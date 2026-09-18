import "server-only";

const META_GRAPH_VERSION = "v21.0";

type SendMetaEventInput = {
  eventName: string;
  eventId: string;
  eventTime: number;
  eventSourceUrl: string;
  clientIp?: string;
  clientUserAgent?: string;
  fbp?: string;
  fbc?: string;
};

/**
 * Sends one event to the user's own Meta Conversions API dataset (independent
 * of Whop's ad stack). Paired with the client-side Meta Pixel call using the
 * same `eventId` so Meta deduplicates the two automatically.
 */
export async function sendMetaEvent(input: SendMetaEventInput): Promise<void> {
  const pixelId = process.env.META_PIXEL_ID;
  const accessToken = process.env.META_CAPI_ACCESS_TOKEN;
  if (!pixelId || !accessToken) return;

  const body = {
    data: [
      {
        event_name: input.eventName,
        event_time: input.eventTime,
        event_id: input.eventId,
        event_source_url: input.eventSourceUrl,
        action_source: "website",
        user_data: {
          client_ip_address: input.clientIp,
          client_user_agent: input.clientUserAgent,
          fbp: input.fbp,
          fbc: input.fbc,
        },
      },
    ],
    ...(process.env.META_TEST_EVENT_CODE ? { test_event_code: process.env.META_TEST_EVENT_CODE } : {}),
  };

  const response = await fetch(
    `https://graph.facebook.com/${META_GRAPH_VERSION}/${pixelId}/events?access_token=${encodeURIComponent(accessToken)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
  );

  if (!response.ok) {
    console.error(`Meta CAPI event failed (${response.status}): ${await response.text()}`);
  }
}
