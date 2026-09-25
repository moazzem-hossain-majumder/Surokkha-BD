"use client";

import { useSyncExternalStore } from "react";
import { themeStore } from "@/lib/store";

function getSystemPrefersDark() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

// Resolves the *effective* theme (light/dark), accounting for "system".
export function useEffectiveTheme(): "light" | "dark" {
  const stored = useSyncExternalStore(themeStore.subscribe, themeStore.get, () => null);
  const systemDark = useSyncExternalStore(
    (cb) => {
      if (typeof window === "undefined") return () => {};
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    getSystemPrefersDark,
    () => false
  );
  if (stored === "light") return "light";
  if (stored === "dark") return "dark";
  return systemDark ? "dark" : "light";
}
