"use client";
import { createContext, useContext, ReactNode } from "react";
import { useStore } from "./store";

type StoreType = ReturnType<typeof useStore>;
const StoreContext = createContext<StoreType | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const store = useStore();
  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
}

export function useAppStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useAppStore must be used inside StoreProvider");
  return ctx;
}
