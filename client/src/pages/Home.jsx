import { Link } from "react-router-dom";
import { DEPTS, RESOURCES } from "../data.js";
import { useLang } from "../i18n/index.jsx";
import { DeptIcon, ResLinks, useTitle } from "../components/bits.jsx";

// Clickable areas over the 7 tiles painted on the wall photo (px in the 1941x808 image): x, y, w, h
const SLOTS = [[725, 198, 201, 204], [942, 207, 186, 191], [1143, 215, 163, 181], [1320, 222, 139, 171],
  [808, 421, 213, 209], [1037, 417, 187, 197], [1238, 414, 164, 188]];
const IW = 1941, IH = 808;
const pc = (v, t) => (v / t * 100).toFixed(2) + "%";

export default function Home() {
  const { T, ui } = useLang();
  const h = ui.hero, a = ui.about, d = ui.depts, p = ui.paths, q = ui.quiz;
  useTitle(T.meta.title);

  return (
    <>
      <section className="hero" id="top">
        <div className="hero-art">
          <div className="scene">
            <img className="scene-img" src="/assets/hero-wall.webp" width="1941" height="808" alt={h.photoAlt} />
            <nav className="wall-tiles" aria-label={d.title}>
              {DEPTS.map((x, i) => {
                const s = SLOTS[i];
                return (
                  <Link key={x.id} className="wt" to={`/departments/${x.id}`} title={T.depts[x.id].name}
                    style={{ "--x": pc(s[0], IW), "--y": pc(s[1], IH), "--w": pc(s[2], IW), "--h": pc(s[3], IH) }}>
                    <span className="sr">{T.depts[x.id].name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <h1>{h.title}</h1>
            <p className="lead">{h.sub}</p>
            <div className="cta">
              <a className="btn invert" href="#departments">{h.cta1}</a>
              <Link className="btn outline-light" to="/quiz">{h.cta2}</Link>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="sec">
        <div className="wrap">
          <header className="sec-head"><h2>{h.what.title}</h2><p>{h.what.text}</p></header>
          <div className="cols3">
            {a.cards.map((c, i) => <article key={i}><h3>{c.title}</h3><p>{c.text}</p></article>)}
          </div>
          <div className="tips">
            <h3 className="h3">{a.tipTitle}</h3>
            <ol>{a.tips.map((t, i) => <li key={i}>{t}</li>)}</ol>
          </div>
        </div>
      </section>

      <section id="departments" className="sec tint">
        <div className="wrap">
          <header className="sec-head"><h2>{d.title}</h2><p>{d.sub}</p></header>
          <div className="cards">
            {DEPTS.map((x) => (
              <Link key={x.id} className="dcard" to={`/departments/${x.id}`}>
                <span className="badge"><DeptIcon id={x.id} /></span>
                <h3>{T.depts[x.id].name}</h3>
                <p className="tag">{T.depts[x.id].tag}</p>
                <span className="go">{d.open}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="quiz" className="quiz-band">
        <div className="wrap band-row">
          <div className="band-copy"><h2>{q.title}</h2><p>{q.sub}</p></div>
          <Link className="btn primary big" to="/quiz">{q.start}</Link>
        </div>
      </section>

      <section id="learn" className="sec tint">
        <div className="wrap">
          <header className="sec-head"><h2>{p.title}</h2><p>{p.sub}</p></header>
          <h3 className="h3">{p.startTitle}</h3>
          <p className="muted">{p.startSub}</p>
          <div className="res"><ResLinks list={RESOURCES.common} /></div>
          <div className="two">
            <div><h3 className="h3">{p.payTitle}</h3><ol className="pay">{p.pay.map((x, i) => <li key={i}><b>{x.t}</b><span>{x.d}</span></li>)}</ol></div>
            <div><h3 className="h3">{p.habitTitle}</h3><ul className="habits">{p.habits.map((x, i) => <li key={i}>{x}</li>)}</ul></div>
          </div>
        </div>
      </section>
    </>
  );
}
