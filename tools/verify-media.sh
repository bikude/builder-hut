#!/usr/bin/env bash
#
# Check that a deployment is actually serving its media.
#
# Videos rendering as black rectangles almost always mean one of three things, and this
# tells you which in about five seconds:
#
#   200 + video/mp4   → the file is fine; the problem is playback (autoplay policy,
#                       codec, or the element's attributes), not delivery.
#   404               → the file is not in the deployment. Usually `public/media/` was
#                       never committed, or was caught by a .gitignore rule.
#   200 + text/html   → the host is returning the SPA shell instead of the file, so a
#                       rewrite rule is swallowing the request.
#
# Usage:  ./tools/verify-media.sh https://your-site.vercel.app

set -uo pipefail

BASE="${1:-}"
if [[ -z "$BASE" ]]; then
  echo "Usage: $0 https://your-site.example" >&2
  exit 1
fi
BASE="${BASE%/}"

PATHS=(
  # If the logos load but these do not, delivery is fine and playback is the problem.
  "/media/brand/logo-batanagar.png"
  "/media/branches/batanagar/hero-walkthrough.mp4"
  "/media/branches/batanagar/hero-walkthrough.jpg"
  "/media/branches/chandannagar-club/hero-rig.mp4"
  "/media/branches/budge-budge-3-0/reel-bench.mp4"
  "/media/shared/location-zoom.mp4"
  "/media/branches/batanagar/floor-wide.jpg"
)

printf '%-58s %-6s %-26s %s\n' "PATH" "STATUS" "CONTENT-TYPE" "SIZE"
printf '%s\n' "--------------------------------------------------------------------------------------------------"

fail=0
for path in "${PATHS[@]}"; do
  headers=$(curl -sS -o /dev/null -D - -L --max-time 20 "${BASE}${path}" 2>/dev/null)
  status=$(printf '%s' "$headers" | awk 'BEGIN{IGNORECASE=1} /^HTTP\//{code=$2} END{print code}')
  ctype=$(printf '%s' "$headers" | awk 'BEGIN{IGNORECASE=1} /^content-type:/{sub(/^[^:]*: */,""); gsub(/\r/,""); v=$0} END{print v}')
  size=$(printf '%s' "$headers" | awk 'BEGIN{IGNORECASE=1} /^content-length:/{sub(/^[^:]*: */,""); gsub(/\r/,""); v=$0} END{print v}')

  [[ -z "$status" ]] && status="---"
  [[ -z "$ctype"  ]] && ctype="(none)"
  if [[ -n "$size" ]]; then
    human=$(awk -v b="$size" 'BEGIN{printf "%.1f KB", b/1024}')
  else
    human="(unknown)"
  fi

  printf '%-58s %-6s %-26s %s\n' "$path" "$status" "$ctype" "$human"
  [[ "$status" != "200" ]] && fail=1
  case "$path:$ctype" in
    *.mp4:*text/html*) fail=1 ;;
  esac
done

echo
if [[ "$fail" -eq 0 ]]; then
  echo "All assets served. If videos still do not play, the cause is playback rather than"
  echo "delivery — check autoplay policy (iOS Low Power Mode blocks it outright) and that"
  echo "the element carries muted + playsInline + autoPlay together."
else
  echo "Something is not being served. A 404 on the .mp4 files while the .png loads means"
  echo "the videos are missing from the deployment: confirm public/media/ is committed"
  echo "(git ls-files public/media | wc -l) and that nothing in .gitignore excludes it."
fi
