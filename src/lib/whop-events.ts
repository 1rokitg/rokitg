import "server-only";
import { WHOP_ACCOUNT_ID, WHOP_API_BASE } from "@/lib/whop-api";

export type WhopLead = {
  email: string;
  eventId: string;
  pageUrl: string;
  visitorId?: string;
  ip?: string | null;
  userAgent?: string | null;
};

/**
 * Reports a lead to Whop's server-side Events API. Whop stores the email on the visitor's
 * People record and ties it to the ad click in `pageUrl`. Needs a key with `event:create`.
 */
export async function sendWhopLead(lead: WhopLead): Promise<void> {
  const apiKey = process.env.WHOP_API_KEY;
  if (!apiKey) throw new Error("WHOP_API_KEY is not set");

  const response = await fetch(`${WHOP_API_BASE}/events`, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      account_id: WHOP_ACCOUNT_ID,
      event_name: "lead",
      event_id: lead.eventId,
      event_time: new Date().toISOString(),
      action_source: "website",
      url: lead.pageUrl,
      user: { email: lead.email, ...(lead.visitorId ? { anonymous_id: lead.visitorId } : {}) },
      context: {
        ...(lead.ip ? { ip_address: lead.ip } : {}),
        ...(lead.userAgent ? { user_agent: lead.userAgent } : {}),
      },
    }),
  });

  if (!response.ok) {
    const detail = (await response.text()).slice(0, 200);
    throw new Error(`Whop events responded ${response.status}${detail ? `: ${detail}` : ""}`);
  }
}
