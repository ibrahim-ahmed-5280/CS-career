import { Router } from "express";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import { Department, Track, Question, Student, Attempt } from "../models/index.js";
import { scoreTracks, scoreLevel } from "../lib/scoring.js";
import { pick, hasLang, langOf, LANGS } from "../lib/i18n.js";

export const publicRouter = Router();

const summary = (t, lang) => {
  const c = pick(t.content, lang) || {};
  return {
    slug: t.slug, name: c.name, line: c.line, day: c.day, aiDoes: c.aiDoes, humansOwn: c.humansOwn,
    careers: c.careers, hasPage: Boolean(c.page), lastReviewedAt: t.lastReviewedAt
  };
};

const published = (dept) => Track.find({ dept, status: "published" }).sort("order");

/* Tracks of every department (for menus and cards) */
publicRouter.get("/departments", async (req, res) => {
  const lang = langOf(req);
  const tracks = await Track.find({ status: "published" }).sort("dept order");
  const out = {};
  tracks.forEach((t) => { (out[t.dept] ||= []).push({ slug: t.slug, name: pick(t.content, lang)?.name }); });
  res.json(out);
});

publicRouter.get("/departments/:id", async (req, res) => {
  const lang = langOf(req);
  const dept = await Department.findById(req.params.id);
  if (!dept) return res.status(404).json({ error: "Department not found" });
  const tracks = await published(dept._id);
  res.json({
    id: dept._id,
    tracks: tracks.map((t) => summary(t, lang)),
    translated: tracks.every((t) => hasLang(t.content, lang))
  });
});

publicRouter.get("/departments/:id/tracks/:slug", async (req, res) => {
  const lang = langOf(req);
  const t = await Track.findOne({ dept: req.params.id, slug: req.params.slug, status: "published" });
  if (!t) return res.status(404).json({ error: "Track not found" });
  const others = await published(t.dept);
  res.json({
    ...summary(t, lang),
    dept: t.dept,
    page: pick(t.content, lang)?.page || null,
    translated: hasLang(t.content, lang),
    others: others.map((o) => ({ slug: o.slug, name: pick(o.content, lang)?.name }))
  });
});

publicRouter.get("/departments/:id/quiz", async (req, res) => {
  const lang = langOf(req);
  const dept = await Department.findById(req.params.id);
  if (!dept) return res.status(404).json({ error: "Department not found" });
  const questions = await Question.find({ dept: dept._id, active: true }).sort("order");
  res.json({
    quizVersion: dept.quizVersion,
    questions: questions.map((q) => ({ id: q._id, text: pick(q.text, lang) })),
    levelSkills: pick(dept.levelSkills, lang) || [],
    translated: questions.every((q) => hasLang(q.text, lang))
  });
});

/* Many students share one university Wi-Fi address, so the limit is generous. */
const attemptLimit = rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: "draft-8", legacyHeaders: false });

const attemptBody = z.object({
  dept: z.string().min(1).max(10),
  lang: z.enum(LANGS).default("en"),
  durationMs: z.number().int().min(0).max(24 * 3600 * 1000).optional(),
  student: z.object({
    studentId: z.string().trim().min(2).max(40),
    name: z.string().trim().min(2).max(100),
    phone: z.string().trim().max(30).optional().or(z.literal("")),
    email: z.string().trim().email().max(120).optional().or(z.literal("")),
    className: z.string().trim().max(60).optional().or(z.literal("")),
    consent: z.literal(true)
  }),
  answers: z.array(z.object({ question: z.string().regex(/^[a-f0-9]{24}$/), value: z.number().int().min(1).max(5) })).min(1).max(60),
  level: z.object({
    year: z.number().int().min(0).max(3),
    built: z.number().int().min(0).max(3),
    skills: z.array(z.number().int().min(0).max(20)).max(20)
  })
});

publicRouter.post("/attempts", attemptLimit, async (req, res) => {
  const parsed = attemptBody.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid answers", issues: parsed.error.issues });
  const b = parsed.data;

  const dept = await Department.findById(b.dept);
  if (!dept) return res.status(404).json({ error: "Department not found" });
  const questions = await Question.find({ dept: dept._id, active: true }).sort("order");
  const byId = new Map(b.answers.map((a) => [a.question, a.value]));
  if (questions.length !== b.answers.length || questions.some((q) => !byId.has(String(q._id)))) {
    return res.status(409).json({ error: "The quiz has changed. Please reload the page and try again." });
  }
  const values = questions.map((q) => byId.get(String(q._id)));
  const tracks = await published(dept._id);
  const result = scoreTracks(questions, values, tracks.map((t) => t.slug));
  const skillCount = (pick(dept.levelSkills, "en") || []).length;
  const level = scoreLevel({ ...b.level, skills: [...new Set(b.level.skills)].filter((i) => i < skillCount) });

  const s = b.student;
  const student = await Student.findOneAndUpdate(
    { studentId: s.studentId },
    { name: s.name, phone: s.phone || undefined, email: s.email || undefined, className: s.className || undefined, lang: b.lang, consentAt: new Date() },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  const attempt = await Attempt.create({
    student: student._id, dept: dept._id, quizVersion: dept.quizVersion, lang: b.lang, durationMs: b.durationMs,
    answers: questions.map((q, i) => ({ question: q._id, value: values[i] })),
    level, ...result
  });

  const names = new Map(tracks.map((t) => [t.slug, pick(t.content, b.lang)?.name]));
  const texts = new Map(questions.map((q) => [String(q._id), pick(q.text, b.lang)]));
  res.status(201).json({
    id: attempt._id,
    percents: result.percents.map((p) => ({ ...p, name: names.get(p.track) })),
    top: result.top,
    flat: result.flat,
    reasons: result.reasons.map((id) => texts.get(String(id))),
    level: level.name
  });
});
