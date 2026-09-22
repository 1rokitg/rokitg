---
description: Ask for a timeframe, then generate a visual, professional business report (ads, revenue, members, traffic, pixel events) as a published Artifact dashboard
---

## 0. Ask for the timeframe first — always, every run

Before running any `whop` command, use `AskUserQuestion` to ask which window this report should cover. Offer these options (single-select):

- **Today** — current UTC day so far
- **Yesterday** — the full previous UTC day
- **Last 7 days** — rolling week ending today
- **Last 30 days** — rolling month ending today
- **Custom range** — if chosen, ask a follow-up for the exact start/end dates (`YYYY-MM-DD`)

Do not default to "today" or skip this step because a prior run picked something — ask fresh every time the command is invoked. Resolve the choice to concrete `--from`/`--to` values (`YYYY-MM-DD`, current UTC date for "today"/"yesterday" math) before moving on.

## 1. Gather the data (for the resolved `--from`/`--to` window)

Run these in parallel:

- `whop ad-campaigns list --format json` — every campaign's status, budget, spend, CTR, purchases (lifetime figures; note which are active vs paused as of now)
- `whop ad-groups list --account_id biz_ROKYKZdV9YGZP7 --format json` — per-group budget/targeting detail if any campaign needs a closer look
- `whop stats get ad_spend --account_id biz_ROKYKZdV9YGZP7 --from <from> --to <to> --format json`
- `whop stats get gross_revenue --account_id biz_ROKYKZdV9YGZP7 --from <from> --to <to> --format json`
- `whop stats get net_revenue --account_id biz_ROKYKZdV9YGZP7 --from <from> --to <to> --format json`
- `whop stats get successful_payments --account_id biz_ROKYKZdV9YGZP7 --from <from> --to <to> --format json`
- `whop stats get new_users --account_id biz_ROKYKZdV9YGZP7 --from <from> --to <to> --format json`
- `whop stats get page_visits --account_id biz_ROKYKZdV9YGZP7 --from <from> --to <to> --format json`
- `whop stats get traffic_people --account_id biz_ROKYKZdV9YGZP7 --from <from> --to <to> --format json`
- `whop stats get traffic_events --account_id biz_ROKYKZdV9YGZP7 --from <from> --to <to> --breakdown_by event_name --format json` — filter the breakdown down to customer-facing events only (`pixel.*`, `checkout.*`, `payment.*`); ignore Whop's internal ops events (`ads.ad*.*`, `ledger_line.*`, `infra.*`, `economic_intelligence_funnel`, `experiment.exposure`, `partners.affiliate_payment.*`, `page.click.creator_dashboard`)
- `whop memberships list --account_id biz_ROKYKZdV9YGZP7 --format json` — filter to `created_at` within the window (and note any trials started just before the window as pipeline context, even if not strictly inside it)
- **Custom click detail (default, always include):** get the exact list of the window's custom pixel events, not just the aggregate count. First pull the breakdown by name: `whop stats get traffic_events --account_id biz_ROKYKZdV9YGZP7 --from <from> --to <to> --event_name pixel.custom --breakdown_by custom_name --format json`. Then fetch each individual event with full context (page, geo, source/ad attribution) via `whop events list --account_id biz_ROKYKZdV9YGZP7 --from <from>T00:00:00Z --to <to>T23:59:59Z --event "pixel.custom:<Name 1>,pixel.custom:<Name 2>,..." --first 100 --format json`, building the comma-separated `--event` value from whatever custom names the breakdown returned. For each event, surface: time (UTC), event name, page path, visitor city/country, and source — prefer the specific ad (campaign/ad group/ad title from `related.ad_campaign`/`related.ad_group`/`related.ad`) when `context.ad_campaign_id` is set, otherwise fall back to `context.utm_source`/`utm_medium` or the plain referrer domain. If the window spans many days and this list gets long (50+), still fetch it all but consider grouping/summarizing older entries in the dashboard rather than dropping them.
- **Trend context:** pull `ad_spend`, `gross_revenue`, and `new_users` as a daily series across a window at least as long as the report window (for "Today"/"Yesterday", still pull the trailing 7 days for context; for "Last 7 days"/"Last 30 days"/custom, the report window itself typically doubles as the trend series) so the dashboard always shows a real chart, never just a single-point number.

## 2. Build the dashboard

Load the `dataviz` skill before writing any chart code, then load `artifact-design` before writing the artifact (the Artifact tool's own instructions require this — don't skip it because this is a repeat report).

Structure the HTML artifact as:
- **Header**: "RokitG — [Timeframe] Report" (name it after the resolved window, e.g. "Last 7 Days Report") + the resolved date range, dark/light theme aware. If the window includes today and today is partial, say so explicitly (e.g. "as of 14:32 UTC, day ~60% elapsed") so the numbers aren't misread as final.
- **KPI row** (stat tiles): Revenue, Ad spend, New members, Unique visitors — labeled for the window (e.g. "Revenue this week" not always "today") — each with a small delta vs. the prior period of equal length or a trailing average, when available
- **Trend chart**: line/area chart of spend vs. revenue (or spend vs. new users if revenue is usually $0) across the window's daily buckets, so the user sees direction, not just a snapshot
- **Campaign table**: one row per ad campaign — status (active/paused badge), daily budget, lifetime spend, CTR, purchases, cost/purchase — sorted active-first
- **Funnel events section**: the customer-facing pixel/checkout event counts for the window as a small funnel or bar chart (page view → checkout started → funnel complete → payment completed), plus standout custom events (add_to_cart, view_content, etc.)
- **Custom Click Detail table (default, always include)**: one row per custom pixel event fetched above — time, event name (color-tagged by type), page, visitor location, and source/attribution (specific ad when attributed, otherwise UTM or referrer). This replaces a flat "custom clicks: N" badge — the count alone is not enough, the user wants to see exactly which visitor did what, from where, via which source, every time.
- **New members list**: the window's actual signups (plan name, time, status) plus any trials in flight
- **Narrative callout**: 2-4 sentences at the bottom in plain language — what happened over the window, what's notable, one clear recommendation (this is the part that replaces a "Bottom line" summary from chat)

Use the placeholder palette from `dataviz`'s `references/palette.md` unless the user has already established brand colors in this project.

## 3. Publish

Publish via the `Artifact` tool (title: `rokitg_daily_report`, icon: `chart`). If a same-titled report artifact already exists from a prior run this conversation, update it in place by URL instead of creating a new one — the artifact is reused across timeframes, just re-rendered for whichever window was picked this run. After publishing, send one short chat message summarizing the 2-3 headline numbers for the chosen window and a link/reference to the dashboard — don't repeat the full breakdown in text since the dashboard now carries it.
