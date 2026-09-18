"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePrivy, useLogin } from "@privy-io/react-auth";
import { recordVisitAndGetStreak, getCompletedLessons } from "@/lib/academy-progress";
import styles from "./AcademySidebar.module.scss";

const NAV_ITEMS = [
  { href: "/app", label: "Dashboard", icon: "🏠" },
  { href: "/app/courses", label: "Explorar cursos", icon: "📚" },
  { href: "/app/courses/library", label: "Mi aprendizaje", icon: "🎓" },
];

export function AcademySidebar({ totalLessons }: { totalLessons: number }) {
  const pathname = usePathname();
  const { ready, authenticated, user, logout } = usePrivy();
  const { login } = useLogin();
  const [streakDays, setStreakDays] = useState<number | null>(null);
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    setStreakDays(recordVisitAndGetStreak().days);
    setCompletedCount(getCompletedLessons().length);
  }, []);

  const progressPct = totalLessons > 0 ? Math.min(100, (completedCount / totalLessons) * 100) : 0;

  return (
    <aside className={styles.sidebar}>
      <Link href="/app" className={styles.brand}>
        <span className={styles.brandMark}>R</span>
        <span className={styles.brandLabel}>
          RokitG
          <small>ACADEMY</small>
        </span>
      </Link>

      <div className={styles.identity}>
        <div className={styles.identityRow}>
          <span>{authenticated ? (user?.email?.address ?? "Cuenta conectada") : "Invitado"}</span>
          {streakDays !== null && streakDays > 0 && (
            <span className={styles.streak}>🔥 {streakDays}d</span>
          )}
        </div>
        <div className={styles.progressTrack}>
          <div className={styles.progressFill} style={{ width: `${progressPct}%` }} />
        </div>
        <span className={styles.progressLabel}>
          {completedCount}/{totalLessons} lecciones completadas
        </span>
      </div>

      <nav className={styles.nav}>
        {NAV_ITEMS.map((item) => {
          const isActive = item.href === "/app" ? pathname === "/app" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navLink} ${isActive ? styles.navLinkActive : ""}`}
            >
              <span aria-hidden="true">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className={styles.sidebarFooter}>
        <button
          type="button"
          className={styles.loginButton}
          disabled={!ready}
          onClick={() => (authenticated ? logout() : login())}
        >
          {authenticated ? "Cerrar sesión" : "Iniciar sesión"}
        </button>
        <a className={styles.backToSite} href="https://rokitg.com">
          ← Volver a rokitg.com
        </a>
      </div>
    </aside>
  );
}
