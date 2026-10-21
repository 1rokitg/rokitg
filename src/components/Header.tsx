"use client";

import { useLocale, useTranslations } from "next-intl";

import { Fade, Flex, Line, Row, ToggleButton } from "@once-ui-system/core";

import { routes, display, work, whop } from "@/resources";
import { usePathname, localeHref } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import { ThemeToggle } from "./ThemeToggle";
import styles from "./Header.module.scss";

export const Header = () => {
  const pathname = usePathname() ?? "";
  const locale = useLocale() as AppLocale;
  const href = (path: string) => localeHref(locale, path);
  const t = useTranslations("Header");

  return (
    <>
      <Fade
        s={{ hide: true }}
        fillWidth
        position="fixed"
        height="80"
        zIndex={9}
      />
      <Fade
        hide
        s={{ hide: false }}
        fillWidth
        position="fixed"
        bottom="0"
        to="top"
        height="80"
        zIndex={9}
      />
      <Row
        fitHeight
        className={styles.position}
        position="sticky"
        as="header"
        zIndex={9}
        fillWidth
        padding="8"
        horizontal="center"
        data-border="rounded"
        s={{
          position: "fixed",
        }}
      >
        <Row
          paddingLeft="12"
          fillWidth
          vertical="center"
          textVariant="body-default-s"
        />
        {/* Profile icon hidden while the e-learning platform (/app) is still WIP. */}
        <Row fillWidth horizontal="center">
          <Row
            background="page"
            border="brand-alpha-medium"
            radius="l"
            shadow="l"
            padding="4"
            gap="4"
            horizontal="center"
            zIndex={1}
            style={{
              backdropFilter: "blur(18px)",
              boxShadow: "0 16px 45px rgba(0, 0, 0, 0.24)",
            }}
          >
            <Row
              gap="4"
              vertical="center"
              textVariant="body-default-s"
              suppressHydrationWarning
            >
              {routes["/"] && (
                <ToggleButton
                  className={styles.compactItem}
                  prefixIcon="home"
                  href={href("/")}
                  label={t("home")}
                  selected={pathname === "/"}
                />
              )}
              <Line background="neutral-alpha-medium" vert maxHeight="24" />
              {routes["/sponsors"] && (
                <>
                  <Row s={{ hide: true }}>
                    <ToggleButton
                      className={styles.compactItem}
                      prefixIcon="gift"
                      href={href("/sponsors")}
                      label={t("sponsors")}
                      selected={pathname.startsWith("/sponsors")}
                    />
                  </Row>
                  <Row hide s={{ hide: false }}>
                    <ToggleButton
                      prefixIcon="gift"
                      href={href("/sponsors")}
                      selected={pathname.startsWith("/sponsors")}
                    />
                  </Row>
                </>
              )}
              {routes["/work"] && (
                <>
                  <Row s={{ hide: true }}>
                    <ToggleButton
                      className={styles.compactItem}
                      prefixIcon="grid"
                      href={href("/work")}
                      label={work.label}
                      selected={pathname.startsWith("/work")}
                    />
                  </Row>
                  <Row hide s={{ hide: false }}>
                    <ToggleButton
                      prefixIcon="grid"
                      href={href("/work")}
                      selected={pathname.startsWith("/work")}
                    />
                  </Row>
                </>
              )}
              {routes["/whop"] && (
                <>
                  <Row s={{ hide: true }}>
                    <ToggleButton
                      className={styles.compactItem}
                      prefixIcon="whop"
                      href={href("/whop")}
                      label={whop.label}
                      selected={pathname.startsWith("/whop")}
                    />
                  </Row>
                  <Row hide s={{ hide: false }}>
                    <ToggleButton
                      prefixIcon="whop"
                      href={href("/whop")}
                      selected={pathname.startsWith("/whop")}
                    />
                  </Row>
                </>
              )}
              {display.themeSwitcher && (
                <>
                  <Line background="neutral-alpha-medium" vert maxHeight="24" />
                  <ThemeToggle />
                </>
              )}
            </Row>
          </Row>
        </Row>
        {/* Login button hidden while the e-learning platform (/app) is still WIP. */}
        <Flex fillWidth horizontal="end" vertical="center" />
      </Row>
    </>
  );
};
