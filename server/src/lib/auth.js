import jwt from "jsonwebtoken";
import { config } from "../config.js";
import { Admin } from "../models/index.js";

export const COOKIE = "cs_admin";
const MAX_AGE = 8 * 3600 * 1000;   // one working day

export function setSession(res, admin) {
  const token = jwt.sign({ sub: String(admin._id), role: admin.role }, config.jwtSecret, { expiresIn: MAX_AGE / 1000 });
  res.cookie(COOKIE, token, { httpOnly: true, sameSite: "strict", secure: config.isProd, maxAge: MAX_AGE, path: "/api" });
}

export function clearSession(res) {
  res.clearCookie(COOKIE, { path: "/api" });
}

/* Admin routes only. Loads req.admin or answers 401. */
export async function requireAdmin(req, res, next) {
  try {
    const { sub } = jwt.verify(req.cookies?.[COOKIE] || "", config.jwtSecret);
    req.admin = await Admin.findById(sub).select("-passwordHash");
    if (req.admin) return next();
  } catch { /* invalid or expired token */ }
  res.status(401).json({ error: "Please sign in" });
}

/* Viewers can read the dashboard but not change content. */
export function requireEditor(req, res, next) {
  if (req.admin.role === "admin") return next();
  res.status(403).json({ error: "Your account can only view data" });
}
