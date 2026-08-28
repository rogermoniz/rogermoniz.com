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

The local values are in `.env.local`, which is gitignored.

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
