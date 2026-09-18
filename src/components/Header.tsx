"use client";

import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";

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
        >
          <ToggleButton
            prefixIcon="person"
            href={href("/about")}
            aria-label="Open the RokitG About Me Page"
            selected={pathname.startsWith("/about")}
          />
        </Row>
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
              <>
                <Row s={{ hide: true }}>
                  <ToggleButton
                    className={styles.compactItem}
                    href={href("/sponsors/fomo")}
                    label={
                      <Row gap="4" vertical="center">
                        <Image
                          src="/images/fomo-logo.png"
                          alt=""
                          width={16}
                          height={16}
                          style={{ borderRadius: "4px" }}
                        />
                        {t("fomo")}
                      </Row>
                    }
                    selected={pathname.startsWith("/sponsors/fomo")}
                  />
                </Row>
                <Row hide s={{ hide: false }}>
                  <ToggleButton
                    href={href("/sponsors/fomo")}
                    label={
                      <Image
                        src="/images/fomo-logo.png"
                        alt="Fomo"
                        width={16}
                        height={16}
                        style={{ borderRadius: "4px" }}
                      />
                    }
                    selected={pathname.startsWith("/sponsors/fomo")}
                  />
                </Row>
              </>
              <>
                <Row s={{ hide: true }}>
                  <ToggleButton
                    className={styles.compactItem}
                    href={href("/sponsors/bb")}
                    label={
                      <Row gap="4" vertical="center">
                        <Image
                          src="/images/basedbot-logo.png"
                          alt=""
                          width={16}
                          height={16}
                          style={{ borderRadius: "4px", background: "#fff" }}
                        />
                        {t("tradingBot")}
                      </Row>
                    }
                    selected={pathname.startsWith("/sponsors/bb")}
                  />
                </Row>
                <Row hide s={{ hide: false }}>
                  <ToggleButton
                    href={href("/sponsors/bb")}
                    label={
                      <Image
                        src="/images/basedbot-logo.png"
                        alt="Trading Bot"
                        width={16}
                        height={16}
                        style={{ borderRadius: "4px", background: "#fff" }}
                      />
                    }
                    selected={pathname.startsWith("/sponsors/bb")}
                  />
                </Row>
              </>
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
        <Flex fillWidth horizontal="end" vertical="center">
          <Flex
            paddingRight="12"
            horizontal="end"
            vertical="center"
            textVariant="body-default-s"
          >
            <ToggleButton
              href="/app"
              label={t("login")}
              selected={pathname.startsWith("/app")}
            />
          </Flex>
        </Flex>
      </Row>
    </>
  );
};
