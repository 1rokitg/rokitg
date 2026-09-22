---
description: Generate a visual, professional daily business report (ads, revenue, members, traffic, pixel events) as a published Artifact dashboard
---

Pull today's business snapshot for RokitG (`biz_ROKYKZdV9YGZP7`) via the `whop` CLI, then publish it as a polished, visual dashboard artifact — not a text reply.

## 1. Gather the data (today = current UTC day, `YYYY-MM-DD` for both `--from` and `--to`)

Run these in parallel:

- `whop ad-campaigns list --format json` — every campaign's status, budget, spend, CTR, purchases (lifetime figures; note which are active vs paused today)
- `whop ad-groups list --account_id biz_ROKYKZdV9YGZP7 --format json` — per-group budget/targeting detail if any campaign needs a closer look
- `whop stats get ad_spend --account_id biz_ROKYKZdV9YGZP7 --from <today> --to <today> --format json`
- `whop stats get gross_revenue --account_id biz_ROKYKZdV9YGZP7 --from <today> --to <today> --format json`
- `whop stats get net_revenue --account_id biz_ROKYKZdV9YGZP7 --from <today> --to <today> --format json`
- `whop stats get successful_payments --account_id biz_ROKYKZdV9YGZP7 --from <today> --to <today> --format json`
- `whop stats get new_users --account_id biz_ROKYKZdV9YGZP7 --from <today> --to <today> --format json`
- `whop stats get page_visits --account_id biz_ROKYKZdV9YGZP7 --from <today> --to <today> --format json`
- `whop stats get traffic_people --account_id biz_ROKYKZdV9YGZP7 --from <today> --to <today> --format json`
- `whop stats get traffic_events --account_id biz_ROKYKZdV9YGZP7 --from <today> --to <today> --breakdown_by event_name --format json` — filter the breakdown down to customer-facing events only (`pixel.*`, `checkout.*`, `payment.*`); ignore Whop's internal ops events (`ads.ad*.*`, `ledger_line.*`, `infra.*`, `economic_intelligence_funnel`, `experiment.exposure`, `partners.affiliate_payment.*`, `page.click.creator_dashboard`)
- `whop memberships list --account_id biz_ROKYKZdV9YGZP7 --format json` — filter to `created_at` within today (and note any trials started in the last 24-48h as pipeline, even if not "today")
- **Custom click detail (default, always include):** get the exact list of today's custom pixel events, not just the aggregate count. First pull the breakdown by name: `whop stats get traffic_events --account_id biz_ROKYKZdV9YGZP7 --from <today> --to <today> --event_name pixel.custom --breakdown_by custom_name --format json`. Then fetch each individual event with full context (page, geo, source/ad attribution) via `whop events list --account_id biz_ROKYKZdV9YGZP7 --from <today>T00:00:00Z --to <today>T23:59:59Z --event "pixel.custom:<Name 1>,pixel.custom:<Name 2>,..." --first 100 --format json`, building the comma-separated `--event` value from whatever custom names the breakdown returned (e.g. `pixel.custom:Fomo Referral Click,pixel.custom:Telegram Click,pixel.custom:Checkout - Free Community`). For each event, surface: time (UTC), event name, page path, visitor city/country, and source — prefer the specific ad (campaign/ad group/ad title from `related.ad_campaign`/`related.ad_group`/`related.ad`) when `context.ad_campaign_id` is set, otherwise fall back to `context.utm_source`/`utm_medium` or the plain referrer domain.
- For trend context, also pull `ad_spend`, `gross_revenue`, and `new_users` for the trailing 7 days (`--from <today-6d> --to <today>` with default day interval) so the dashboard can show a sparkline/line chart, not just a single-day number

## 2. Build the dashboard

Load the `dataviz` skill before writing any chart code, then load `artifact-design` before writing the artifact (the Artifact tool's own instructions require this — don't skip it because this is a repeat report).

Structure the HTML artifact as:
- **Header**: "RokitG — Daily Report" + today's date, dark/light theme aware
- **KPI row** (stat tiles): Revenue today, Ad spend today, New members today, Unique visitors today — each with a small delta vs. yesterday or 7-day average if available
- **7-day trend chart**: line/area chart of spend vs. revenue (or spend vs. new users if revenue is usually $0) so the user sees direction, not just a snapshot
- **Campaign table**: one row per ad campaign — status (active/paused badge), daily budget, lifetime spend, CTR, purchases, cost/purchase — sorted active-first
- **Funnel events section**: the customer-facing pixel/checkout event counts today as a small funnel or bar chart (page view → checkout started → funnel complete → payment completed), plus standout custom events (add_to_cart, view_content, etc.)
- **Custom Click Detail table (default, always include)**: one row per custom pixel event fetched above — time, event name (color-tagged by type), page, visitor location, and source/attribution (specific ad when attributed, otherwise UTM or referrer). This replaces a flat "custom clicks: N" badge — the count alone is not enough, the user wants to see exactly which visitor did what, from where, via which source, every time.
- **New members list**: today's actual signups (plan name, time, status) plus any trials in flight
- **Narrative callout**: 2-4 sentences at the bottom in plain language — what happened, what's notable, one clear recommendation (this is the part that replaces the "Bottom line" summary from chat)

Use the placeholder palette from `dataviz`'s `references/palette.md` unless the user has already established brand colors in this project.

## 3. Publish

Publish via the `Artifact` tool (title: `rokitg_daily_report`, icon: `chart`). If a same-titled report artifact already exists from a prior run this conversation, update it in place by URL instead of creating a new one. After publishing, send one short chat message summarizing the 2-3 headline numbers and a link/reference to the dashboard — don't repeat the full breakdown in text since the dashboard now carries it.
