import { Badge, Button, Column, Heading, Row, Text, Meta, Schema } from "@once-ui-system/core";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { baseURL } from "@/resources";

const HYPERDASH_URL = "https://hyperdash.com/join/rokitg";
const SPONSOR_PATH = "/sponsors/hyperdash";

export async function generateMetadata() {
  const t = await getTranslations("HyperdashSponsorPage");
  return Meta.generate({
    title: t("metaTitle"),
    description: t("metaDescription"),
    baseURL: baseURL,
    path: SPONSOR_PATH,
    image: `/api/og/generate?title=${encodeURIComponent(t("metaTitle"))}`,
  });
}

export default async function HyperdashSponsorPage() {
  const t = await getTranslations("HyperdashSponsorPage");
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
              src="/images/hyperdash-logo.png"
              alt="Hyperdash"
              width={22}
              height={22}
              style={{ borderRadius: "5px" }}
            />
            {t("brandLabel")}
          </Row>
        </Badge>
        <Heading wrap="balance" variant="display-strong-l">
          {t("title")}
        </Heading>
        <Text wrap="balance" onBackground="neutral-weak" variant="heading-default-xl">
          {t("subtitle")}
        </Text>
        <Button
          href={HYPERDASH_URL}
          target="_blank"
          rel="noreferrer"
          arrowIcon
          size="l"
          data-analytics-source="hyperdash_hero"
        >
          {t("cta")}
        </Button>
        <Text onBackground="neutral-weak" variant="body-default-xs">
          {t("disclosure")}
        </Text>
      </Column>

      <Column
        maxWidth="xs"
        fillWidth
        gap="8"
        padding="24"
        radius="l"
        border="neutral-alpha-medium"
        background="neutral-alpha-weak"
      >
        <Text variant="label-default-s" onBackground="neutral-weak">
          {t("perkTag")}
        </Text>
        <Heading variant="heading-strong-m">{t("perkTitle")}</Heading>
      </Column>
    </Column>
  );
}
