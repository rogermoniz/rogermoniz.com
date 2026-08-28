#!/usr/bin/env bash
# Applies the schema and seed to the rogermoniz Supabase project.
#
# Reads a Supabase personal access token from a file so the secret is never
# passed on the command line, echoed, or written into the repo.
#
#   usage: scripts/db-push.sh [schema|seed|all|verify]
set -euo pipefail

PROJECT_REF="isjzvhhleoukhjbebvje"
TOKEN_FILE="${SUPABASE_TOKEN_FILE:-$HOME/.rogermoniz-supabase-token}"
API="https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

if [[ ! -f "$TOKEN_FILE" ]]; then
  echo "No token at $TOKEN_FILE" >&2
  echo "Create one at https://supabase.com/dashboard/account/tokens and save it there." >&2
  exit 1
fi
TOKEN="$(tr -d '[:space:]' < "$TOKEN_FILE")"

run_sql_file() {
  local file="$1" label="$2"
  echo "→ $label ($(wc -l < "$file" | tr -d ' ') lines)"
  # Send the file as a JSON string without ever interpolating it into the shell.
  python3 -c 'import json,sys; print(json.dumps({"query": open(sys.argv[1], encoding="utf-8").read()}))' "$file" \
    | curl -sS -X POST "$API" \
        -H "Authorization: Bearer ${TOKEN}" \
        -H "Content-Type: application/json" \
        --data-binary @- \
    | python3 -c '
import json,sys
raw = sys.stdin.read()
try:
    data = json.loads(raw)
except Exception:
    print("  unexpected response:", raw[:400]); sys.exit(1)
if isinstance(data, dict) and data.get("message"):
    print("  ERROR:", data["message"][:600]); sys.exit(1)
print("  ok")
'
}

query() {
  python3 -c 'import json,sys; print(json.dumps({"query": sys.argv[1]}))' "$1" \
    | curl -sS -X POST "$API" -H "Authorization: Bearer ${TOKEN}" \
        -H "Content-Type: application/json" --data-binary @-
}

case "${1:-all}" in
  schema) run_sql_file "$ROOT/supabase/migrations/0001_init.sql" "schema" ;;
  seed)   run_sql_file "$ROOT/supabase/seed.sql" "seed" ;;
  all)
    run_sql_file "$ROOT/supabase/migrations/0001_init.sql" "schema"
    run_sql_file "$ROOT/supabase/seed.sql" "seed"
    "$0" verify
    ;;
  verify)
    echo "→ row counts"
    query "select relname as table, n_live_tup as rows from pg_stat_user_tables where schemaname='public' order by relname" \
      | python3 -c '
import json,sys
rows = json.load(sys.stdin)
if isinstance(rows, dict): print("  ERROR:", rows.get("message","?")[:400]); sys.exit(1)
total = 0
for r in rows:
    total += r["rows"]
    print(f"  {r[\"table\"]:32} {r[\"rows\"]:>5}")
print(f"  {\"TOTAL\":32} {total:>5}")
'
    ;;
  *) echo "usage: $0 [schema|seed|all|verify]" >&2; exit 2 ;;
esac
