"use client";
import { useState } from "react";
import { useAppStore } from "@/lib/context";
import { isFirebaseConfigured } from "@/lib/firebase";

export default function FamilyCodeGate({ children }: { children: React.ReactNode }) {
  const { familyCode, joinFamily, leaveFamily, hydrated, connectionError } = useAppStore();
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  if (!hydrated) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  // Firebase env vars missing — show setup instructions
  if (!isFirebaseConfigured) {
    return (
      <div className="flex items-center justify-center min-h-[80vh] px-4">
        <div className="w-full max-w-sm bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
          <div className="text-4xl mb-3">⚠️</div>
          <h2 className="font-bold text-red-700 mb-2">Firebase not configured</h2>
          <p className="text-sm text-red-600">
            Add these 3 environment variables in your Vercel project settings:
          </p>
          <ul className="text-xs text-left mt-3 space-y-1 bg-white rounded-lg p-3 font-mono text-gray-700">
            <li>NEXT_PUBLIC_FIREBASE_API_KEY</li>
            <li>NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN</li>
            <li>NEXT_PUBLIC_FIREBASE_PROJECT_ID</li>
          </ul>
          <p className="text-xs text-gray-500 mt-3">Then redeploy on Vercel.</p>
        </div>
      </div>
    );
  }

  // Connected but Firestore returned an error
  if (familyCode && connectionError) {
    return (
      <div className="flex items-center justify-center min-h-[80vh] px-4">
        <div className="w-full max-w-sm bg-red-50 border border-red-200 rounded-2xl p-6 text-center space-y-4">
          <div className="text-4xl">🔌</div>
          <h2 className="font-bold text-red-700">Connection failed</h2>
          <p className="text-sm text-red-600">{connectionError}</p>
          <button
            onClick={leaveFamily}
            className="text-sm text-gray-500 underline"
          >
            Try a different code
          </button>
        </div>
      </div>
    );
  }

  if (familyCode) return <>{children}</>;

  function handleJoin(e: React.FormEvent) {
    e.preventDefault();
    const code = input.toUpperCase().trim();
    if (code.length < 4) {
      setError("Code must be at least 4 characters");
      return;
    }
    joinFamily(code);
  }

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🏠</div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome to FamilyChores</h1>
          <p className="text-gray-500 text-sm mt-2">
            Enter your family code to sync chores across all devices
          </p>
        </div>

        <form onSubmit={handleJoin} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Family Code</label>
            <input
              value={input}
              onChange={(e) => { setInput(e.target.value); setError(""); }}
              placeholder="e.g. SAM2026"
              autoCapitalize="characters"
              className="w-full border border-gray-300 rounded-lg px-3 py-3 text-center text-lg font-bold tracking-widest uppercase focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
            {error && <p className="text-red-500 text-xs mt-1 text-center">{error}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-semibold py-3 rounded-xl transition-all text-sm"
          >
            Join / Create Family
          </button>

          <p className="text-xs text-gray-400 text-center">
            New family? Just pick a code and share it with your family members.
            Anyone with the same code shares the same data.
          </p>
        </form>
      </div>
    </div>
  );
}
