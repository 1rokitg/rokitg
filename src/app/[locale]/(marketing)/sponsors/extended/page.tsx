import { localizedMeta } from "@/lib/seo";
import { Badge, Button, Column, Heading, Row, Text, Schema } from "@once-ui-system/core";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { baseURL } from "@/resources";
import { SponsorsCarousel } from "@/components/SponsorsCarousel";

const EXTENDED_URL = "https://app.extended.exchange/join/ROKITG";
const SPONSOR_PATH = "/sponsors/extended";

export async function generateMetadata() {
  const t = await getTranslations("ExtendedSponsorPage");
  return localizedMeta({
    title: t("metaTitle"),
    description: t("metaDescription"),
    path: SPONSOR_PATH,
    image: `/api/og/generate?title=${encodeURIComponent(t("metaTitle"))}`,
  });
}

export default async function ExtendedSponsorPage() {
  const t = await getTranslations("ExtendedSponsorPage");
  const perks = [1, 2] as const;
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
              src="/images/extended-logo.png"
              alt="Extended"
              width={22}
              height={22}
              style={{ borderRadius: "50%" }}
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
          href={EXTENDED_URL}
          target="_blank"
          rel="noreferrer"
          arrowIcon
          size="l"
          data-analytics-source="extended_hero"
        >
          {t("cta")}
        </Button>
      </Column>

      <Row fillWidth gap="12" s={{ direction: "column" }}>
        {perks.map((n) => (
          <Column
            key={n}
            flex={1}
            gap="8"
            padding="24"
            radius="l"
            border="neutral-alpha-medium"
            background="neutral-alpha-weak"
          >
            <Text variant="label-default-s" onBackground="neutral-weak">
              {t("perkTag")}
            </Text>
            <Heading variant="heading-strong-m">{t(`perk${n}Title`)}</Heading>
          </Column>
        ))}
      </Row>
      <SponsorsCarousel current="extended" />
    </Column>
  );
}
