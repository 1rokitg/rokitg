import Link from "next/link";
import {
  RANGES,
  breakdownTotals,
  lastValue,
  sumPoints,
  visitorsFrom,
  wholeWindow,
  type DashboardData,
  type RangeKey,
} from "@/lib/internal-dashboard";
import type { AdCampaign, MetricSeries, Payment, Result } from "@/lib/whop-stats";
import styles from "./DashboardView.module.scss";

const PRODUCT_NAMES: Record<string, string> = {
  prod_c1w81EBTtfHWs: "Social Capital",
  prod_fGgcg5TK7jvos: "Free Community",
};

const RANGE_LABELS: Record<RangeKey, string> = { today: "Today", "7d": "7 days", "30d": "30 days" };

function usd(value: number): string {
  const digits = Math.abs(value) < 1000 ? 2 : 0;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}

const count = (value: number) => new Intl.NumberFormat("en-US").format(Math.round(value));
const percent = (value: number | null) => (value === null ? "—" : `${value.toFixed(1)}%`);

function timeAgo(iso: string, now: number): string {
  const minutes = Math.max(0, Math.round((now - new Date(iso).getTime()) / 60_000));
  if (minutes < 60) return `${minutes}m ago`;
  if (minutes < 60 * 24) return `${Math.round(minutes / 60)}h ago`;
  return `${Math.round(minutes / (60 * 24))}d ago`;
}

type Delta = { text: string; tone: "good" | "bad" | "flat" };

function delta(current: number, previous: number, goodWhen: "up" | "neutral" = "up"): Delta {
  if (previous === 0) return { text: current > 0 ? "new" : "—", tone: "flat" };
  const change = ((current - previous) / Math.abs(previous)) * 100;
  const text = `${change >= 0 ? "+" : ""}${change.toFixed(0)}% vs prev`;
  if (goodWhen === "neutral" || Math.abs(change) < 0.5) return { text, tone: "flat" };
  return { text, tone: change > 0 ? "good" : "bad" };
}

function Unavailable({ error }: { error: string }) {
  return <p className={styles.unavailable}>Unavailable: {error}</p>;
}

function Tile({ label, value, sub, change }: { label: string; value: string; sub?: string; change?: Delta }) {
  return (
    <div className={styles.tile}>
      <span className={styles.tileLabel}>{label}</span>
      <span className={styles.tileValue}>{value}</span>
      {change ? <span className={`${styles.delta} ${styles[change.tone]}`}>{change.text}</span> : null}
      {sub ? <span className={styles.tileSub}>{sub}</span> : null}
    </div>
  );
}

function FailedTile({ label, error }: { label: string; error: string }) {
  return (
    <div className={styles.tile}>
      <span className={styles.tileLabel}>{label}</span>
      <span className={styles.tileValue}>—</span>
      <span className={styles.tileSub} title={error}>
        failed to load
      </span>
    </div>
  );
}

function Card({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <section className={styles.card}>
      <header className={styles.cardHead}>
        <h2 className={styles.cardTitle}>{title}</h2>
        {hint ? <span className={styles.cardHint}>{hint}</span> : null}
      </header>
      {children}
    </section>
  );
}

function periodSums(series: Result<MetricSeries>, fromTs: number, days: number) {
  if (!series.ok) return null;
  const prevFromTs = fromTs - days * 86_400;
  return {
    current: sumPoints(series.data, fromTs),
    previous: sumPoints(series.data, prevFromTs, fromTs),
  };
}

function TrendChart({ net, spend, fromTs }: { net: MetricSeries; spend: MetricSeries; fromTs: number }) {
  const netPoints = net.points.filter((point) => point.timestamp >= fromTs);
  const spendByTs = new Map(spend.points.map((point) => [point.timestamp, point.value ?? 0]));
  if (netPoints.length < 2) return <p className={styles.empty}>Pick a longer range to see the daily trend.</p>;

  const width = 640;
  const height = 150;
  const pad = 6;
  const netValues = netPoints.map((point) => point.value ?? 0);
  const spendValues = netPoints.map((point) => spendByTs.get(point.timestamp) ?? 0);
  const max = Math.max(1, ...netValues, ...spendValues);
  const x = (index: number) => pad + (index / (netPoints.length - 1)) * (width - pad * 2);
  const y = (value: number) => height - pad - (value / max) * (height - pad * 2);
  const line = (values: number[]) => values.map((value, index) => `${x(index)},${y(value)}`).join(" ");
  const label = (timestamp: number) =>
    new Date(timestamp * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });

  return (
    <div>
      <svg viewBox={`0 0 ${width} ${height}`} className={styles.chart} role="img" aria-label="Daily net revenue and ad spend">
        <polyline points={line(spendValues)} className={styles.lineSpend} fill="none" />
        <polyline points={line(netValues)} className={styles.lineNet} fill="none" />
      </svg>
      <div className={styles.chartAxis}>
        <span>{label(netPoints[0].timestamp)}</span>
        <span>peak {usd(max)}/day</span>
        <span>{label(netPoints[netPoints.length - 1].timestamp)}</span>
      </div>
      <div className={styles.legend}>
        <span className={styles.legendNet}>Net revenue</span>
        <span className={styles.legendSpend}>Ad spend</span>
      </div>
    </div>
  );
}

