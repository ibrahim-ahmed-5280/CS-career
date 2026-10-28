import mongoose from "mongoose";

const { Schema, model } = mongoose;

/* Text in several languages: { en, so, ar }. English is the fallback. */
const I18n = { type: Map, of: Schema.Types.Mixed, default: {} };

/* ---------- Department: level-question options and quiz version ---------- */
const departmentSchema = new Schema({
  _id: { type: String },                 // cs, it, se, ds, ai, cy, iot
  order: Number,
  levelSkills: I18n,                     // { en: ["Use Git and GitHub", ...] }
  quizVersion: { type: Number, default: 1 }
}, { timestamps: true });

/* ---------- Track: one specialisation inside a department ----------
   content[lang] = { name, line, day, aiDoes, humansOwn, careers, page? }
   page = { what, day, ai[], roadmap{beginner,intermediate,jobReady}, projects[], resources[], certifications, careers[], related[] } */
const trackSchema = new Schema({
  dept: { type: String, required: true, index: true },
  slug: { type: String, required: true },
  order: Number,
  status: { type: String, enum: ["draft", "published"], default: "published" },
  content: I18n,
  lastReviewedAt: Date
}, { timestamps: true });
trackSchema.index({ dept: 1, slug: 1 }, { unique: true });

/* ---------- Question: one 1–5 statement of a department's track quiz ---------- */
const questionSchema = new Schema({
  dept: { type: String, required: true, index: true },
  order: Number,
  text: I18n,                            // { en: "I like ..." }
  weights: { type: Map, of: Number, default: {} },   // { be: 2, ops: 1 }
  active: { type: Boolean, default: true }
}, { timestamps: true });

/* ---------- Student: identified by university student ID, no password ---------- */
const studentSchema = new Schema({
  studentId: { type: String, required: true, unique: true, trim: true },
  name: { type: String, required: true, trim: true },
  phone: { type: String, trim: true },
  email: { type: String, trim: true, lowercase: true },
  className: { type: String, trim: true },
  lang: String,
  consentAt: Date
}, { timestamps: true });
studentSchema.index({ name: "text", studentId: "text" });

/* ---------- Attempt: one finished track quiz ---------- */
const attemptSchema = new Schema({
  student: { type: Schema.Types.ObjectId, ref: "Student", required: true, index: true },
  dept: { type: String, required: true, index: true },
  quizVersion: Number,
  answers: [{ _id: false, question: { type: Schema.Types.ObjectId, ref: "Question" }, value: Number }],
  level: {
    year: Number, built: Number, skills: [Number],
    points: Number, name: { type: String, enum: ["beginner", "intermediate", "jobReady"] }
  },
  percents: [{ _id: false, track: String, pct: Number }],   // sorted, best first
  top: [String],
  flat: Boolean,
  reasons: [{ type: Schema.Types.ObjectId, ref: "Question" }],
  lang: String,
  durationMs: Number
}, { timestamps: true });
attemptSchema.index({ createdAt: -1 });

/* ---------- Admin: staff who can see the dashboard ---------- */
const adminSchema = new Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  name: String,
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ["admin", "viewer"], default: "admin" }
}, { timestamps: true });

export const Department = model("Department", departmentSchema);
export const Track = model("Track", trackSchema);
export const Question = model("Question", questionSchema);
export const Student = model("Student", studentSchema);
export const Attempt = model("Attempt", attemptSchema);
export const Admin = model("Admin", adminSchema);
