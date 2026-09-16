/** Stable public names. Version payload changes separately. */
export const EVENTS = {
  discordClicked: "Discord Click",
  telegramClicked: "Telegram Click",
  youtubeClicked: "YouTube Click",
  whopClicked: "Whop Click",
  calendarClicked: "Calendar Click",
  calendarBooked: "Calendar Booking",
  videoPlayed: "Video Play",
  newsletterSubmitted: "Newsletter Submitted",
  fomoReferralClicked: "Fomo Referral Click",
  returnVisit: "Return Visit",
  toolInteracted: "Tool Interaction",
  freeCheckoutClicked: "Checkout - Free Community",
  paidCheckoutClicked: "Checkout - Social Capital",
} as const;
type Base = { source: string; event_id?: string };
type Outbound = Base & {
  destination: string;
  link_label: string;
  interaction: "open" | "subscribe";
  content_id?: string;
};
type Checkout = Base & { offer: string; plan_id: string; payment_type: string; amount?: number };
export type OutboundEvent =
  | "Discord Click"
  | "Telegram Click"
  | "YouTube Click"
  | "Whop Click"
  | "Calendar Click"
  | "Fomo Referral Click";
export type EventPayloads = Record<OutboundEvent, Outbound> & {
  "Video Play": Base & { content_id: string; content_type: "video"; interaction: "play" };
  "Newsletter Submitted": Base & { submission_id: string; interaction: "submit" };
  "Calendar Booking": Base & { booking_id: string; interaction: "confirmed" };
  "Tool Interaction": Base & {
    content_id: string;
    content_type: "tool";
    interaction: "check" | "uncheck" | "complete";
    item_id?: string;
  };
  "Return Visit": Base & { days_since_last_visit: number; visit_day: string };
  "Checkout - Free Community": Checkout;
  "Checkout - Social Capital": Checkout;
};
export type EventName = keyof EventPayloads;
export function eventCategory(name: EventName) {
  if (name === EVENTS.returnVisit) return "retention";
  if (name === EVENTS.calendarBooked) return "completion";
  if (name === EVENTS.newsletterSubmitted) return "submission";
  return "interaction";
}
export function classifyOutbound(url: URL): OutboundEvent | undefined {
  if (!/^https?:$/.test(url.protocol)) return;
  const host = url.hostname.toLowerCase().replace(/^www\./, "");
  if (host === "discord.gg" || (host === "discord.com" && url.pathname.startsWith("/invite/")))
    return EVENTS.discordClicked;
  if (host === "t.me" || host === "telegram.me") return EVENTS.telegramClicked;
  if (["youtube.com", "m.youtube.com", "youtu.be"].includes(host)) return EVENTS.youtubeClicked;
  if (host === "cal.com" || host === "calendly.com") return EVENTS.calendarClicked;
  if (host === "whop.com") return EVENTS.whopClicked;
  if (host === "fomo.family" && /^\/r\/[^/]+/.test(url.pathname)) return EVENTS.fomoReferralClicked;
}
export const ATTRIBUTION_KEYS = [
  "utm_meta_ad_id",
  "utm_meta_adset_id",
  "utm_meta_campaign_id",
  "utm_source",
  "utm_placement",
  "utm_medium",
  "utm_content",
  "utm_adset",
  "utm_campaign",
  "utm_term",
  "utm_whop",
  "wacid",
  "wasid",
  "waid",
  "fbclid",
  "gclid",
  "ttclid",
] as const;
export function attributionFromUrl(url: URL) {
  const safe = new URL(url.origin + url.pathname);
  const parameters: Record<string, string> = {};
  for (const key of ATTRIBUTION_KEYS) {
    const value = url.searchParams.get(key);
    if (value) {
      parameters[key] = value.slice(0, 512);
      safe.searchParams.set(key, parameters[key]);
    }
  }
  return { landing_url: safe.href, parameters };
}
export function utcDay(now: Date) {
  return now.toISOString().slice(0, 10);
}
export function returnVisit(previousDay: string | null, now: Date) {
  const today = utcDay(now);
  if (!previousDay || !/^\d{4}-\d{2}-\d{2}$/.test(previousDay) || previousDay >= today) return;
  const days = Math.round((Date.parse(today) - Date.parse(previousDay)) / 86_400_000);
  if (Number.isFinite(days) && days > 0) return { days_since_last_visit: days, visit_day: today };
}
