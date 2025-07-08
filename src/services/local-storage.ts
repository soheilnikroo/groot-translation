import { StorageAdapter } from '@/core/types';

export class LocalStorageAdapter implements StorageAdapter {
  private prefix: string;

  constructor(prefix = 'groot_') {
    this.prefix = prefix;
  }

  get(key: string): string | null {
    return localStorage.getItem(this.prefix + key);
  }

  set(key: string, value: string): void {
    localStorage.setItem(this.prefix + key, value);
  }

  remove(key: string): void {
    localStorage.removeItem(this.prefix + key);
  }

  subscribe(key: string, callback: (newValue: string | null) => void): void {
    if (typeof window === 'undefined') return;
    window.addEventListener('storage', (e: StorageEvent) => {
      if (e.key === key) {
        callback(e.newValue);
      }
    });
  }
}
