import "server-only";
import { WHOP_API_BASE } from "@/lib/whop-api";

export type WhopReview = {
  id: string;
  stars: number;
  title: string | null;
  description: string | null;
  paid_for_product: boolean | null;
  published_at: string | null;
  status: string;
  user: { name: string | null; username: string } | null;
  attachments: { id: string; filename: string; content_type: string; url: string }[];
};

/** Published reviews for a product, newest first. Returns [] on any failure so the page simply hides the section. */
export async function listPublishedReviews(productId: string, limit = 50): Promise<WhopReview[]> {
  const apiKey = process.env.WHOP_API_KEY;
  if (!apiKey) return [];

  try {
    const url = new URL(`${WHOP_API_BASE}/reviews`);
    url.searchParams.set("product_id", productId);
    url.searchParams.set("first", String(limit));
    url.searchParams.set("order", "created_at");
    url.searchParams.set("direction", "desc");

    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${apiKey}` },
      next: { revalidate: 3600 },
    });
    if (!response.ok) return [];

    const body = (await response.json()) as { data?: WhopReview[] };
    return (body.data ?? []).filter((review) => review.status === "published");
  } catch {
    return [];
  }
}
