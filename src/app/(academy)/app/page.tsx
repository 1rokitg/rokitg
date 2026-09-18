import { DesignbyteShowcase } from "@/components/academy/DesignbyteShowcase";
import { AchievementsPreview } from "@/components/academy/AchievementsPreview";

export const metadata = {
  title: "Dashboard | RokitG Academy",
  description: "A focused learning space for beginner traders.",
};

// Temporary: showing the tweakcn "designbyte" card gallery + the Achievements
// mock at /app root so the visual direction can be reviewed in place.
export default function AppPreviewPage() {
  return (
    <>
      <DesignbyteShowcase />
      <AchievementsPreview />
    </>
  );
}