function BarList({
  rows,
  format,
  empty,
}: {
  rows: { name: string; value: number }[];
  format: (value: number) => string;
  empty: string;
}) {
  if (rows.length === 0) return <p className={styles.empty}>{empty}</p>;
  const max = rows[0].value;
  return (
    <ul className={styles.bars}>
      {rows.map((row) => (
        <li key={row.name}>
          <div className={styles.barRow}>
            <span className={styles.barName}>{row.name}</span>
            <span className={styles.barValue}>{format(row.value)}</span>
          </div>
          <div className={styles.barTrack}>
            <div className={styles.barFill} style={{ width: `${Math.max(2, (row.value / max) * 100)}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

function AdsTable({ campaigns }: { campaigns: AdCampaign[] }) {
  if (campaigns.length === 0) return <p className={styles.empty}>No ad campaigns.</p>;
  const sorted = [...campaigns].sort(
    (a, b) => Number(b.status === "active") - Number(a.status === "active") || (b.spend ?? 0) - (a.spend ?? 0),
  );
  const totalSpend = sorted.reduce((sum, campaign) => sum + (campaign.spend ?? 0), 0);
  const totalClicks = sorted.reduce((sum, campaign) => sum + (campaign.clicks ?? 0), 0);
  const totalPurchases = sorted.reduce((sum, campaign) => sum + (campaign.purchases ?? 0), 0);

  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Campaign</th>
            <th>Status</th>
            <th className={styles.num}>Budget</th>
            <th className={styles.num}>Spend</th>
            <th className={styles.num}>Clicks</th>
            <th className={styles.num}>CTR</th>
            <th className={styles.num}>CPC</th>
            <th className={styles.num}>Purchases</th>
            <th className={styles.num}>ROAS</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((campaign) => (
            <tr key={campaign.id}>
              <td className={styles.strong}>{campaign.title ?? campaign.id}</td>
              <td>
                <span className={`${styles.chip} ${campaign.status === "active" ? styles.chipOk : styles.chipOff}`}>
                  {campaign.status}
                </span>
              </td>
              <td className={styles.num}>
                {campaign.budget_amount === null ? "—" : `${usd(campaign.budget_amount)}/${campaign.budget_type === "lifetime" ? "life" : "day"}`}
              </td>
              <td className={styles.num}>{usd(campaign.spend ?? 0)}</td>
              <td className={styles.num}>{count(campaign.clicks ?? 0)}</td>
              <td className={styles.num}>{campaign.click_through_rate ? `${(campaign.click_through_rate * 100).toFixed(2)}%` : "—"}</td>
              <td className={styles.num}>{campaign.cost_per_click ? usd(campaign.cost_per_click) : "—"}</td>
              <td className={styles.num}>{count(campaign.purchases ?? 0)}</td>
              <td className={styles.num}>{campaign.return_on_ad_spend ? `${campaign.return_on_ad_spend.toFixed(2)}x` : "—"}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={3}>Total</td>
            <td className={styles.num}>{usd(totalSpend)}</td>
            <td className={styles.num}>{count(totalClicks)}</td>
            <td />
            <td className={styles.num}>{totalClicks > 0 ? usd(totalSpend / totalClicks) : "—"}</td>
            <td className={styles.num}>{count(totalPurchases)}</td>
            <td />
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

function PaymentsTable({ payments, now }: { payments: Payment[]; now: number }) {
  const rows = payments.filter((payment) => Number(payment.usd_total.amount) > 0).slice(0, 8);
  if (rows.length === 0) return <p className={styles.empty}>No paid or attempted payments yet.</p>;
  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>When</th>
            <th>Product</th>
            <th className={styles.num}>Amount</th>
            <th className={styles.num}>After fees</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((payment) => {
            const ok = payment.status === "paid";
            return (
              <tr key={payment.id}>
                <td>{timeAgo(payment.paid_at ?? payment.created_at, now)}</td>
                <td className={styles.strong}>
                  {payment.line_items[0]?.product_title ?? payment.line_items[0]?.label ?? "—"}
                </td>
                <td className={styles.num}>{usd(Number(payment.usd_total.amount))}</td>
                <td className={styles.num}>{ok ? usd(Number(payment.amount_after_fees.amount)) : "—"}</td>
                <td>
                  <span className={`${styles.chip} ${ok ? styles.chipOk : styles.chipBad}`}>
                    {ok ? (Number(payment.refunded_amount.amount) > 0 ? "refunded" : "paid") : (payment.substatus ?? payment.status)}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export function DashboardView({ data, range }: { data: DashboardData; range: RangeKey }) {
  const { windows, series, snapshots, windowTotals } = data;
  const now = new Date(data.generatedAt).getTime();
  const days = windows.days;

  const net = periodSums(series.net_revenue, windows.fromTs, days);
  const gross = periodSums(series.gross_revenue, windows.fromTs, days);
  const spend = periodSums(series.ad_spend, windows.fromTs, days);
  const users = periodSums(series.new_users, windows.fromTs, days);
  const visits = periodSums(series.page_visits, windows.fromTs, days);
  const sales = periodSums(series.successful_payments, windows.fromTs, days);

  const visitorsResult = windowTotals.traffic_people;
  const sourceTotal = data.trafficBySource.ok
    ? breakdownTotals(data.trafficBySource.data).reduce((sum, row) => sum + row.value, 0)
    : 0;
  const visitorInfo: { value: number; approx: boolean } | null =
    (visitorsResult.ok ? visitorsFrom(visitorsResult.data, windows.fromTs) : null) ??
    (sourceTotal > 0 ? { value: sourceTotal, approx: true } : null);
  const visitors = visitorInfo?.value ?? null;

  const funnelProblems = [
    visitors === null
      ? `visitors (${visitorsResult.ok ? "Whop returned no traffic data for this range" : visitorsResult.error})`
      : null,
    !users ? `new members (${series.new_users.ok ? "no data" : series.new_users.error})` : null,
    !sales ? `payments (${series.successful_payments.ok ? "no data" : series.successful_payments.error})` : null,
  ].filter((problem): problem is string => problem !== null);
  const snapshot = (key: keyof typeof snapshots) => {
    const result = snapshots[key];
    return result.ok ? lastValue(result.data) : null;
  };

  const rate = (key: keyof typeof windowTotals) => {
    const result = windowTotals[key];
    return result.ok ? wholeWindow(result.data) : null;
  };

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.top}>
          <div>
            <p className={styles.eyebrow}>Overview</p>
            <h1 className={styles.title}>Business dashboard</h1>
            <p className={styles.lead}>
              {windows.from === windows.to ? windows.from : `${windows.from} → ${windows.to}`} (UTC) · source: Whop only
            </p>
          </div>
          <nav className={styles.ranges} aria-label="Date range">
            {(Object.keys(RANGES) as RangeKey[]).map((key) => (
              <Link
                key={key}
                href={`/internal/dashboard?range=${key}`}
                className={`${styles.range} ${key === range ? styles.rangeActive : ""}`}
              >
                {RANGE_LABELS[key]}
              </Link>
            ))}
          </nav>
        </div>

        <div className={styles.tiles}>
          {net && spend ? (
            <Tile
              label="Net − ad spend"
              value={usd(net.current - spend.current)}
              sub="net revenue minus ad spend"
              change={delta(net.current - spend.current, net.previous - spend.previous)}
            />
          ) : (
            <FailedTile label="Net − ad spend" error="net revenue or ad spend failed" />
          )}
          {net ? (
            <Tile label="Net revenue" value={usd(net.current)} change={delta(net.current, net.previous)} sub="after refunds & fees" />
          ) : (
            <FailedTile label="Net revenue" error={series.net_revenue.ok ? "" : series.net_revenue.error} />
          )}
          {gross ? (
            <Tile
              label="Gross revenue"
              value={usd(gross.current)}
              change={delta(gross.current, gross.previous)}
              sub={sales ? `${count(sales.current)} successful payments` : undefined}
            />
          ) : (
            <FailedTile label="Gross revenue" error={series.gross_revenue.ok ? "" : series.gross_revenue.error} />
          )}
          {spend ? (
            <Tile label="Ad spend" value={usd(spend.current)} change={delta(spend.current, spend.previous, "neutral")} />
          ) : (
            <FailedTile label="Ad spend" error={series.ad_spend.ok ? "" : series.ad_spend.error} />
          )}
          {users ? (
            <Tile label="New members" value={count(users.current)} change={delta(users.current, users.previous)} sub="free + paid joins" />
          ) : (
            <FailedTile label="New members" error={series.new_users.ok ? "" : series.new_users.error} />
          )}
          <Tile
            label="Unique visitors"
            value={visitors === null ? "—" : `${visitorInfo?.approx ? "~" : ""}${count(visitors)}`}
            sub={visits ? `${count(visits.current)} page views` : undefined}
            change={visits ? delta(visits.current, visits.previous) : undefined}
          />
          <Tile label="Paid members" value={snapshot("paid_active_members") === null ? "—" : count(snapshot("paid_active_members") as number)} sub="active right now" />
          <Tile label="MRR" value={snapshot("monthly_recurring_revenue") === null ? "—" : usd(snapshot("monthly_recurring_revenue") as number)} sub="active subscriptions" />
          <Tile label="Balance" value={snapshot("account_balance") === null ? "—" : usd(snapshot("account_balance") as number)} sub="wallet total" />
        </div>

        <div className={styles.twoCol}>
          <Card title="Daily trend" hint="net revenue vs ad spend">
            {series.net_revenue.ok && series.ad_spend.ok ? (
              <TrendChart net={series.net_revenue.data} spend={series.ad_spend.data} fromTs={windows.fromTs} />
            ) : (
              <Unavailable error="revenue or ad spend series failed to load" />
            )}
          </Card>
          <Card title="Funnel" hint="visitors → members → payments">
            {visitors !== null && users && sales ? (
              <ul className={styles.funnel}>
                {[
                  { label: "Visitors", value: visitors, of: visitors },
                  { label: "New members", value: users.current, of: visitors },
                  { label: "Payments", value: sales.current, of: users.current },
                ].map((step, index) => (
                  <li key={step.label}>
                    <div className={styles.barRow}>
                      <span className={styles.barName}>{step.label}</span>
                      <span className={styles.barValue}>
                        {index === 0 && visitorInfo?.approx ? "~" : ""}
                        {count(step.value)}
                        {index > 0 && step.of > 0 ? ` · ${((step.value / step.of) * 100).toFixed(1)}%` : ""}
                      </span>
                    </div>
                    <div className={styles.barTrack}>
                      <div
                        className={styles.barFill}
                        style={{ width: `${visitors > 0 ? Math.max(2, Math.min(100, (step.value / visitors) * 100)) : 2}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <Unavailable error={`missing ${funnelProblems.join("; ")}`} />
            )}
          </Card>
        </div>

        <Card title="Ad campaigns" hint="spend and results for this range">
          {data.campaigns.ok ? <AdsTable campaigns={data.campaigns.data} /> : <Unavailable error={data.campaigns.error} />}
        </Card>

        <div className={styles.twoCol}>
          <Card title="Revenue by product" hint="gross">
            {data.revenueByProduct.ok ? (
              <BarList
                rows={breakdownTotals(data.revenueByProduct.data).slice(0, 6).map((row) => ({
                  name: PRODUCT_NAMES[row.name] ?? row.name,
                  value: row.value,
                }))}
                format={usd}
                empty="No revenue in this range."
              />
            ) : (
              <Unavailable error={data.revenueByProduct.error} />
            )}
          </Card>
          <Card title="Traffic sources" hint="unique people">
            {data.trafficBySource.ok ? (
              <BarList
                rows={breakdownTotals(data.trafficBySource.data).slice(0, 6)}
                format={count}
                empty="No traffic in this range."
              />
            ) : (
              <Unavailable error={data.trafficBySource.error} />
            )}
          </Card>
        </div>

        <div className={styles.twoCol}>
          <Card title="Health" hint="this range">
            <dl className={styles.health}>
              <div><dt>Payment success rate</dt><dd>{percent(rate("payment_success_rate"))}</dd></div>
              <div><dt>Refund rate</dt><dd>{percent(rate("refund_rate"))}</dd></div>
              <div><dt>Trial → paid</dt><dd>{percent(rate("trial_conversion_rate"))}</dd></div>
              <div><dt>Churn</dt><dd>{percent(rate("churn_rate"))}</dd></div>
              <div><dt>Disputes</dt><dd>{rate("dispute_count") === null ? "—" : count(rate("dispute_count") as number)}</dd></div>
            </dl>
          </Card>
          <Card title="Recent payments" hint="latest activity">
            {data.payments.ok ? <PaymentsTable payments={data.payments.data} now={now} /> : <Unavailable error={data.payments.error} />}
          </Card>
        </div>

        <p className={styles.footer}>Generated {new Date(data.generatedAt).toISOString().replace("T", " ").slice(0, 16)} UTC · reloads on each visit</p>
      </div>
    </div>
  );
}
