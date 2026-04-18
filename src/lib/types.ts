export interface FamilyMember {
  id: string;
  name: string;
  color: string;
  avatar: string;
}

export interface Chore {
  id: string;
  title: string;
  description?: string;
  assignedTo: string; // FamilyMember id
  date: string; // YYYY-MM-DD start date
  time?: string; // HH:MM
  completed: boolean; // used for one-time chores
  completedAt?: string;
  recurring?: "daily" | "weekly" | "none";
  completedDates?: string[]; // YYYY-MM-DD dates completed, used for recurring chores
}

export const MEMBER_COLORS = [
  "#6366f1", "#ec4899", "#f59e0b", "#10b981",
  "#3b82f6", "#ef4444", "#8b5cf6", "#14b8a6",
];

export const MEMBER_AVATARS = ["👩", "👨", "👧", "👦", "👵", "👴", "🧒", "👶"];
