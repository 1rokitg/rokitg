# Community welcome page

`/welcome` is the shared Spanish onboarding destination for Free Community and Social Capital. It follows the large cards and numbered steps used on `/sponsors/fomo`.

## Checkout success redirect

After deploying, set Whop's business checkout success redirect URL to `https://www.rokitg.com/welcome` and choose **Exclude OAuth code**. This public page does not exchange OAuth codes, inspect checkout query parameters, confirm payment, or grant membership access. Whop still controls entitlements. Visiting the page does not emit a conversion.

## Verified destinations

On September 16, 2026, Whop's API confirmed both experiences are attached to Free Community (`prod_fGgcg5TK7jvos`) and Social Capital (`prod_c1w81EBTtfHWs`):

- Discord account linking: `https://whop.com/rokitg/exp_DSkH2hqtsdeM39/app/`
- Courses: `https://whop.com/rokitg/exp_p8nAF6RNdAM8kN/app/`
- Direct invitations are intentionally not used on this page: Whop's Discord experience links the member's account and plan to the correct server roles.

Course titles are a curated snapshot of the published Courses app; update them when the catalog changes. No temporary signed thumbnail URLs are embedded. Course language and access are not assumed.

Existing shared outbound tracking records Whop and Discord clicks, differentiated by `welcome_*` sources. No new event names or checkout/purchase events are added. The page is excluded from indexing and the sitemap since it is an onboarding destination.

Official Discord account linking instructions: https://docs.whop.com/memberships-and-access/access-discord-server/access-a-discord-server
