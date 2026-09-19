"use client";
import { useEffect, useState } from "react";
const KEY = "rokitg:courses:notes:v1";
type Notes = Record<string, string>;

function noteId(course: string, lesson: string) {
  return `${course}/${lesson}`;
}

function read(): Notes {
  try {
    const raw: unknown = JSON.parse(localStorage.getItem(KEY) ?? "{}");
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
    return Object.fromEntries(
      Object.entries(raw).filter(([, value]) => typeof value === "string"),
    ) as Notes;
  } catch {
    return {};
  }
}

export function useNotes() {
  const [notes, setNotes] = useState<Notes>({});
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const sync = () => setNotes(read());
    sync();
    setReady(true);
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);
  function setNote(course: string, lesson: string, text: string) {
    const current = read();
    const id = noteId(course, lesson);
    const next = { ...current };
    if (text.trim()) next[id] = text;
    else delete next[id];
    setNotes(next);
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* Storage can be unavailable. */
    }
  }
  function getNote(course: string, lesson: string) {
    return notes[noteId(course, lesson)] ?? "";
  }
  return { notes, ready, setNote, getNote };
}
