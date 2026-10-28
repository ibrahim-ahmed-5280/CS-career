import { useState } from "react";
import { useLang } from "../i18n/index.jsx";
import { local } from "../lib/api.js";
import { Icon } from "./bits.jsx";

/* Numbered steps the student can tick off; progress is kept in this browser under storeKey. */
export function useProgress(storeKey, total) {
  const [done, setDone] = useState(() => {
    const a = local.get(storeKey, []);
    return Array.from({ length: total }, (_, i) => Boolean(a[i]));
  });
  const toggle = (i) => {
    const next = done.map((v, j) => (j === i ? !v : v));
    setDone(next);
    local.set(storeKey, next);
  };
  return [done, toggle];
}

export function ProgressBar({ done }) {
  const { ui } = useLang();
  const n = done.filter(Boolean).length;
  return (
    <div className="rm-progress">
      <div className="bar-track"><div className="bar-fill" style={{ width: `${Math.round((n / done.length) * 100) || 0}%` }} /></div>
      <p className="small muted">{ui.detail.progress.replace("{n}", n).replace("{t}", done.length)}</p>
    </div>
  );
}

/* steps: [{ title, text }]; offset numbers the tiles when one roadmap is split into levels. */
export function Steps({ steps, done, toggle, offset = 0 }) {
  const { ui } = useLang();
  return (
    <ol className="rm">
      {steps.map((s, k) => {
        const i = offset + k;
        return (
          <li key={i} className={done[i] ? "is-done" : ""}>
            <span className="rm-num" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
            <button type="button" className="rm-check" aria-pressed={done[i]} aria-label={`${ui.detail.markDone}: ${s.title}`} onClick={() => toggle(i)}>
              <Icon name="check" />
            </button>
            <h4>{s.title}</h4>
            {s.text && <p>{s.text}</p>}
          </li>
        );
      })}
    </ol>
  );
}
