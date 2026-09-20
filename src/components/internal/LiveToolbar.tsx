"use client";

import styles from "./LiveToolbar.module.scss";

export function LiveToolbar({
  title,
  status,
  live,
  onToggleLive,
  onRestart,
  liveControl = true,
}: {
  title: string;
  status: string;
  live: boolean;
  onToggleLive: () => void;
  onRestart?: () => void;
  /** false renders a plain "Refresh" action instead of the Live/Paused toggle, for pages with no tailing mode. */
  liveControl?: boolean;
}) {
  return (
    <div className={styles.bar}>
      <div className={styles.title}>
        <span className={styles.titleText}>{title}</span>
        <span className={styles.status}>{status}</span>
      </div>
      <div className={styles.controls}>
        {onRestart && (
          <button type="button" className={styles.iconButton} onClick={onRestart}>
            Restart
          </button>
        )}
        {liveControl ? (
          <button
            type="button"
            className={`${styles.liveButton} ${!live ? styles.paused : ""}`}
            onClick={onToggleLive}
          >
            <span className={styles.pulse} aria-hidden="true" />
            {live ? "Live" : "Paused"}
          </button>
        ) : (
          <button type="button" className={styles.iconButton} onClick={onToggleLive}>
            Refresh
          </button>
        )}
      </div>
    </div>
  );
}
