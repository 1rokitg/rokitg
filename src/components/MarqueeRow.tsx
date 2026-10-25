"use client";

import { useState, type CSSProperties, type ReactNode } from "react";

type Props = { className: string; pausedClassName: string; style?: CSSProperties; children: ReactNode };

// Mouse hover is handled in CSS. Touch screens keep :hover "stuck" after a tap, so there the row pauses only while a finger is held on it.
export function MarqueeRow({ className, pausedClassName, style, children }: Props) {
  const [held, setHeld] = useState(false);
  const hold = (event: React.PointerEvent) => {
    if (event.pointerType !== "mouse") setHeld(true);
  };
  const release = () => setHeld(false);

  return (
    <div
      className={held ? `${className} ${pausedClassName}` : className}
      style={style}
      onPointerDown={hold}
      onPointerUp={release}
      onPointerCancel={release}
      onPointerLeave={release}
    >
      {children}
    </div>
  );
}
