import { mintTrackingAccessToken } from "@/lib/whop-api";
import { PeopleTerminalClient } from "@/components/internal/PeopleTerminalClient";

export const dynamic = "force-dynamic";

export default async function InternalPeoplePage() {
  if (!process.env.WHOP_API_KEY) {
    return (
      <div style={{ padding: 40, color: "#fff", fontFamily: "Arial, sans-serif" }}>
        <h1>WHOP_API_KEY is not set</h1>
        <p style={{ color: "#9b9b96", maxWidth: 480 }}>
          Add a Whop API key to the environment to mint access tokens for this dashboard.
        </p>
      </div>
    );
  }

  const { token } = await mintTrackingAccessToken();

  return <PeopleTerminalClient accessToken={token} />;
}
