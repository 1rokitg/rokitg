"use client";

// Per-browser learning progress for the academy dashboard — a lightweight stub,
// not tied to Privy identity yet. Good enough to show real streak/progress
// numbers without needing a backend; swap for server-verified data later.

const STREAK_KEY = "rokitg:academy:streak:v1";
const COMPLETED_KEY = "rokitg:academy:completed-lessons:v1";

function utcDay(date: Date) {
  return date.toISOString().slice(0, 10);
}

export type StreakState = { days: number; lastVisit: string | null };

export function recordVisitAndGetStreak(): StreakState {
  if (typeof window === "undefined") return { days: 0, lastVisit: null };
  try {
    const today = utcDay(new Date());
    const raw = window.localStorage.getItem(STREAK_KEY);
    const stored = raw ? (JSON.parse(raw) as StreakState) : { days: 0, lastVisit: null };

    if (stored.lastVisit === today) return stored;

    const yesterday = utcDay(new Date(Date.now() - 86_400_000));
    const days = stored.lastVisit === yesterday ? stored.days + 1 : 1;
    const next: StreakState = { days, lastVisit: today };
    window.localStorage.setItem(STREAK_KEY, JSON.stringify(next));
    return next;
  } catch {
    return { days: 0, lastVisit: null };
  }
}

export function getCompletedLessons(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(COMPLETED_KEY);
    const parsed = raw ? (JSON.parse(raw) as string[]) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function markLessonComplete(courseSlug: string, lessonSlug: string) {
  if (typeof window === "undefined") return;
  const id = `${courseSlug}/${lessonSlug}`;
  try {
    const completed = new Set(getCompletedLessons());
    completed.add(id);
    window.localStorage.setItem(COMPLETED_KEY, JSON.stringify([...completed]));
  } catch {
    /* Storage can be unavailable. */
  }
}

export function isLessonComplete(courseSlug: string, lessonSlug: string): boolean {
  return getCompletedLessons().includes(`${courseSlug}/${lessonSlug}`);
}
