# Courses v0

## Scope

Built on `main`, under `/app/courses`, using this project's Next.js App Router, React and SCSS modules, with Whop's supported `@whop/checkout` embed for the new course flow. Existing checkout components elsewhere are unchanged. Referenced the downloaded learning platform's course/chapter/progress structure; its older dependencies and paid content were not imported.

Routes:
- `/app/courses`: searchable category-filtered catalog.
- `/app/courses/tus-primeros-pasos`: first course, planned price EUR 20 (2000 minor units).
- `/app/courses/[course]`: course description and curriculum.
- `/app/courses/[course]/[lesson]`: public sample lesson reader with navigation and completion toggles.
- `/app/courses/library`: local sample progress and resume links.
- `/app/courses/checkout/complete`: neutral checkout return page, never proof of purchase.

## Temporary commerce setup (explicitly requested)

The first course uses Free Community as a placeholder. Verified via Whop MCP on 2026-09-16:
- Account: RokitG (`biz_ROKYKZdV9YGZP7`).
- Product: Free Community (`prod_fGgcg5TK7jvos`).
- Plan: `plan_6hY35QLQssD74`, one-time, initial and renewal prices both zero.
- Hosted fallback: https://whop.com/rokitg/free-comm/

The page distinguishes the planned EUR 20 course from the actual free community signup. Opening checkout records the existing free checkout interaction; it does not record a completed purchase. Checkout loads only after the visitor clicks. No real registrations or charges were submitted during development.

`src/lib/course-offers.ts` owns the course-to-Whop product/plan mapping. `CourseCheckout` and `CourseCheckoutEmbed` accept this mapping rather than binding the interface to Free Comm. The current offer is explicitly marked `free_placeholder` and `one_time`; real one-time course plans must ship with the access verification described below. The official `@whop/checkout/react` SDK renders the embedded checkout in Spanish.

## Content and access boundaries

`src/lib/courses.ts` is a server-only source containing catalog data and explicitly labeled original sample text. Only catalog summaries, with no lesson bodies, are passed to the catalog client. The requested course has no placeholder lessons presented as paid content. Sample progress uses versioned localStorage, survives reloads, and can be reset by clearing browser storage. It is device-local and is never an entitlement.

The lesson route rejects unknown courses/lessons and any non-demo or non-preview lesson. No private lessons, video URLs, or purchase grants are sent to the browser. Do not put paid lesson bodies into this public catalog module when replacing the samples.

## Required before selling the EUR 20 course

1. Add the user's actual course content and approved curriculum, with protected storage for paid media.
2. Create/map the dedicated EUR 20 Whop plan; replace the free placeholder with an accurate price and checkout.
3. Link an authenticated learner identity to a server-verified Whop membership. Do not infer access from matching unverified email, localStorage, query parameters, or client checkout callbacks.
4. Enforce entitlement checks on lesson delivery and media access; handle revoked/refunded memberships.
5. Persist learner progress server-side under the verified account and populate the purchased library from verified access.
6. Test the paid purchase, reload/resume, denied access and refund flows before opening sales.

The current v0 intentionally supports the user-approved free placeholder and public lesson experience, not production paid-course fulfillment.

## Verification

- Production build and TypeScript passed with Next.js 16.3.2.
- Browser checks passed for catalog search/empty/reset/category filters, lesson navigation, completion after reload, library resume, and mobile width.
- Whop MCP confirmed the placeholder plan has zero initial and renewal prices.
- The exact official checkout URL rendered the Spanish registration form when opened directly. The embedded iframe remained blank in the Codex localhost browser; the hosted fallback is provided. Verify iframe rendering in the deployment/browser environment before opening signups broadly.
- No registrations, purchases, or account changes were submitted through checkout during verification.
