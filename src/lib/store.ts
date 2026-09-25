// Tiny localStorage-backed external store, safe for SSR with useSyncExternalStore.
export function createLocalStorageStore(key: string) {
  const listeners = new Set<() => void>();
  return {
    subscribe(callback: () => void) {
      listeners.add(callback);
      const onStorage = (e: StorageEvent) => {
        if (e.key === key || e.key === null) callback();
      };
      window.addEventListener("storage", onStorage);
      return () => {
        listeners.delete(callback);
        window.removeEventListener("storage", onStorage);
      };
    },
    get(): string | null {
      try {
        return localStorage.getItem(key);
      } catch {
        return null;
      }
    },
    set(value: string | null) {
      try {
        if (value === null) localStorage.removeItem(key);
        else localStorage.setItem(key, value);
      } catch {
        /* storage unavailable: ignore */
      }
      listeners.forEach((l) => l());
    },
  };
}

export const themeStore = createLocalStorageStore("theme");
export const bnPromptStore = createLocalStorageStore("bn-prompt-dismissed");
