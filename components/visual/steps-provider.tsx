"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

// Context shared by all TopicCard steps + the floating progress pill.
//  - `register(id)` is called by each step on mount so `total` reflects the
//    actual number of steps in the article (no manual count needed).
//  - `opened` is a Set of step ids currently expanded.
//  - Progress is persisted to localStorage keyed by post slug so returning
//    readers see where they left off.

export type StepInfo = { id: string; label: string; step: string };

type Ctx = {
  register: (info: StepInfo) => void;
  isOpen: (id: string) => boolean;
  toggle: (id: string) => void;
  opened: Set<string>;
  steps: StepInfo[];
  total: number;
  openedCount: number;
  activeId: string | null;
  setActive: (id: string | null) => void;
};

const StepsContext = createContext<Ctx | null>(null);

const STORAGE_PREFIX = "zeist-progress-";

export function StepsProvider({
  slug,
  children,
}: {
  slug: string;
  children: ReactNode;
}) {
  const [steps, setSteps] = useState<StepInfo[]>([]);
  const [opened, setOpened] = useState<Set<string>>(new Set());
  const [activeId, setActiveId] = useState<string | null>(null);
  const storageKey = `${STORAGE_PREFIX}${slug}`;

  // Hydrate opened set from localStorage after mount (SSR-safe).
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw) as string[];
        setOpened(new Set(parsed));
      }
    } catch {
      /* ignore */
    }
  }, [storageKey]);

  const register = useCallback((info: StepInfo) => {
    setSteps((prev) => {
      if (prev.some((s) => s.id === info.id)) return prev;
      return [...prev, info];
    });
  }, []);

  const isOpen = useCallback((id: string) => opened.has(id), [opened]);

  const toggle = useCallback(
    (id: string) => {
      setOpened((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        try {
          window.localStorage.setItem(storageKey, JSON.stringify([...next]));
        } catch {
          /* ignore */
        }
        return next;
      });
    },
    [storageKey],
  );

  const setActive = useCallback((id: string | null) => setActiveId(id), []);

  const value = useMemo<Ctx>(
    () => ({
      register,
      isOpen,
      toggle,
      opened,
      steps,
      total: steps.length,
      openedCount: opened.size,
      activeId,
      setActive,
    }),
    [register, isOpen, toggle, opened, steps, activeId, setActive],
  );

  return (
    <StepsContext.Provider value={value}>{children}</StepsContext.Provider>
  );
}

export function useStepsSafe() {
  return useContext(StepsContext);
}

export function useSteps() {
  const ctx = useContext(StepsContext);
  if (!ctx) throw new Error("useSteps must be used inside <StepsProvider>");
  return ctx;
}
