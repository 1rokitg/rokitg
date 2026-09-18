import "server-only";

const WHOP_API_BASE = "https://api.whop.com/api/v1";
const WHOP_ACCOUNT_ID = "biz_ROKYKZdV9YGZP7";

type CheckoutConfiguration = {
  id: string;
  purchase_url: string | null;
  redirect_url: string | null;
};

/**
 * Mints a fresh, single-use Whop checkout link for one visitor/session instead of
 * sharing one static plan link — lets the payment.succeeded webhook match the buyer
 * back to a specific Privy user via `metadata`, with no email-matching guesswork.
 */
export async function createCourseCheckout(options: {
  planId: string;
  metadata: Record<string, string>;
  redirectUrl: string;
}): Promise<CheckoutConfiguration> {
  const apiKey = process.env.WHOP_API_KEY;
  if (!apiKey) {
    throw new Error("WHOP_API_KEY is not set — add it to generate real checkout links.");
  }

  const response = await fetch(`${WHOP_API_BASE}/checkout_configurations`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      account_id: WHOP_ACCOUNT_ID,
      plan_id: options.planId,
      metadata: options.metadata,
      redirect_url: options.redirectUrl,
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Whop checkout_configurations create failed (${response.status}): ${detail}`);
  }

  return (await response.json()) as CheckoutConfiguration;
}

type AccessToken = {
  token: string;
  expiresAt: string;
};

/**
 * Mints a short-lived, scoped access token for Whop Elements' Tracking handle
 * (People/Events feed). Never expose WHOP_API_KEY itself to the browser — only
 * this derived token, which expires on its own (max 3h upstream).
 */
export async function mintTrackingAccessToken(): Promise<AccessToken> {
  const apiKey = process.env.WHOP_API_KEY;
  if (!apiKey) {
    throw new Error("WHOP_API_KEY is not set — add it to mint Elements access tokens.");
  }

  const response = await fetch(`${WHOP_API_BASE}/access_tokens`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      account_id: WHOP_ACCOUNT_ID,
      scoped_actions: ["company:basic:read", "stats:read", "audience:basic:read"],
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Whop access_tokens create failed (${response.status}): ${detail}`);
  }

  const data = (await response.json()) as { token: string; expires_at: string };
  return { token: data.token, expiresAt: data.expires_at };
}
