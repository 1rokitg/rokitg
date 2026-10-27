"use client";

import { loadWhop } from "@whop/elements";
import { Checkout, CheckoutElement, WhopElements } from "@whop/elements-react";
import { WHOP_AFFILIATE_CODE, WHOP_OFFERS } from "@/lib/whop-offers";

type Props = {
  locale: "en" | "es";
  theme: "light" | "dark";
  /** Where on the site the sign-up started, recorded with the membership. */
  source: string;
  /** Ad attribution from the landing url, so the membership is credited to the campaign that brought the visitor. */
  attribution: Record<string, string>;
  onJoined: (sessionId: string) => void;
};

const whop = loadWhop();

export default function FreeCommunityEmbed({ locale, theme, source, attribution, onJoined }: Props) {
  return (
    <WhopElements elements={whop} appearance={{ theme: { appearance: theme } }}>
      <Checkout
        plan={WHOP_OFFERS.freeCommunity.planId}
        affiliateCode={WHOP_AFFILIATE_CODE}
        locale={locale}
        attribution={{
          source,
          utmSource: attribution.utm_source,
          utmMedium: attribution.utm_medium,
          utmCampaign: attribution.utm_campaign,
          utmTerm: attribution.utm_term,
          utmContent: attribution.utm_content,
        }}
        onComplete={(payload) => onJoined(payload.sessionId)}
      >
        <CheckoutElement />
      </Checkout>
    </WhopElements>
  );
}
