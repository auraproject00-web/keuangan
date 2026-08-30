import { useState, useEffect, useCallback } from 'react';

// ─── Generic localStorage hook ────────────────────────────────────────────────

export function useLocalStorage<T>(key: string, defaultValue: T): [T, (val: T | ((prev: T) => T)) => void] {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? (JSON.parse(stored) as T) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage full or unavailable — silently ignore
    }
  }, [key, value]);

  return [value, setValue];
}

// ─── Session helpers ──────────────────────────────────────────────────────────

const SESSION_KEY = 'catatuang_session';

export function isLoggedIn(): boolean {
  return localStorage.getItem(SESSION_KEY) === 'true';
}

export function setLoggedIn(val: boolean): void {
  if (val) {
    localStorage.setItem(SESSION_KEY, 'true');
  } else {
    localStorage.removeItem(SESSION_KEY);
  }
}

export function logout(): void {
  localStorage.removeItem(SESSION_KEY);
}

// ─── Data reset ───────────────────────────────────────────────────────────────

export function clearAllData(): void {
  const keys = ['catatuang_wallets', 'catatuang_txs', 'catatuang_session'];
  keys.forEach(k => localStorage.removeItem(k));
}
