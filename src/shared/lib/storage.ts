export const storage = {
  get<T = unknown>(key: string, fallback: T | null = null): T | null {
    if (typeof window === 'undefined') return fallback;
    try {
      const item = window.localStorage.getItem(key);
      if (item === null) return fallback;
      return JSON.parse(item) as T;
    } catch {
      return (window.localStorage.getItem(key) as unknown as T) ?? fallback;
    }
  },

  getString(key: string, fallback: string | null = null): string | null {
    if (typeof window === 'undefined') return fallback;
    try {
      return window.localStorage.getItem(key) ?? fallback;
    } catch {
      return fallback;
    }
  },

  set(key: string, value: unknown): void {
    if (typeof window === 'undefined') return;
    try {
      const serialized = typeof value === 'string' ? value : JSON.stringify(value);
      window.localStorage.setItem(key, serialized);
    } catch {
      // Игнорируем ошибки при переполнении квоты или приватном режиме
    }
  },

  remove(key: string): void {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.removeItem(key);
    } catch {
      // Игнорируем ошибки
    }
  },

  clear(): void {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.clear();
    } catch {
      // Игнорируем ошибки
    }
  },
};
