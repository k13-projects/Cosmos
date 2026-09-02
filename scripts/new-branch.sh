#!/usr/bin/env bash
# Create the next K13-style iteration branch: <shortcode>_<monDD>_v<N>
set -e
prefix="${1:-${K13_PREFIX:-$(basename "$(git rev-parse --show-toplevel)" | tr '[:upper:]' '[:lower:]' | cut -c1-5)}}"
day=$(date +%b%d | tr '[:upper:]' '[:lower:]')          # e.g. jun07
base="${prefix}_${day}_v"
n=$(git branch --list "${base}*" | sed -E "s#.*${base}##" | sort -n | tail -1)
next=$(( ${n:-0} + 1 ))
git checkout -b "${base}${next}"
echo "→ on ${base}${next}"
