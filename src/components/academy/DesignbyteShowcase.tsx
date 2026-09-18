"use client";

import { useState } from "react";
import { FiChevronLeft, FiChevronRight, FiMinus, FiPlus } from "react-icons/fi";
import { FaGithub, FaGoogle } from "react-icons/fa";
import styles from "./DesignbyteShowcase.module.scss";

// Replicates the tweakcn "designbyte" Cards demo (see the theme's own preview
// gallery) as a static visual reference — charts, calendar and forms are all
// mock data, not wired to anything real.

function sparklinePath(values: number[], width: number, height: number) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const stepX = width / (values.length - 1);
  return values
    .map((v, i) => {
      const x = i * stepX;
      const y = height - ((v - min) / range) * (height - 8) - 4;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

function Sparkline({ values }: { values: number[] }) {
  const width = 260;
  const height = 90;
  const path = sparklinePath(values, width, height);
  const last = values[values.length - 1];
  const lastX = width;
  const lastY = height - ((last - Math.min(...values)) / (Math.max(...values) - Math.min(...values) || 1)) * (height - 8) - 4;
  return (
    <svg className={styles.chart} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      <path d={path} fill="none" stroke="var(--academy-brand, #2dd4a7)" strokeWidth={2} />
      <circle cx={lastX - 2} cy={lastY} r={3.5} fill="var(--academy-brand, #2dd4a7)" />
    </svg>
  );
}

function CalendarCard() {
  const [monthOffset, setMonthOffset] = useState(0);
  const base = new Date(2026, 5 + monthOffset, 1); // June 2026, matching the reference month
  const year = base.getFullYear();
  const month = base.getMonth();
  const monthLabel = base.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const cells: { day: number; muted: boolean }[] = [];
  for (let i = firstWeekday - 1; i >= 0; i--) cells.push({ day: daysInPrevMonth - i, muted: true });
  for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d, muted: false });
  while (cells.length % 7 !== 0) cells.push({ day: cells.length, muted: true });

  const [selected, setSelected] = useState(13);
  const rangeStart = 8;
  const rangeEnd = 13;

  return (
    <div className={styles.card}>
      <div className={styles.calendarHeader}>
        <button
          type="button"
          className={styles.calendarNavButton}
          onClick={() => setMonthOffset((m) => m - 1)}
          aria-label="Previous month"
        >
          <FiChevronLeft />
        </button>
        <span className={styles.calendarTitle}>{monthLabel}</span>
        <button
          type="button"
          className={styles.calendarNavButton}
          onClick={() => setMonthOffset((m) => m + 1)}
          aria-label="Next month"
        >
          <FiChevronRight />
        </button>
      </div>
      <div className={styles.calendarGrid}>
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
          <span key={d} className={styles.calendarWeekday}>
            {d}
          </span>
        ))}
        {cells.map((cell, i) => {
          const inRange = !cell.muted && cell.day >= rangeStart && cell.day <= rangeEnd;
          const isSelected = !cell.muted && cell.day === selected;
          return (
            <button
              type="button"
              key={i}
              className={[
                styles.calendarDay,
                cell.muted ? styles.calendarDayMuted : "",
                inRange ? styles.calendarDayInRange : "",
                isSelected ? styles.calendarDaySelected : "",
              ].join(" ")}
              onClick={() => !cell.muted && setSelected(cell.day)}
              disabled={cell.muted}
            >
              {cell.day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function MoveGoalCard() {
  const [calories, setCalories] = useState(350);
  const bars = [40, 55, 35, 60, 45, 50, 65, 48, 58, 70];

  return (
    <div className={styles.card}>
      <div className={styles.goalHeader}>
        <div className={styles.cardValue} style={{ fontSize: 16 }}>
          Move Goal
        </div>
        <p className={styles.cardFootnote}>Set your daily activity goal.</p>
      </div>
      <div className={styles.goalStepper}>
        <button
          type="button"
          className={styles.stepperButton}
          onClick={() => setCalories((c) => Math.max(0, c - 50))}
          aria-label="Decrease goal"
        >
          <FiMinus />
        </button>
        <div className={styles.goalValue}>
          <div className={styles.goalNumber}>{calories}</div>
          <div className={styles.goalUnit}>CALORIES/DAY</div>
        </div>
        <button
          type="button"
          className={styles.stepperButton}
          onClick={() => setCalories((c) => c + 50)}
          aria-label="Increase goal"
        >
          <FiPlus />
        </button>
      </div>
      <div className={styles.barChart}>
        {bars.map((h, i) => (
          <div key={i} className={styles.bar} style={{ height: `${h}%` }} />
        ))}
      </div>
      <button type="button" className={styles.primaryButton}>
        Set Goal
      </button>
    </div>
  );
}

export function DesignbyteShowcase() {
  return (
    <div className={styles.grid}>
      <div className={styles.card}>
        <span className={styles.cardLabel}>Total Revenue</span>
        <span className={styles.cardValue}>$15,231.89</span>
        <span className={styles.cardFootnote}>+20.1% from last month</span>
        <Sparkline values={[20, 24, 18, 22, 26, 23, 30, 55]} />
      </div>

      <div className={styles.card}>
        <span className={styles.cardLabel}>Subscriptions</span>
        <span className={styles.cardValue}>+2,350</span>
        <span className={styles.cardFootnote}>+180.1% from last month</span>
        <Sparkline values={[10, 60, 70, 30, 65, 25, 55, 20]} />
      </div>

      <CalendarCard />
      <MoveGoalCard />

      <div className={`${styles.card} ${styles.span2}`}>
        <span className={styles.cardValue} style={{ fontSize: 18 }}>
          Upgrade your subscription
        </span>
        <p className={styles.cardFootnote}>
          You are currently on the free plan. Upgrade to the pro plan to get access to all features.
        </p>
        <div className={styles.formRow}>
          <label className={styles.field}>
            Name
            <input type="text" placeholder="Evil Rabbit" readOnly />
          </label>
          <label className={styles.field}>
            Email
            <input type="email" placeholder="example@acme.com" readOnly />
          </label>
        </div>
      </div>

      <div className={`${styles.card} ${styles.span2}`}>
        <span className={styles.cardValue} style={{ fontSize: 18 }}>
          Create an account
        </span>
        <p className={styles.cardFootnote}>Enter your email below to create your account</p>
        <div className={styles.oauthRow}>
          <button type="button" className={styles.oauthButton}>
            <FaGithub aria-hidden="true" /> GitHub
          </button>
          <button type="button" className={styles.oauthButton}>
            <FaGoogle aria-hidden="true" /> Google
          </button>
        </div>
        <div className={styles.dividerRow}>OR CONTINUE WITH</div>
        <label className={styles.field}>
          Email
          <input type="email" placeholder="example@acme.com" readOnly />
        </label>
      </div>

      <div className={`${styles.card} ${styles.span2}`}>
        <span className={styles.cardValue} style={{ fontSize: 16 }}>
          Exercise Minutes
        </span>
        <p className={styles.cardFootnote}>Your exercise minutes are ahead of where you normally are.</p>
        <Sparkline values={[10, 30, 55, 70, 60, 40, 25, 15]} />
      </div>
    </div>
  );
}
