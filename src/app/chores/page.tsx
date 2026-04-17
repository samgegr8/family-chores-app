"use client";
import { useState } from "react";
import { useAppStore } from "@/lib/context";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

export default function AddChorePage() {
  const { members, addChore, hydrated } = useAppStore();
  const router = useRouter();

  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [date, setDate] = useState(today);
  const [time, setTime] = useState("");
  const [recurring, setRecurring] = useState<"none" | "daily" | "weekly">("none");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) { setError("Title is required"); return; }
    if (!assignedTo) { setError("Please assign this chore to a family member"); return; }
    await addChore({
      id: uuidv4(),
      title: title.trim(),
      description: description.trim() || undefined,
      assignedTo,
      date,
      time: time || undefined,
      completed: false,
      recurring,
    });
    sessionStorage.setItem("jump_date", date);
    router.push("/");
  }

  if (!hydrated) return null;

  return (
    <div className="max-w-xl mx-auto px-4 py-6 pb-28 sm:pb-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Add New Chore</h1>

      {members.length === 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-sm text-amber-700">
          ⚠️ You need to add family members first.{" "}
          <a href="/members" className="font-semibold underline">Go to Family</a>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Chore Title *</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Wash dishes, Take out trash..."
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Any extra notes..."
            rows={2}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Assign To *</label>
          <div className="flex gap-2 flex-wrap">
            {members.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setAssignedTo(m.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl border-2 text-sm font-medium transition-all ${
                  assignedTo === m.id
                    ? "border-transparent text-white scale-105"
                    : "border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
                style={assignedTo === m.id ? { backgroundColor: m.color } : {}}
              >
                {m.avatar} {m.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Time (optional)</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Recurring</label>
          <div className="flex gap-2">
            {(["none", "daily", "weekly"] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRecurring(r)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors capitalize ${
                  recurring === r
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-white text-gray-600 border-gray-300 hover:border-gray-400"
                }`}
              >
                {r === "none" ? "One-time" : r}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="flex-1 border border-gray-300 text-gray-700 font-medium py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg transition-colors text-sm"
          >
            Add Chore
          </button>
        </div>
      </form>
    </div>
  );
}
