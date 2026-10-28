import { Link, useParams } from "react-router-dom";
import { DEPTS } from "../data.js";
import { fill, fmtDate, useLang } from "../i18n/index.jsx";
import { local, useApi } from "../lib/api.js";
import { Crumbs, DeptIcon, Icon, LoadError, Loading, ResLinks, useTitle } from "../components/bits.jsx";
import { ProgressBar, Steps, useProgress } from "../components/Roadmap.jsx";

const LEVELS = ["beginner", "intermediate", "jobReady"];

function Labelled({ items, className = "ai-grid" }) {
  return (
    <div className={className}>
      {items.map((it, i) => <article key={i}><h3>{it.label}</h3><p>{it.text}</p></article>)}
    </div>
  );
}

function FullGuide({ page, storeKey, level }) {
  const { ui } = useLang();
  const t = ui.tracks;
  const all = LEVELS.flatMap((l) => page.roadmap[l] || []);
  const [done, toggle] = useProgress(storeKey, all.length);
  const free = page.resources.filter((r) => r.free), paid = page.resources.filter((r) => !r.free);
  let offset = 0;

  return (
    <>
      <section aria-labelledby="sDay">
        <h2 id="sDay">{t.day}</h2>
        <p className="prose">{page.day}</p>
      </section>

      <section aria-labelledby="sAi">
        <h2 id="sAi">{t.ai}</h2>
        <Labelled items={page.ai} />
      </section>

      <section aria-labelledby="sRoad">
        <h2 id="sRoad">{t.roadmap}</h2>
        <p className="muted sub">{t.roadmapSub}</p>
        <ProgressBar done={done} />
        {LEVELS.map((l) => {
          const steps = page.roadmap[l] || [];
          const start = offset;
          offset += steps.length;
          return (
            <div key={l} className="level" id={`level-${l}`}>
              <h3 className="level-head">{t.levels[l]}{level === l && <span className="pill free">{t.startHere}</span>}</h3>
              <Steps steps={steps} done={done} toggle={toggle} offset={start} />
            </div>
          );
        })}
      </section>

      <section aria-labelledby="sProj">
        <h2 id="sProj">{t.projects}</h2>
        <Labelled items={page.projects} className="proj" />
      </section>

      <section aria-labelledby="sLearn">
        <h2 id="sLearn">{t.learn}</h2>
        <div className="res-group"><h3 className="h3">{ui.detail.free}</h3><div className="res"><ResLinks list={free} /></div></div>
        {paid.length > 0 && <div className="res-group"><h3 className="h3">{ui.detail.paid}</h3><div className="res"><ResLinks list={paid} /></div></div>}
      </section>

      <section className="cols" aria-label={t.certs}>
        <div><h2 className="h3 big-h3">{t.certs}</h2><p className="note">{page.certifications}</p></div>
        <div className="plain"><h2 className="h3 big-h3">{t.careers}</h2><Labelled items={page.careers} className="stack" /></div>
      </section>
    </>
  );
}

function Summary({ track }) {
  const { ui } = useLang();
  const t = ui.tracks;
  return (
    <section aria-label={t.day}>
      <div className="ai-grid">
        <article><h3>{t.day}</h3><p>{track.day}</p></article>
        <article><h3>{t.aiDoes}</h3><p>{track.aiDoes}</p></article>
        <article><h3>{t.humansOwn}</h3><p>{track.humansOwn}</p></article>
        <article><h3>{t.careers}</h3><p>{track.careers}</p></article>
      </div>
      <p className="note"><Icon name="clock" /> {t.soon}</p>
    </section>
  );
}

export default function Track() {
  const { id, slug } = useParams();
  const { lang, T, ui } = useLang();
  const t = ui.tracks;
  const d = DEPTS.find((x) => x.id === id);
  const deptName = d ? T.depts[id].name : id;
  const { data, error, loading, reload } = useApi(`/departments/${id}/tracks/${slug}?lang=${lang}`);
  const result = local.get(`track-result-${id}`);
  useTitle(data && `${data.name} · ${deptName}`);

  if (error) return <div className="wrap"><LoadError error={error} onRetry={reload} /></div>;
  if (loading || !data) return <div className="wrap"><Loading /></div>;

  return (
    <>
      <div className="detail-hero">
        <div className="wrap">
          <Crumbs items={[{ to: "/", label: ui.nav.home }, { to: `/departments/${id}`, label: deptName }, { to: `/departments/${id}#tracks`, label: t.title }, { label: data.name }]} />
          <div className="dh-grid">
            <div className="dh-copy">
              <div className="detail-title">
                <span className="badge"><DeptIcon id={id} /></span>
                <div><p className="tagline">{deptName}</p><h1 dir="auto">{data.name}</h1></div>
              </div>
              <p className="lead" dir="auto">{data.page?.what || data.line}</p>
              <div className="hero-meta">
                {result?.top?.[0] === slug && <span className="chip-on"><Icon name="star" /> {t.yourMatch}</span>}
                {data.lastReviewedAt && <span><Icon name="calendar-check" /> {fill(t.reviewed, { date: fmtDate(data.lastReviewedAt, lang) })}</span>}
              </div>
            </div>
            <img className="dh-art" src={`/assets/dept/${id}.svg`} alt="" width="480" height="340" />
          </div>
        </div>
      </div>

      <div className={`wrap detail-body${data.translated ? "" : " mixed-dir"}`}>
        {!data.translated && <p className="note small top-note" dir="auto">{t.notTranslated}</p>}
        {data.page
          ? <FullGuide page={data.page} storeKey={`road-${id}-${slug}`} level={result?.top?.includes(slug) ? result.level : null} />
          : <Summary track={data} />}

        <section aria-labelledby="sOthers">
          <h2 id="sOthers">{fill(t.others, { dept: deptName })}</h2>
          <ul className="chips track-chips">
            {data.others.filter((o) => o.slug !== slug).map((o) => (
              <li key={o.slug}><Link className="chip link" to={`/departments/${id}/tracks/${o.slug}`}>{o.name}</Link></li>
            ))}
          </ul>
        </section>

        <section className="cta-band">
          <div><h2>{t.quizAgain}</h2><p>{fill(t.quizAgainSub, { dept: deptName })}</p></div>
          <div className="cta">
            <Link className="btn invert" to={`/departments/${id}/quiz`}>{t.bandBtn}</Link>
            <Link className="btn outline-light" to={`/departments/${id}`}>{t.deptGuide}</Link>
          </div>
        </section>
      </div>
    </>
  );
}
