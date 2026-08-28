#!/usr/bin/env bash
# Deploys to Vercel, reading the access token from a file so the secret never
# lands on a command line or in the repo.
#
#   usage: scripts/deploy.sh [preview|production]
set -euo pipefail

TARGET="${1:-preview}"
TOKEN_FILE="${VERCEL_TOKEN_FILE:-$HOME/.rogermoniz-vercel-token}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

if [[ ! -f "$TOKEN_FILE" ]]; then
  echo "No token at $TOKEN_FILE" >&2
  echo "Create one at https://vercel.com/account/tokens and save it there." >&2
  exit 1
fi
export VERCEL_TOKEN="$(tr -d '[:space:]' < "$TOKEN_FILE")"

cd "$ROOT"
case "$TARGET" in
  preview)    npx --yes vercel@latest deploy --token "$VERCEL_TOKEN" --yes ;;
  production) npx --yes vercel@latest deploy --prod --token "$VERCEL_TOKEN" --yes ;;
  *) echo "usage: $0 [preview|production]" >&2; exit 2 ;;
esac
