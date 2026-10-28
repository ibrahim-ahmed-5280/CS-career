import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useLang } from "../i18n/index.jsx";
import { useApi } from "../lib/api.js";
import { Icon, LoadError, Loading, useTitle } from "../components/bits.jsx";
import { Filters, qs } from "./Overview.jsx";

const LEVELS = { beginner: "Beginner", intermediate: "Intermediate", jobReady: "Job-ready" };
const when = (d) => new Date(d).toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

export function Students() {
  useTitle("Students · CS Career admin");
  const navigate = useNavigate();
  const [f, setF] = useState({ dept: "", className: "", from: "", to: "" });
  const [q, setQ] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  useEffect(() => { const t = setTimeout(() => { setSearch(q.trim()); setPage(1); }, 300); return () => clearTimeout(t); }, [q]);
  useEffect(() => setPage(1), [f.dept, f.className]);

  const { data, error, loading, reload } = useApi(`/admin/students?${qs({ q: search, dept: f.dept, className: f.className, page })}`);
  const stats = useApi("/admin/stats");

  return (
    <>
      <div className="admin-head">
        <div><h1>Students</h1><p className="muted">Everyone who took a track quiz. Open a student to see their answers.</p></div>
        <a className="btn ghost" href={`/api/admin/export.csv?${qs(f)}`}><Icon name="download" />Export CSV</a>
      </div>
      <Filters f={f} setF={setF} classes={stats.data?.classes || []} extra={
        <label className="grow"><span>Search</span>
          <span className="search"><Icon name="search" /><input type="search" placeholder="Name, student ID or phone" value={q} onChange={(e) => setQ(e.target.value)} /></span>
        </label>
      } />
      {error ? <LoadError error={error} onRetry={reload} /> : !data ? <Loading /> : (
        <div className={`card flush${loading ? " is-loading" : ""}`}>
          {data.items.length === 0 ? <p className="muted pad">No students match.</p> : (
            <div className="tbl-scroll">
              <table className="tbl">
                <thead><tr><th>Name</th><th>Student ID</th><th>Class</th><th>Latest best track</th><th className="num">Match</th><th>Level</th><th>Last quiz</th></tr></thead>
                <tbody>
                  {data.items.map((s) => (
                    <tr key={s.id} className="clickable" onClick={() => navigate(`/admin/students/${s.id}`)}>
                      <td><Link to={`/admin/students/${s.id}`} onClick={(e) => e.stopPropagation()}>{s.name}</Link>{s.attempts > 1 && <small className="muted"> · {s.attempts} attempts</small>}</td>
                      <td className="mono">{s.studentId}</td>
                      <td className="nowrap">{s.className || "–"}</td>
                      <td>{s.last ? <>{s.last.track} <small className="muted">{s.last.dept.toUpperCase()}</small></> : "–"}</td>
                      <td className="num">{s.last ? `${s.last.pct}%` : "–"}</td>
                      <td>{s.last ? LEVELS[s.last.level] : "–"}</td>
                      <td className="nowrap">{s.last ? when(s.last.at) : "–"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="pager">
            <span className="small muted">{data.total} students</span>
            <button type="button" className="btn ghost" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button>
            <span className="small">Page {data.page} of {data.pages}</span>
            <button type="button" className="btn ghost" disabled={page >= data.pages} onClick={() => setPage(page + 1)}>Next</button>
          </div>
        </div>
      )}
    </>
  );
}

export function StudentDetail() {
  const { id } = useParams();
  const { T } = useLang();
  const { data, error, reload } = useApi(`/admin/students/${id}`);
  useTitle(data ? `${data.student.name} · CS Career admin` : "Student · CS Career admin");
  if (error) return <LoadError error={error} onRetry={reload} />;
  if (!data) return <Loading />;
  const s = data.student;
  const rows = [["Student ID", s.studentId], ["Class", s.className], ["Phone", s.phone], ["Email", s.email], ["First seen", when(s.createdAt)]];

  return (
    <>
      <Link className="back-link" to="/admin/students"><Icon name="arrow-left" />All students</Link>
      <div className="admin-head"><div><h1>{s.name}</h1><p className="muted">{data.attempts.length} quiz attempt{data.attempts.length === 1 ? "" : "s"}</p></div></div>
      <div className="detail-grid">
        <section className="card">
          <h2>Details</h2>
          <dl className="dl">{rows.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v || "–"}</dd></div>)}</dl>
          {(s.phone || s.email) && (
            <div className="q-actions">
              {s.phone && <a className="btn ghost" href={`tel:${s.phone}`}><Icon name="phone" />Call</a>}
              {s.email && <a className="btn ghost" href={`mailto:${s.email}`}><Icon name="mail" />Email</a>}
            </div>
          )}
        </section>
        <div className="stack-lg">
          {data.attempts.map((a) => (
            <section key={a.id} className="card">
              <div className="attempt-head">
                <h2>{T.depts[a.dept]?.name || a.dept}</h2>
                <span className="small muted">{when(a.at)} · {LEVELS[a.level?.name]} · {a.lang.toUpperCase()}{a.durationMs ? ` · ${Math.round(a.durationMs / 60000) || "<1"} min` : ""}</span>
              </div>
              {a.flat && <p className="note small">Flat result: no track clearly ahead. A good student to talk to.</p>}
              <ul className="hbars">
                {a.percents.map((p) => (
                  <li key={p.track} className={a.top.includes(p.track) ? "is-top" : ""}>
                    <span className="hb-label">{p.name}</span>
                    <span className="hb-track"><span className="hb-bar" style={{ width: `${p.pct}%` }} /></span>
                    <span className="hb-val">{p.pct}%</span>
                  </li>
                ))}
              </ul>
              <details className="answers">
                <summary>Answers</summary>
                <ol>{a.answers.map((x, i) => <li key={i}><span>{x.text}</span><b>{["", "Strongly disagree", "Disagree", "Not sure", "Agree", "Strongly agree"][x.value]}</b></li>)}</ol>
              </details>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
