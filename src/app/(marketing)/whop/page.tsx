"use client";

import { Column, Heading, Text } from "@once-ui-system/core";
import { useEffect, useState } from "react";

export default function NotFound() {
  const [secondsLeft, setSecondsLeft] = useState(5);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((prev) => Math.max(prev - 1, 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [secondsLeft]);

  if (secondsLeft <= 0) {
    window.location.href = "https://whop.com/rokitg";
  }

  return (
    <Column as="section" fill center paddingBottom="160">
      <img
        src="/images/whop.png"
        alt="Whop Logo"
        style={{ width: 64, height: 64, marginBottom: 16, borderRadius: "50%" }}
        className="rounded-full"
      />
      <Heading marginBottom="s" variant="display-default-xs">
        Redirecting to Whop...
      </Heading>
      <Text onBackground="neutral-weak">{secondsLeft} seconds left</Text>
    </Column>
  );
}
