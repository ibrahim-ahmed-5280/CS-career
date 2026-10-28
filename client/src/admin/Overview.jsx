import { useMemo, useState } from "react";
import { DEPTS } from "../data.js";
import { useLang } from "../i18n/index.jsx";
import { useApi } from "../lib/api.js";
import { Icon, LoadError, Loading, useTitle } from "../components/bits.jsx";
import { Bars, Columns, TableToggle } from "./charts.jsx";

const LEVELS = { beginner: "Beginner", intermediate: "Intermediate", jobReady: "Job-ready" };
const LANG_NAMES = { en: "English", so: "Somali", ar: "Arabic" };

export function Filters({ f, setF, classes, extra }) {
  const { T } = useLang();
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  return (
    <div className="filters">
      <label><span>Department</span>
        <select value={f.dept} onChange={set("dept")}>
          <option value="">All departments</option>
          {DEPTS.map((d) => <option key={d.id} value={d.id}>{T.depts[d.id].name}</option>)}
        </select>
      </label>
      <label><span>Class</span>
        <select value={f.className} onChange={set("className")}>
          <option value="">All classes</option>
          {classes.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </label>
      <label><span>From</span><input type="date" value={f.from} onChange={set("from")} /></label>
      <label><span>To</span><input type="date" value={f.to} onChange={set("to")} /></label>
      {extra}
    </div>
  );
}

export const qs = (f) => new URLSearchParams(Object.entries(f).filter(([, v]) => v)).toString();

export default function Overview() {
  useTitle("Overview · CS Career admin");
  const { T } = useLang();
  const [f, setF] = useState({ dept: "", className: "", from: "", to: "" });
  const query = qs(f);
  const { data, error, loading, reload } = useApi(`/admin/stats?${query}`);

  const view = useMemo(() => {
    if (!data) return null;
    const deptRows = DEPTS.map((d) => ({ key: d.id, label: T.depts[d.id].name, value: data.byDept[d.id] || 0 })).sort((a, b) => b.value - a.value);
    const trackRows = data.tracks.map((t) => ({
      key: `${t.dept}/${t.slug}`, label: t.name, sub: f.dept ? null : t.dept.toUpperCase(), value: t.count
    })).slice(0, f.dept ? 20 : 12);
    const levelRows = Object.entries(LEVELS).map(([k, label]) => ({ key: k, label, value: data.levels[k] || 0 }));
    const langRows = Object.entries(LANG_NAMES).map(([k, label]) => ({ key: k, label, value: data.langs[k] || 0 }));
    // 30 days, with empty days filled in
    const counts = Object.fromEntries(data.daily.map((d) => [d.day, d.count]));
    const days = Array.from({ length: 30 }, (_, i) => {
      const d = new Date(Date.now() - (29 - i) * 864e5).toISOString().slice(0, 10);
      return { key: d, label: new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short" }), value: counts[d] || 0 };
    });
    return { deptRows, trackRows, levelRows, langRows, days, topTrack: data.tracks.find((t) => t.count > 0) };
  }, [data, f.dept, T]);

  return (
    <>
      <div className="admin-head">
        <div><h1>Overview</h1><p className="muted">Where students are, and which tracks fit them. Each student counts once per department (their latest answers).</p></div>
        <a className="btn ghost" href={`/api/admin/export.csv?${query}`}><Icon name="download" />Export CSV</a>
      </div>
      <Filters f={f} setF={setF} classes={data?.classes || []} />

      {error ? <LoadError error={error} onRetry={reload} /> : !view ? <Loading /> : (
        <div className={loading ? "is-loading" : ""}>
          <div className="kpis">
            <div className="kpi"><span>Students</span><b>{data.totals.students}</b></div>
            <div className="kpi"><span>Quiz attempts</span><b>{data.totals.attempts}</b></div>
            <div className="kpi"><span>Attempts, last 7 days</span><b>{data.totals.lastWeek}</b></div>
            <div className="kpi"><span>Most common best track</span><b className="kpi-text">{view.topTrack ? view.topTrack.name : "–"}</b>
              {view.topTrack && <small className="muted">{view.topTrack.count} student{view.topTrack.count === 1 ? "" : "s"}{!f.dept && ` · ${view.topTrack.dept.toUpperCase()}`}</small>}</div>
          </div>

          <div className="chart-grid">
            <section className="card wide">
              <h2>Best-match track{f.dept ? ` in ${T.depts[f.dept].name}` : ", all departments"}</h2>
              <p className="muted small">Students whose top result is this track.</p>
              <Bars rows={view.trackRows} />
              <TableToggle rows={view.trackRows} head={["Track", "Students"]} />
            </section>
            {!f.dept && (
              <section className="card">
                <h2>Students per department</h2>
                <p className="muted small">Students who took that department's track quiz.</p>
                <Bars rows={view.deptRows} />
              </section>
            )}
            <section className="card">
              <h2>Starting level</h2>
              <p className="muted small">From year, projects built and skills.</p>
              <Bars rows={view.levelRows} />
            </section>
            <section className="card">
              <h2>Quiz language</h2>
              <p className="muted small">Language students chose for the quiz.</p>
              <Bars rows={view.langRows} />
            </section>
            <section className="card wide">
              <h2>Quiz attempts per day</h2>
              <p className="muted small">Last 30 days{f.dept ? `, ${T.depts[f.dept].name}` : ""}. Hover a day for its number.</p>
              <Columns rows={view.days} />
            </section>
          </div>
        </div>
      )}
    </>
  );
}
