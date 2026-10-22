import { DashboardView } from "@/components/internal/DashboardView";
import { loadDashboard, parseRange } from "@/lib/internal-dashboard";

export const dynamic = "force-dynamic";

export default async function InternalDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}) {
  if (!process.env.WHOP_API_KEY) {
    return (
      <div style={{ padding: 40, color: "#fff", fontFamily: "Arial, sans-serif" }}>
        <h1>WHOP_API_KEY is not set</h1>
        <p style={{ color: "#9b9b96", maxWidth: 480 }}>
          Add a Whop API key to the environment to load the dashboard. It reads revenue, ads, members and traffic
          from Whop only.
        </p>
      </div>
    );
  }

  const range = parseRange((await searchParams).range);
  const data = await loadDashboard(range);

  return <DashboardView data={data} range={range} />;
}
