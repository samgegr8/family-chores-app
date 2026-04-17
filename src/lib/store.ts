"use client";
import { useState, useEffect, useCallback } from "react";
import {
  collection, doc, setDoc, deleteDoc,
  onSnapshot, updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import { FamilyMember, Chore } from "./types";

const FAMILY_CODE_KEY = "chores_family_code";

// Firestore rejects undefined values — strip them before writing
function stripUndefined<T extends object>(obj: T): T {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined)
  ) as T;
}

function getFamilyCode(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(FAMILY_CODE_KEY);
}

export function saveFamilyCode(code: string) {
  localStorage.setItem(FAMILY_CODE_KEY, code.toUpperCase().trim());
}

export function clearFamilyCode() {
  localStorage.removeItem(FAMILY_CODE_KEY);
}

export function useStore() {
  const [familyCode, setFamilyCode] = useState<string | null>(null);
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [chores, setChores] = useState<Chore[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  // Load family code from localStorage on mount
  useEffect(() => {
    const code = getFamilyCode();
    setFamilyCode(code);
    setHydrated(true);
  }, []);

  // Subscribe to Firestore when family code is set
  useEffect(() => {
    if (!familyCode) return;

    const membersRef = collection(db, "families", familyCode, "members");
    const choresRef = collection(db, "families", familyCode, "chores");

    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 30);

    const onError = (err: Error) => {
      console.error("Firestore error:", err);
      setConnectionError("Cannot connect to database. Check your Firebase setup in Vercel environment variables.");
    };

    const unsubMembers = onSnapshot(membersRef, (snap) => {
      setConnectionError(null);
      setMembers(snap.docs.map((d) => d.data() as FamilyMember));
    }, onError);

    const unsubChores = onSnapshot(choresRef, (snap) => {
      const all = snap.docs.map((d) => d.data() as Chore);
      setChores(all.filter((c) => {
        if (!c.completed) return true;
        return new Date(c.date + "T00:00:00") >= cutoff;
      }));
    }, onError);

    return () => {
      unsubMembers();
      unsubChores();
    };
  }, [familyCode]);

  const joinFamily = useCallback((code: string) => {
    saveFamilyCode(code);
    setFamilyCode(code.toUpperCase().trim());
  }, []);

  const leaveFamily = useCallback(() => {
    clearFamilyCode();
    setFamilyCode(null);
    setMembers([]);
    setChores([]);
  }, []);

  const addMember = useCallback(async (member: FamilyMember): Promise<string | null> => {
    if (!familyCode) return "No family code set";
    try {
      await setDoc(doc(db, "families", familyCode, "members", member.id), member);
      return null;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      console.error("addMember failed:", msg);
      return msg;
    }
  }, [familyCode]);

  const updateMember = useCallback(async (id: string, patch: Partial<FamilyMember>) => {
    if (!familyCode) return;
    await updateDoc(doc(db, "families", familyCode, "members", id), patch);
  }, [familyCode]);

  const deleteMember = useCallback(async (id: string) => {
    if (!familyCode) return;
    await deleteDoc(doc(db, "families", familyCode, "members", id));
    // Delete this member's chores too
    const memberChores = chores.filter((c) => c.assignedTo === id);
    await Promise.all(
      memberChores.map((c) => deleteDoc(doc(db, "families", familyCode, "chores", c.id)))
    );
  }, [familyCode, chores]);

  const addChore = useCallback(async (chore: Chore): Promise<string | null> => {
    if (!familyCode) return "No family code set";
    try {
      await setDoc(doc(db, "families", familyCode, "chores", chore.id), stripUndefined(chore));
      return null;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      console.error("addChore failed:", msg);
      return msg;
    }
  }, [familyCode]);

  const updateChore = useCallback(async (id: string, patch: Partial<Chore>) => {
    if (!familyCode) return;
    await updateDoc(doc(db, "families", familyCode, "chores", id), patch);
  }, [familyCode]);

  const deleteChore = useCallback(async (id: string) => {
    if (!familyCode) return;
    await deleteDoc(doc(db, "families", familyCode, "chores", id));
  }, [familyCode]);

  const toggleChore = useCallback(async (id: string) => {
    if (!familyCode) return;
    const chore = chores.find((c) => c.id === id);
    if (!chore) return;
    await updateDoc(doc(db, "families", familyCode, "chores", id), {
      completed: !chore.completed,
      completedAt: !chore.completed ? new Date().toISOString() : null,
    });
  }, [familyCode, chores]);

  return {
    familyCode, members, chores, hydrated, connectionError,
    joinFamily, leaveFamily,
    addMember, updateMember, deleteMember,
    addChore, updateChore, deleteChore, toggleChore,
  };
}
