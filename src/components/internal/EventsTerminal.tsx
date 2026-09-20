"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { loadWhop } from "@whop/elements";
import { WhopElements, Tracking, EventsElement, PersonElement } from "@whop/elements-react";
import { LiveToolbar } from "./LiveToolbar";
import { PersonOverlay } from "./PersonOverlay";
import styles from "./EventsTerminal.module.scss";

const WHOP_ACCOUNT_ID = "biz_ROKYKZdV9YGZP7";
const TICK_MS = 3000;
// Within this many px of the top counts as "at the live edge" — matches how
// chat/log UIs (e.g. j7tracker) auto-follow: scroll away to inspect history
// pauses the tail, scrolling back to the top resumes it.
const TOP_THRESHOLD = 4;

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

export function EventsTerminal({ accessToken }: { accessToken: string }) {
  const [live, setLive] = useState(true);
  const [liveFrom, setLiveFrom] = useState(() => new Date().toISOString());
  const [elapsed, setElapsed] = useState(0);
  const [period, setPeriod] = useState<Period>("last_30_days");
  const [customRange, setCustomRange] = useState<CustomRange>(null);
  const [openPerson, setOpenPerson] = useState<string | null>(null);
  const [liveTo, setLiveTo] = useState(liveFrom);
  const liveStartRef = useRef(Date.now());
  const wrapRef = useRef<HTMLDivElement>(null);
  const suppressScrollRef = useRef(false);
  const prevScrollTopRef = useRef(0);

  // Ticks `to` forward while live, without touching `from` — resuming after a
  // scroll-pause catches up to now instead of dropping whatever fired while paused.
  useEffect(() => {
    if (!live) return;
    liveStartRef.current = Date.now();
    setElapsed(0);
    const tick = () => {
      setLiveTo(new Date().toISOString());
      setElapsed(Math.round((Date.now() - liveStartRef.current) / 1000));
    };
    tick();
    const id = setInterval(tick, TICK_MS);
    return () => clearInterval(id);
  }, [live]);

  const goToTop = useCallback(() => {
    suppressScrollRef.current = true;
    wrapRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    window.setTimeout(() => {
      suppressScrollRef.current = false;
    }, 400);
  }, []);

  const restart = useCallback(() => {
    const now = new Date().toISOString();
    setLiveFrom(now);
    setLiveTo(now);
    liveStartRef.current = Date.now();
    setElapsed(0);
    setLive(true);
    goToTop();
  }, [goToTop]);

  const toggleLive = useCallback(() => {
    setLive((prev) => {
      if (!prev) goToTop();
      return !prev;
    });
  }, [goToTop]);

  // Pause the instant the viewer scrolls away from the top (so a manual
  // pause never gets clobbered by a stray scroll event at rest), and only
  // resume on an actual upward crossing back into the top zone — not merely
  // "happens to be at 0" on a tick where nothing moved.
  const handleScroll = useCallback(() => {
    const top = wrapRef.current?.scrollTop ?? 0;
    if (suppressScrollRef.current) {
      prevScrollTopRef.current = top;
      return;
    }
    const wasBelowTop = prevScrollTopRef.current > TOP_THRESHOLD;
    const isAtTop = top <= TOP_THRESHOLD;
    prevScrollTopRef.current = top;
    if (isAtTop && wasBelowTop) setLive(true);
    else if (!isAtTop) setLive(false);
  }, []);

  const status = live
    ? `tailing since ${new Date(liveFrom).toLocaleTimeString()} · ${elapsed}s`
    : "paused — scroll back to the top to resume";

  return (
    <div className={styles.page}>
      <LiveToolbar title="Events" status={status} live={live} onToggleLive={toggleLive} onRestart={restart} />
      <WhopElements elements={loadWhop()} appearance={{ theme: { appearance: "dark", accentColor: "teal" } }}>
        <Tracking
          accountId={WHOP_ACCOUNT_ID}
          accessToken={accessToken}
          period={period}
          customRange={customRange}
        >
          <div ref={wrapRef} className={styles.elementWrap} onScroll={handleScroll}>
            <EventsElement
              from={live ? liveFrom : ""}
              to={live ? liveTo : ""}
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
