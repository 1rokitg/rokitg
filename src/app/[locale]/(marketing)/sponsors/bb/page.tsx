import { Badge, Button, Column, Heading, Row, Text, Meta, Schema } from "@once-ui-system/core";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { baseURL } from "@/resources";

const VIDEO_URL = "https://www.youtube.com/watch?v=kXMxDsIWPJo";
const VIDEO_THUMBNAIL_URL =
  "https://img.youtube.com/vi/kXMxDsIWPJo/maxresdefault.jpg";
const SPONSOR_PATH = "/sponsors/bb";

export async function generateMetadata() {
  const t = await getTranslations("TradingBotSponsorPage");
  return Meta.generate({
    title: t("metaTitle"),
    description: t("metaDescription"),
    baseURL: baseURL,
    path: SPONSOR_PATH,
    image: `/api/og/generate?title=${encodeURIComponent(t("metaTitle"))}`,
  });
}

export default async function TradingBotSponsorPage() {
  const t = await getTranslations("TradingBotSponsorPage");
  return (
    <Column maxWidth="m" gap="xl" paddingY="12" horizontal="center">
      <Schema
        as="webPage"
        baseURL={baseURL}
        title={t("metaTitle")}
        description={t("metaDescription")}
        path={SPONSOR_PATH}
        image={`/api/og/generate?title=${encodeURIComponent(t("metaTitle"))}`}
      />
      <Column maxWidth="s" horizontal="center" align="center" gap="m">
        <Badge
          background="brand-alpha-weak"
          paddingX="8"
          paddingY="4"
          onBackground="neutral-strong"
          textVariant="label-default-s"
        >
          <Row gap="8" vertical="center">
            <Image
              src="/images/basedbot-logo.png"
              alt={t("brandLabel")}
              width={22}
              height={22}
              style={{ borderRadius: "5px", background: "#fff" }}
            />
            {t("brandLabel")}
          </Row>
        </Badge>
        <Heading wrap="balance" variant="display-strong-l">
          {t("title")}
        </Heading>
        <Text
          wrap="balance"
          onBackground="neutral-weak"
          variant="heading-default-xl"
        >
          {t("subtitle")}
        </Text>
      </Column>

      <Column maxWidth="m" fillWidth horizontal="center" gap="m">
        <a
          href={VIDEO_URL}
          target="_blank"
          rel="noreferrer"
          aria-label={t("watchAriaLabel")}
          style={{
            display: "block",
            width: "100%",
            overflow: "hidden",
            borderRadius: "16px",
            border: "2px solid rgba(91, 135, 204, 0.65)",
            boxShadow: "0 18px 48px rgba(45, 99, 177, 0.24)",
          }}
        >
          <img
            src={VIDEO_THUMBNAIL_URL}
            alt={t("videoAlt")}
            style={{ display: "block", width: "100%", aspectRatio: "16 / 9" }}
          />
        </a>
        <Button href={VIDEO_URL} target="_blank" prefixIcon="play" size="l">
          {t("watchCta")}
        </Button>
      </Column>
    </Column>
  );
}
