import type { CSSProperties } from "react";
import { getTranslations } from "next-intl/server";
import { Heading } from "@once-ui-system/core";
import { listPublishedReviews, type WhopReview } from "@/lib/whop-reviews";
import { WHOP_OFFERS, whopPageUrl } from "@/lib/whop-offers";
import {
  REVIEWS_PRODUCT_ID,
  MIN_FOR_LOOP,
  averageStars,
  avatarUrl,
  clip,
  pickReviews,
  reviewerName,
  stars,
} from "@/lib/reviews-view";
import { wins } from "@/resources/wins";
import { MarqueeRow } from "./MarqueeRow";
import styles from "./SocialProof.module.scss";

const MAX_TEXT = 240;

const imageOf = (review: WhopReview) => review.attachments.find((file) => file.content_type.startsWith("image/"));

export async function SocialProof() {
  const t = await getTranslations("SocialProof");
  const all = await listPublishedReviews(REVIEWS_PRODUCT_ID);
  if (all.length === 0 && wins.length === 0) return null;

  const average = averageStars(all);
  const shown = pickReviews(all).carousel;
  const loops = shown.length >= MIN_FOR_LOOP;
  const productUrl = whopPageUrl(WHOP_OFFERS.paidProgram.productUrl);

  const card = (review: WhopReview, duplicate: boolean) => {
    const image = imageOf(review);
    const name = reviewerName(review);
    return (
      <li
        key={`${review.id}${duplicate ? "-copy" : ""}`}
        className={`${styles.review} ${duplicate ? styles.duplicate : ""}`}
        aria-hidden={duplicate || undefined}
      >
        <article className={styles.card}>
          <span className={styles.starsRow} role="img" aria-label={t("starsLabel", { rating: String(review.stars) })}>
            {stars(review.stars)}
          </span>
          {review.title ? <h3 className={styles.cardTitle}>{review.title}</h3> : null}
          <p className={styles.text}>{clip(review.description ?? "", MAX_TEXT)}</p>
          {image ? <img className={styles.shot} src={image.url} alt="" loading="lazy" /> : null}
          <div className={styles.who}>
            <span className={styles.person}>
              <img
                className={styles.avatar}
                src={avatarUrl(review)}
                width={32}
                height={32}
                alt=""
                referrerPolicy="no-referrer"
              />
              <span className={styles.name}>{name}</span>
            </span>
            {review.paid_for_product ? <span className={styles.badge}>{t("paying")}</span> : null}
          </div>
        </article>
      </li>
    );
  };

  return (
    <section className={styles.section} aria-label={t("title")}>
      <div className={styles.head}>
        <Heading as="h2" variant="heading-strong-xl" className={styles.title}>
          {t("title")}
        </Heading>
        {all.length > 0 ? (
          <p className={styles.rating}>
            <span className={styles.starsRow} role="img" aria-label={t("starsLabel", { rating: average.toFixed(1) })}>
              {stars(Math.round(average))}
            </span>
            <span>{t("rating", { rating: average.toFixed(1), count: all.length })}</span>
          </p>
        ) : null}
      </div>

      {shown.length > 0 ? (
        loops ? (
          <MarqueeRow className={styles.marquee} pausedClassName={styles.held} style={{ "--count": shown.length } as CSSProperties}>
            <ul className={styles.track}>
              {shown.map((review) => card(review, false))}
              {shown.map((review) => card(review, true))}
            </ul>
          </MarqueeRow>
        ) : (
          <div className={styles.static}>
            <ul className={styles.track}>{shown.map((review) => card(review, false))}</ul>
          </div>
        )
      ) : null}

      {wins.length > 0 ? (
        <>
          <Heading as="h3" variant="heading-strong-l" className={styles.title} align="center">
            {t("winsTitle")}
          </Heading>
          <div className={styles.wins}>
            {wins.map((win) => (
              <img key={win.src} className={styles.win} src={win.src} alt={win.alt} loading="lazy" />
            ))}
          </div>
        </>
      ) : null}

      {all.length > 0 ? (
        <p className={styles.sub}>
          <a className={styles.link} href={productUrl} target="_blank" rel="noopener">
            {t("seeAll")}
          </a>
        </p>
      ) : null}
    </section>
  );
}
