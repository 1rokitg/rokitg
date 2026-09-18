import { DesignbyteShowcase } from "@/components/academy/DesignbyteShowcase";
import { AchievementsPreview } from "@/components/academy/AchievementsPreview";

export const metadata = {
  title: "Demo | RokitG Academy",
  description: "Visual reference gallery — the tweakcn 'designbyte' card demo, kept for design review.",
};

// The original tweakcn "designbyte" card gallery + Achievements mock, moved
// off the real dashboard route once /app got real course-platform content.
export default function DesignDemoPage() {
  return (
    <>
      <DesignbyteShowcase />
      <AchievementsPreview />
    </>
  );
}
