"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useAppStore } from "@/lib/context";
import ChoreCard from "@/components/ChoreCard";

function fmt(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function displayDate(d: string) {
  const date = new Date(d + "T00:00:00");
  return date.toLocaleDateString("en-AU", { weekday: "long", day: "numeric", month: "long" });
}

export default function Dashboard() {
  const { members, chores, hydrated } = useAppStore();
  const [selectedDate, setSelectedDate] = useState(fmt(new Date()));
  const [filterMember, setFilterMember] = useState<string>("all");

  useEffect(() => {
    const jump = sessionStorage.getItem("jump_date");
    if (jump) {
      setSelectedDate(jump);
      sessionStorage.removeItem("jump_date");
    }
  }, []);

  if (!hydrated) return null;

  function isChoreOnDate(c: (typeof chores)[0], d: string) {
    if (c.date === d) return true;
    if (!c.recurring || c.recurring === "none") return false;
    if (c.date > d) return false;
    const msPerDay = 864e5;
    const diff = Math.round((new Date(d + "T00:00:00").getTime() - new Date(c.date + "T00:00:00").getTime()) / msPerDay);
    return c.recurring === "daily" || (c.recurring === "weekly" && diff % 7 === 0);
  }

  function isChoreCompleted(c: (typeof chores)[0], d: string) {
    if (c.recurring && c.recurring !== "none") return (c.completedDates ?? []).includes(d);
    return c.completed;
  }

  const dateChores = chores.filter((c) => isChoreOnDate(c, selectedDate));
  const filtered = filterMember === "all" ? dateChores : dateChores.filter((c) => c.assignedTo === filterMember);

  const sorted = [...filtered].sort((a, b) => {
    const aDone = isChoreCompleted(a, selectedDate);
    const bDone = isChoreCompleted(b, selectedDate);
    if (aDone !== bDone) return aDone ? 1 : -1;
    if (a.time && b.time) return a.time.localeCompare(b.time);
    if (a.time) return -1;
    if (b.time) return 1;
    return 0;
  });

  const totalToday = dateChores.length;
  const doneToday = dateChores.filter((c) => isChoreCompleted(c, selectedDate)).length;

  const prevDay = () => {
    const d = new Date(selectedDate + "T00:00:00");
    d.setDate(d.getDate() - 1);
    setSelectedDate(fmt(d));
  };

  const nextDay = () => {
    const d = new Date(selectedDate + "T00:00:00");
    d.setDate(d.getDate() + 1);
    setSelectedDate(fmt(d));
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-28 sm:pb-8">
      {/* Date navigator */}
      <div className="flex items-center justify-between mb-5">
        <button onClick={prevDay} className="p-3 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors active:scale-95">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="text-center relative">
          <label className="cursor-pointer group">
            <p className="text-base sm:text-lg font-bold text-gray-900 leading-tight group-hover:text-indigo-600 transition-colors">
              {displayDate(selectedDate)}
              <span className="ml-1 text-xs text-gray-400 group-hover:text-indigo-400">📅</span>
            </p>
            {selectedDate === fmt(new Date()) && (
              <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">Today</span>
            )}
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => e.target.value && setSelectedDate(e.target.value)}
              className="absolute inset-0 opacity-0 cursor-pointer w-full"
            />
          </label>
        </div>
        <button onClick={nextDay} className="p-3 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors active:scale-95">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Progress bar */}
      {totalToday > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Daily Progress</span>
            <span className="text-sm font-bold text-indigo-600">{doneToday}/{totalToday}</span>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 rounded-full transition-all duration-500"
              style={{ width: `${(doneToday / totalToday) * 100}%` }}
            />
          </div>
          {doneToday === totalToday && totalToday > 0 && (
            <p className="text-center text-green-600 font-medium text-sm mt-2">🎉 All done for today!</p>
          )}
        </div>
      )}

      {/* Member filter */}
      {members.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-1 mb-6">
          <button
            onClick={() => setFilterMember("all")}
            className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
              filterMember === "all" ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            All Members
          </button>
          {members.map((m) => (
            <button
              key={m.id}
              onClick={() => setFilterMember(filterMember === m.id ? "all" : m.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                filterMember === m.id ? "text-white scale-105" : "text-gray-600 bg-gray-100 hover:bg-gray-200"
              }`}
              style={filterMember === m.id ? { backgroundColor: m.color } : {}}
            >
              {m.avatar} {m.name}
            </button>
          ))}
        </div>
      )}

      {/* Chores list */}
      {members.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">👨‍👩‍👧‍👦</div>
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Welcome to FamilyChores!</h2>
          <p className="text-gray-500 text-sm mb-6">Start by adding your family members.</p>
          <Link href="/members" className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-medium text-sm hover:bg-indigo-700 transition-colors">
            Add Family Members
          </Link>
        </div>
      ) : sorted.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">✨</div>
          <p className="text-gray-500 mb-6">No chores for this day yet.</p>
          <Link href="/chores" className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-medium text-sm hover:bg-indigo-700 transition-colors">
            + Add a Chore
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map((chore) => (
            <ChoreCard
              key={chore.id + selectedDate}
              chore={chore}
              date={selectedDate}
              member={members.find((m) => m.id === chore.assignedTo)}
            />
          ))}
          <Link
            href="/chores"
            className="flex items-center justify-center gap-2 w-full border-2 border-dashed border-gray-200 rounded-xl py-3 text-gray-400 hover:border-indigo-300 hover:text-indigo-500 transition-colors text-sm font-medium"
          >
            + Add another chore
          </Link>
        </div>
      )}
    </div>
  );
}
