import styles from "./SkeletonBlock.module.scss";

/**
 * A shimmering placeholder for identity/progress data that only exists once a
 * visitor signs in (streak, XP, avatar, lesson progress) — deliberately looks
 * "waiting for you" rather than showing a real zero, which would read as broken.
 */
export function SkeletonBlock({
  width = "100%",
  height = 14,
  radius = 6,
  className,
}: {
  width?: number | string;
  height?: number | string;
  radius?: number | string;
  className?: string;
}) {
  return (
    <span
      className={[styles.skeleton, className].filter(Boolean).join(" ")}
      style={{ width, height, borderRadius: radius }}
      aria-hidden="true"
    />
  );
}
