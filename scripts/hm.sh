#!/usr/bin/env bash
# The Hail Mary — branch + commit (session record) + push.
# Variants:  --here (hm-1, skip new branch)   --ship (hm++: PR + merge)
# Usage: scripts/hm.sh [--here] [--ship] [--prefix <shortcode>] <commit-message-file>
# The agent writes the Hail Mary grouped-bullet message to a file, then calls this.
set -e
here=0; ship=0; prefix=""; msgfile=""
while [ $# -gt 0 ]; do case "$1" in
  --here) here=1; shift;;
  --ship) ship=1; shift;;
  --prefix) prefix="$2"; shift 2;;
  *) msgfile="$1"; shift;;
esac; done
if [ -z "$msgfile" ] || [ ! -f "$msgfile" ]; then
  echo "usage: hm.sh [--here] [--ship] [--prefix X] <commit-message-file>"; exit 1; fi
dir="$(cd "$(dirname "$0")" && pwd)"
[ "$here" -eq 0 ] && bash "$dir/new-branch.sh" ${prefix:+"$prefix"}
git add -A
git commit -F "$msgfile"
git push -u origin HEAD
echo "→ pushed $(git rev-parse --abbrev-ref HEAD)"
if [ "$ship" -eq 1 ]; then
  if command -v gh >/dev/null; then
    gh pr create --fill
    num=$(gh pr view --json number -q .number)
    gh pr merge "$num" --merge   # real merge; no squash/rebase, no --delete-branch
  else echo "hm++ needs GitHub CLI (gh) for PR + merge."; fi
fi
