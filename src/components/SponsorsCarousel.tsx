import type { CSSProperties } from "react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Heading } from "@once-ui-system/core";
import { Link } from "@/i18n/navigation";
import { links } from "@/resources/links";
import styles from "./SponsorsCarousel.module.scss";

type SponsorKey = keyof typeof links;

async function SponsorCards({ current, variant }: { current?: SponsorKey; variant: "carousel" | "grid" }) {
  const t = await getTranslations("LinktreePage");
  const common = await getTranslations("SponsorsCarousel");
  const items = (Object.entries(links) as [SponsorKey, (typeof links)[SponsorKey]][]).filter(
    ([key]) => key !== current,
  );

  return (
    <ul className={variant === "carousel" ? styles.carousel : styles.grid}>
      {items.map(([key, sponsor]) => (
        <li key={key} className={styles.item}>
          <Link
            href={sponsor.sponsorPath}
            className={styles.card}
            style={{ "--glow": sponsor.color } as CSSProperties}
            data-analytics-source={`sponsors_${variant}`}
          >
            <span className={styles.visual}>
              <span className={styles.aura} aria-hidden="true" />
              <Image src={sponsor.icon} alt="" width={96} height={96} className={styles.logo} />
            </span>
            <span className={styles.body}>
              <span className={styles.name}>{sponsor.name}</span>
              <span className={styles.caption}>{t(sponsor.captionKey)}</span>
              <span className={styles.cta}>{common("learnMore")} →</span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export async function SponsorsCarousel({ current }: { current: SponsorKey }) {
  const t = await getTranslations("SponsorsCarousel");
  return (
    <section className={styles.section} aria-label={t("title")}>
      <Heading as="h2" variant="heading-strong-l">
        {t("title")}
      </Heading>
      <SponsorCards current={current} variant="carousel" />
    </section>
  );
}

export function SponsorsGrid() {
  return <SponsorCards variant="grid" />;
}
