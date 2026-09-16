"use client";
import { useEffect, useState } from "react";
import { trackWhopEvent, WHOP_EVENTS } from "@/lib/whop";
import { utcDay } from "@/lib/analytics/events";
import styles from "./RetentionChecklist.module.scss";

const ITEMS = [
  { id: "context", text: "He revisado el contexto y los eventos del día." },
  { id: "plan", text: "He escrito mi plan y las condiciones para actuar." },
  { id: "limits", text: "He definido mis límites antes de empezar." },
  { id: "review", text: "He reservado un momento para revisar mis decisiones." },
];
type Progress = { day: string; checked: string[]; completed: boolean };
const KEY = "rokitg:checklist:v1";
function loadProgress(): Progress {
  const day = utcDay(new Date());
  try {
    const value = JSON.parse(localStorage.getItem(KEY) || "null");
    if (value?.day === day && Array.isArray(value.checked)) {
      return {
        day,
        checked: value.checked.filter((id: unknown) => ITEMS.some((item) => item.id === id)),
        completed: value.completed === true,
      };
    }
  } catch {
    /* A private browser can still use the checklist. */
  }
  return { day, checked: [], completed: false };
}
export function RetentionChecklist() {
  const [progress, setProgress] = useState<Progress | null>(null);
  const [storageAvailable, setStorageAvailable] = useState(true);
  const [events, setEvents] = useState<string[]>([]);
  const [preview, setPreview] = useState(false);
  useEffect(() => {
    setProgress(loadProgress());
    setPreview(window.__whopContext?.live !== true);
    const receive = (event: Event) => {
      const detail = (event as CustomEvent).detail;
      setEvents((previous) =>
        [
          `${detail.name} · ${detail.payload.interaction ?? detail.payload.event_category} · ${detail.delivery}`,
          ...previous,
        ].slice(0, 8),
      );
    };
    window.addEventListener("rokitg:analytics", receive);
    return () => window.removeEventListener("rokitg:analytics", receive);
  }, []);
  function toggle(id: string) {
    if (!progress) return;
    const current = progress.day === utcDay(new Date()) ? progress : loadProgress();
    const isChecked = current.checked.includes(id);
    const checked = isChecked
      ? current.checked.filter((value) => value !== id)
      : [...current.checked, id];
    const complete = checked.length === ITEMS.length && !current.completed;
    const next = { ...current, checked, completed: current.completed || complete };
    setProgress(next);
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      setStorageAvailable(false);
    }
    trackWhopEvent(WHOP_EVENTS.toolInteracted, {
      source: "retention_checklist",
      content_id: "daily_preparation_v1",
      content_type: "tool",
      interaction: isChecked ? "uncheck" : "check",
      item_id: id,
    });
    if (complete)
      trackWhopEvent(WHOP_EVENTS.toolInteracted, {
        source: "retention_checklist",
        content_id: "daily_preparation_v1",
        content_type: "tool",
        interaction: "complete",
        event_id: `checklist:${current.day}:${getCompletionId()}`,
      });
  }
  return (
    <section className={styles.page} data-analytics-source="retention_checklist">
      <p className={styles.eyebrow}>ROKITG / TU RUTINA DIARIA</p>
      <h1>
        Antes del próximo movimiento,
        <br />
        un momento para preparar.
      </h1>
      <p className={styles.intro}>
        Cuatro pasos para empezar con un plan. Guarda tu progreso y vuelve mañana para preparar una
        nueva sesión.
      </p>
      <div className={styles.card}>
        <div className={styles.top}>
          <h2>Mi preparación de hoy</h2>
          <span>{progress?.day ?? "…"} · UTC</span>
        </div>
        <progress
          aria-label="Pasos completados"
          max={ITEMS.length}
          value={progress?.checked.length ?? 0}
        />
        {ITEMS.map((item) => (
          <label key={item.id} className={styles.item}>
            <input
              type="checkbox"
              disabled={!progress}
              checked={progress?.checked.includes(item.id) ?? false}
              onChange={() => toggle(item.id)}
            />
            <span>{item.text}</span>
          </label>
        ))}
        <p aria-live="polite">
          {progress?.checked.length === ITEMS.length
            ? "Preparación completa. Vuelve mañana para empezar de nuevo."
            : `${progress?.checked.length ?? 0} de 4 pasos completados.`}
        </p>
        <small>
          {storageAvailable
            ? "Tu progreso se guarda en este navegador y se renueva cada día a las 00:00 UTC."
            : "Este navegador no permite guardar el progreso. Puedes completar la checklist durante esta visita."}
        </small>
      </div>
      <div className={styles.community}>
        <div>
          <h2>Comparte el proceso.</h2>
          <p>Únete a la comunidad de RokitG y habla con otros traders.</p>
        </div>
        <a href="https://discord.gg/VcjBxgtv" target="_blank" rel="noopener noreferrer">
          Entrar en Discord ↗
        </a>
      </div>
      {preview && (
        <details className={styles.diagnostics}>
          <summary>Comprobación de eventos (vista de prueba)</summary>
          <p>
            Los eventos de esta vista no se envían a Whop. Interactúa con la checklist para
            comprobarlos.
          </p>
          <ol>
            {events.map((event, i) => (
              <li key={`${i}:${event}`}>{event}</li>
            ))}
          </ol>
        </details>
      )}
    </section>
  );
}
function getCompletionId() {
  const key = "rokitg:checklist-browser:v1";
  try {
    const id = localStorage.getItem(key) || crypto.randomUUID();
    localStorage.setItem(key, id);
    return id;
  } catch {
    return crypto.randomUUID();
  }
}
