#!/usr/bin/env bash
#
# Decide whether a Dependabot pull request may merge itself.
#
# Reads Dependabot's own commit message on stdin, prints "true" or "false" on
# stdout, and explains itself on stderr.
#
# Dependabot normally records what it changed in a trailer:
#
#     - dependency-name: eslint
#       dependency-version: 10.10.0
#       update-type: version-update:semver-minor
#
# but it omits `update-type` for indirect (transitive) dependencies, which is
# most of what security updates bump. Treating that as "unclassifiable" left
# every transitive bump waiting for a human. The subject still carries both
# versions ("bump tar from 7.5.19 to 7.5.22"), so fall back to comparing them.
#
# Either way, a major bump — or anything that cannot be read at all — holds the
# whole pull request for a human.
set -euo pipefail

message="$(cat)"

decline() {
  printf '%s\n' "$1" >&2
  echo "false"
  exit 0
}

# --- Preferred: Dependabot's own classification -----------------------------

types="$(printf '%s\n' "$message" | grep -o 'version-update:semver-[a-z]*' || true)"

if [ -n "$types" ]; then
  echo "update-type trailers:" >&2
  printf '  %s\n' $types >&2

  if printf '%s\n' "$types" | grep -qv -e 'semver-patch$' -e 'semver-minor$'; then
    decline "Major update — holding for review."
  fi

  echo "All patch or minor." >&2
  echo "true"
  exit 0
fi

# --- Fallback: read the versions out of the message ------------------------

names="$(printf '%s\n' "$message" | grep -c '^- dependency-name:' || true)"
if [ "$names" -eq 0 ]; then
  decline "No updated-dependencies trailer — not a Dependabot update this understands."
fi

pairs="$(printf '%s\n' "$message" \
  | grep -oE 'from [0-9][^[:space:]]* to [0-9][^[:space:]]*' \
  | sed 's/[.,;]$//' \
  | sort -u || true)"

if [ -z "$pairs" ]; then
  decline "No update-type trailer and no readable from/to versions — holding for review."
fi

echo "No update-type trailer (indirect dependency); comparing versions:" >&2

safe=true
while read -r _from_kw from _to_kw to; do
  [ -n "${from:-}" ] && [ -n "${to:-}" ] || continue

  from_major="${from%%.*}"
  to_major="${to%%.*}"

  if [ "$from_major" != "$to_major" ]; then
    echo "  $from -> $to: major bump" >&2
    safe=false
    continue
  fi

  # Below 1.0.0 the minor position is where breaking changes land.
  if [ "$from_major" = "0" ]; then
    from_minor="$(printf '%s' "$from" | cut -d. -f2)"
    to_minor="$(printf '%s' "$to" | cut -d. -f2)"
    if [ "$from_minor" != "$to_minor" ]; then
      echo "  $from -> $to: 0.x minor bump, treated as breaking" >&2
      safe=false
      continue
    fi
  fi

  echo "  $from -> $to: compatible" >&2
done <<< "$pairs"

if [ "$safe" = true ]; then
  echo "true"
else
  decline "Holding for review."
fi
