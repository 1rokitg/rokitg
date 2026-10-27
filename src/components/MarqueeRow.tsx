"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

type Props = { className: string; style?: CSSProperties; children: ReactNode };

// Slow enough to read a card while it passes, in CSS pixels per second.
const SPEED = 26;

// Drives the row from script instead of a CSS keyframe: mobile Safari renders a wide animated track inside a masked box as blank once it slides past the first screen,
// and it mishandles percentage translates in keyframes. Plain pixel offsets on a frame loop behave the same everywhere.
// The track (first child) holds the cards twice; sliding it by one copy's width and wrapping gives an endless loop with no visible jump.
export function MarqueeRow({ className, style, children }: Props) {
  const viewport = useRef<HTMLDivElement>(null);
  const paused = useRef(false);

  useEffect(() => {
    const track = viewport.current?.firstElementChild as HTMLElement | null | undefined;
    if (!viewport.current || !track) return;
    const box = viewport.current;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let loopWidth = 0;
    let offset = 0;
    let visible = true;
    let last = performance.now();
    let frame = 0;

    // Width of one copy: where the second copy starts, which includes the gap in front of it.
    const measure = () => {
      const cards = track.children;
      const half = cards.length / 2;
      loopWidth = half >= 1 ? (cards[half] as HTMLElement).offsetLeft - (cards[0] as HTMLElement).offsetLeft : 0;
    };

    const tick = (now: number) => {
      const elapsed = Math.min(now - last, 100) / 1000;
      last = now;
      if (reduceMotion.matches) {
        track.style.transform = "";
      } else if (visible && !paused.current && loopWidth > 0) {
        offset = (offset + SPEED * elapsed) % loopWidth;
        track.style.transform = `translate3d(${-offset}px, 0, 0)`;
      }
      frame = requestAnimationFrame(tick);
    };

    measure();
    const resize = new ResizeObserver(measure);
    resize.observe(track);
    const viewing = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    viewing.observe(box);
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      viewing.disconnect();
      track.style.transform = "";
    };
  }, []);

  // A mouse pauses the row while it hovers it. Touch screens keep :hover "stuck" after a tap, so there the row pauses only while a finger is held on it.
  const hold = (event: React.PointerEvent) => {
    if (event.pointerType !== "mouse") paused.current = true;
  };
  const release = (event: React.PointerEvent) => {
    if (event.pointerType !== "mouse") paused.current = false;
  };

  return (
    <div
      ref={viewport}
      className={className}
      style={style}
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") paused.current = true;
      }}
      onPointerLeave={() => {
        paused.current = false;
      }}
      onPointerDown={hold}
      onPointerUp={release}
      onPointerCancel={release}
    >
      {children}
    </div>
  );
}
