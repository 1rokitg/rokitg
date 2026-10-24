import { localizedMeta } from "@/lib/seo";
import { Badge, Button, Column, Heading, Row, Text, Schema } from "@once-ui-system/core";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { baseURL } from "@/resources";
import { SponsorsCarousel } from "@/components/SponsorsCarousel";

const PROPR_URL = "https://app.propr.xyz/r/ROKIT";
const SPONSOR_PATH = "/sponsors/propr";

export async function generateMetadata() {
  const t = await getTranslations("ProprSponsorPage");
  return localizedMeta({
    title: t("metaTitle"),
    description: t("metaDescription"),
    path: SPONSOR_PATH,
    image: `/api/og/generate?title=${encodeURIComponent(t("metaTitle"))}`,
  });
}

export default async function ProprSponsorPage() {
  const t = await getTranslations("ProprSponsorPage");
  const steps = [1, 2, 3] as const;
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
              src="/images/propr-logo.svg"
              alt="Propr"
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
          href={PROPR_URL}
          target="_blank"
          rel="noreferrer"
          arrowIcon
          size="l"
          data-analytics-source="propr_hero"
        >
          {t("cta")}
        </Button>
        <Text onBackground="neutral-weak" variant="body-default-xs">
          {t("disclosure")}
        </Text>
      </Column>

      <Row fillWidth gap="12" s={{ direction: "column" }}>
        {steps.map((n) => (
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
              {t(`step${n}Tag`)}
            </Text>
            <Heading variant="heading-strong-m">{t(`step${n}Title`)}</Heading>
          </Column>
        ))}
      </Row>
      <SponsorsCarousel current="propr" />
    </Column>
  );
}
