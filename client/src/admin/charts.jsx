/* Single-series charts in the site blue. One colour, so no legend: the card title names the series.
   Every value is also in the tooltip and in the "Show as table" view. */
import { useState } from "react";

export function Bars({ rows, empty = "No answers yet." }) {
  const max = Math.max(1, ...rows.map((r) => r.value));
  if (!rows.some((r) => r.value)) return <p className="muted small chart-empty">{empty}</p>;
  return (
    <ul className="hbars">
      {rows.map((r) => (
        <li key={r.key} title={`${r.label}: ${r.value}`}>
          <span className="hb-label">{r.label}{r.sub && <small>{r.sub}</small>}</span>
          <span className="hb-track"><span className="hb-bar" style={{ width: r.value ? `max(2px, ${(r.value / max) * 100}%)` : 0 }} /></span>
          <span className="hb-val">{r.value}</span>
        </li>
      ))}
    </ul>
  );
}

/* Attempts per day: columns, the highest day labelled, others in the tooltip. */
export function Columns({ rows }) {
  const [hover, setHover] = useState(null);
  const max = Math.max(1, ...rows.map((r) => r.value));
  if (!rows.some((r) => r.value)) return <p className="muted small chart-empty">No answers in the last 30 days.</p>;
  const peak = rows.reduce((a, b) => (b.value > a.value ? b : a), rows[0]);
  return (
    <div className="cols-chart" onMouseLeave={() => setHover(null)}>
      <div className="cc-plot">
        {rows.map((r) => (
          <button type="button" key={r.key} className="cc-col" onMouseEnter={() => setHover(r)} onFocus={() => setHover(r)}
            aria-label={`${r.label}: ${r.value}`}>
            {r === peak && <span className="cc-peak">{r.value}</span>}
            <span className="cc-bar" style={{ height: `${(r.value / max) * 100}%` }} />
          </button>
        ))}
      </div>
      <div className="cc-axis small muted"><span>{rows[0].label}</span><span>{rows[rows.length - 1].label}</span></div>
      <p className="cc-tip small" aria-live="polite">{hover ? <><b>{hover.value}</b> on {hover.label}</> : " "}</p>
    </div>
  );
}

export function TableToggle({ rows, head }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" className="link-btn small" onClick={() => setOpen(!open)}>{open ? "Hide table" : "Show as table"}</button>
      {open && (
        <table className="tbl compact">
          <thead><tr><th>{head[0]}</th><th className="num">{head[1]}</th></tr></thead>
          <tbody>{rows.map((r) => <tr key={r.key}><td>{r.label}</td><td className="num">{r.value}</td></tr>)}</tbody>
        </table>
      )}
    </>
  );
}
