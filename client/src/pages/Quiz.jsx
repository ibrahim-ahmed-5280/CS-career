import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { DEPTS, QUIZ_WEIGHTS } from "../data.js";
import { fill, useLang } from "../i18n/index.jsx";
import { Crumbs, DeptIcon, Icon, Logo, useTitle } from "../components/bits.jsx";

/* "Not decided yet?" quiz for new students: which department fits. Answers stay in the browser. */
const LOAD_MS = 1300, SUCCESS_MS = 1700;

export default function Quiz() {
  const { T, ui } = useLang();
  const q = ui.quiz;
  useTitle(`${q.title} · CS Career`);
  // stage: intro | ask | loading | success | result
  const [quiz, setQuiz] = useState({ i: 0, answers: [], stage: "intro" });
  const box = useRef(null);
  const focus = (sel) => requestAnimationFrame(() => box.current?.querySelector(sel)?.focus({ preventScroll: true }));

  useEffect(() => {
    if (quiz.stage === "loading") { const t = setTimeout(() => setQuiz((s) => ({ ...s, stage: "success" })), LOAD_MS); return () => clearTimeout(t); }
    if (quiz.stage === "success") { const t = setTimeout(() => { setQuiz((s) => ({ ...s, stage: "result" })); focus(".btn"); }, SUCCESS_MS); return () => clearTimeout(t); }
  }, [quiz.stage]);

  const total = q.q.length;
  let body;
  if (quiz.stage === "intro") {
    body = <div className="q-start"><button className="btn primary big" type="button" onClick={() => { setQuiz({ i: 0, answers: [], stage: "ask" }); focus(".opt"); }}>{q.start}</button></div>;
  } else if (quiz.stage === "loading") {
    body = <div className="q-status" role="status"><Logo className="logo-load" /><p>{q.loading}</p></div>;
  } else if (quiz.stage === "success") {
    body = <div className="q-status"><div className="q-success" role="status"><Icon name="circle-check" /><p>{q.success}</p></div></div>;
  } else if (quiz.stage === "result") {
    const score = Object.fromEntries(DEPTS.map((d) => [d.id, 0]));
    quiz.answers.forEach((a, qi) => Object.entries(QUIZ_WEIGHTS[qi][a]).forEach(([k, w]) => { score[k] += w; }));
    const ranked = [...DEPTS].sort((a, b) => score[b.id] - score[a.id]).slice(0, 3);
    body = (
      <>
        <h2 className="q-title">{q.resultTitle}</h2>
        <p className="muted">{q.resultSub}</p>
        {ranked.map((d, i) => (
          <div key={d.id} className={`res-item${i === 0 ? " top" : ""}`}>
            <span className="badge"><DeptIcon id={d.id} /></span>
            <div className="grow"><small>{i === 0 ? q.best : q.also}</small><h3>{T.depts[d.id].name}</h3></div>
            <Link className="btn ghost" to={`/departments/${d.id}`}>{q.view}</Link>
          </div>
        ))}
        <div className="q-actions"><button className="btn ghost" type="button" onClick={() => { setQuiz({ i: 0, answers: [], stage: "ask" }); focus(".opt"); }}>{q.retake}</button></div>
      </>
    );
  } else {
    const cur = q.q[quiz.i];
    body = (
      <>
        <p className="q-top">{fill(q.progress, { n: quiz.i + 1, t: total })}</p>
        <div className="bar-track"><div className="bar-fill" style={{ width: `${Math.round((quiz.i / total) * 100)}%` }} /></div>
        <h2 className="q-title">{cur.q}</h2>
        <div className="opts">
          {cur.o.map((o, k) => (
            <button key={k} type="button" className="opt" onClick={() => {
              const answers = [...quiz.answers]; answers[quiz.i] = k;
              setQuiz(quiz.i + 1 < total ? { ...quiz, answers, i: quiz.i + 1 } : { ...quiz, answers, stage: "loading" });
              focus(".opt");
            }}>{o}</button>
          ))}
        </div>
        {quiz.i > 0 && <button type="button" className="q-back" onClick={() => setQuiz({ ...quiz, i: quiz.i - 1 })}>{q.back}</button>}
      </>
    );
  }

  return (
    <>
      <div className="page-head">
        <div className="wrap">
          <Crumbs items={[{ to: "/", label: ui.nav.home }, { label: ui.nav.quiz }]} />
          <div className="dh-grid quiz-grid">
            <div className="dh-copy"><h1>{q.title}</h1><p className="lead">{q.sub}</p></div>
            <img className="dh-art" src="/assets/quiz.svg" alt="" width="480" height="340" />
          </div>
        </div>
      </div>
      <div className="wrap narrow quiz-wrap">
        <div ref={box} className={`quiz-box${["ask", "loading", "success"].includes(quiz.stage) ? " fixed" : ""}`} aria-live="polite">{body}</div>
      </div>
    </>
  );
}
