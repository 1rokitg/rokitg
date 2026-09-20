"use client";

import { useCallback, useState } from "react";
import { loadWhop } from "@whop/elements";
import { WhopElements, Tracking, PeopleElement, PersonElement } from "@whop/elements-react";
import { LiveToolbar } from "./LiveToolbar";
import { PersonOverlay } from "./PersonOverlay";
import styles from "./EventsTerminal.module.scss";

const WHOP_ACCOUNT_ID = "biz_ROKYKZdV9YGZP7";

type Period =
  | "today"
  | "yesterday"
  | "last_7_days"
  | "last_14_days"
  | "last_30_days"
  | "last_90_days"
  | "all_time"
  | "custom";
type CustomRange = { from: string; to: string } | null;

export function PeopleTerminal({ accessToken }: { accessToken: string }) {
  const [period, setPeriod] = useState<Period>("last_30_days");
  const [customRange, setCustomRange] = useState<CustomRange>(null);
  const [openPerson, setOpenPerson] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = useCallback(() => setRefreshKey((k) => k + 1), []);

  return (
    <div className={styles.page}>
      <LiveToolbar
        title="People"
        status="everyone the pixel has resolved, in the current window"
        live={false}
        onToggleLive={refresh}
        liveControl={false}
      />
      <WhopElements elements={loadWhop()} appearance={{ theme: { appearance: "dark", accentColor: "teal" } }}>
        <Tracking
          key={refreshKey}
          accountId={WHOP_ACCOUNT_ID}
          accessToken={accessToken}
          period={period}
          customRange={customRange}
        >
          <div className={styles.elementWrap}>
            <PeopleElement
              onPeriodChanged={(payload) => {
                setPeriod(payload.period);
                setCustomRange(payload.customRange);
              }}
              onPersonOpened={(payload) => setOpenPerson(payload.personId)}
            />
          </div>
          {openPerson && (
            <PersonOverlay onClose={() => setOpenPerson(null)}>
              <PersonElement identifier={openPerson} />
            </PersonOverlay>
          )}
        </Tracking>
      </WhopElements>
    </div>
  );
}
