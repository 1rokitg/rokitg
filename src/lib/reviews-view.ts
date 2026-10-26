import type { WhopReview } from "@/lib/whop-reviews";

export const REVIEWS_PRODUCT_ID = "prod_c1w81EBTtfHWs";

const HERO_COUNT = 3;
const HERO_MAX_TEXT = 220;
const CAROUSEL_MAX = 6;
// Fewer cards than this can't fill the row twice over, so the carousel stays still instead of looping.
export const MIN_FOR_LOOP = 4;

export const stars = (count: number) => "★".repeat(count) + "☆".repeat(5 - count);

export function clip(text: string, max: number): string {
  const clean = text.replace(/\s+/g, " ").trim();
  return clean.length > max ? `${clean.slice(0, max).trimEnd()}…` : clean;
}

// Seeded with an opaque id (never the reviewer's name), so no member names are sent to the avatar service.
export const avatarUrl = (review: WhopReview) =>
  `https://avatar.vercel.sh/${encodeURIComponent(review.user?.id ?? review.id)}.png?size=64`;

export const reviewerName = (review: WhopReview) => review.user?.name?.trim() || review.user?.username || "";

const isGood = (review: WhopReview) => review.stars >= 4 && (review.description?.trim().length ?? 0) >= 20;

/** The few short reviews shown above the join button, and the carousel's cards (which avoid repeating them when enough remain). */
export function pickReviews(all: WhopReview[]): { hero: WhopReview[]; carousel: WhopReview[] } {
  const good = all.filter(isGood);
  const short = good.filter((review) => (review.description?.trim().length ?? 0) <= HERO_MAX_TEXT);
  const hero = (short.length >= HERO_COUNT ? short : good).slice(0, HERO_COUNT);
  const rest = good.filter((review) => !hero.includes(review));
  const carousel = (rest.length >= MIN_FOR_LOOP ? rest : good).slice(0, CAROUSEL_MAX);
  return { hero, carousel };
}

export const averageStars = (all: WhopReview[]) =>
  all.length > 0 ? all.reduce((sum, review) => sum + review.stars, 0) / all.length : 0;
