"use client";
import { FamilyMember } from "@/lib/types";
import { useAppStore } from "@/lib/context";

export default function MemberCard({ member }: { member: FamilyMember }) {
  const { deleteMember, chores } = useAppStore();
  const total = chores.filter((c) => c.assignedTo === member.id).length;
  const done = chores.filter((c) => c.assignedTo === member.id && c.completed).length;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex items-center gap-4">
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center text-2xl flex-shrink-0"
        style={{ backgroundColor: member.color + "22", border: `2px solid ${member.color}` }}
      >
        {member.avatar}
      </div>
      <div className="flex-1">
        <p className="font-semibold text-gray-800">{member.name}</p>
        <p className="text-sm text-gray-500 mt-0.5">
          {done}/{total} chores done today
        </p>
        <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: total ? `${(done / total) * 100}%` : "0%",
              backgroundColor: member.color,
            }}
          />
        </div>
      </div>
      <button
        onClick={() => deleteMember(member.id)}
        className="text-gray-300 hover:text-red-400 transition-colors"
        title="Remove member"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  );
}
