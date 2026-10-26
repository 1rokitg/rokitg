import { localizedMeta } from "@/lib/seo";
import { getTranslations } from "next-intl/server";
import { home, about, person, baseURL } from "@/resources";

import {
  Column,
  Schema,
  Badge,
  Row,
  Heading,
  Text,
  RevealFx,
} from "@once-ui-system/core";
import { HomeCheckout } from "@/components/home-client";
import { SocialProof } from "@/components/SocialProof";
import { DiscordPreview } from "@/components/DiscordPreview";
import { getDiscordServer } from "@/lib/discord-invite";
import { DISCORD_INVITE_CODE, previewChannels } from "@/resources/discord";

export async function generateMetadata() {
  return localizedMeta({
    title: home.title,
    description: home.description,
    path: home.path,
    image: home.image,
  });
}

export default async function Home() {
  const t = await getTranslations("HomePage");
  // The live Discord card replaces the video cover; if Discord can't be reached the page keeps the video cover.
  const discord = await getDiscordServer(DISCORD_INVITE_CODE);
  const preview = discord ? <DiscordPreview server={discord} channels={previewChannels} /> : null;

  return (
    <Column maxWidth="m" gap="xl" paddingY="12" horizontal="center">
      <Schema
        as="webPage"
        baseURL={baseURL}
        path={home.path}
        title={home.title}
        description={home.description}
        image={`/api/og/generate?title=${encodeURIComponent(home.title)}`}
        author={{
          name: person.name,
          url: `${baseURL}${about.path}`,
          image: `${baseURL}${person.avatar}`,
        }}
      />
      <Column fillWidth horizontal="center" gap="m">
        <Column maxWidth="s" horizontal="center" align="center">
          {home.featured.display && (
            <RevealFx
              fillWidth
              horizontal="center"
              paddingTop="16"
              paddingBottom="32"
              paddingLeft="12"
            >
              <Badge
                background="brand-alpha-weak"
                paddingX="8"
                paddingY="4"
                onBackground="neutral-strong"
                textVariant="label-default-s"
                arrow={false}
                href={home.featured.href}
              >
                <Row paddingY="2">{home.featured.title}</Row>
              </Badge>
            </RevealFx>
          )}
          <RevealFx
            translateY="4"
            fillWidth
            horizontal="center"
            paddingBottom="16"
          >
            <Heading wrap="balance" variant="display-strong-l">
              {t("headline")}
            </Heading>
          </RevealFx>
          <RevealFx
            translateY="8"
            delay={0.2}
            fillWidth
            horizontal="center"
            paddingBottom="32"
          >
            <Text
              wrap="balance"
              onBackground="neutral-weak"
              variant="heading-default-xl"
            >
              {t.rich("sublineLine1", {
                name: person.firstName,
                b: (chunks) => (
                  <Text as="span" size="xl" weight="strong">
                    {chunks}
                  </Text>
                ),
              })}
              <br />
              {t("sublineLine2")}
            </Text>
          </RevealFx>
        </Column>
      </Column>

      <HomeCheckout hero={preview} />
      <SocialProof />
    </Column>
  );
}
