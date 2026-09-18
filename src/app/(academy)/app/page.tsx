import { AchievementsPreview } from "@/components/academy/AchievementsPreview";

export const metadata = {
  title: "Achievements | RokitG Academy",
  description: "A focused learning space for beginner traders.",
};

// Temporary: showing the Achievements mock at /app root so the visual
// direction can be reviewed in place. Swap back to a real dashboard once
// the sidebar/gamification direction is confirmed.
export default function AppPreviewPage() {
  return <AchievementsPreview />;
}
