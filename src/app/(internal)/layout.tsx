import { notFound } from "next/navigation";
import { isInternalAuthenticated } from "@/lib/internal-auth";

export const metadata = {
  title: "RokitG Internal",
  robots: { index: false, follow: false },
};

export default async function InternalRootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Anyone off the IP allowlist gets a plain 404, so the area doesn't advertise itself.
  if (!(await isInternalAuthenticated())) notFound();

  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#000" }}>{children}</body>
    </html>
  );
}
