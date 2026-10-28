import { useEffect, useState } from "react";
import { api, useApi } from "../lib/api.js";
import { Icon, LoadError, Loading, useTitle } from "../components/bits.jsx";
import { useAdmin } from "./Admin.jsx";
import { DeptTabs } from "./Content.jsx";

function QuestionRow({ q, n, tracks, onSaved, canEdit }) {
  const [open, setOpen] = useState(!q._id);
  const [f, setF] = useState({ text: { en: "", so: "", ar: "", ...q.text }, weights: { ...q.weights }, active: q.active ?? true });
  const [msg, setMsg] = useState(null);
  const [busy, setBusy] = useState(false);
  const summary = Object.entries(q.weights || {}).map(([k, v]) => `${tracks.find((t) => t.slug === k)?.name || k} ${v}`).join(" · ");

  const save = async () => {
    setBusy(true); setMsg(null);
    try {
      const body = { ...f, weights: Object.fromEntries(Object.entries(f.weights).map(([k, v]) => [k, Number(v) || 0])) };
      await api(q._id ? `/admin/questions/${q._id}` : "/admin/questions", { method: q._id ? "PUT" : "POST", body: { ...body, dept: q.dept } });
      setMsg({ ok: true, text: "Saved. Students who already started this quiz will be asked to restart." });
      onSaved();
    } catch (e) { setMsg({ ok: false, text: e.message }); }
    finally { setBusy(false); }
  };

  return (
    <li className={`qrow${f.active ? "" : " off"}`}>
      <button type="button" className="qrow-head" aria-expanded={open} onClick={() => setOpen(!open)}>
        <span className="tnum">{String(n).padStart(2, "0")}</span>
        <span className="grow"><b>{q.text?.en || "New statement"}</b>{summary && <small className="muted">{summary}</small>}</span>
        {!f.active && <span className="status draft">Off</span>}
        <Icon name={open ? "chevron-up" : "chevron-down"} />
      </button>
      {open && (
        <div className="qrow-body">
          {["en", "so", "ar"].map((l) => (
            <label key={l} className="field-row"><span className="fl">{{ en: "English", so: "Somali", ar: "Arabic" }[l]}{l !== "en" && <small className="muted">Optional: English is shown when empty</small>}</span>
              <input value={f.text[l]} dir={l === "ar" ? "rtl" : "ltr"} disabled={!canEdit} onChange={(e) => setF({ ...f, text: { ...f.text, [l]: e.target.value } })} />
            </label>
          ))}
          <p className="fl">Points to each track when the student strongly agrees <small className="muted">0 = none, 2 = main track, 1 = secondary</small></p>
          <div className="weights">
            {tracks.map((t) => (
              <label key={t.slug}><span>{t.name}</span>
                <select value={f.weights[t.slug] || 0} disabled={!canEdit} onChange={(e) => setF({ ...f, weights: { ...f.weights, [t.slug]: Number(e.target.value) } })}>
                  {[0, 1, 2, 3].map((v) => <option key={v} value={v}>{v}</option>)}
                </select>
              </label>
            ))}
          </div>
          <label className="check"><input type="checkbox" checked={f.active} disabled={!canEdit} onChange={(e) => setF({ ...f, active: e.target.checked })} /><span>Used in the quiz</span></label>
          {canEdit && (
            <div className="save-bar inline">
              {msg && <p className={msg.ok ? "ok" : "err"} role="status">{msg.text}</p>}
              <button type="button" className="btn primary" disabled={busy} onClick={save}>Save statement</button>
            </div>
          )}
        </div>
      )}
    </li>
  );
}

export default function Questions() {
  useTitle("Quiz questions · CS Career admin");
  const { canEdit } = useAdmin();
  const [dept, setDept] = useState(() => sessionStorage.getItem("admin-dept") || "cs");
  useEffect(() => { try { sessionStorage.setItem("admin-dept", dept); } catch { /* ignore */ } }, [dept]);
  const { data, error, reload } = useApi(`/admin/questions?dept=${dept}`);
  const [adding, setAdding] = useState(false);
  useEffect(() => setAdding(false), [dept]);

  // Points each track can get from the active statements: very uneven totals are worth a look
  const totals = data ? data.tracks.map((t) => ({
    ...t, total: data.questions.filter((q) => q.active).reduce((s, q) => s + (q.weights[t.slug] || 0), 0)
  })) : [];

  return (
    <>
      <div className="admin-head"><div><h1>Quiz questions</h1><p className="muted">Statements students rate from "Strongly disagree" to "Strongly agree". Saving a change starts a new quiz version.</p></div></div>
      <DeptTabs dept={dept} setDept={setDept} />
      {error ? <LoadError error={error} onRetry={reload} /> : !data ? <Loading /> : (
        <>
          <div className="card totals">
            <span className="small muted">Quiz version {data.quizVersion} · points per track:</span>
            {totals.map((t) => <span key={t.slug} className={`chip${t.total === 0 ? " bad" : ""}`}>{t.name} <b>{t.total}</b></span>)}
          </div>
          <ol className="qlist">
            {data.questions.map((q, i) => <QuestionRow key={q._id} q={q} n={i + 1} tracks={data.tracks} onSaved={reload} canEdit={canEdit} />)}
            {adding && <QuestionRow q={{ dept, text: {}, weights: {} }} n={data.questions.length + 1} tracks={data.tracks} canEdit={canEdit} onSaved={() => { setAdding(false); reload(); }} />}
          </ol>
          {canEdit && !adding && <button type="button" className="btn ghost" onClick={() => setAdding(true)}><Icon name="plus" />Add a statement</button>}
        </>
      )}
    </>
  );
}
