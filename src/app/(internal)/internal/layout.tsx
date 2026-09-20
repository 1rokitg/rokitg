import { InternalShell } from "@/components/internal/InternalShell";

export default function InternalDashboardLayout({ children }: { children: React.ReactNode }) {
  return <InternalShell>{children}</InternalShell>;
}
