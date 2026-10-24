import { localizedMeta } from "@/lib/seo";
import { Column, Heading, Text, Schema } from "@once-ui-system/core";
import { getTranslations } from "next-intl/server";
import { baseURL } from "@/resources";
import { SponsorsGrid } from "@/components/SponsorsCarousel";
import { EmailCapture } from "@/components/EmailCapture";

const SPONSORS_PATH = "/sponsors";

export async function generateMetadata() {
  const t = await getTranslations("SponsorsPage");
  return localizedMeta({
    title: t("metaTitle"),
    description: t("metaDescription"),
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
      </Column>
      <SponsorsGrid />
      <EmailCapture source="sponsors_hub" />
    </Column>
  );
}
