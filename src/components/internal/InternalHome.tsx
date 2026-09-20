import Link from "next/link";
import styles from "./InternalHome.module.scss";

const TOOLS = [
  {
    href: "/internal/events",
    label: "Events",
    description:
      "Every event the pixel measured — page views, leads, purchases, custom clicks — as a live, tailable stream.",
  },
  {
    href: "/internal/people",
    label: "People",
    description: "Everyone the pixel has resolved, with source, spend, and activity. Click a row for their full history.",
  },
] as const;

export function InternalHome() {
  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <p className={styles.eyebrow}>Internal</p>
        <h1 className={styles.title}>Internal Tools</h1>
        <p className={styles.lead}>Built on Whop&apos;s Elements SDK.</p>
        <div className={styles.grid}>
          {TOOLS.map((tool) => (
            <Link key={tool.href} href={tool.href} className={styles.card}>
              <div className={styles.cardTitle}>
                <span className={styles.dot} aria-hidden="true" />
                {tool.label}
              </div>
              <p className={styles.cardDesc}>{tool.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
