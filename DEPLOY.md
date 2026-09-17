# Deploying rogermoniz.com

The site is a standard Next.js app. It reads its content from Supabase at build
time and revalidates every 10 minutes, so content edits go live without a
redeploy.

## Where it runs today

`rogermoniz.com` currently resolves to **Vercel** (`216.198.79.1`, and
`www` is a `vercel-dns-017.com` CNAME). DNS is hosted at **IONOS**
(`ns*.ui-dns.*`), not at the registrar's Vercel integration — so DNS records are
added at IONOS, and the domain is attached to the project inside Vercel.

## Environment variables

Set all five in the Vercel project, for Production and Preview:

| Variable | Scope | Notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | public | `https://isjzvhhleoukhjbebvje.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | public | read only by design |
| `SUPABASE_SECRET_KEY` | **secret** | CMS writes; never `NEXT_PUBLIC_` |
| `ADMIN_PASSWORD` | **secret** | CMS sign in |
| `ADMIN_SESSION_SECRET` | **secret** | signs the admin cookie |
| `STRIPE_SECRET_KEY` | **secret** | `sk_live_…` in production; a `sk_test_…` key locally |
| `STRIPE_WEBHOOK_SECRET` | **secret** | `whsec_…` of the endpoint below, one per mode |

The local values are in `.env.local`, which is gitignored.

## Stripe

**Payments open the moment `STRIPE_SECRET_KEY` exists in the environment**
(`lib/orders/launch.ts`). Without it every "Réserver" leads to the contact page,
the gift card form offers "Me contacter pour commander", and the booking pages
404, so a deploy without the key is the site as it was before Stripe.

The gift card (`/carte-cadeau`) and every priced prestation formula
(`/reserver/<slug>/`, reached from each pricing card's button) are paid through
Stripe Checkout. The forms post to the `startGiftCheckout` / `startBookingCheckout`
server actions in `lib/orders/checkout.ts`, which price the order from the
content rows (`gift_packages` / `gift_deliveries` / `pricing_cards`), record it
in `orders` and send the buyer to Stripe. A card whose price is prose
("Sur devis") is simply not bookable. Stripe then calls back:

    POST https://rogermoniz.com/api/stripe/webhook

Register that URL as a webhook endpoint in the Stripe dashboard (live mode)
with these events, and put its signing secret in `STRIPE_WEBHOOK_SECRET`:

    checkout.session.completed
    checkout.session.async_payment_succeeded
    checkout.session.async_payment_failed
    checkout.session.expired

On a paid session the webhook marks the order paid; the buyer lands on
`/merci/?session=…`. Orders are listed at `/admin/commandes`; the owner is emailed by Stripe's own "successful payment"
notification (Web3Forms refuses server side calls, so the webhook cannot use
it). The buyer gets Stripe's receipt.

`scripts/stripe-go-live.sh` registered the live webhook (2026-09-17) and writes both secrets
into the Vercel project, reading the live key from
`~/.rogermoniz-stripe-live-key` and a Vercel token from
`~/.rogermoniz-vercel-token`, so neither value is ever typed or printed.
Prices are the text in the editor (`200€`, `+ 15€`, `Inclus`) parsed by
`lib/orders/money.ts`; an unreadable price fails the build rather than charging
a guess.

## Deploying

    scripts/deploy.sh preview     # build and deploy a preview URL
    scripts/deploy.sh production  # promote to rogermoniz.com

It reads a Vercel access token from `~/.rogermoniz-vercel-token` so the secret
never appears on a command line or in the repo.

## admin.rogermoniz.com

The CMS lives at `/admin` in this same app. `middleware.ts` rewrites any host
starting `admin.` onto `/admin`, so one deployment serves both.

Two steps:

1. **Vercel** — add `admin.rogermoniz.com` as a domain on the project.
2. **IONOS DNS** — add the record Vercel then asks for, normally:

       Type   Name    Value
       CNAME  admin   cname.vercel-dns.com

Vercel issues the TLS certificate automatically once the record resolves.

Until that exists, the CMS is reachable at `https://rogermoniz.com/admin`.

## Database

Schema and seed live in `supabase/`. Both are re-runnable; the seed truncates
first, so it always restores the database to match the repo.

    scripts/db-push.sh all      # schema, seed, then verify
    scripts/db-push.sh verify   # row counts only
