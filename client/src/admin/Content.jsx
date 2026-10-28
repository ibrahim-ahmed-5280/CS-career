import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { DEPTS } from "../data.js";
import { useLang } from "../i18n/index.jsx";
import { api, useApi } from "../lib/api.js";
import { Icon, LoadError, Loading, useTitle } from "../components/bits.jsx";
import { useAdmin } from "./Admin.jsx";

const LANG_NAMES = { en: "English", so: "Somali", ar: "Arabic" };
const KINDS = ["course", "practice", "docs", "video", "cert", "tool", "book", "data"];
const STALE_DAYS = 180;
const isStale = (d) => !d || Date.now() - new Date(d) > STALE_DAYS * 864e5;
const day = (d) => (d ? new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "never");

export function DeptTabs({ dept, setDept }) {
  const { T } = useLang();
  return (
    <div className="tabs" role="tablist">
      {DEPTS.map((d) => (
        <button key={d.id} type="button" role="tab" aria-selected={dept === d.id} className={dept === d.id ? "on" : ""} onClick={() => setDept(d.id)}>
          {d.code}<span className="tab-long"> · {T.depts[d.id].name}</span>
        </button>
      ))}
    </div>
  );
}

export function Content() {
  useTitle("Tracks · CS Career admin");
  const [dept, setDept] = useState(() => sessionStorage.getItem("admin-dept") || "cs");
  useEffect(() => { try { sessionStorage.setItem("admin-dept", dept); } catch { /* ignore */ } }, [dept]);
  const { data, error, reload } = useApi(`/admin/tracks?dept=${dept}`);

  return (
    <>
      <div className="admin-head"><div><h1>Tracks</h1><p className="muted">The track pages students read. Pages not reviewed for {STALE_DAYS / 30} months are flagged.</p></div></div>
      <DeptTabs dept={dept} setDept={setDept} />
      {error ? <LoadError error={error} onRetry={reload} /> : !data ? <Loading /> : (
        <div className="card flush">
          <div className="tbl-scroll">
            <table className="tbl">
              <thead><tr><th>Track</th><th>Status</th><th>Full guide</th><th>Languages</th><th>Last reviewed</th><th /></tr></thead>
              <tbody>
                {data.map((t) => (
                  <tr key={t._id}>
                    <td><b>{t.content.en?.name}</b><br /><small className="muted">{t.content.en?.line}</small></td>
                    <td><span className={`status ${t.status}`}>{t.status === "published" ? "Published" : "Draft"}</span></td>
                    <td>{t.content.en?.page ? <span className="ok"><Icon name="check" /> Yes</span> : <span className="muted">Not yet</span>}</td>
                    <td className="nowrap">{Object.keys(LANG_NAMES).map((l) => <span key={l} className={`lang-tag${t.content[l] ? " on" : ""}`} title={LANG_NAMES[l]}>{l.toUpperCase()}</span>)}</td>
                    <td className="nowrap">{isStale(t.lastReviewedAt) ? <span className="warn"><Icon name="alert-triangle" /> {day(t.lastReviewedAt)}</span> : day(t.lastReviewedAt)}</td>
                    <td className="num"><Link className="btn ghost sm" to={`/admin/content/${t._id}`}>Edit</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}

/* ---------- Lists edited as plain text, one item per line ---------- */
const toLabelled = (items = []) => items.map((x) => (x.label ? `${x.label}: ${x.text}` : x.text)).join("\n");
const fromLabelled = (s) => s.split("\n").map((l) => l.trim()).filter(Boolean).map((l) => {
  const i = l.indexOf(": ");
  return i > 0 ? { label: l.slice(0, i), text: l.slice(i + 2) } : { label: "", text: l };
});
const toSteps = (steps = []) => steps.map((x) => (x.text ? `${x.title}: ${x.text}` : x.title)).join("\n");
const fromSteps = (s) => fromLabelled(s).map((x) => (x.label ? { title: x.label, text: x.text } : { title: x.text, text: "" }));
const toRes = (list = []) => list.map((r) => [r.name, r.url || "", r.kind, r.free ? "free" : "paid", r.desc || ""].join(" | ")).join("\n");
function fromRes(s) {
  return s.split("\n").map((l) => l.trim()).filter(Boolean).map((l, i) => {
    const [name = "", url = "", kind = "docs", price = "free", desc = ""] = l.split("|").map((x) => x.trim());
    if (!KINDS.includes(kind)) throw new Error(`Resource line ${i + 1}: kind must be one of ${KINDS.join(", ")}`);
    if (url && !/^https?:\/\//.test(url)) throw new Error(`Resource line ${i + 1}: the link must start with https://`);
    return { name, url, kind, free: price.toLowerCase() !== "paid", desc };
  });
}

const EMPTY_PAGE = { what: "", day: "", ai: [], roadmap: { beginner: [], intermediate: [], jobReady: [] }, projects: [], resources: [], certifications: "", careers: [], related: [] };

function formFrom(c = {}) {
  const p = c.page;
  return {
    name: c.name || "", line: c.line || "", day: c.day || "", aiDoes: c.aiDoes || "", humansOwn: c.humansOwn || "", careers: c.careers || "",
    hasPage: Boolean(p),
    what: p?.what || "", pday: p?.day || "", ai: toLabelled(p?.ai),
    beginner: toSteps(p?.roadmap.beginner), intermediate: toSteps(p?.roadmap.intermediate), jobReady: toSteps(p?.roadmap.jobReady),
    projects: toLabelled(p?.projects), resources: toRes(p?.resources), certifications: p?.certifications || "",
    pcareers: toLabelled(p?.careers), related: (p?.related || []).join("\n")
  };
}

function Field({ label, hint, children }) {
  return <label className="field-row"><span className="fl">{label}{hint && <small className="muted">{hint}</small>}</span>{children}</label>;
}

export function TrackEditor() {
  const { trackId } = useParams();
  const { canEdit } = useAdmin();
  const [track, setTrack] = useState(null);
  const [error, setError] = useState(null);
  const [lang, setLang] = useState("en");
  const [f, setF] = useState(null);
  const [status, setStatus] = useState("published");
  const [msg, setMsg] = useState(null);
  const [busy, setBusy] = useState(false);
  useTitle(track ? `Edit ${track.content.en?.name} · CS Career admin` : "Edit track · CS Career admin");

  useEffect(() => {
    api(`/admin/tracks`).then((all) => {
      const t = all.find((x) => x._id === trackId);
      if (!t) throw Object.assign(new Error("Track not found"), { status: 404 });
      setTrack(t); setStatus(t.status); setF(formFrom(t.content.en));
    }).catch(setError);
  }, [trackId]);
  // Switching language loads that language's text (English as the starting point when missing)
  const switchLang = (l) => {
    setLang(l);
    setF(formFrom(track.content[l] || track.content.en));
    setMsg(null);
  };

  if (error) return <LoadError error={error} onRetry={() => location.reload()} />;
  if (!f) return <Loading />;

  const set = (k) => (e) => { setMsg(null); setF({ ...f, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value }); };
  const ta = (k, rows = 3) => <textarea rows={rows} value={f[k]} onChange={set(k)} disabled={!canEdit} dir={lang === "ar" ? "rtl" : "ltr"} />;

  const save = async (reviewed) => {
    setBusy(true); setMsg(null);
    try {
      const page = f.hasPage ? {
        ...EMPTY_PAGE, what: f.what, day: f.pday, ai: fromLabelled(f.ai),
        roadmap: { beginner: fromSteps(f.beginner), intermediate: fromSteps(f.intermediate), jobReady: fromSteps(f.jobReady) },
        projects: fromLabelled(f.projects), resources: fromRes(f.resources), certifications: f.certifications,
        careers: fromLabelled(f.pcareers), related: f.related.split("\n").map((x) => x.trim()).filter(Boolean)
      } : null;
      const content = { name: f.name, line: f.line, day: f.day, aiDoes: f.aiDoes, humansOwn: f.humansOwn, careers: f.careers, page };
      const saved = await api(`/admin/tracks/${trackId}`, { method: "PUT", body: { status, lang, content, reviewed } });
      setTrack(saved);
      setMsg({ ok: true, text: reviewed ? "Saved and marked as reviewed today." : "Saved." });
    } catch (e) {
      const issue = e.body?.issues?.[0];
      setMsg({ ok: false, text: issue ? `${e.message}: ${issue.path.join(" › ")}: ${issue.message}` : e.message });
    } finally { setBusy(false); }
  };

  return (
    <>
      <Link className="back-link" to="/admin/content"><Icon name="arrow-left" />All tracks</Link>
      <div className="admin-head">
        <div><h1>{track.content.en?.name}</h1><p className="muted">{track.dept.toUpperCase()} · last reviewed {day(track.lastReviewedAt)}</p></div>
        <a className="btn ghost" href={`/departments/${track.dept}/tracks/${track.slug}`} target="_blank" rel="noopener noreferrer"><Icon name="eye" />View page</a>
      </div>

      <div className="editor-bar card">
        <label><span>Language</span>
          <select value={lang} onChange={(e) => switchLang(e.target.value)}>
            {Object.entries(LANG_NAMES).map(([k, v]) => <option key={k} value={k}>{v}{track.content[k] ? "" : " (not translated)"}</option>)}
          </select>
        </label>
        <label><span>Status</span>
          <select value={status} onChange={(e) => setStatus(e.target.value)} disabled={!canEdit}>
            <option value="published">Published</option><option value="draft">Draft (hidden from students)</option>
          </select>
        </label>
        {lang !== "en" && !track.content[lang] && <p className="small muted">Starts from the English text. Translate it and save.</p>}
      </div>

      <section className="card form-card">
        <h2>Summary</h2>
        <p className="muted small">Shown on the department page and when the full guide is not written yet.</p>
        <Field label="Name"><input value={f.name} onChange={set("name")} disabled={!canEdit} /></Field>
        <Field label="One line"><input value={f.line} onChange={set("line")} disabled={!canEdit} /></Field>
        <Field label="A day in the job">{ta("day")}</Field>
        <Field label="AI already does">{ta("aiDoes", 2)}</Field>
        <Field label="Humans still own">{ta("humansOwn", 2)}</Field>
        <Field label="Careers">{ta("careers", 2)}</Field>
      </section>

      <section className="card form-card">
        <label className="check"><input type="checkbox" checked={f.hasPage} onChange={set("hasPage")} disabled={!canEdit} /><span><b>This track has a full guide</b></span></label>
        {f.hasPage && (
          <>
            <Field label="What it is">{ta("what")}</Field>
            <Field label="A day in the job">{ta("pday")}</Field>
            <Field label="How AI is changing this job" hint="One per line: Heading: text">{ta("ai", 5)}</Field>
            <Field label="Roadmap: Beginner" hint="One step per line: Title: what to do">{ta("beginner", 4)}</Field>
            <Field label="Roadmap: Intermediate" hint="One step per line">{ta("intermediate", 4)}</Field>
            <Field label="Roadmap: Job-ready" hint="One step per line">{ta("jobReady", 4)}</Field>
            <Field label="Projects to build" hint="One per line: Level: project">{ta("projects", 3)}</Field>
            <Field label="Where to learn" hint={`One per line: Name | https://link | kind (${KINDS.join(", ")}) | free or paid | short note`}>{ta("resources", 8)}</Field>
            <Field label="Certifications">{ta("certifications", 3)}</Field>
            <Field label="Careers" hint="One per line: Heading: text">{ta("pcareers", 3)}</Field>
            <Field label="Related tracks" hint="One per line">{ta("related", 3)}</Field>
          </>
        )}
      </section>

      {canEdit ? (
        <div className="save-bar">
          {msg && <p className={msg.ok ? "ok" : "err"} role="status">{msg.text}</p>}
          <button type="button" className="btn ghost" disabled={busy} onClick={() => save(false)}>Save</button>
          <button type="button" className="btn primary" disabled={busy} onClick={() => save(true)}><Icon name="calendar-check" />Save and mark reviewed</button>
        </div>
      ) : <p className="note small">Your account can view content but not change it.</p>}
    </>
  );
}
