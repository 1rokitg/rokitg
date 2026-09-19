"use client";
import { useEffect, useState } from "react";
const KEY = "rokitg:courses:bookmarks:v1";
type Bookmarks = Record<string, string[]>;

function read(): Bookmarks {
  try {
    const raw: unknown = JSON.parse(localStorage.getItem(KEY) ?? "{}");
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
    return Object.fromEntries(
      Object.entries(raw).filter(
        ([key, value]) =>
          /^[a-z0-9-]+$/.test(key) &&
          Array.isArray(value) &&
          value.every((item) => typeof item === "string"),
      ),
    );
  } catch {
    return {};
  }
}

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Bookmarks>({});
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const sync = () => setBookmarks(read());
    sync();
    setReady(true);
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);
  function toggle(course: string, lesson: string) {
    const current = read();
    const existing = current[course] ?? [];
    const next = {
      ...current,
      [course]: existing.includes(lesson)
        ? existing.filter((slug) => slug !== lesson)
        : [...existing, lesson],
    };
    setBookmarks(next);
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* Storage can be unavailable. */
    }
  }
  function isBookmarked(course: string, lesson: string) {
    return (bookmarks[course] ?? []).includes(lesson);
  }
  return { bookmarks, ready, toggle, isBookmarked };
}
