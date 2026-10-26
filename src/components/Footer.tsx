import { Column, Row, IconButton, Text } from "@once-ui-system/core";
import { getTranslations } from "next-intl/server";
import { person, social } from "@/resources";
import { Link } from "@/i18n/navigation";
import { CookieSettingsLink } from "@/components/CookieSettingsLink";
import styles from "./Footer.module.scss";

export const Footer = async () => {
  const t = await getTranslations("Footer");
  const currentYear = new Date().getFullYear();

  return (
    <Column as="footer" fillWidth padding="8" horizontal="center">
      <Row
        className={styles.mobile}
        maxWidth="m"
        paddingY="8"
        paddingX="16"
        gap="16"
        horizontal="between"
        vertical="center"
        s={{
          direction: "column",
          horizontal: "center",
          align: "center",
        }}
      >
        <Text variant="body-default-s" onBackground="neutral-strong">
          <Text onBackground="neutral-weak">© {currentYear} /</Text>
          <Text paddingX="4">{person.name}</Text>
        </Text>
        <Row gap="16">
          {social.map(
            (item) =>
              item.link && (
                <IconButton
                  key={item.name}
                  href={item.link}
                  icon={item.icon}
                  tooltip={item.name}
                  size="s"
                  variant="ghost"
                />
              ),
          )}
        </Row>
      </Row>
      <Column maxWidth="m" paddingX="16" paddingBottom="16" gap="8" horizontal="center" align="center">
        <Text variant="body-default-xs" onBackground="neutral-weak" wrap="balance">
          <strong>{t("disclaimerLabel")}</strong> {t("risk")}
        </Text>
        <Text variant="body-default-xs" onBackground="neutral-weak" wrap="balance">
          {t("affiliate")}
        </Text>
        <Row gap="16" horizontal="center">
          <Text variant="body-default-xs" onBackground="neutral-weak">
            <Link href="/privacy" style={{ color: "inherit", textDecoration: "underline", textUnderlineOffset: 3 }}>
              {t("privacy")}
            </Link>
          </Text>
          <Text variant="body-default-xs" onBackground="neutral-weak">
            <CookieSettingsLink label={t("cookieSettings")} />
          </Text>
        </Row>
      </Column>
      <Row height="80" hide s={{ hide: false }} />
    </Column>
  );
};
