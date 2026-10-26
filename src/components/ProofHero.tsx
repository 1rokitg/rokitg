import { getTranslations } from "next-intl/server";
import type { WhopReview } from "@/lib/whop-reviews";
import { avatarUrl, clip, reviewerName, stars } from "@/lib/reviews-view";
import styles from "./ProofHero.module.scss";

const QUOTE_MAX = 160;

type Props = { reviews: WhopReview[]; average: number; count: number };

/** Social proof that sits above the join button: the overall rating plus a few short member reviews. */
export async function ProofHero({ reviews, average, count }: Props) {
  const t = await getTranslations("SocialProof");

  return (
    <section className={styles.proof} aria-label={t("title")}>
      <p className={styles.rating}>
        <span className={styles.stars} role="img" aria-label={t("starsLabel", { rating: average.toFixed(1) })}>
          {stars(Math.round(average))}
        </span>
        <span>{t("rating", { rating: average.toFixed(1), count })}</span>
      </p>

      <ul className={styles.quotes}>
        {reviews.map((review) => (
          <li key={review.id} className={styles.quote}>
            <span className={styles.stars} role="img" aria-label={t("starsLabel", { rating: String(review.stars) })}>
              {stars(review.stars)}
            </span>
            <p className={styles.text}>“{clip(review.description ?? "", QUOTE_MAX)}”</p>
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
                <span className={styles.name}>{reviewerName(review)}</span>
              </span>
              {review.paid_for_product ? <span className={styles.badge}>{t("paying")}</span> : null}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
