"use client";
import { useState, useEffect, useCallback } from "react";
import { FamilyMember, Chore } from "./types";

const MEMBERS_KEY = "chores_members";
const CHORES_KEY = "chores_list";

function load<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function save<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function useStore() {
  const [members, setMembersState] = useState<FamilyMember[]>([]);
  const [chores, setChoresState] = useState<Chore[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setMembersState(load<FamilyMember[]>(MEMBERS_KEY, []));
    const allChores = load<Chore[]>(CHORES_KEY, []);
    // Drop completed chores older than 30 days to keep storage lean
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 30);
    const pruned = allChores.filter((c) => {
      if (!c.completed) return true;
      return new Date(c.date + "T00:00:00") >= cutoff;
    });
    save(CHORES_KEY, pruned);
    setChoresState(pruned);
    setHydrated(true);
  }, []);

  const setMembers = useCallback((updater: (prev: FamilyMember[]) => FamilyMember[]) => {
    setMembersState((prev) => {
      const next = updater(prev);
      save(MEMBERS_KEY, next);
      return next;
    });
  }, []);

  const setChores = useCallback((updater: (prev: Chore[]) => Chore[]) => {
    setChoresState((prev) => {
      const next = updater(prev);
      save(CHORES_KEY, next);
      return next;
    });
  }, []);

  const addMember = useCallback((member: FamilyMember) => {
    setMembers((prev) => [...prev, member]);
  }, [setMembers]);

  const updateMember = useCallback((id: string, patch: Partial<FamilyMember>) => {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, ...patch } : m)));
  }, [setMembers]);

  const deleteMember = useCallback((id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
    setChores((prev) => prev.filter((c) => c.assignedTo !== id));
  }, [setMembers, setChores]);

  const addChore = useCallback((chore: Chore) => {
    setChores((prev) => [...prev, chore]);
  }, [setChores]);

  const updateChore = useCallback((id: string, patch: Partial<Chore>) => {
    setChores((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  }, [setChores]);

  const deleteChore = useCallback((id: string) => {
    setChores((prev) => prev.filter((c) => c.id !== id));
  }, [setChores]);

  const toggleChore = useCallback((id: string) => {
    setChores((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, completed: !c.completed, completedAt: !c.completed ? new Date().toISOString() : undefined }
          : c
      )
    );
  }, [setChores]);

  return {
    members, chores, hydrated,
    addMember, updateMember, deleteMember,
    addChore, updateChore, deleteChore, toggleChore,
  };
}
