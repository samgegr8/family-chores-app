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
  date: string; // YYYY-MM-DD
  time?: string; // HH:MM
  completed: boolean;
  completedAt?: string;
  recurring?: "daily" | "weekly" | "none";
}

export const MEMBER_COLORS = [
  "#6366f1", "#ec4899", "#f59e0b", "#10b981",
  "#3b82f6", "#ef4444", "#8b5cf6", "#14b8a6",
];

export const MEMBER_AVATARS = ["👩", "👨", "👧", "👦", "👵", "👴", "🧒", "👶"];
