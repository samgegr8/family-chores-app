"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppStore } from "@/lib/context";

const links = [
  {
    href: "/",
    label: "Dashboard",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    href: "/members",
    label: "Family",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    href: "/chores",
    label: "Add Chore",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
      </svg>
    ),
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const { familyCode, leaveFamily } = useAppStore();

  return (
    <>
      {/* Desktop top bar */}
      <nav className="hidden sm:block bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏠</span>
            <span className="font-bold text-lg text-indigo-700">FamilyChores</span>
            {familyCode && (
              <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded-full font-mono font-semibold">
                {familyCode}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === l.href
                    ? "bg-indigo-100 text-indigo-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {l.label}
              </Link>
            ))}
            {familyCode && (
              <button
                onClick={leaveFamily}
                className="ml-2 text-xs text-gray-400 hover:text-red-500 transition-colors px-2 py-1 rounded"
                title="Switch family"
              >
                Switch
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile top header */}
      <header className="sm:hidden bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between h-12 px-4">
          <div className="flex items-center gap-1.5">
            <span className="text-lg">🏠</span>
            <span className="font-bold text-base text-indigo-700">FamilyChores</span>
          </div>
          {familyCode && (
            <div className="flex items-center gap-2">
              <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-mono font-semibold">
                {familyCode}
              </span>
              <button
                onClick={leaveFamily}
                className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                title="Switch family"
              >
                Switch
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Mobile bottom tab bar */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 safe-bottom">
        <div className="flex">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`flex-1 flex flex-col items-center justify-center py-2 gap-0.5 transition-colors ${
                  active ? "text-indigo-600" : "text-gray-400"
                }`}
              >
                <span className={active ? "text-indigo-600" : "text-gray-400"}>{l.icon}</span>
                <span className="text-[10px] font-medium">{l.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
