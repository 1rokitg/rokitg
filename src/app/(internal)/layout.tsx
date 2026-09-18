import { isInternalAuthenticated } from "@/lib/internal-auth";
import { InternalLoginForm } from "@/components/internal/InternalLoginForm";

export const metadata = {
  title: "RokitG Internal",
  robots: { index: false, follow: false },
};

export default async function InternalRootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const authenticated = await isInternalAuthenticated();

  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#000" }}>
        {authenticated ? children : <InternalLoginForm />}
      </body>
    </html>
  );
}
