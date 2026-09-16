# Retention analytics v1

## Contract

`src/lib/analytics/events.ts` is the event/payload registry. `trackWhopEvent` is the only custom-event dispatcher. Required event-specific fields are enforced by TypeScript; arbitrary property bags are not accepted. Each payload adds schema_version, event_id, occurred_at, event_category, page, source, locale/language/timezone, referrer host, and available attribution. Monetary value is not assigned to clicks.

| Event | Exact trigger | Category |
| --- | --- | --- |
| Discord Click / Telegram Click / Whop Click | Activating a supported external anchor | Interaction |
| YouTube Click | Opening a video/channel or subscription link; interaction distinguishes open/subscribe | Interaction |
| Fomo Referral Click | Activating a fomo.family/r/… referral link | Interaction |
| Calendar Click | Opening cal.com or calendly.com | Interaction |
| Calendar Booking | Booking system confirms a booking ID | Completion; reserved integration |
| Video Play | Tagged, non-autoplay HTML media reaches playing; once per element | Interaction |
| Newsletter Submitted | Existing /api/leads request succeeds; submission_id required | Submission; lead saved, not verified mailing-list subscription |
| Checkout - Free Community / Checkout - Social Capital | Existing checkout CTA activation | Interaction; not payment completion |
| Tool Interaction | Checklist check/uncheck, or first daily completion | Interaction |
| Return Visit | Browser opens app on a later UTC date than its last recorded visit | Retention; GA4 only |

Never emit page arrival, automatic redirects, page leaving, app entry, or inferred purchases as custom conversions. A return date measures a browser, not an identified person. Clearing storage resets history. Concurrent tabs can race; this is a lightweight metric, not billing-grade identity.

## Ownership and duplicate prevention

InteractionTracker owns supported anchors across routes (left click, keyboard-generated click, middle click). Explicit button handlers own non-anchor CTAs. Use data-analytics-manual on an anchor if its handler owns tracking, or data-analytics="off" to opt out. data-analytics-source on a section names placement. Add data-content-id to controlled HTML video/audio; YouTube links are never play events. Iframe playback requires that player's verified API callback.

Stable submission/booking IDs deduplicate repeat dispatches in memory and are sent as event_id for provider deduplication. Clicks receive fresh action IDs. Checklist completion is persisted once per UTC day; reloads do not complete it again.

## Attribution

Whop remains authoritative for visitor/ad matching. Its pixel owns _wuid and native URL handling. Our sessionStorage record supplements diagnostics with last tagged arrival: utm_meta_*, utm_source/medium/campaign/content/term/placement/adset/whop, wacid/wasid/waid and supported click IDs. Internal untagged navigation preserves the record; a new tagged URL replaces it. Our landing_url excludes unrelated query values. We neither overwrite Whop identity nor append IDs to Discord/Telegram links. For future server events, capture the actual source URL and _wuid at the handoff using Whop's Events API guide.

## Preview and live modes

VERCEL_ENV=production enables the Whop pixel and dispatch. Preview/local builds only dispatch the rokitg:analytics DOM diagnostic event. Existing IP exclusions apply to live tracking; local diagnostics work for excluded developers too. This setting intentionally avoids mixing experimental traffic into the production conversion stream. GA4's existing general page analytics are separate; Return Visit is a GA4 operational event, not a Whop conversion. Do not mark return_visit as a GA4 key event.

## Test page

/retention is a noindex Spanish daily preparation checklist. Progress is local to the browser, resets by UTC date, and completes only when all four items are checked. The Discord action is measured by the shared tracker. Preview mode includes a small event diagnostic panel. No market feed, investment recommendation, or fabricated live data is included.

## Verification and rollout

1. Run node scripts/test-analytics.cjs and npm run build.
2. In preview, exercise supported links and checklist; listen to rokitg:analytics. Verify one event per action and no Whop requests.
3. Seed rokitg:last-visit:v1 with yesterday in a test browser; reload. Return Visit should appear once, never as a Whop conversion.
4. For calendar completion, connect a verified provider success callback/webhook with booking_id before using Calendar Booking. Current external links cannot prove a booking. Newsletter success currently proves private lead storage only.
5. After an approved production promotion, perform a labeled real interaction and inspect Whop events_list for name, source, event_id, and attribution. Do not fabricate signups/bookings to populate the picker.
6. Add desired real-action events to the dashboard picker after receipt. Historical names stay in Whop. Dashboard selection is separate from this code change.

Historical migration: Lead -> Newsletter Submitted; YouTube Video Click / YouTube Subscription Click -> YouTube Click with interaction. Fomo Referral Click and checkout display names remain stable. Compare historical data explicitly across those names.

Live baseline checked 2026-09-15: Whop returned Fomo Referral Click at 13:50:26Z, attributed to Fomo Sponsor Ad / Bootcamp Sales 09/15. This validates the existing production event only, not this branch's new events.
