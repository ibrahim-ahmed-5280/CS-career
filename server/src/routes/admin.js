import { Router } from "express";
import rateLimit from "express-rate-limit";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { Admin, Department, Track, Question, Student, Attempt } from "../models/index.js";
import { setSession, clearSession, requireAdmin, requireEditor } from "../lib/auth.js";
import { pick, LANGS } from "../lib/i18n.js";

export const adminRouter = Router();

/* ---------- Session ---------- */
const loginLimit = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: "draft-8", legacyHeaders: false });
const loginBody = z.object({ email: z.string().trim().toLowerCase().email(), password: z.string().min(1).max(200) });

adminRouter.post("/login", loginLimit, async (req, res) => {
  const parsed = loginBody.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Enter your email and password" });
  const admin = await Admin.findOne({ email: parsed.data.email });
  const ok = admin && (await bcrypt.compare(parsed.data.password, admin.passwordHash));
  if (!ok) return res.status(401).json({ error: "Wrong email or password" });
  setSession(res, admin);
  res.json({ email: admin.email, name: admin.name, role: admin.role });
});

adminRouter.post("/logout", (req, res) => { clearSession(res); res.json({ ok: true }); });

adminRouter.use(requireAdmin);

adminRouter.get("/me", (req, res) => {
  const { email, name, role } = req.admin;
  res.json({ email, name, role });
});

/* ---------- Shared helpers ---------- */
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

function rangeFilter(q) {
  const f = {};
  if (q.dept) f.dept = String(q.dept);
  const from = q.from ? new Date(q.from) : null, to = q.to ? new Date(q.to) : null;
  if ((from && !isNaN(from)) || (to && !isNaN(to))) {
    f.createdAt = {};
    if (from && !isNaN(from)) f.createdAt.$gte = from;
    if (to && !isNaN(to)) f.createdAt.$lt = new Date(to.getTime() + 24 * 3600 * 1000);   // "to" day included
  }
  return f;
}

async function trackNames() {
  const tracks = await Track.find().sort("dept order");
  const names = {};
  tracks.forEach((t) => { names[`${t.dept}/${t.slug}`] = pick(t.content, "en")?.name || t.slug; });
  return { tracks, names };
}

/* Latest attempt of each student in each department, with the student joined. */
async function latestAttempts(query) {
  const rows = await Attempt.aggregate([
    { $match: rangeFilter(query) },
    { $sort: { createdAt: -1 } },
    { $group: { _id: { student: "$student", dept: "$dept" }, a: { $first: "$$ROOT" } } },
    { $replaceRoot: { newRoot: "$a" } },
    { $lookup: { from: "students", localField: "student", foreignField: "_id", as: "s" } },
    { $unwind: "$s" },
    ...(query.className ? [{ $match: { "s.className": String(query.className) } }] : [])
  ]);
  return rows;
}

