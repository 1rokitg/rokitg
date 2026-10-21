import { Column, Heading, Text, Meta, Schema } from "@once-ui-system/core";
import { getTranslations } from "next-intl/server";
import { baseURL } from "@/resources";
import { SponsorsGrid } from "@/components/SponsorsCarousel";

const SPONSORS_PATH = "/sponsors";

export async function generateMetadata() {
  const t = await getTranslations("SponsorsPage");
  return Meta.generate({
    title: t("metaTitle"),
    description: t("metaDescription"),
    baseURL: baseURL,
    path: SPONSORS_PATH,
    image: `/api/og/generate?title=${encodeURIComponent(t("metaTitle"))}`,
  });
}

export default async function SponsorsPage() {
  const t = await getTranslations("SponsorsPage");
  return (
    <Column maxWidth="m" fillWidth gap="xl" paddingY="12" horizontal="center">
      <Schema
        as="webPage"
        baseURL={baseURL}
        title={t("metaTitle")}
        description={t("metaDescription")}
        path={SPONSORS_PATH}
        image={`/api/og/generate?title=${encodeURIComponent(t("metaTitle"))}`}
      />
      <Column maxWidth="s" horizontal="center" align="center" gap="m">
        <Heading wrap="balance" variant="display-strong-l">
          {t("title")}
        </Heading>
        <Text wrap="balance" onBackground="neutral-weak" variant="heading-default-xl">
          {t("subtitle")}
        </Text>
        <Text onBackground="neutral-weak" variant="body-default-xs">
          {t("disclosure")}
        </Text>
      </Column>
      <SponsorsGrid />
    </Column>
  );
}
