#!/usr/bin/env bash
# Quick conventional commit:  scripts/save.sh "feat: add hero section"
set -e
msg="$*"
[ -z "$msg" ] && { echo 'usage: save.sh "feat: your message"'; exit 1; }
git add -A
git commit -m "$msg"
