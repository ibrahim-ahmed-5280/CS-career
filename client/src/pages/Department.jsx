import { Link, Navigate, useParams } from "react-router-dom";
import { CONFIG, DEPTS, RESOURCES } from "../data.js";
import { useLang } from "../i18n/index.jsx";
import { local, useApi } from "../lib/api.js";
import { Crumbs, DeptIcon, Icon, LoadError, ResLinks, useTitle } from "../components/bits.jsx";
import { ProgressBar, Steps, useProgress } from "../components/Roadmap.jsx";

function TrackCards({ dept }) {
  const { lang, ui } = useLang();
  const t = ui.tracks;
  const { data, error, loading, reload } = useApi(`/departments/${dept}?lang=${lang}`);
  const mine = local.get(`track-result-${dept}`)?.top || [];
  if (error) return <LoadError error={error} onRetry={reload} />;
  return (
    <>
      {data && !data.translated && <p className="note small">{t.notTranslated}</p>}
      <div className={`tcards${loading ? " is-loading" : ""}`} aria-busy={loading}>
        {(data?.tracks || Array.from({ length: 5 }, () => null)).map((tr, i) => tr
          ? (
            <Link key={tr.slug} className="tcard" to={`/departments/${dept}/tracks/${tr.slug}`}>
              <span className="tcard-top">
                <span className="tnum">{String(i + 1).padStart(2, "0")}</span>
                {mine[0] === tr.slug && <span className="pill free">{t.yourMatch}</span>}
              </span>
              <h3 dir="auto">{tr.name}</h3>
              <p dir="auto">{tr.line}</p>
              <span className="tcard-foot">
                <span className="go">{t.open}</span>
                {tr.hasPage && <span className="small muted"><Icon name="book-2" /> {t.guide}</span>}
              </span>
            </Link>
          )
          : <div key={i} className="tcard skeleton" aria-hidden="true" />)}
      </div>
    </>
  );
}

export default function Department() {
  const { id } = useParams();
  const { T, ui } = useLang();
  const d = DEPTS.find((x) => x.id === id);
  const t = d && T.depts[id];
  useTitle(t && `${t.name} · ${T.meta.title.split("·")[0].trim()}`);
  const [done, toggle] = useProgress(`road-${id}`, t ? t.steps.length : 0);
  if (!d) return <Navigate to="/#departments" replace />;

  const dt = ui.detail, x = ui.dept, tr = ui.tracks;
  const idx = DEPTS.indexOf(d);
  const prev = DEPTS[(idx + DEPTS.length - 1) % DEPTS.length], nxt = DEPTS[(idx + 1) % DEPTS.length];
  const res = RESOURCES[id] || [];
  const free = res.filter((r) => r.free), paid = res.filter((r) => !r.free);
  const steps = t.steps.map(([title, text]) => ({ title, text }));

  return (
    <>
      <div className="detail-hero">
        <div className="wrap">
          <Crumbs items={[{ to: "/", label: ui.nav.home }, { to: "/#departments", label: x.crumb }, { label: t.name }]} />
          <div className="dh-grid">
            <div className="dh-copy">
              <div className="detail-title">
                <span className="badge"><DeptIcon id={id} /></span>
                <div><p className="tagline">{t.tag}</p><h1>{t.name}</h1></div>
              </div>
              <p className="lead">{t.about}</p>
              <div className="cta">
                <Link className="btn invert" to={`/departments/${id}/quiz`}><Icon name="compass" />{tr.bandBtn}</Link>
                <a className="btn outline-light" href="#tracks">{tr.title}</a>
              </div>
            </div>
            <img className="dh-art" src={`/assets/dept/${id}.svg`} alt="" width="480" height="340" />
          </div>
        </div>
      </div>

      <div className="wrap detail-body">
        <section id="tracks" aria-labelledby="sTracks">
          <h2 id="sTracks">{tr.title}</h2>
          <p className="muted sub">{tr.sub}</p>
          <TrackCards dept={id} />
          <div className="quiz-inline">
            <div><h3>{tr.bandTitle}</h3><p className="muted">{tr.bandSub}</p></div>
            <Link className="btn primary" to={`/departments/${id}/quiz`}>{tr.bandBtn}</Link>
          </div>
        </section>

        <section aria-labelledby="sFields">
          <h2 id="sFields">{x.fieldsTitle}</h2>
          <p className="muted sub">{x.fieldsSub}</p>
          <div className="fields">
            {t.fields.map((f, i) => (
              <article key={i} className="field"><span className="fn">{i + 1}</span><div><h3>{f[0]}</h3><p>{f[1]}</p></div></article>
            ))}
          </div>
        </section>

        <section className="cols" aria-label={dt.careers}>
          <div className="plain"><h3 className="h3">{dt.careers}</h3><p className="muted small">{x.careersSub}</p><ul>{t.careers.map((c, i) => <li key={i}>{c}</li>)}</ul></div>
          <div className="plain"><h3 className="h3">{dt.learn}</h3><ul>{t.learn.map((c, i) => <li key={i}>{c}</li>)}</ul></div>
        </section>

        <section aria-labelledby="sPre">
          <h2 id="sPre">{x.prereqTitle}</h2>
          <p className="muted sub">{x.prereqSub}</p>
          <h3 className="h3 mt-s">{x.subjects}</h3>
          <div className="subjects">{t.prereq.subjects.map((s, i) => <article key={i}><h3>{s[0]}</h3><p>{s[1]}</p></article>)}</div>
          <h3 className="h3 mt-s">{x.skills}</h3>
          <ul className="chips">{t.prereq.skills.map((s, i) => <li key={i} className="chip">{s}</li>)}</ul>
          <p className="note">{t.prereq.note}</p>
        </section>

        <section aria-labelledby="sRoad">
          <h2 id="sRoad">{dt.roadmap}</h2>
          <p className="muted sub">{dt.roadmapSub}</p>
          <ProgressBar done={done} />
          <Steps steps={steps} done={done} toggle={toggle} />
        </section>

        <section aria-labelledby="sRes">
          <h2 id="sRes">{dt.resources}</h2>
          <div className="res-group"><h3 className="h3">{dt.free}</h3><div className="res"><ResLinks list={free} /></div></div>
          {paid.length > 0 && <div className="res-group"><h3 className="h3">{dt.paid}</h3><div className="res"><ResLinks list={paid} /></div></div>}
        </section>

        <section className="cta-band">
          <div><h2>{x.ctaTitle}</h2><p>{x.ctaText}</p></div>
          <div className="cta">
            <Link className="btn invert" to="/contact">{x.ctaBtn}</Link>
            <a className="btn outline-light" href={CONFIG.university.admission} target="_blank" rel="noopener noreferrer">{x.admission}</a>
          </div>
        </section>

        <nav className="pn" aria-label="Departments">
          <Link to={`/departments/${prev.id}`}><small>{x.prev}</small><b>{T.depts[prev.id].name}</b></Link>
          <Link to={`/departments/${nxt.id}`} className="pn-next"><small>{x.nextLabel}</small><b>{T.depts[nxt.id].name}</b></Link>
        </nav>
      </div>
    </>
  );
}
