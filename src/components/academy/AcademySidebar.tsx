"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePrivy, useLogin } from "@privy-io/react-auth";
import { recordVisitAndGetStreak, getCompletedLessons } from "@/lib/academy-progress";
import styles from "./AcademySidebar.module.scss";

// Real pages first; the rest are visual-reference stubs until they exist —
// see project_rokitg memory for the "replicate the reference dashboard" ask.
const NAV_ITEMS = [
  { href: "/app", label: "Dashboard", icon: "🏠", real: true },
  { href: "/app/courses", label: "Browse Courses", icon: "📚", real: true },
  { href: "/app/courses/library", label: "My Learning", icon: "🎓", real: true },
  { href: "/app", label: "Assignments", icon: "📋", real: false },
  { href: "/app", label: "Calendar", icon: "📅", real: false },
  { href: "/app", label: "Progress", icon: "📈", real: false },
  { href: "/app", label: "Certificates", icon: "🏅", real: false },
  { href: "/app", label: "Achievements", icon: "🏆", real: false, forceActive: true },
  { href: "/app", label: "Leaderboard", icon: "🥇", real: false },
  { href: "/app", label: "Bookmarks", icon: "🔖", real: false },
  { href: "/app", label: "Notes", icon: "📝", real: false },
  { href: "/app", label: "Messages", icon: "💬", real: false },
  { href: "/app", label: "Discussions", icon: "🗣️", real: false },
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
  const displayName = authenticated ? (user?.email?.address ?? "Cuenta conectada") : "Invitado";

  return (
    <aside className={styles.sidebar}>
      <Link href="/app" className={styles.brand}>
        <span className={styles.brandMark}>R</span>
        <span className={styles.brandLabel}>
          RokitG
          <small>ACADEMY</small>
        </span>
      </Link>

      <div className={styles.profileCard}>
        <div className={styles.profileRow}>
          <div className={styles.avatar} aria-hidden="true">
            {displayName.slice(0, 1).toUpperCase()}
          </div>
          <div>
            <div className={styles.profileName}>{displayName}</div>
            <div className={styles.profileLevel}>Level 1</div>
          </div>
        </div>
        <div className={styles.xpRow}>
          <span>0 XP</span>
          {streakDays !== null && streakDays > 0 && (
            <span className={styles.streak}>🔥 {streakDays}d streak</span>
          )}
        </div>
        <div className={styles.progressTrack}>
          <div className={styles.progressFill} style={{ width: "0%" }} />
        </div>
      </div>

      <div className={styles.portalSelect}>
        <span>🎓 Student Portal</span>
        <span aria-hidden="true">⌄</span>
      </div>

      <nav className={styles.nav}>
        {NAV_ITEMS.map((item, index) => {
          const isActive = item.forceActive
            ? true
            : item.real && (item.href === "/app" ? pathname === "/app" : pathname.startsWith(item.href));
          return (
            <Link
              key={`${item.href}-${item.label}-${index}`}
              href={item.href}
              className={`${styles.navLink} ${isActive ? styles.navLinkActive : ""}`}
              aria-disabled={!item.real}
            >
              <span aria-hidden="true">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className={styles.progressSummary}>
        <span>
          {completedCount}/{totalLessons} lessons complete
        </span>
      </div>

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
