/* Load department content from docs/content/*-draft.md into MongoDB.
     npm run seed            add what is missing, keep anything edited in the admin
     npm run seed -- --force also overwrite the English track text and quiz questions */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import mongoose from "mongoose";
import { Department, Track, Question } from "../src/models/index.js";
import { parseDepartment } from "./content-parser.js";

const DEPTS = ["cs", "it", "se", "ds", "ai", "cy", "iot"];
const CONTENT = new URL("../../docs/content/", import.meta.url);

export async function seed({ force = false } = {}) {
  for (const [i, id] of DEPTS.entries()) {
    const { tracks, questions, levelSkills } = parseDepartment(readFileSync(new URL(`${id}-draft.md`, CONTENT), "utf8"));

    const dept = (await Department.findById(id)) || new Department({ _id: id });
    dept.order = i + 1;
    if (force || !dept.levelSkills.get("en")) dept.levelSkills.set("en", levelSkills);
    await dept.save();

    for (const t of tracks) {
      const doc = await Track.findOne({ dept: id, slug: t.slug });
      if (doc && !force) continue;
      const track = doc || new Track({ dept: id, slug: t.slug, lastReviewedAt: new Date("2026-10-28") });
      track.order = t.order;
      track.content.set("en", t.en);
      await track.save();
    }

    const existing = await Question.find({ dept: id }).sort("order");
    if (!existing.length) {
      await Question.insertMany(questions.map((q) => ({ dept: id, order: q.order, text: { en: q.en }, weights: q.weights })));
    } else if (force) {
      for (const q of questions) {
        await Question.updateOne({ dept: id, order: q.order }, { $set: { "text.en": q.en, weights: q.weights } }, { upsert: true });
      }
      await Department.updateOne({ _id: id }, { $inc: { quizVersion: 1 } });
    }
    console.log(`${id}: ${tracks.length} tracks, ${questions.length} questions, ${tracks.filter((t) => t.en.page).length} full page`);
  }
}

// Run directly: npm run seed
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const { connectDb } = await import("../src/db.js");
  await connectDb();
  await seed({ force: process.argv.includes("--force") });
  await mongoose.disconnect();
  process.exit(0);
}
