"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type AccessibilityState = {
  fontScale: number; // 1 = 100%
  highContrast: boolean;
  reduceMotion: boolean;
  screenReaderHints: boolean;
  setFontScale: (n: number) => void;
  setHighContrast: (b: boolean) => void;
  setReduceMotion: (b: boolean) => void;
  setScreenReaderHints: (b: boolean) => void;
};

const AccessibilityContext = createContext<AccessibilityState | null>(null);

export function useAccessibility() {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) throw new Error("useAccessibility must be used within AccessibilityProvider");
  return ctx;
}

export default function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [fontScale, setFontScale] = useState<number>(1);
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [reduceMotion, setReduceMotion] = useState<boolean>(false);
  const [screenReaderHints, setScreenReaderHints] = useState<boolean>(true);

  // Load persisted settings
  useEffect(() => {
    const saved = localStorage.getItem("a11y-settings");
    if (saved) {
      try {
        const s = JSON.parse(saved);
        if (typeof s.fontScale === "number") setFontScale(s.fontScale);
        if (typeof s.highContrast === "boolean") setHighContrast(s.highContrast);
        if (typeof s.reduceMotion === "boolean") setReduceMotion(s.reduceMotion);
        if (typeof s.screenReaderHints === "boolean") setScreenReaderHints(s.screenReaderHints);
      } catch {}
    }
  }, []);

  // Persist and apply
  useEffect(() => {
    localStorage.setItem(
      "a11y-settings",
      JSON.stringify({ fontScale, highContrast, reduceMotion, screenReaderHints })
    );

    // Apply font scaling on root
    document.documentElement.style.setProperty("--a11y-font-scale", String(fontScale));

    // Toggle high contrast (dark class)
    document.documentElement.classList.toggle("dark", highContrast);

    // Reduce motion
    document.documentElement.style.setProperty(
      "--a11y-reduce-motion",
      reduceMotion ? "1" : "0"
    );
  }, [fontScale, highContrast, reduceMotion, screenReaderHints]);

  const value = useMemo(
    () => ({
      fontScale,
      highContrast,
      reduceMotion,
      screenReaderHints,
      setFontScale,
      setHighContrast,
      setReduceMotion,
      setScreenReaderHints,
    }),
    [fontScale, highContrast, reduceMotion, screenReaderHints]
  );

  return (
    <AccessibilityContext.Provider value={value}>
      <div
        style={{
          // Scale all text sizes proportionally without breaking Tailwind tokens
          fontSize: `${fontScale * 100}%`,
        }}
        className={reduceMotion ? "motion-reduce" : undefined}
      >
        {children}
      </div>
    </AccessibilityContext.Provider>
  );
}