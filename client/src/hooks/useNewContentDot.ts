/**
 * useNewContentDot
 * Shows a red dot on nav items / tabs if the user hasn't visited in the last
 * STALE_MINUTES minutes. Call `markSeen(key)` when the user navigates to a section.
 */

const STALE_MINUTES = 5;
const PREFIX = 'silo_last_seen_';

export const markSeen = (key: string) => {
    try {
        localStorage.setItem(PREFIX + key, String(Date.now()));
    } catch { /* ignore in SSR / private mode */ }
};

export const isStale = (key: string): boolean => {
    try {
        const raw = localStorage.getItem(PREFIX + key);
        if (!raw) return true; // never visited → show dot
        const elapsed = Date.now() - Number(raw);
        return elapsed > STALE_MINUTES * 60 * 1000;
    } catch {
        return false;
    }
};
