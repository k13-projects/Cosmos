#!/usr/bin/env bash
# Quick audit of the P5 "done" checklist in the current project.
chk(){ if eval "$2" >/dev/null 2>&1; then echo "  [x] $1"; else echo "  [ ] $1"; fi; }
echo "P5 polish check:"
chk "favicon"            "ls public/favicon* public/icon* 2>/dev/null | grep -q ."
chk "OG / social image"  "grep -riq 'og:image' . --include=*.{html,tsx,ts,jsx,js} 2>/dev/null"
chk "sitemap"            "find . -iname 'sitemap*' -not -path '*/node_modules/*' | grep -q ."
chk "robots.txt"         "find . -iname 'robots.txt' -not -path '*/node_modules/*' | grep -q ."
chk "reduced-motion"     "grep -rq 'prefers-reduced-motion' . --include=*.{css,scss,tsx,ts,js} 2>/dev/null"
chk "404 / error page"   "find . -iname '404*' -o -iname 'not-found*' -o -iname 'error*' 2>/dev/null | grep -vq node_modules"
