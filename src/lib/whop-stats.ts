import "server-only";
import { WHOP_ACCOUNT_ID, WHOP_API_BASE } from "@/lib/whop-api";

export type Result<T> = { ok: true; data: T } | { ok: false; error: string };

export type MetricPoint = {
  timestamp: number;
  value: number | null;
  breakdown?: { name: string; value: number | null }[];
};

export type MetricSeries = {
  currency: string | null;
  points: MetricPoint[];
  totals: { name: string; value: number | null }[];
};

export type AdCampaign = {
  id: string;
  title: string | null;
  status: string;
  delivery_status: string | null;
  objective: string | null;
  budget_amount: number | null;
  budget_type: string | null;
  spend: number | null;
  impressions: number | null;
  clicks: number | null;
  click_through_rate: number | null;
  cost_per_click: number | null;
  purchases: number | null;
  leads: number | null;
  return_on_ad_spend: number | null;
};

export type Payment = {
  id: string;
  status: string;
  substatus: string | null;
  billing_reason: string | null;
  created_at: string;
  paid_at: string | null;
  line_items: { product_title: string | null; label: string | null }[];
  usd_total: { amount: string };
  amount_after_fees: { amount: string };
  refunded_amount: { amount: string };
};

async function whopGet<T>(path: string, params: Record<string, string | number | undefined>): Promise<T> {
  const apiKey = process.env.WHOP_API_KEY;
  if (!apiKey) throw new Error("WHOP_API_KEY is not set");

  const url = new URL(`${WHOP_API_BASE}${path}`);
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) url.searchParams.set(key, String(value));
  }

  const response = await fetch(url, { headers: { Authorization: `Bearer ${apiKey}` }, cache: "no-store" });
  if (!response.ok) {
    const detail = (await response.text()).slice(0, 200);
    throw new Error(`Whop ${path} responded ${response.status}${detail ? `: ${detail}` : ""}`);
  }
  return (await response.json()) as T;
}

export async function attempt<T>(work: () => Promise<T>): Promise<Result<T>> {
  try {
    return { ok: true, data: await work() };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

export async function getMetric(
  metric: string,
  params: { from: string; to: string; interval?: string; breakdown_by?: string },
): Promise<MetricSeries> {
  const body = await whopGet<{
    data: { currency?: string | null; points?: MetricPoint[]; totals?: MetricSeries["totals"] };
  }>(`/stats/time_series/${metric}`, { account_id: WHOP_ACCOUNT_ID, interval: "day", ...params });

  return {
    currency: body.data.currency ?? null,
    points: body.data.points ?? [],
    totals: body.data.totals ?? [],
  };
}

export async function listAdCampaigns(from: string, to: string): Promise<AdCampaign[]> {
  const body = await whopGet<{ data: AdCampaign[] }>("/ad_campaigns", {
    account_id: WHOP_ACCOUNT_ID,
    stats_from: from,
    stats_to: to,
    first: 50,
  });
  return body.data;
}

export async function listRecentPayments(limit: number): Promise<Payment[]> {
  const body = await whopGet<{ data: Payment[] }>("/payments", {
    account_id: WHOP_ACCOUNT_ID,
    first: limit,
  });
  return [...body.data].sort((a, b) => b.created_at.localeCompare(a.created_at));
}
