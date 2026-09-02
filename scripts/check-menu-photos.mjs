#!/usr/bin/env node
// Verifies every photo path the menu pop-up (`menuPopup` in lib/content.ts)
// references actually exists under public/, plus the printed-menu link
// target. Read-only, no dependencies: parses lib/content.ts as text rather
// than executing TypeScript, so it needs nothing beyond plain Node.
//
// Run with: node scripts/check-menu-photos.mjs

import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const PUB = path.join(ROOT, "public");
const CONTENT_FILE = path.join(ROOT, "lib", "content.ts");

const source = readFileSync(CONTENT_FILE, "utf8");

// Scope the scan to the menuPopup block only, so a photo path used elsewhere
// in the file (hero, best sellers not referenced from the menu, etc.) can't
// produce a false pass/fail for this check.
const start = source.indexOf("export const menuPopup = {");
const end = source.indexOf("export function menuStructuredData(");
if (start === -1 || end === -1 || end < start) {
  console.error("ERROR: could not locate the menuPopup block in lib/content.ts");
  process.exit(1);
}
const block = source.slice(start, end);

const paths = new Set();

for (const m of block.matchAll(/src:\s*"([^"]+)"/g)) paths.add(m[1]);
const printedMenu = block.match(/printedMenuHref:\s*"([^"]+)"/);
if (printedMenu) paths.add(printedMenu[1]);

if (paths.size === 0) {
  console.error("ERROR: no photo paths found in the menuPopup block, check the scan markers above");
  process.exit(1);
}

let missing = 0;
const sorted = [...paths].sort();
for (const p of sorted) {
  const abs = path.join(PUB, p);
  const ok = existsSync(abs);
  console.log(`${ok ? "OK  " : "MISS"}  ${p}`);
  if (!ok) missing++;
}

console.log(`\n${sorted.length} paths checked, ${missing} missing.`);
process.exit(missing === 0 ? 0 : 1);
