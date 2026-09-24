import Image from "next/image";
import {
  Avatar,
  Column,
  Row,
  Heading,
  Text,
  Button,
  Icon,
  SmartLink,
  Meta,
  Schema,
} from "@once-ui-system/core";
import { baseURL, person, social } from "@/resources";
import { links as tools } from "@/resources/links";
import { SocialCapitalButton } from "@/components/SocialCapitalButton";

const LINKS_PATH = "/links";
const TITLE = `Links – ${person.name}`;
const DESCRIPTION = `Every place to find ${person.name} — main socials, the community, and the tools I actually use.`;

// Curated order for the linktree — pulled from the single social-links source of
// truth (src/resources/content.tsx) so this page never drifts from the footer/about page.
const SOCIAL_ORDER = ["Instagram", "TikTok", "YouTube", "Twitter", "Discord", "Telegram"];

export async function generateMetadata() {
  return Meta.generate({
    title: TITLE,
    description: DESCRIPTION,
    baseURL: baseURL,
    path: LINKS_PATH,
    image: `/api/og/generate?title=${encodeURIComponent(TITLE)}`,
  });
}

export default function LinksPage() {
  const orderedSocial = SOCIAL_ORDER.map((name) => social.find((item) => item.name === name)).filter(
    (item): item is (typeof social)[number] => Boolean(item?.link),
  );
  const toolList = Object.values(tools);

  return (
    <Column maxWidth="xs" gap="40" paddingY="24" horizontal="center" data-analytics-source="links_page">
      <Schema
        as="webPage"
        baseURL={baseURL}
        title={TITLE}
        description={DESCRIPTION}
        path={LINKS_PATH}
        image={`/api/og/generate?title=${encodeURIComponent(TITLE)}`}
        author={{
          name: person.name,
          url: `${baseURL}/about`,
          image: `${baseURL}${person.avatar}`,
        }}
      />

      <Column horizontal="center" align="center" gap="12">
        <Avatar src={person.avatar} size="xl" />
        <Heading variant="display-strong-m">{person.name}</Heading>
        <Text wrap="balance" align="center" onBackground="neutral-weak" variant="body-default-m">
          Trading, creator tools, and every place to find me — all in one spot.
        </Text>
      </Column>

      <Column fillWidth gap="8">
        <SocialCapitalButton source="links_page" />
        <Text align="center" onBackground="neutral-weak" variant="body-default-xs">
          Real ROI breakdowns, live trade reviews, and the exact system I run.
        </Text>
      </Column>

      <Column fillWidth gap="12">
        <Text variant="label-default-s" onBackground="neutral-weak" marginLeft="4">
          MAIN SOCIALS
        </Text>
        <Column fillWidth gap="8">
          {orderedSocial.map((item) => (
            <Button
              key={item.name}
              href={item.link}
              label={item.name}
              prefixIcon={item.icon}
              arrowIcon
              fillWidth
              size="l"
              variant="secondary"
              data-analytics-source="links_page_socials"
              style={{ justifyContent: "flex-start", paddingLeft: "20px" }}
            />
          ))}
        </Column>
      </Column>

      <Column fillWidth gap="12">
        <Text variant="label-default-s" onBackground="neutral-weak" marginLeft="4">
          RECOMMENDED TOOLS
        </Text>
        <Column fillWidth gap="8">
          {toolList.map((tool) => (
            <SmartLink
              key={tool.name}
              href={tool.sponsorPath}
              unstyled
              style={{ width: "100%" }}
              data-analytics-source="links_page_tools"
            >
              <Row
                fillWidth
                gap="16"
                vertical="center"
                padding="16"
                radius="l"
                border="neutral-alpha-medium"
                background="neutral-alpha-weak"
                style={{ borderLeft: `3px solid ${tool.color}` }}
              >
                <Image
                  src={tool.icon}
                  alt={tool.name}
                  width={40}
                  height={40}
                  style={{ borderRadius: "10px", flexShrink: 0 }}
                />
                <Column gap="2" flex={1}>
                  <Text variant="body-strong-m">{tool.name}</Text>
                  <Text variant="body-default-s" onBackground="neutral-weak">
                    {tool.caption}
                  </Text>
                </Column>
                <Icon name="arrowRight" onBackground="neutral-weak" />
              </Row>
            </SmartLink>
          ))}
        </Column>
      </Column>
    </Column>
  );
}
