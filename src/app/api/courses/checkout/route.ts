import { NextResponse } from "next/server";
import { getCourseOffer } from "@/lib/course-offers";
import { getPrivyUserId } from "@/lib/privy-server";
import { createCourseCheckout } from "@/lib/whop-api";

const SITE_URL = "https://rokitg.com";

export async function POST(request: Request) {
  const privyUserId = await getPrivyUserId();
  if (!privyUserId) {
    return NextResponse.json({ error: "not_authenticated" }, { status: 401 });
  }

  const { courseSlug } = (await request.json()) as { courseSlug?: string };
  if (!courseSlug) {
    return NextResponse.json({ error: "missing_course_slug" }, { status: 400 });
  }

  const offer = getCourseOffer(courseSlug);
  if (!offer || offer.purpose !== "paid") {
    return NextResponse.json({ error: "course_not_sellable" }, { status: 404 });
  }

  const configuration = await createCourseCheckout({
    planId: offer.planId,
    metadata: { privy_user_id: privyUserId, course_slug: courseSlug },
    redirectUrl: `${SITE_URL}/app/courses/${courseSlug}/unlocked`,
  });

  if (!configuration.purchase_url) {
    return NextResponse.json({ error: "no_purchase_url" }, { status: 502 });
  }

  return NextResponse.json({ url: configuration.purchase_url });
}
