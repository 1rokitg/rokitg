"use server";

import { cookies } from "next/headers";
import { INTERNAL_AUTH_COOKIE } from "@/lib/internal-auth";

export async function authenticateInternal(
  _prevState: { error?: string } | undefined,
  formData: FormData,
): Promise<{ error?: string }> {
  const password = String(formData.get("password") ?? "");
  const correctPassword = process.env.INTERNAL_DASHBOARD_PASSWORD;

  if (!correctPassword) {
    console.error("INTERNAL_DASHBOARD_PASSWORD environment variable is not set");
    return { error: "Internal server error" };
  }

  if (password !== correctPassword) {
    return { error: "Incorrect password" };
  }

  const cookieStore = await cookies();
  cookieStore.set(INTERNAL_AUTH_COOKIE, "authenticated", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  return {};
}
