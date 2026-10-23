import "server-only";
import {
  attempt,
  getMetric,
  listAdCampaigns,
  listRecentPayments,
  type AdCampaign,
  type MetricSeries,
  type Payment,
  type Result,
} from "@/lib/whop-stats";

export const RANGES = { today: 1, "7d": 7, "30d": 30 } as const;
export type RangeKey = keyof typeof RANGES;

export function parseRange(value: string | undefined): RangeKey {
  return value && value in RANGES ? (value as RangeKey) : "7d";
}

const DAY_MS = 86_400_000;
const isoDate = (date: Date) => date.toISOString().slice(0, 10);
const addDays = (date: Date, days: number) => new Date(date.getTime() + days * DAY_MS);

export type Windows = {
  from: string;
  to: string;
  prevFrom: string;
  prevTo: string;
  fromTs: number;
  days: number;
};

export function windowsFor(range: RangeKey, now = new Date()): Windows {
  const days = RANGES[range];
  const to = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const from = addDays(to, -(days - 1));
  const prevTo = addDays(from, -1);
  const prevFrom = addDays(prevTo, -(days - 1));
  return {
    from: isoDate(from),
    to: isoDate(to),
    prevFrom: isoDate(prevFrom),
    prevTo: isoDate(prevTo),
    fromTs: from.getTime() / 1000,
    days,
  };
}

/** Sum of daily points inside [startTs, endTs). Use for count and currency metrics only. */
export function sumPoints(series: MetricSeries, startTs: number, endTs = Number.POSITIVE_INFINITY): number {
  return series.points.reduce(
    (total, point) => (point.timestamp >= startTs && point.timestamp < endTs ? total + (point.value ?? 0) : total),
    0,
  );
}

export function lastValue(series: MetricSeries): number | null {
  for (let i = series.points.length - 1; i >= 0; i -= 1) {
    const value = series.points[i].value;
    if (value !== null) return value;
  }
  return null;
}

/** Whole-window aggregate Whop computes itself (rates and unique people can't be summed from daily points). */
export function wholeWindow(series: MetricSeries): number | null {
  return series.totals[0]?.value ?? null;
}

/**
 * Unique visitors for the window. Prefers Whop's own whole-window total; if Whop didn't send one,
 * falls back to summing daily uniques, which counts a returning visitor once per day (approx).
 */
export function visitorsFrom(series: MetricSeries, fromTs: number): { value: number; approx: boolean } | null {
  const total = wholeWindow(series);
  if (total !== null) return { value: total, approx: false };
  const inWindow = series.points.filter((point) => point.timestamp >= fromTs);
  if (inWindow.length === 0) return null;
  return { value: sumPoints(series, fromTs), approx: true };
}

export function breakdownTotals(series: MetricSeries): { name: string; value: number }[] {
  const merged = new Map<string, number>();
  if (series.totals.length > 0) {
    for (const entry of series.totals) merged.set(entry.name, entry.value ?? 0);
  } else {
    for (const point of series.points) {
      for (const entry of point.breakdown ?? []) {
        merged.set(entry.name, (merged.get(entry.name) ?? 0) + (entry.value ?? 0));
      }
    }
  }
  return [...merged.entries()]
    .map(([name, value]) => ({ name, value }))
    .filter((entry) => entry.value > 0)
    .sort((a, b) => b.value - a.value);
}

const SERIES_METRICS = [
  "gross_revenue",
  "net_revenue",
  "ad_spend",
  "new_users",
  "successful_payments",
  "page_visits",
] as const;
const SNAPSHOT_METRICS = ["paid_active_members", "monthly_recurring_revenue", "account_balance"] as const;
const WINDOW_METRICS = [
  "traffic_people",
  "payment_success_rate",
  "refund_rate",
  "trial_conversion_rate",
  "churn_rate",
  "dispute_count",
] as const;

type MetricMap<K extends string> = Record<K, Result<MetricSeries>>;

export type DashboardData = {
  windows: Windows;
  generatedAt: string;
  series: MetricMap<(typeof SERIES_METRICS)[number]>;
  snapshots: MetricMap<(typeof SNAPSHOT_METRICS)[number]>;
  windowTotals: MetricMap<(typeof WINDOW_METRICS)[number]>;
  revenueByProduct: Result<MetricSeries>;
  trafficBySource: Result<MetricSeries>;
  campaigns: Result<AdCampaign[]>;
  payments: Result<Payment[]>;
};

async function collect<K extends string>(
  keys: readonly K[],
  load: (key: K) => Promise<MetricSeries>,
): Promise<MetricMap<K>> {
  const entries = await Promise.all(keys.map(async (key) => [key, await attempt(() => load(key))] as const));
  return Object.fromEntries(entries) as MetricMap<K>;
}

export async function loadDashboard(range: RangeKey): Promise<DashboardData> {
  const windows = windowsFor(range);
  const snapshotFrom = isoDate(addDays(new Date(`${windows.to}T00:00:00Z`), -7));

  const [series, snapshots, windowTotals, revenueByProduct, trafficBySource, campaigns, payments] =
    await Promise.all([
      collect(SERIES_METRICS, (metric) => getMetric(metric, { from: windows.prevFrom, to: windows.to })),
      collect(SNAPSHOT_METRICS, (metric) => getMetric(metric, { from: snapshotFrom, to: windows.to })),
      collect(WINDOW_METRICS, (metric) => getMetric(metric, { from: windows.from, to: windows.to })),
      attempt(() => getMetric("gross_revenue", { from: windows.from, to: windows.to, breakdown_by: "product" })),
      attempt(() => getMetric("traffic_people", { from: windows.from, to: windows.to, breakdown_by: "source" })),
      attempt(() => listAdCampaigns(windows.from, windows.to)),
      attempt(() => listRecentPayments(12)),
    ]);

  return {
    windows,
    generatedAt: new Date().toISOString(),
    series,
    snapshots,
    windowTotals,
    revenueByProduct,
    trafficBySource,
    campaigns,
    payments,
  };
}
