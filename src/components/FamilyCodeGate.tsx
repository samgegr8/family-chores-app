"use client";
import { useState } from "react";
import { useAppStore } from "@/lib/context";

export default function FamilyCodeGate({ children }: { children: React.ReactNode }) {
  const { familyCode, joinFamily, hydrated } = useAppStore();
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  if (!hydrated) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
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
              placeholder="e.g. SMITH2024"
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
