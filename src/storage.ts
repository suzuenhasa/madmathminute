import type { Settings } from './types';
import { DEFAULTS, STORAGE_KEYS } from './config';

interface SafeStore {
  get(key: string): string | null;
  set(key: string, val: string): void;
}

/**
 * Safe storage: uses localStorage when available (e.g. when the file is opened
 * directly on a tablet) and silently falls back to in-memory if it's blocked.
 * Never throws.
 */
export const Store: SafeStore = (() => {
  let ok = false;
  const mem: Record<string, string> = {};
  try {
    const k = '__mm_test__';
    localStorage.setItem(k, '1');
    localStorage.removeItem(k);
    ok = true;
  } catch {
    ok = false;
  }
  return {
    get(key) {
      try {
        return ok ? localStorage.getItem(key) : mem[key] ?? null;
      } catch {
        return mem[key] ?? null;
      }
    },
    set(key, val) {
      try {
        if (ok) localStorage.setItem(key, val);
        else mem[key] = val;
      } catch {
        mem[key] = val;
      }
    },
  };
})();

/** Load saved settings merged over the defaults. */
export function loadSettings(): Settings {
  try {
    const raw = Store.get(STORAGE_KEYS.settings);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<Settings>;
      return { ...DEFAULTS, ...parsed };
    }
  } catch {
    /* fall through to defaults */
  }
  return { ...DEFAULTS };
}

export function saveSettings(settings: Settings): void {
  try {
    Store.set(STORAGE_KEYS.settings, JSON.stringify(settings));
  } catch {
    /* ignore */
  }
}

export function loadBest(): number {
  return parseInt(Store.get(STORAGE_KEYS.best) || '0', 10) || 0;
}

export function saveBest(best: number): void {
  Store.set(STORAGE_KEYS.best, String(best));
}
