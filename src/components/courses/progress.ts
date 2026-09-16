"use client";
import { useEffect, useState } from "react";
const KEY = "rokitg:courses:demo-progress:v1";
type Progress = Record<string, string[]>;

function read(): Progress {
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

// Demo progress is local convenience data, never proof of purchase or access.
export function useCourseProgress() {
  const [progress, setProgress] = useState<Progress>({});
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    const sync = () => setProgress(read());
    sync();
    setReady(true);
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);
  function toggle(course: string, lesson: string) {
    const current = read();
    const completed = current[course] ?? [];
    const next = {
      ...current,
      [course]: completed.includes(lesson)
        ? completed.filter((id) => id !== lesson)
        : [...completed, lesson],
    };
    setProgress(next);
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
      setError("");
    } catch {
      setError("No se ha podido guardar el progreso en este navegador.");
    }
  }
  return { progress, ready, error, toggle };
}
