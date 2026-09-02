#!/usr/bin/env bash
# Set this repo's git identity to Kazim (K13). Run once per new repo.
set -e
git config user.name "K13"
git config user.email "223161079+k13-projects@users.noreply.github.com"
echo "git identity set: $(git config user.name) <$(git config user.email)>"
echo "(Kazim / K13 / Kazimiro — Kazim Anil Korkmaz)"
