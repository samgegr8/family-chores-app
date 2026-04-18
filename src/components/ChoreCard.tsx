"use client";
import { Chore, FamilyMember } from "@/lib/types";
import { useAppStore } from "@/lib/context";

interface Props {
  chore: Chore;
  member?: FamilyMember;
  date: string; // the date being viewed (YYYY-MM-DD)
}

export default function ChoreCard({ chore, member, date }: Props) {
  const { toggleChore, deleteChore } = useAppStore();

  const isRecurring = chore.recurring && chore.recurring !== "none";
  const completed = isRecurring
    ? (chore.completedDates ?? []).includes(date)
    : chore.completed;

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-xl border transition-all ${
        completed
          ? "bg-gray-50 border-gray-200 opacity-70"
          : "bg-white border-gray-200 shadow-sm hover:shadow-md"
      }`}
    >
      <button
        onClick={() => toggleChore(chore.id, date)}
        className={`mt-0.5 w-7 h-7 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors active:scale-90 ${
          completed
            ? "bg-green-500 border-green-500 text-white"
            : "border-gray-300 hover:border-green-400"
        }`}
      >
        {completed && (
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      <div className="flex-1 min-w-0">
        <p className={`font-medium text-sm ${completed ? "line-through text-gray-400" : "text-gray-800"}`}>
          {chore.title}
        </p>
        {chore.description && (
          <p className="text-xs text-gray-500 mt-0.5 truncate">{chore.description}</p>
        )}
        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
          {member && (
            <span
              className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full text-white font-medium"
              style={{ backgroundColor: member.color }}
            >
              {member.avatar} {member.name}
            </span>
          )}
          {chore.time && (
            <span className="text-xs text-gray-500 flex items-center gap-1">
              🕐 {chore.time}
            </span>
          )}
          {chore.recurring && chore.recurring !== "none" && (
            <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full">
              🔁 {chore.recurring}
            </span>
          )}
        </div>
      </div>

      <button
        onClick={() => deleteChore(chore.id)}
        className="p-1 text-gray-300 hover:text-red-400 transition-colors flex-shrink-0 active:scale-90"
        title="Delete chore"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
