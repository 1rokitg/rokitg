"use client";

import { PrivyProvider } from "@privy-io/react-auth";

const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;

/**
 * Global identity for /app — sits on top of Whop, not instead of it. Whop stays the
 * billing/checkout rail; Privy (email today, wallet later) is what "crypto native"
 * login and course entitlement are keyed on, independent of Whop community membership.
 */
export function AppAuthProvider({ children }: { children: React.ReactNode }) {
  if (!appId) return <>{children}</>;

  return (
    <PrivyProvider appId={appId} config={{ loginMethods: ["email"] }}>
      {children}
    </PrivyProvider>
  );
}
