"use client";

import { useEffect } from "react";
import styles from "./PersonOverlay.module.scss";

/** Chrome only — the caller mounts <PersonElement> as `children`, inside its own <Tracking> tree, so it shares accountId/accessToken/appearance with whichever list opened it. */
export function PersonOverlay({ onClose, children }: { onClose: () => void; children: React.ReactNode }) {
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.panel} onClick={(event) => event.stopPropagation()}>
        <div className={styles.panelHeader}>
          <span>PERSON</span>
          <button type="button" className={styles.closeButton} onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        <div className={styles.panelBody}>{children}</div>
      </div>
    </div>
  );
}
