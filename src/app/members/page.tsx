"use client";
import { useState } from "react";
import { useAppStore } from "@/lib/context";
import { MEMBER_COLORS, MEMBER_AVATARS } from "@/lib/types";
import MemberCard from "@/components/MemberCard";
import { v4 as uuidv4 } from "uuid";

export default function MembersPage() {
  const { members, addMember, hydrated } = useAppStore();
  const [name, setName] = useState("");
  const [color, setColor] = useState(MEMBER_COLORS[0]);
  const [avatar, setAvatar] = useState(MEMBER_AVATARS[0]);
  const [error, setError] = useState("");

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) { setError("Name is required"); return; }
    addMember({ id: uuidv4(), name: name.trim(), color, avatar });
    setName("");
    setError("");
  }

  if (!hydrated) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-28 sm:pb-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Family Members</h1>

      <form onSubmit={handleAdd} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-8">
        <h2 className="font-semibold text-gray-700 mb-4">Add Member</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Mum, Dad, Emma..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Avatar</label>
            <div className="flex gap-2 flex-wrap">
              {MEMBER_AVATARS.map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => setAvatar(a)}
                  className={`w-10 h-10 text-xl rounded-lg border-2 transition-all ${
                    avatar === a ? "border-indigo-500 bg-indigo-50 scale-110" : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
            <div className="flex gap-2 flex-wrap">
              {MEMBER_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-8 h-8 rounded-full border-4 transition-all ${
                    color === c ? "border-gray-400 scale-110" : "border-transparent"
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg transition-colors text-sm"
          >
            Add Member
          </button>
        </div>
      </form>

      {members.length === 0 ? (
        <div className="text-center text-gray-400 py-12">
          <div className="text-5xl mb-3">👨‍👩‍👧‍👦</div>
          <p>No family members yet. Add one above!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {members.map((m) => <MemberCard key={m.id} member={m} />)}
        </div>
      )}
    </div>
  );
}
