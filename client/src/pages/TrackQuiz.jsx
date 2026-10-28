import { useRef, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { DEPTS } from "../data.js";
import { fill, useLang } from "../i18n/index.jsx";
import { api, local, useApi } from "../lib/api.js";
import { Crumbs, Icon, LoadError, Loading, Logo, useTitle } from "../components/bits.jsx";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const STUDENT_KEY = "student";

/* Step 1: who the student is (remembered on this device for next time). */
function AboutYou({ onDone }) {
  const { ui } = useLang();
  const q = ui.tq;
  const [f, setF] = useState(() => ({ name: "", studentId: "", phone: "", email: "", className: "", consent: false, ...local.get(STUDENT_KEY, {}) }));
  const [err, setErr] = useState(null);
  const set = (k) => (e) => { setErr(null); setF({ ...f, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value }); };

  const submit = (e) => {
    e.preventDefault();
    const check = !f.name.trim() ? ["name", q.needName] : !f.studentId.trim() ? ["studentId", q.needId]
      : f.email.trim() && !EMAIL.test(f.email.trim()) ? ["email", q.badEmail] : !f.consent ? ["consent", q.needConsent] : null;
    if (check) { setErr(check); document.getElementById(`f-${check[0]}`)?.focus(); return; }
    const { consent, ...keep } = f;
    local.set(STUDENT_KEY, keep);
    onDone({ ...f, name: f.name.trim(), studentId: f.studentId.trim() });
  };
  const bad = (k) => (err?.[0] === k ? true : undefined);

  return (
    <form className="about-form" onSubmit={submit} noValidate>
      <h2 className="q-title">{q.aboutYou}</h2>
      <p className="muted">{q.aboutSub}</p>
      <div className="form-grid">
        <div><label htmlFor="f-name">{q.name}</label><input id="f-name" autoComplete="name" value={f.name} onChange={set("name")} placeholder={q.phName} aria-invalid={bad("name")} required /></div>
        <div><label htmlFor="f-studentId">{q.studentId}</label><input id="f-studentId" dir="ltr" value={f.studentId} onChange={set("studentId")} placeholder={q.phId} aria-invalid={bad("studentId")} required /></div>
        <div><label htmlFor="f-phone">{q.phone}</label><input id="f-phone" type="tel" dir="ltr" autoComplete="tel" inputMode="tel" value={f.phone} onChange={set("phone")} placeholder={q.phPhone} /></div>
        <div><label htmlFor="f-email">{q.email}</label><input id="f-email" type="email" dir="ltr" autoComplete="email" inputMode="email" value={f.email} onChange={set("email")} placeholder="name@example.com" aria-invalid={bad("email")} /></div>
        <div className="span-2"><label htmlFor="f-className">{q.className}</label><input id="f-className" dir="ltr" value={f.className} onChange={set("className")} placeholder={q.phClass} /></div>
      </div>
      <label className="check" htmlFor="f-consent">
        <input id="f-consent" type="checkbox" checked={f.consent} onChange={set("consent")} aria-invalid={bad("consent")} />
        <span>{q.consent}</span>
      </label>
      {err && <p className="err" role="alert">{err[1]}</p>}
      <div className="q-actions"><button className="btn primary big" type="submit">{q.start} <Icon name="arrow-right" className="dir-icon" /></button></div>
    </form>
  );
}

function Progress({ label, pct }) {
  return (
    <>
      <p className="q-top">{label}</p>
      <div className="bar-track"><div className="bar-fill" style={{ width: `${pct}%` }} /></div>
    </>
  );
}

function Result({ dept, deptName, result, onRetake }) {
  const { ui } = useLang();
  const q = ui.tq, t = ui.tracks;
  const shown = result.percents.filter((p) => result.top.includes(p.track));
  const rest = result.percents.filter((p) => !result.top.includes(p.track));
  return (
    <div className="result">
      <div className="q-success" role="status"><Icon name="circle-check" /><p>{ui.quiz.success}</p></div>
      <h2 className="q-title mt">{q.resultTitle}</h2>
      <p className="muted">{q.resultSub}</p>
      {shown.map((p, i) => (
        <div key={p.track} className={`res-item match${i === 0 ? " top" : ""}`}>
          <div className="grow">
            <small>{i === 0 ? ui.quiz.best : ui.quiz.also}</small>
            <h3>{p.name}</h3>
            <div className="meter" role="img" aria-label={`${p.pct}%`}><span style={{ width: `${p.pct}%` }} /></div>
          </div>
          <b className="pct">{p.pct}%</b>
          <Link className="btn ghost" to={`/departments/${dept}/tracks/${p.track}`}>{q.openGuide}</Link>
        </div>
      ))}
      {result.flat
        ? <p className="note">{q.flat}</p>
        : result.reasons.length > 0 && (
          <div className="note why"><b>{q.why}</b><ul>{result.reasons.map((r, i) => <li key={i} dir="auto">“{r}”</li>)}</ul></div>
        )}
      <p className="level-line"><Icon name="stairs-up" /> {fill(q.level, { level: t.levels[result.level] })}</p>
      {rest.length > 0 && (
        <details className="all-tracks">
          <summary>{q.all}</summary>
          <ul>{rest.map((p) => (
            <li key={p.track}><Link to={`/departments/${dept}/tracks/${p.track}`}>{p.name}</Link><span className="meter small"><span style={{ width: `${p.pct}%` }} /></span><b>{p.pct}%</b></li>
          ))}</ul>
        </details>
      )}
      <div className="q-actions">
        <Link className="btn primary" to={`/departments/${dept}/tracks/${result.top[0]}`}>{q.openGuide}</Link>
        <Link className="btn ghost" to={`/departments/${dept}`}>{deptName}</Link>
        <button type="button" className="btn ghost" onClick={onRetake}>{q.retake}</button>
      </div>
    </div>
  );
}

export default function TrackQuiz() {
  const { id } = useParams();
  const { lang, T, ui } = useLang();
  const q = ui.tq;
  const d = DEPTS.find((x) => x.id === id);
  const deptName = d ? T.depts[id].name : id;
  const { data, error, loading, reload } = useApi(d ? `/departments/${id}/quiz?lang=${lang}` : null);
  useTitle(`${fill(q.title, { dept: deptName })} · CS Career`);

  // stage: about | ask | level | sending | result
  const [stage, setStage] = useState("about");
  const [student, setStudent] = useState(null);
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [lvl, setLvl] = useState({ step: 0, year: null, built: null, skills: [] });
  const [result, setResult] = useState(null);
  const [sendErr, setSendErr] = useState(null);
  const started = useRef(0);
  const box = useRef(null);
  // Next step: bring the quiz box back into view (the form above it is taller) and focus its first option
  const focusBox = () => requestAnimationFrame(() => {
    const el = box.current;
    if (!el) return;
    if (el.getBoundingClientRect().top < 0) el.scrollIntoView({ block: "start" });
    el.querySelector(".opt, .btn.primary, input")?.focus({ preventScroll: true });
  });

  if (!d) return <Navigate to="/#departments" replace />;

  const restart = () => {
    setStage("ask"); setI(0); setAnswers([]); setLvl({ step: 0, year: null, built: null, skills: [] }); setResult(null); setSendErr(null);
    started.current = Date.now();
    focusBox();
  };

  const send = async (level) => {
    setStage("sending"); setSendErr(null);
    try {
      const r = await api("/attempts", {
        method: "POST",
        body: {
          dept: id, lang, durationMs: Date.now() - started.current,
          student: { ...student, consent: true },
          answers: data.questions.map((x, k) => ({ question: x.id, value: answers[k] })),
          level: { year: level.year, built: level.built, skills: level.skills }
        }
      });
      local.set(`track-result-${id}`, { top: r.top, level: r.level });
      setResult(r);
      setStage("result");
    } catch (e) {
      if (e.status === 409) { reload(); setSendErr(q.changed); setStage("ask"); setI(0); setAnswers([]); return; }
      setSendErr(q.saveError);
      setStage("level");
    }
  };

  let body;
  if (error) body = <LoadError error={error} onRetry={reload} />;
  else if (loading || !data) body = <Loading />;
  else if (stage === "about") body = <AboutYou onDone={(s) => { setStudent(s); restart(); }} />;
  else if (stage === "sending") body = <div className="q-status" role="status"><Logo className="logo-load" /><p>{q.sending}</p></div>;
  else if (stage === "result") body = <Result dept={id} deptName={deptName} result={result} onRetake={restart} />;
  else if (stage === "ask") {
    const total = data.questions.length, cur = data.questions[i];
    body = (
      <>
        <Progress label={fill(q.statement, { n: i + 1, t: total })} pct={Math.round((i / (total + 3)) * 100)} />
        {sendErr && <p className="err" role="alert">{sendErr}</p>}
        {!data.translated && <p className="note small">{ui.tracks.notTranslated}</p>}
        <h2 className="q-title statement" dir="auto">{cur.text}</h2>
        <div className="likert" role="radiogroup" aria-label={cur.text}>
          {q.scale.map((label, v) => (
            <button key={v} type="button" role="radio" aria-checked={answers[i] === v + 1}
              className={`opt likert-opt${answers[i] === v + 1 ? " on" : ""}`}
              onClick={() => {
                const next = [...answers]; next[i] = v + 1; setAnswers(next);
                if (i + 1 < total) setI(i + 1); else setStage("level");
                focusBox();
              }}>
              <span className="dot" aria-hidden="true" />{label}
            </button>
          ))}
        </div>
        <button type="button" className="q-back" onClick={() => { if (i > 0) setI(i - 1); else setStage("about"); }}>{q.back}</button>
      </>
    );
  } else {
    const total = data.questions.length, step = lvl.step;
    const choose = (k, v) => { setLvl({ ...lvl, [k]: v, step: step + 1 }); focusBox(); };
    const toggleSkill = (k) => setLvl({ ...lvl, skills: lvl.skills.includes(k) ? lvl.skills.filter((x) => x !== k) : [...lvl.skills, k] });
    body = (
      <>
        <Progress label={fill(q.levelStep, { n: step + 1 })} pct={Math.round(((total + step) / (total + 3)) * 100)} />
        {sendErr && <p className="err" role="alert">{sendErr}</p>}
        {step === 0 && (<><h2 className="q-title">{q.year}</h2><div className="opts">{q.years.map((y, k) => <button key={k} type="button" className={`opt${lvl.year === k ? " on" : ""}`} onClick={() => choose("year", k)}>{y}</button>)}</div></>)}
        {step === 1 && (<><h2 className="q-title">{q.built}</h2><div className="opts">{q.builts.map((y, k) => <button key={k} type="button" className={`opt${lvl.built === k ? " on" : ""}`} onClick={() => choose("built", k)}>{y}</button>)}</div></>)}
        {step === 2 && (
          <>
            <h2 className="q-title">{q.skills}</h2>
            <div className="opts">
              {data.levelSkills.map((s, k) => (
                <label key={k} dir="auto" className={`opt check-opt${lvl.skills.includes(k) ? " on" : ""}`}>
                  <input type="checkbox" checked={lvl.skills.includes(k)} onChange={() => toggleSkill(k)} />
                  <span className="box" aria-hidden="true"><Icon name="check" /></span>{s}
                </label>
              ))}
            </div>
            <div className="q-actions">
              <button type="button" className="btn primary big" onClick={() => send(lvl)}>
                {lvl.skills.length ? q.finish : `${q.none} · ${q.finish}`}
              </button>
            </div>
          </>
        )}
        <button type="button" className="q-back" onClick={() => { if (step > 0) setLvl({ ...lvl, step: step - 1 }); else { setStage("ask"); setI(total - 1); } }}>{q.back}</button>
      </>
    );
  }

  return (
    <>
      <div className="page-head">
        <div className="wrap">
          <Crumbs items={[{ to: "/", label: ui.nav.home }, { to: `/departments/${id}`, label: deptName }, { label: ui.nav.quiz }]} />
          <div className="dh-grid quiz-grid">
            <div className="dh-copy"><h1>{fill(q.title, { dept: deptName })}</h1><p className="lead">{q.sub}</p></div>
            <img className="dh-art" src="/assets/quiz.svg" alt="" width="480" height="340" />
          </div>
        </div>
      </div>
      <div className="wrap narrow quiz-wrap">
        <div ref={box} className={`quiz-box${stage === "ask" || stage === "level" || stage === "sending" ? " fixed" : ""}`} aria-live="polite">{body}</div>
      </div>
    </>
  );
}
