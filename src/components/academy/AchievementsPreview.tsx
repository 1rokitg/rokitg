import styles from "./AchievementsPreview.module.scss";

// Visual-reference mock only — replicates a screenshot the user provided of the
// dashboard/gamification style they want, not real data. Swap for real XP/badge
// state once the underlying tracking exists (see project_rokitg_academy memory).
type Badge = {
  icon: string;
  title: string;
  rarity: "Common" | "Rare" | "Epic";
  description: string;
  earned: string | null;
  requirement?: string;
};

const BADGES: Badge[] = [
  { icon: "👣", title: "First Steps", rarity: "Common", description: "Complete your first lesson", earned: "Sep 16, 2025" },
  { icon: "🔥", title: "Week Warrior", rarity: "Common", description: "Maintain a 7-day learning streak", earned: "Sep 22, 2025" },
  { icon: "🏆", title: "Course Conqueror", rarity: "Rare", description: "Complete your first course", earned: "Jan 15, 2026" },
  { icon: "🧠", title: "Quiz Whiz", rarity: "Rare", description: "Score 100% on any quiz", earned: "Feb 10, 2026" },
  { icon: "⚡", title: "Two-Week Streak", rarity: "Rare", description: "Maintain a 14-day streak", earned: "Mar 5, 2026" },
  { icon: "💛", title: "Helpful Hand", rarity: "Rare", description: "Get 10 upvotes on forum answers", earned: "Mar 20, 2026" },
  { icon: "🎖️", title: "Triple Threat", rarity: "Epic", description: "Complete 3 courses", earned: "Apr 10, 2026" },
  { icon: "🔒", title: "Month Master", rarity: "Epic", description: "Maintain a 30-day streak", earned: null, requirement: "30-day streak" },
  { icon: "🔒", title: "Knowledge Guru", rarity: "Epic", description: "Complete 5 courses", earned: null, requirement: "Complete 5 courses" },
];

function rarityClass(rarity: Badge["rarity"]) {
  if (rarity === "Rare") return styles.rarityRare;
  if (rarity === "Epic") return styles.rarityEpic;
  return "";
}

export function AchievementsPreview() {
  const earnedCount = BADGES.filter((b) => b.earned).length;

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Achievements</h1>
      <p className={styles.subtitle}>{earnedCount} of 12 badges earned</p>

      <div className={styles.levelCard}>
        <div className={styles.levelLeft}>
          <div className={styles.trophyIcon} aria-hidden="true">
            🏆
          </div>
          <div>
            <div className={styles.levelName}>Level 12</div>
            <div className={styles.levelXp}>4250 XP</div>
          </div>
        </div>
        <div className={styles.levelRight}>
          <div className={styles.levelRightHeader}>
            <span>Level 12</span>
            <span>Level 13</span>
          </div>
          <div className={styles.levelTrack}>
            <div className={styles.levelFill} style={{ width: "85%" }} />
          </div>
          <div className={styles.levelFootnote}>250 XP to next level</div>
        </div>
      </div>

      <div className={styles.tabs}>
        <button type="button" className={`${styles.tab} ${styles.tabActive}`}>
          Badges (12)
        </button>
        <button type="button" className={styles.tab}>
          Leaderboard
        </button>
      </div>

      <div className={styles.grid}>
        {BADGES.map((badge) => (
          <div key={badge.title} className={`${styles.badge} ${!badge.earned ? styles.badgeLocked : ""}`}>
            <div className={styles.badgeIcon} aria-hidden="true">
              {badge.icon}
            </div>
            <div>
              <div className={styles.badgeTitleRow}>
                {badge.title}
                <span className={`${styles.rarity} ${rarityClass(badge.rarity)}`}>{badge.rarity}</span>
              </div>
              <p className={styles.badgeDesc}>{badge.description}</p>
              <div className={styles.badgeMeta}>
                {badge.earned ? `Earned ${badge.earned}` : `Requirement: ${badge.requirement}`}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
