"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./InternalShell.module.scss";

const TABS = [
  { href: "/internal/events", label: "Events" },
  { href: "/internal/people", label: "People" },
] as const;

export function InternalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className={styles.shell}>
      <nav className={styles.nav}>
        <div className={styles.brand}>
          <span className={styles.dot} aria-hidden="true" />
          rokitg.com <span className={styles.sep}>/</span> internal
        </div>
        <div className={styles.tabs}>
          {TABS.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className={`${styles.tab} ${pathname?.startsWith(tab.href) ? styles.tabActive : ""}`}
            >
              {tab.label}
            </Link>
          ))}
        </div>
      </nav>
      <div className={styles.body}>{children}</div>
    </div>
  );
}
