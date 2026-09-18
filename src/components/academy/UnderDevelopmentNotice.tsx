"use client";

import { useEffect, useState } from "react";
import styles from "./UnderDevelopmentNotice.module.scss";

const DISMISSED_KEY = "rokitg:academy:dev-notice-dismissed:v1";

// Temporary — remove once the academy is out of the visual-mock phase
// (see project_rokitg_academy memory: dashboard cards, achievements, etc.
// are all placeholder content right now).
export function UnderDevelopmentNotice() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!sessionStorage.getItem(DISMISSED_KEY)) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  function dismiss() {
    setVisible(false);
    try {
      sessionStorage.setItem(DISMISSED_KEY, "1");
    } catch {
      /* Storage can be unavailable. */
    }
  }

  if (!visible) return null;

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-label="Academia en construcción"
      onClick={dismiss}
    >
      <div className={styles.modal} onClick={(event) => event.stopPropagation()}>
        <span className={styles.badge}>En construcción</span>
        <h2 className={styles.title}>RokitG Academy todavía se está construyendo</h2>
        <p className={styles.body}>
          Lo que ves aquí es una vista previa visual — cursos, progreso, insignias y algunos botones
          todavía no son funcionales. Puedes explorar, pero nada de esto es definitivo todavía.
        </p>
        <button type="button" className={styles.button} onClick={dismiss}>
          Entendido, seguir explorando
        </button>
      </div>
    </div>
  );
}
