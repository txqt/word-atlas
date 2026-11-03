import { execSync } from "node:child_process";
import fs from "node:fs";

const conflicted = execSync("git diff --name-only --diff-filter=U -- public/atlas/entries", { encoding: "utf8" })
  .split("\n")
  .filter(Boolean);

let merged = 0;
let pronEntries = 0;
for (const path of conflicted) {
  const ours = JSON.parse(execSync(`git show :2:${path}`, { encoding: "utf8", maxBuffer: 1 << 28 }));
  const theirs = JSON.parse(execSync(`git show :3:${path}`, { encoding: "utf8", maxBuffer: 1 << 28 }));
  const byId = new Map(ours.map((e) => [e.id, e]));
  if (ours.length !== theirs.length) throw new Error(`length mismatch ${path}: ${ours.length} vs ${theirs.length}`);
  for (const e of theirs) {
    const mine = byId.get(e.id);
    if (!mine) throw new Error(`id missing in ours ${path}: ${e.id}`);
    e.senses = e.senses.map((s, i) => ({ ...s, ...(mine.senses[i] ?? {}) }));
    if (mine.ety !== undefined) e.ety = mine.ety;
    if (mine.root !== undefined) e.root = mine.root;
    if (mine.syn) e.syn = mine.syn;
    if (e.pron) pronEntries += 1;
  }
  fs.writeFileSync(path, JSON.stringify(theirs));
  merged += 1;
}
console.log(`merged ${merged} files, ${pronEntries} entries with pron`);
