import { test } from "node:test";
import assert from "node:assert/strict";
import { scoreTracks, scoreLevel } from "../src/lib/scoring.js";

const q = (id, weights) => ({ _id: id, weights: new Map(Object.entries(weights)) });
const questions = [q("q1", { fe: 2, ux: 1 }), q("q2", { be: 2, ops: 1 }), q("q3", { be: 2, fe: 1 }), q("q4", { ux: 2 })];
const slugs = ["fe", "be", "ops", "ux"];

test("percent is score divided by the most a track can get", () => {
  const r = scoreTracks(questions, [1, 5, 5, 1], slugs);
  assert.deepEqual(r.percents.find((p) => p.track === "be"), { track: "be", pct: 100 });
  assert.deepEqual(r.percents.find((p) => p.track === "ops"), { track: "ops", pct: 100 });
  assert.equal(r.percents.find((p) => p.track === "fe").pct, 33);   // (0 + 1) / 3
  assert.equal(r.percents.find((p) => p.track === "ux").pct, 0);
});

test("third track is shown when within 5 points of the second", () => {
  const r = scoreTracks(questions, [5, 5, 5, 4], slugs);
  assert.equal(r.top.length, 3);
});

test("all answers in the middle is a flat result", () => {
  const r = scoreTracks(questions, [3, 3, 3, 3], slugs);
  assert.equal(r.flat, true);
});

test("reasons are the statements that added most to the best track", () => {
  const r = scoreTracks(questions, [1, 4, 5, 1], slugs);
  assert.equal(r.percents[0].track, "be");
  assert.deepEqual(r.reasons, ["q3", "q2"]);
});

test("starting level from year, built and skills", () => {
  assert.equal(scoreLevel({ year: 0, built: 1, skills: [0] }).name, "beginner");
  assert.equal(scoreLevel({ year: 2, built: 2, skills: [0, 1] }).name, "intermediate");
  assert.equal(scoreLevel({ year: 3, built: 3, skills: [0, 1, 2] }).name, "jobReady");
});