/* ---------- Dashboard numbers ---------- */
adminRouter.get("/stats", async (req, res) => {
  const [latest, { tracks, names }, classes] = await Promise.all([
    latestAttempts(req.query), trackNames(), Student.distinct("className")
  ]);
  const match = rangeFilter(req.query);
  const studentIds = new Set(latest.map((a) => String(a.student)));
  const weekAgo = new Date(Date.now() - 7 * 24 * 3600 * 1000);
  const monthAgo = new Date(Date.now() - 30 * 24 * 3600 * 1000);

  const [attempts, lastWeek, daily] = await Promise.all([
    Attempt.countDocuments(match),
    Attempt.countDocuments({ ...match, createdAt: { ...(match.createdAt || {}), $gte: weekAgo } }),
    Attempt.aggregate([
      { $match: { ...(match.dept ? { dept: match.dept } : {}), createdAt: { $gte: monthAgo } } },
      { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ])
  ]);

  const byDept = {}, topTracks = {}, levels = { beginner: 0, intermediate: 0, jobReady: 0 }, langs = {};
  latest.forEach((a) => {
    byDept[a.dept] = (byDept[a.dept] || 0) + 1;
    const best = a.top?.[0];
    if (best) {
      const key = `${a.dept}/${best}`;
      topTracks[key] = (topTracks[key] || 0) + 1;
    }
    if (a.level?.name) levels[a.level.name]++;
    langs[a.lang] = (langs[a.lang] || 0) + 1;
  });

  // Every track of the shown departments, so tracks nobody picked show 0
  const shown = req.query.dept ? [String(req.query.dept)] : Object.keys(byDept);
  const tracksOut = tracks
    .filter((t) => shown.includes(t.dept))
    .map((t) => {
      const key = `${t.dept}/${t.slug}`;
      return { dept: t.dept, slug: t.slug, name: names[key], count: topTracks[key] || 0 };
    })
    .sort((a, b) => b.count - a.count);

  res.json({
    totals: { students: studentIds.size, attempts, lastWeek },
    byDept, tracks: tracksOut, levels, langs,
    daily: daily.map((d) => ({ day: d._id, count: d.count })),
    classes: classes.filter(Boolean).sort()
  });
});

/* ---------- Students ---------- */
const PAGE = 25;

adminRouter.get("/students", async (req, res) => {
  const filter = {};
  const q = String(req.query.q || "").trim().slice(0, 60);
  if (q) filter.$or = [{ name: new RegExp(escapeRe(q), "i") }, { studentId: new RegExp(escapeRe(q), "i") }, { phone: new RegExp(escapeRe(q), "i") }];
  if (req.query.className) filter.className = String(req.query.className);
  if (req.query.dept) filter._id = { $in: await Attempt.distinct("student", { dept: String(req.query.dept) }) };
  const page = Math.max(1, Number(req.query.page) || 1);

  const [total, students, { names }] = await Promise.all([
    Student.countDocuments(filter),
    Student.find(filter).sort({ updatedAt: -1 }).skip((page - 1) * PAGE).limit(PAGE).lean(),
    trackNames()
  ]);
  const attempts = await Attempt.find({ student: { $in: students.map((s) => s._id) }, ...(req.query.dept ? { dept: String(req.query.dept) } : {}) })
    .sort({ createdAt: -1 }).select("student dept top percents level createdAt").lean();

  res.json({
    total, page, pages: Math.max(1, Math.ceil(total / PAGE)),
    items: students.map((s) => {
      const mine = attempts.filter((a) => String(a.student) === String(s._id));
      const last = mine[0];
      return {
        id: s._id, studentId: s.studentId, name: s.name, phone: s.phone, className: s.className,
        attempts: mine.length,
        last: last && {
          dept: last.dept, track: names[`${last.dept}/${last.top[0]}`], pct: last.percents[0]?.pct,
          level: last.level?.name, at: last.createdAt
        }
      };
    })
  });
});

adminRouter.get("/students/:id", async (req, res) => {
  if (!/^[a-f0-9]{24}$/.test(req.params.id)) return res.status(404).json({ error: "Student not found" });
  const student = await Student.findById(req.params.id).lean();
  if (!student) return res.status(404).json({ error: "Student not found" });
  const [attempts, { names }] = await Promise.all([
    Attempt.find({ student: student._id }).sort({ createdAt: -1 }).populate("answers.question", "text order").lean(),
    trackNames()
  ]);
  res.json({
    student,
    attempts: attempts.map((a) => ({
      id: a._id, dept: a.dept, at: a.createdAt, lang: a.lang, durationMs: a.durationMs, flat: a.flat, level: a.level,
      percents: a.percents.map((p) => ({ ...p, name: names[`${a.dept}/${p.track}`] })),
      top: a.top,
      answers: a.answers.map((x) => ({ text: x.question ? pick(x.question.text, "en") : "(removed question)", value: x.value }))
    }))
  });
});

/* CSV of every attempt in the filter, for the faculty. */
adminRouter.get("/export.csv", async (req, res) => {
  const [attempts, { names }] = await Promise.all([
    Attempt.find(rangeFilter(req.query)).sort({ createdAt: -1 }).populate("student").lean(),
    trackNames()
  ]);
  const cell = (v) => {
    let s = v == null ? "" : String(v);
    if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;          // stop spreadsheet formulas
    return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const head = ["Date", "Student ID", "Name", "Phone", "Email", "Class", "Department", "Best track", "Best %", "Second track", "Second %", "Level", "Language"];
  const rows = attempts
    .filter((a) => a.student && (!req.query.className || a.student.className === req.query.className))
    .map((a) => {
      const [p1, p2] = a.percents;
      return [a.createdAt.toISOString().slice(0, 16).replace("T", " "), a.student.studentId, a.student.name, a.student.phone, a.student.email,
        a.student.className, a.dept.toUpperCase(), p1 && names[`${a.dept}/${p1.track}`], p1?.pct, p2 && names[`${a.dept}/${p2.track}`], p2?.pct,
        a.level?.name, a.lang];
    });
  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", `attachment; filename="cscareer-attempts-${new Date().toISOString().slice(0, 10)}.csv"`);
  res.send("﻿" + [head, ...rows].map((r) => r.map(cell).join(",")).join("\r\n"));
});

/* ---------- Content: tracks ---------- */
adminRouter.get("/tracks", async (req, res) => {
  const tracks = await Track.find(req.query.dept ? { dept: String(req.query.dept) } : {}).sort("dept order").lean();
  res.json(tracks);
});

const line = z.string().trim().max(2000);
const item = z.object({ label: line, text: line });
const step = z.object({ title: line, text: line.optional().default("") });
const pageSchema = z.object({
  what: line, day: line,
  ai: z.array(item).max(10),
  roadmap: z.object({ beginner: z.array(step).max(12), intermediate: z.array(step).max(12), jobReady: z.array(step).max(12) }),
  projects: z.array(item).max(6),
  resources: z.array(z.object({
    name: z.string().trim().min(1).max(200),
    url: z.string().trim().url().regex(/^https?:\/\//).optional().or(z.literal("")),
    desc: line.optional().default(""),
    kind: z.enum(["course", "practice", "docs", "video", "cert", "tool", "book", "data"]),
    free: z.boolean()
  })).max(30),
  certifications: line,
  careers: z.array(item).max(6),
  related: z.array(z.string().trim().max(120)).max(8)
});
const contentSchema = z.object({
  name: z.string().trim().min(1).max(120),
  line: line, day: line, aiDoes: line, humansOwn: line,
  careers: line,
  page: pageSchema.nullable().optional()
});
const trackBody = z.object({
  status: z.enum(["draft", "published"]).optional(),
  lang: z.enum(LANGS).optional(),
  content: contentSchema.optional(),
  reviewed: z.boolean().optional()
});

adminRouter.put("/tracks/:id", requireEditor, async (req, res) => {
  const parsed = trackBody.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Please check the fields", issues: parsed.error.issues });
  const b = parsed.data;
  const track = await Track.findById(req.params.id).catch(() => null);
  if (!track) return res.status(404).json({ error: "Track not found" });
  if (b.status) track.status = b.status;
  if (b.content) {
    const lang = b.lang || "en";
    const prev = track.content.get(lang) || {};
    track.content.set(lang, { ...b.content, page: b.content.page === undefined ? prev.page : b.content.page });
  }
  if (b.reviewed) track.lastReviewedAt = new Date();
  await track.save();
  res.json(track);
});

/* ---------- Content: quiz questions ---------- */
adminRouter.get("/questions", async (req, res) => {
  const dept = String(req.query.dept || "");
  const [questions, tracks, department] = await Promise.all([
    Question.find({ dept }).sort("order").lean(),
    Track.find({ dept }).sort("order").lean(),
    Department.findById(dept).lean()
  ]);
  res.json({
    quizVersion: department?.quizVersion,
    tracks: tracks.map((t) => ({ slug: t.slug, name: t.content.en?.name })),
    questions
  });
});

const questionBody = z.object({
  text: z.object({ en: z.string().trim().min(3).max(300), so: z.string().trim().max(300).optional(), ar: z.string().trim().max(300).optional() }),
  weights: z.record(z.string(), z.number().int().min(0).max(3)),
  active: z.boolean().default(true)
});

/* Changing the quiz bumps quizVersion, so old attempts stay comparable by version. */
async function saveQuestion(q, body, res) {
  const parsed = questionBody.safeParse(body);
  if (!parsed.success) return res.status(400).json({ error: "Please check the question", issues: parsed.error.issues });
  const slugs = new Set((await Track.find({ dept: q.dept }).select("slug")).map((t) => t.slug));
  const weights = Object.fromEntries(Object.entries(parsed.data.weights).filter(([k, v]) => slugs.has(k) && v > 0));
  if (!Object.keys(weights).length) return res.status(400).json({ error: "Give the statement weight for at least one track" });
  const text = Object.fromEntries(Object.entries(parsed.data.text).filter(([, v]) => v));
  q.set({ text, weights, active: parsed.data.active });
  await q.save();
  await Department.updateOne({ _id: q.dept }, { $inc: { quizVersion: 1 } });
  res.json(q);
}

adminRouter.put("/questions/:id", requireEditor, async (req, res) => {
  const q = await Question.findById(req.params.id).catch(() => null);
  if (!q) return res.status(404).json({ error: "Question not found" });
  await saveQuestion(q, req.body, res);
});

adminRouter.post("/questions", requireEditor, async (req, res) => {
  const dept = await Department.findById(String(req.body?.dept || ""));
  if (!dept) return res.status(404).json({ error: "Department not found" });
  const last = await Question.findOne({ dept: dept._id }).sort("-order");
  await saveQuestion(new Question({ dept: dept._id, order: (last?.order || 0) + 1 }), req.body, res);
});
