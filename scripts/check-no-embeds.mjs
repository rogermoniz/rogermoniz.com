/**
 * Fails the build if any HTML embed sneaks back in. The site this replaced was
 * built entirely out of injected HTML strings; this guard is what keeps the
 * rebuild honest.
 */
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

const FORBIDDEN = [
  { pattern: /dangerouslySetInnerHTML/, label: "dangerouslySetInnerHTML" },
  { pattern: /\.innerHTML\s*=/, label: "innerHTML assignment" },
  { pattern: /<iframe\b/i, label: "<iframe>" },
  { pattern: /document\.write\s*\(/, label: "document.write" },
  { pattern: /insertAdjacentHTML/, label: "insertAdjacentHTML" },
];

const ROOTS = ["app", "components", "lib"];
const failures = [];

async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      await walk(path);
      continue;
    }
    if (!/\.(tsx?|css)$/.test(entry.name)) continue;
    const source = await readFile(path, "utf8");
    source.split("\n").forEach((line, index) => {
      for (const { pattern, label } of FORBIDDEN) {
        if (pattern.test(line)) {
          failures.push(`${path}:${index + 1}  ${label}`);
        }
      }
    });
  }
}

await Promise.all(ROOTS.map(walk));

if (failures.length > 0) {
  console.error("HTML embeds are not allowed in this codebase:\n" + failures.join("\n"));
  process.exit(1);
}

console.log("No HTML embeds found. Every page is real React.");
