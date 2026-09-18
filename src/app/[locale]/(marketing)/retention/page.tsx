import { RetentionChecklist } from "@/components/RetentionChecklist";
export const metadata = {
  title: "Tu preparación diaria | RokitG",
  description: "Prepara tu sesión y guarda tu checklist diario.",
  robots: { index: false, follow: false },
};
export default function RetentionPage() {
  return <RetentionChecklist />;
}
