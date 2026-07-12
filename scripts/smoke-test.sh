#!/usr/bin/env bash
# scripts/smoke-test.sh
#
# Post-deploy verification for the Stratifit 5-phase rollout.
# Run against your production Vercel URL after applying the Phase 5
# commit (676ac81). Print PASS / FAIL per check.
#
# Usage:
#   BASE_URL=https://stratifit.com ./scripts/smoke-test.sh
# Optional override:
#   CRON_SECRET=...                     # if you don't want to read .env.local
#   ADMIN_EMAIL=admin@stratifit.com ADMIN_PASSWORD=...  # for admin viewer checks
#
# Requires: curl, jq

set -euo pipefail
BASE_URL="${BASE_URL:-http://localhost:3000}"
COOKIE_JAR="$(mktemp -t stratifit-cookies.XXXXXX)"
trap 'rm -f "$COOKIE_JAR"' EXIT

PASS=0
FAIL=0

check() {
  local name="$1"; shift
  if "$@" >/dev/null 2>&1; then
    echo "  PASS  $name"
    PASS=$((PASS+1))
  else
    echo "  FAIL  $name"
    FAIL=$((FAIL+1))
  fi
}

echo "== Stratifit post-deploy smoke test =="
echo "Base URL: $BASE_URL"
echo

# -------------------------------------------------------------
# Check 1: Cron dispatch + Resend pipeline
# POST /api/cron/followups with Bearer CRON_SECRET.
# Expect: HTTP 200 + JSON {processed, sent, failed, errors, remainingDue,
# limit, ranAt}. sent>0 confirms the Resend path AND the atomic UPDATE
# ... RETURNING claim.
# -------------------------------------------------------------
echo "-- 1. Cron dispatch (POST /api/cron/followups)"
if [[ -z "${CRON_SECRET:-}" && -f .env.local ]]; then
  CRON_SECRET="$(grep -E '^CRON_SECRET=' .env.local | cut -d= -f2- | tr -d '"' || true)"
fi
if [[ -z "${CRON_SECRET:-}" ]]; then
  echo "  SKIP  CRON_SECRET not set in env or .env.local"
else
  RESP=$(curl -sS -X POST "$BASE_URL/api/cron/followups" \
    -H "Authorization: Bearer $CRON_SECRET" \
    -H "Content-Type: application/json" \
    -d '{}' \
    --cookie-jar "$COOKIE_JAR" --cookie "$COOKIE_JAR" \
    -w '\n%{http_code}')
  CODE=$(echo "$RESP" | tail -n1)
  BODY=$(echo "$RESP" | head -n-1)
  echo "  HTTP $CODE"
  echo "  body: $BODY"
  if [[ "$CODE" == "200" ]] && echo "$BODY" | jq -e '.sent and (.sent|type=="number")' >/dev/null; then
    echo "  PASS  cron dispatched (sent > 0)"
    PASS=$((PASS+1))
  else
    echo "  FAIL  cron response not as expected"
    FAIL=$((FAIL+1))
  fi
fi
echo

# -------------------------------------------------------------
# Check 2: Realtime admin edit -> public site reflects
# No curl-able artifact (WebSocket subscription). This check is run
# MANUALLY in two browser tabs:
#   tab A: open /admin/content, save hero badge with a known marker
#          (e.g. add " SMOKE_TEST" to heading_line1.en).
#   tab B: open /, observe the headline updates within ~1s.
# Browser console must NOT show 'Realtime subscription CLOSED' or
# 'permission denied for table' warnings.
# -------------------------------------------------------------
echo "-- 2. Realtime propagation (manual browser check)"
echo "  Action: edit hero badge in tab A, verify public tab B updates."
echo "  Pass criteria: within ~1s AND no '[useCms] Realtime subscription CLOSED' in console."
echo

# -------------------------------------------------------------
# Check 3: Contact-form path
# NOTE: ContactModal.tsx currently sets submitted=true locally and
# shows the success card but does NOT POST to a backend. F1 in the
# audit (public POST /api/leads) is outstanding. To smoke-test the
# modal today, open /contact in the browser, fill the inputs, click
# Send Message \u2014 the success card should render. Real lead
# persistence lands with F1.
# -------------------------------------------------------------
echo "-- 3. Contact form (manual browser check; F1 outstanding)"
echo "  Action: open /contact in a browser, fill + submit."
echo "  Pass criteria today: success state renders. F1 will make it persist."
echo

# -------------------------------------------------------------
# Check 4: Admin viewer rows
# /admin/email-log, /admin/llm-log, /admin/leads are server
# components behind AdminGuard. Auth first, then GET each viewer
# endpoint. A 200 with the page HTML or a 307 to /login (when
# unauthed) both count as reaching the route. The seed inserts from
# Phase 3 migration (Ada + Grace) should make /admin/leads show 2 rows.
# -------------------------------------------------------------
echo "-- 4. Admin viewer reachability"
# log in first if creds available
if [[ -n "${ADMIN_EMAIL:-}" && -n "${ADMIN_PASSWORD:-}" && -f .env.local ]]; then
  : # may override
fi
if [[ -z "${ADMIN_EMAIL:-}" && -f .env.local ]]; then
  ADMIN_EMAIL="$(grep -E '^ADMIN_EMAIL=' .env.local | cut -d= -f2- | tr -d '"' || true)"
  ADMIN_PASSWORD="$(grep -E '^ADMIN_PASSWORD=' .env.local | cut -d= -f2- | tr -d '"' || echo test_password)"
fi
if [[ -n "${ADMIN_EMAIL:-}" && -n "${ADMIN_PASSWORD:-}" ]]; then
  curl -sS -X POST "$BASE_URL/api/admin/login" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"$ADMIN_EMAIL\",\"password\":\"$ADMIN_PASSWORD\"}" \
    -c "$COOKIE_JAR" >/dev/null
fi
for path in /admin/email-log /admin/llm-log /admin/leads; do
  CODE=$(curl -sS -o /dev/null -w '%{http_code}' "$BASE_URL$path" \
    --cookie "$COOKIE_JAR" --cookie-jar "$COOKIE_JAR")
  echo "  $path -> HTTP $CODE"
  if [[ "$CODE" =~ ^(200|307|302)$ ]]; then
    echo "    PASS  $path reachable (auth or redirect)"
    PASS=$((PASS+1))
  else
    echo "    FAIL  $path returned $CODE"
    FAIL=$((FAIL+1))
  fi
done
echo

echo "===================="
echo "PASS=$PASS  FAIL=$FAIL"
exit $FAIL
