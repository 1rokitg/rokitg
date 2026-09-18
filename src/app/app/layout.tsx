import { Column } from "@once-ui-system/core";
import { AppAuthProvider } from "@/components/AppAuthProvider";
import styles from "./platform.module.scss";

export default function PlatformLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <AppAuthProvider>
      <Column
        as="main"
        className={styles.platformShell}
        fillWidth
        minHeight="100vh"
        horizontal="center"
      >
        {children}
      </Column>
    </AppAuthProvider>
  );
}
