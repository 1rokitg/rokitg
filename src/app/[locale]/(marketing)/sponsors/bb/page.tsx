import { Badge, Button, Column, Heading, Row, Text } from "@once-ui-system/core";
import Image from "next/image";

const VIDEO_URL = "https://www.youtube.com/watch?v=kXMxDsIWPJo";
const VIDEO_THUMBNAIL_URL =
  "https://img.youtube.com/vi/kXMxDsIWPJo/maxresdefault.jpg";

export const metadata = {
  title: "Trading Bot | RokitG",
  description: "Watch the trading bot overview.",
};

export default function TradingBotSponsorPage() {
  return (
    <Column maxWidth="m" gap="xl" paddingY="12" horizontal="center">
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
              alt="Trading Bot"
              width={22}
              height={22}
              style={{ borderRadius: "5px", background: "#fff" }}
            />
            Based Bot
          </Row>
        </Badge>
        <Heading wrap="balance" variant="display-strong-l">
          Trading Bot
        </Heading>
        <Text
          wrap="balance"
          onBackground="neutral-weak"
          variant="heading-default-xl"
        >
          Watch the trading bot overview to see the platform in action.
        </Text>
      </Column>

      <Column maxWidth="m" fillWidth horizontal="center" gap="m">
        <a
          href={VIDEO_URL}
          target="_blank"
          rel="noreferrer"
          aria-label="Watch the trading bot overview on YouTube"
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
            alt="Trading bot YouTube overview"
            style={{ display: "block", width: "100%", aspectRatio: "16 / 9" }}
          />
        </a>
        <Button href={VIDEO_URL} target="_blank" prefixIcon="play" size="l">
          WATCH THE TRADING BOT OVERVIEW
        </Button>
      </Column>
    </Column>
  );
}
