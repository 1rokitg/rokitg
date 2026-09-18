import "server-only";
import { cookies } from "next/headers";
import { verifyAccessToken, InvalidAuthTokenError } from "@privy-io/node";

/** Reads and verifies the visitor's Privy session cookie server-side — never trust a client-supplied user id. */
export async function getPrivyUserId(): Promise<string | null> {
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
  const verificationKey = process.env.PRIVY_VERIFICATION_KEY;
  if (!appId || !verificationKey) return null;

  const token = (await cookies()).get("privy-token")?.value;
  if (!token) return null;

  try {
    const claims = await verifyAccessToken({
      access_token: token,
      app_id: appId,
      verification_key: verificationKey,
    });
    return claims.user_id;
  } catch (error) {
    if (error instanceof InvalidAuthTokenError) return null;
    throw error;
  }
}
