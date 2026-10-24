import { localizedMeta } from "@/lib/seo";
import { getTranslations } from "next-intl/server";
import {
  Avatar,
  Button,
  Column,
  Heading,
  Icon,
  Tag,
  Text,
  Schema,
  Row,
  IconButton,
} from "@once-ui-system/core";
import { baseURL, about, person, social } from "@/resources";
import TrackedCalendarButton from "./components/book-a-call";
import styles from "@/components/about/about.module.scss";
import React from "react";

export async function generateMetadata() {
  const t = await getTranslations("AboutPage");
  return localizedMeta({
    title: t("metaTitle"),
    description: t("metaDescription"),
    image: `/api/og/generate?title=${encodeURIComponent(t("metaTitle"))}`,
    path: about.path,
  });
}

export default async function About() {
  const t = await getTranslations("AboutPage");
  return (
    <Column maxWidth="m">
      <Schema
        as="webPage"
        baseURL={baseURL}
        title={t("metaTitle")}
        description={t("metaDescription")}
        path={about.path}
        image={`/api/og/generate?title=${encodeURIComponent(t("metaTitle"))}`}
        author={{
          name: person.name,
          url: `${baseURL}${about.path}`,
          image: `${baseURL}${person.avatar}`,
        }}
      />

      <Row fillWidth s={{ direction: "column" }} horizontal="center">
        {about.avatar.display && (
          <Column
            className={styles.avatar}
            top="64"
            fitHeight
            position="sticky"
            s={{ position: "relative", style: { top: "auto" } }}
            xs={{ style: { top: "auto" } }}
            minWidth="160"
            paddingX="l"
            paddingBottom="xl"
            gap="m"
            flex={3}
            horizontal="center"
          >
            <Avatar src={person.avatar} size="xl" />

            <Row gap="8" vertical="center">
              <Icon onBackground="accent-weak" name="globe" />
              {t("location")}
            </Row>

            {person.languages && person.languages.length > 0 && (
              <Row wrap gap="8">
                {[t("langEnglish"), t("langSpanish")].map((language, index) => (
                  <Tag key={index} size="l">
                    {language}
                  </Tag>
                ))}
              </Row>
            )}
          </Column>
        )}

        <Column className={styles.blockAlign} flex={9} maxWidth={40}>
          <Column
            id={about.intro.title}
            fillWidth
            minHeight="160"
            vertical="center"
            marginBottom="32"
          >
            {about.calendar.display && (
              <Row
                fitWidth
                border="brand-alpha-medium"
                background="brand-alpha-weak"
                radius="full"
                padding="4"
                gap="8"
                marginBottom="m"
                vertical="center"
                className={styles.blockAlign}
                style={{
                  backdropFilter: "blur(var(--static-space-1))",
                }}
              >
                <Icon
                  paddingLeft="12"
                  name="calendar"
                  onBackground="brand-weak"
                />

                <Row paddingX="8">{t("scheduleCall")}</Row>

                <TrackedCalendarButton href={about.calendar.link} />
              </Row>
            )}

            <Heading className={styles.textAlign} variant="display-strong-xl">
              {person.name}
            </Heading>

            <Text
              className={styles.textAlign}
              variant="display-default-xs"
              onBackground="neutral-weak"
            >
              {t("role")}
            </Text>

            {social.length > 0 && (
              <Row
                className={styles.blockAlign}
                paddingTop="20"
                paddingBottom="8"
                gap="8"
                wrap
                horizontal="center"
                fitWidth
                data-border="rounded"
              >
                {social
                  .filter((item) => item.essential)
                  .map((item) =>
                    item.name === "Discord"
                      ? { ...item, link: "https://discord.gg/VcjBxgtv" }
                      : item,
                  )
                  .map(
                    (item) =>
                      item.link && (
                        <React.Fragment key={item.name}>
                          <Row s={{ hide: true }}>
                            <Button
                              key={item.name}
                              href={item.link}
                              prefixIcon={item.icon}
                              label={item.name}
                              size="s"
                              weight="default"
                              variant="secondary"
                            />
                          </Row>

                          <Row hide s={{ hide: false }}>
                            <IconButton
                              size="l"
                              key={`${item.name}-icon`}
                              href={item.link}
                              icon={item.icon}
                              variant="secondary"
                            />
                          </Row>
                        </React.Fragment>
                      ),
                  )}
              </Row>
            )}
          </Column>

          {about.intro.display && (
            <Column
              textVariant="body-default-l"
              fillWidth
              gap="m"
              marginBottom="xl"
            >
              {t("intro")}
            </Column>
          )}
        </Column>
      </Row>

    </Column>
  );
}
