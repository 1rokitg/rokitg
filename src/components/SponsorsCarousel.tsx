import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Heading, Icon } from "@once-ui-system/core";
import { Link } from "@/i18n/navigation";
import { links } from "@/resources/links";
import styles from "./SponsorsCarousel.module.scss";

type SponsorKey = keyof typeof links;

async function SponsorCards({ current, variant }: { current?: SponsorKey; variant: "carousel" | "grid" }) {
  const t = await getTranslations("LinktreePage");
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
            data-analytics-source={`sponsors_${variant}`}
          >
            <Image src={sponsor.icon} alt="" width={44} height={44} className={styles.logo} />
            <span className={styles.text}>
              <span className={styles.name}>{sponsor.name}</span>
              <span className={styles.caption}>{t(sponsor.captionKey)}</span>
            </span>
            <Icon name="arrowRight" onBackground="neutral-weak" />
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
