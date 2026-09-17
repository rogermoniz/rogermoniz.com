#!/usr/bin/env bash
# Puts the gift card checkout live: registers the production webhook with
# Stripe and writes both Stripe secrets into the Vercel project.
#
# Reads the live secret key and a Vercel token from files, so neither value is
# ever typed on a command line, echoed, or written into the repo.
#
#   ~/.rogermoniz-stripe-live-key   sk_live_…  (Stripe → Developers → API keys)
#   ~/.rogermoniz-vercel-token      a Vercel token with access to the project's team
#
#   usage: scripts/stripe-go-live.sh
set -euo pipefail

PROJECT_ID="prj_h8fjNYXjdJsiv5gyN1OwEY5bgw0V"
WEBHOOK_URL="https://rogermoniz.com/api/stripe/webhook/"
EVENTS=(checkout.session.completed checkout.session.async_payment_succeeded checkout.session.async_payment_failed checkout.session.expired)

STRIPE_KEY_FILE="${STRIPE_KEY_FILE:-$HOME/.rogermoniz-stripe-live-key}"
VERCEL_TOKEN_FILE="${VERCEL_TOKEN_FILE:-$HOME/.rogermoniz-vercel-token}"

for f in "$STRIPE_KEY_FILE" "$VERCEL_TOKEN_FILE"; do
  [[ -f "$f" ]] || { echo "Missing $f" >&2; exit 1; }
done
STRIPE_KEY="$(tr -d '[:space:]' < "$STRIPE_KEY_FILE")"
VERCEL_TOKEN="$(tr -d '[:space:]' < "$VERCEL_TOKEN_FILE")"
[[ "$STRIPE_KEY" == sk_live_* ]] || { echo "The Stripe key in $STRIPE_KEY_FILE is not a live secret key." >&2; exit 1; }

json() { python3 -c 'import json,sys; d=json.load(sys.stdin); print(eval(sys.argv[1]))' "$1"; }

# --- Stripe: one endpoint for the URL, created if absent, secret captured once.
echo "→ Stripe webhook endpoint"
existing="$(curl -sS -u "$STRIPE_KEY:" "https://api.stripe.com/v1/webhook_endpoints?limit=100" \
  | json "next((e['id'] for e in d['data'] if e['url']=='$WEBHOOK_URL'), '')")"
if [[ -n "$existing" ]]; then
  echo "  already registered as $existing; its signing secret is only shown once, so it is not rewritten."
  echo "  If STRIPE_WEBHOOK_SECRET on Vercel is wrong, delete the endpoint in Stripe and rerun."
  WEBHOOK_SECRET=""
else
  args=(-d "url=$WEBHOOK_URL" -d "description=rogermoniz.com gift card orders")
  for e in "${EVENTS[@]}"; do args+=(-d "enabled_events[]=$e"); done
  created="$(curl -sS -u "$STRIPE_KEY:" "https://api.stripe.com/v1/webhook_endpoints" "${args[@]}")"
  endpoint_id="$(printf '%s' "$created" | json "d.get('id') or ('ERROR: ' + d['error']['message'])")"
  [[ "$endpoint_id" == we_* ]] || { echo "  $endpoint_id" >&2; exit 1; }
  WEBHOOK_SECRET="$(printf '%s' "$created" | json "d['secret']")"
  echo "  created $endpoint_id"
fi

# --- Vercel: upsert the two production variables.
echo "→ Vercel environment"
team="$(curl -sS -H "Authorization: Bearer $VERCEL_TOKEN" "https://api.vercel.com/v9/projects/$PROJECT_ID" \
  | json "d.get('accountId') or ('ERROR: ' + d['error']['message'])")"
[[ "$team" == ERROR* ]] && { echo "  $team" >&2; exit 1; }

upsert() {
  local key="$1" value="$2"
  local body
  body="$(python3 -c 'import json,sys; print(json.dumps({"key": sys.argv[1], "value": sys.argv[2], "type": "sensitive", "target": ["production"]}))' "$key" "$value")"
  curl -sS -X POST -H "Authorization: Bearer $VERCEL_TOKEN" -H "Content-Type: application/json" \
    "https://api.vercel.com/v10/projects/$PROJECT_ID/env?upsert=true&teamId=$team" --data-binary "$body" \
    | json "'  ' + sys.argv[1] + ': ' + ('ok' if 'created' in d or 'id' in d else 'ERROR ' + d['error']['message'])" "$key"
}
upsert STRIPE_SECRET_KEY "$STRIPE_KEY"
if [[ -n "$WEBHOOK_SECRET" ]]; then upsert STRIPE_WEBHOOK_SECRET "$WEBHOOK_SECRET"; fi

echo "Done. Redeploy (push to main) so the new values are baked into the build."
