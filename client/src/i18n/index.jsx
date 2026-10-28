import { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import en from "./en.js";
import so from "./so.js";
import ar from "./ar.js";
import extra from "./tracks.js";

export const LANGS = { en, so, ar };
Object.entries(LANGS).forEach(([k, L]) => {
  Object.assign(L.ui.detail.kinds, extra[k].kinds);
  L.ui.tracks = extra[k].tracks;
  L.ui.tq = extra[k].tq;
});

function store(k, v) {
  try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch { /* private mode */ }
  return null;
}

function initialLang() {
  const saved = store("lang");
  if (saved && LANGS[saved]) return saved;
  const nav = (navigator.language || "en").slice(0, 2);
  return LANGS[nav] ? nav : "en";
}

const LangContext = createContext(null);

export function LangProvider({ children }) {
  const [chosen, setLangState] = useState(initialLang);
  // The admin dashboard is English only (and left-to-right)
  const lang = useLocation().pathname.startsWith("/admin") ? "en" : chosen;
  const T = LANGS[lang];
  useEffect(() => {
    document.documentElement.lang = T.meta.code;
    document.documentElement.dir = T.meta.dir;
  }, [T]);
  const setLang = (l) => { store("lang", l); setLangState(l); };
  return <LangContext.Provider value={{ lang, setLang, T, ui: T.ui }}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);

/* "Question {n} of {t}" → fill(s, { n: 1, t: 6 }) */
export const fill = (s, vars) => s.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m));

export const fmtDate = (d, lang) => new Date(d).toLocaleDateString(lang === "so" ? "en-GB" : lang, { year: "numeric", month: "short", day: "numeric" });
