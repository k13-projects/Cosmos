#!/usr/bin/env bash
# Push the current branch and open a PR (needs GitHub CLI: gh)
set -e
br=$(git rev-parse --abbrev-ref HEAD)
git push -u origin "$br"
if command -v gh >/dev/null; then gh pr create --fill; else echo "Pushed $br. Install gh to auto-open a PR."; fi
