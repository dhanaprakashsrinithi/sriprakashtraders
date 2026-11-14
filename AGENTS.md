<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

## Project rules

- Buy and sell enquiries (enquiry_type buy|sell) are inserted only through the `submitEnquiry` server function (validation, honeypot, time check, per-phone rate limit) using the admin client; the `enquiries` table has no anon insert policy so spam cannot bypass those checks.
- Shared enquiry validation lives in `src/lib/enquiry-schema.ts` and is used by both the form and the server function; keep tests in `src/test/enquiry-schema.test.ts` in sync.
- Staff access is the `admin` role in `public.user_roles`, granted by a trigger to the owner email on email confirmation; the `/admin` route is client-only and renders its own sign-in instead of an `_authenticated` layout.
- Public product data loads via `listProducts` (publishable client, anon SELECT policy) in route loaders so product pages are server-rendered for SEO.
- Product photos are mapped by product slug in `src/lib/product-images.ts`; new products need an image entry there.
- Enquiries store quantity and unit exactly as entered plus `quantity_mt` (converted via `toMetricTonnes`) so the dashboard shows the visitor's unit while totals stay comparable.
- Paired sell/buy call-to-action buttons render only through `src/components/site/TradeButtons.tsx` (with a `tone` for the background) so their order and highlight stay identical on every page.
- The root shell uses a minimal branded header on `/admin` and hides the customer header, footer and WhatsApp shortcut there, keeping administration separate from customer navigation.
