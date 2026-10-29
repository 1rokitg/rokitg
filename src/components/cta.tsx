"use client";

import { useTranslations } from "next-intl";
import { newsletter } from "@/resources";
import { captureAttribution, trackWhopEvent, WHOP_EVENTS } from "@/lib/whop";
import { DISCORD_INVITE_URL, WHOP_OFFERS, whopPageUrl } from "@/lib/whop-offers";
import { EmailCapture } from "@/components/EmailCapture";
import { FreeCommunityCheckout } from "@/components/FreeCommunityCheckout";
import { features } from "@/resources/features";
import { Button, Column, Text } from "@once-ui-system/core";
import Image from "next/image";
import { useState } from "react";

interface CallToActionProps extends React.ComponentProps<typeof Column> {
  trustBadges: boolean;
}

export const CallToAction: React.FC<CallToActionProps> = ({
  trustBadges,
  ...flex
}) => {
  const t = useTranslations("HomeCta");
  const [isHovered, setIsHovered] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const videoId = "kZjEPUCnZ80";
  const thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  const goToProductPage = (productUrl: string, options?: { affiliate?: boolean }) => {
    window.open(whopPageUrl(productUrl, captureAttribution()?.parameters, options), "_blank", "noopener");
  };

  const trackFreeCheckoutClick = (
    source: "home_cta" | "home_thumbnail",
  ) => {
    trackWhopEvent(WHOP_EVENTS.freeCheckoutClicked, {
      source,
      offer: WHOP_OFFERS.freeCommunity.name,
      plan_id: WHOP_OFFERS.freeCommunity.planId,
      payment_type: WHOP_OFFERS.freeCommunity.paymentType,
      amount: WHOP_OFFERS.freeCommunity.amount,
    });
  };

  const handleCommunityClick = () => {
    trackFreeCheckoutClick("home_cta");
    goToProductPage(WHOP_OFFERS.freeCommunity.productUrl);
  };

  // The thumbnail signs people up right here on the page instead of sending them to Whop.
  const handleThumbnailClick = () => {
    trackFreeCheckoutClick("home_thumbnail");
    setIsHovered(false);
    setIsCheckoutOpen(true);
  };

  const handleDiscordClick = () => {
    trackWhopEvent(WHOP_EVENTS.discordClicked, {
      source: "home_cta",
      interaction: "open",
      link_label: "Unirme al Discord",
      destination: DISCORD_INVITE_URL,
    });

    window.open(DISCORD_INVITE_URL, "_blank", "noopener");
  };

  const handlePurchaseClick = () => {
    trackWhopEvent(WHOP_EVENTS.paidCheckoutClicked, {
      source: "home_cta",
      offer: WHOP_OFFERS.paidProgram.name,
      plan_id: WHOP_OFFERS.paidProgram.planId,
      payment_type: WHOP_OFFERS.paidProgram.paymentType,
      amount: WHOP_OFFERS.paidProgram.amount,
    });

    goToProductPage(WHOP_OFFERS.paidProgram.ctaUrl, { affiliate: false });
  };
  if (newsletter.display === false) {
    return null;
  }

  return (
    <Column
      overflow="hidden"
      radius="l"
      horizontal="center"
      align="center"
      {...flex}
      style={{
        width: "100%",
        position: "relative",
      }}
    >
      {/* =========================================================
          VIDEO SALES LETTER
      ========================================================== */}

      <Column
        horizontal="center"
        align="center"
        style={{
          width: "100%",
          maxWidth: 950,
        }}
      >
        {trustBadges && (
          <Image
            src="/images/trust-badges.webp"
            alt="Trust Badges"
            width={462}
            height={70}
            style={{
              width: "80%",
              height: "auto",
            }}
          />
        )}

        {/* THUMBNAIL: opens the free community sign-up in place */}
        {isCheckoutOpen ? (
          <FreeCommunityCheckout onClose={() => setIsCheckoutOpen(false)} />
        ) : (
        <button
          type="button"
          onClick={handleThumbnailClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onFocus={() => setIsHovered(true)}
          onBlur={() => setIsHovered(false)}
          aria-label={t("videoAriaLabel")}
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: "16 / 9",
            padding: 0,
            border: "2px solid #ed1238",
            borderRadius: 16,
            overflow: "hidden",
            cursor: "pointer",
            background: "#050505",
            boxShadow: isHovered
              ? "0 24px 70px rgba(237,18,56,0.28)"
              : "0 15px 45px rgba(0,0,0,0.35)",
            transform: isHovered ? "translateY(-4px)" : "translateY(0)",
            transition: "transform 250ms ease, box-shadow 250ms ease",
          }}
        >
          {/* Thumbnail */}
          <img
            src={thumbnail}
            alt={t("videoThumbnailAlt")}
            draggable={false}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: isHovered ? "scale(1.035)" : "scale(1)",
              transition: "transform 600ms ease",
            }}
          />

          {/* Dark cinematic overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `
                linear-gradient(
                  180deg,
                  rgba(0,0,0,0.10) 0%,
                  rgba(0,0,0,0.05) 40%,
                  rgba(0,0,0,0.75) 100%
                )
              `,
            }}
          />

          {/* Top player UI */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "16px 18px",
            }}
          >
            {/* LIVE / CLASS badge */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "7px 11px",
                borderRadius: 999,
                background: "rgba(0,0,0,0.55)",
                border: "1px solid rgba(255,255,255,0.16)",
                backdropFilter: "blur(12px)",
                color: "#fff",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.04em",
              }}
            >
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: "#ed1238",
                  boxShadow: "0 0 12px rgba(237,18,56,0.9)",
                }}
              />
              {t("videoBadge")}
            </div>

            {/* Duration */}
            <div
              style={{
                padding: "7px 11px",
                borderRadius: 999,
                background: "rgba(0,0,0,0.55)",
                border: "1px solid rgba(255,255,255,0.16)",
                backdropFilter: "blur(12px)",
                color: "#fff",
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              10:31
            </div>
          </div>

          {/* PLAY BUTTON */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              width: "clamp(72px, 9vw, 104px)",
              height: "clamp(72px, 9vw, 104px)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#ed1238",
              boxShadow: `
                0 12px 35px rgba(0,0,0,0.45),
                0 0 0 10px rgba(237,18,56,0.18),
                0 0 0 20px rgba(237,18,56,0.08)
              `,
              transition: "transform 220ms ease",
            }}
          >
            <svg
              width="38"
              height="38"
              viewBox="0 0 38 38"
              aria-hidden="true"
              style={{
                marginLeft: 4,
                transform: isHovered ? "scale(1.12)" : "scale(1)",
                transition: "transform 220ms ease",
              }}
            >
              <path d="M14 9.5L29 19L14 28.5V9.5Z" fill="white" />
            </svg>
          </div>

          {/* Bottom player area */}
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              padding: "20px 22px 18px",
              color: "#fff",
              textAlign: "left",
            }}
          >
            {/* Fake progress bar */}
            <div
              style={{
                width: "100%",
                height: 3,
                marginBottom: 12,
                borderRadius: 99,
                background: "rgba(255,255,255,0.28)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: "31%",
                  height: "100%",
                  borderRadius: 99,
                  background: "#ed1238",
                }}
              />
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 16,
              }}
            >
              <span
                style={{
                  fontSize: "clamp(13px, 1.5vw, 16px)",
                  fontWeight: 600,
                  textShadow: "0 2px 8px rgba(0,0,0,0.5)",
                }}
              >
                {t("videoTitle")}
              </span>

              <span
                style={{
                  fontSize: 12,
                  opacity: 0.8,
                  whiteSpace: "nowrap",
                }}
              >
                ▶ {t("watchNow")}
              </span>
            </div>
          </div>
        </button>
        )}

        {/* =========================================================
            CTA
        ========================================================== */}

        <Column
          horizontal="center"
          align="center"
          gap="m"
          style={{
            width: "100%",
            marginTop: 18,
          }}
        >
          <Button
            type="button"
            onClick={handleCommunityClick}
            size="l"
            variant="primary"
            style={{
              width: "100%",
              minHeight: 64,
              borderRadius: 10,
              fontSize: "clamp(16px, 2vw, 20px)",
              fontWeight: 800,
              letterSpacing: "0.01em",
              boxShadow: "0 10px 35px rgba(237,18,56,0.28)",
              transition: "transform 180ms ease, box-shadow 180ms ease",
            }}
          >
            {t("joinFreeCta")} →
          </Button>

          <Button
            type="button"
            onClick={handlePurchaseClick}
            size="l"
            variant="secondary"
            style={{
              width: "100%",
              minHeight: 56,
              borderRadius: 10,
              fontSize: "clamp(15px, 1.8vw, 18px)",
              fontWeight: 700,
            }}
          >
            {t("paidCta")}
          </Button>
          <Button
            type="button"
            onClick={handleDiscordClick}
            size="l"
            variant="secondary"
            prefixIcon="discord"
            style={{
              background: "#5865F2",
              color: "#fff",
              width: "100%",
              minHeight: 56,
              borderRadius: 10,
              fontSize: "clamp(15px, 1.8vw, 18px)",
              fontWeight: 700,
            }}
          >
            {t("discordCta")}
          </Button>

          <Text
            onBackground="neutral-weak"
            style={{
              fontSize: 13,
              textAlign: "center",
              opacity: 0.75,
            }}
          >
            {t("footerNote")}
          </Text>

          {features.emailCapture && (
            <div style={{ width: "100%", marginTop: 12 }}>
              <EmailCapture source="home_cta" />
            </div>
          )}
        </Column>
      </Column>
    </Column>
  );
};
