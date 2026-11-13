import assert from "node:assert/strict";
import { test } from "node:test";
import { MEDIA, type Atlas, type WordRef } from "../atlas/types";
import { distractors, retuneSession } from "./session";
import { defaultSettings, type ActiveSession, type Progress, type Step } from "./store";
import type { CardState } from "./srs";

let n = 0;
const w = (word: string, zh: string): WordRef => ({ id: `w${n}`, word, zh, ipa: "", cefr: 2, topic: 0, media: 0, order: ++n });

// distractors() only reads atlas.words, so a minimal atlas is enough.
const atlasOf = (words: WordRef[]) => ({ words } as unknown as Atlas);

test("never offers a distractor that shares any meaning with the answer", () => {
  const spring = w("spring", "n. 春天；弹簧 | n. 泉水");
  const fountain = w("fountain", "n. 泉水"); // 泉水 is a *secondary* sense of spring
  const clean1 = w("summer", "n. 夏天");
  const clean2 = w("winter", "n. 冬天");
  const atlas = atlasOf([spring, fountain, clean1, clean2]);
  const options = distractors(atlas, spring, "meaning", 1);
  assert.ok(options.includes(spring.id), "the correct answer is always present");
  assert.ok(!options.includes(fountain.id), "a word meaning 泉水 must not be a distractor for spring");
});

test("never offers two distractors that share a meaning", () => {
  const spring = w("spring", "n. 春天");
  const car = w("car", "n. 小汽车；轿车");
  const automobile = w("automobile", "n. 轿车"); // shares 轿车 with car, different full gloss
  const book = w("book", "n. 书本");
  const atlas = atlasOf([spring, car, automobile, book]);
  const options = distractors(atlas, spring, "meaning", 1);
  assert.ok(!(options.includes(car.id) && options.includes(automobile.id)), "car and automobile share 轿车; only one may appear");
});

const word = (id: string, order: number): WordRef => ({ id, word: `w${id}`, zh: `词${id}`, ipa: "", cefr: 1, topic: 0, media: MEDIA.img, order });

const words = ["a", "b", "c", "d", "e"].map((id, i) => word(id, i));

const atlas: Atlas = {
  id: "t",
  name: "t",
  kind: "open",
  count: words.length,
  examples: 0,
  illustrated: words.length,
  topics: [],
  cefr: ["A1"],
  words,
  byId: new Map(words.map((w) => [w.id, w])),
  entry: async () => {
    throw new Error("not needed in this test");
  },
  peek: () => undefined,
  img: () => null,
  audio: () => null,
};

const card: CardState = { due: 1, s: 4, d: 5, el: 0, sd: 1, ls: 0, reps: 3, lapses: 0, st: 2, seen: 3 };

const progress: Progress = {
  version: 2,
  datasetId: "word-atlas-open",
  cards: { a: card, b: card, c: card, d: card, e: card },
  bookmarks: [],
  days: {},
  typing: [],
  session: null,
  mistakes: [],
};

const sess = (index: number, steps: Step[]): ActiveSession => ({ id: "s1", started: 0, steps, index, graded: {}, newIds: [], reviewIds: [] });

test("turning spell off replaces the spell questions that are still unanswered", () => {
  const before = sess(1, [
    { id: "a", kind: "spell" },
    { id: "b", kind: "spell" },
    { id: "c", kind: "meaning", options: ["c", "d", "e", "a"] },
    { id: "d", kind: "intro" },
  ]);
  const after = retuneSession(before, atlas, progress, { ...defaultSettings, spell: false });
  assert.notEqual(after, before);
  // The already-answered step keeps its kind so the summary stays accurate.
  assert.equal(after.steps[0].kind, "spell");
  // The pending spell question is replaced with a non-spell quiz with real options.
  assert.notEqual(after.steps[1].kind, "spell");
  const step = after.steps[1] as { options?: string[] };
  assert.equal(step.options?.length, 4);
  assert.ok(step.options?.includes("b"));
  // Other steps are untouched.
  assert.deepEqual(after.steps[2], before.steps[2]);
  assert.deepEqual(after.steps[3], before.steps[3]);
});

test("keeps the session identical when spell is on or no spell question is left", () => {
  const steps: Step[] = [
    { id: "a", kind: "spell" },
    { id: "b", kind: "meaning", options: ["b", "c", "d", "e"] },
  ];
  const started = sess(0, steps);
  const withSpell = retuneSession(started, atlas, progress, { ...defaultSettings, spell: true });
  assert.equal(withSpell, started);
  assert.equal(withSpell.steps[0].kind, "spell");
  const done = retuneSession(sess(2, steps), atlas, progress, { ...defaultSettings, spell: false });
  assert.equal(done.steps[0].kind, "spell");
});
