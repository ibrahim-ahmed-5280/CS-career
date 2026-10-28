import { useEffect } from "react";
import { Link } from "react-router-dom";
import { DEPT_ICONS } from "../data.js";
import { useLang } from "../i18n/index.jsx";

export const Icon = ({ name, className = "" }) => <i className={`ti ti-${name} ${className}`} aria-hidden="true" />;

export const DeptIcon = ({ id }) => <Icon name={DEPT_ICONS[id] || "point"} />;

export const Logo = ({ className = "" }) => (
  <span className={`logo ${className}`}><b>CS</b><span>career</span><i className="cursor" /></span>
);

export function Crumbs({ items }) {
  return (
    <nav className="crumbs" aria-label="Breadcrumb">
      {items.map((it, i) => (
        <span key={i} className="crumb">
          {i > 0 && <span aria-hidden="true">/</span>}
          {it.to ? <Link to={it.to}>{it.label}</Link> : <span>{it.label}</span>}
        </span>
      ))}
    </nav>
  );
}

/* Resource list: name, kind, free / paid pill (and a short note when given). */
export function ResLinks({ list }) {
  const { ui } = useLang();
  const k = ui.detail.kinds;
  return list.map((r, i) => {
    const inner = (
      <>
        <span className="res-name"><span>{r.name}</span>{r.desc && <small className="res-desc">{r.desc}</small>}</span>
        <span className="meta"><small>{k[r.kind] || r.kind}</small><span className={`pill ${r.free ? "free" : "paid"}`}>{r.free ? ui.detail.free : ui.detail.paid}</span></span>
      </>
    );
    return r.url
      ? <a key={i} href={r.url} target="_blank" rel="noopener noreferrer">{inner}</a>
      : <div key={i} className="res-row">{inner}</div>;
  });
}

export function Loading() {
  const { ui } = useLang();
  return <div className="state"><Logo className="logo-load" /><p className="muted">{ui.tracks.loading}</p></div>;
}

export function LoadError({ error, onRetry }) {
  const { ui } = useLang();
  const missing = error?.status === 404;
  return (
    <div className="state">
      <Icon name={missing ? "map-question" : "wifi-off"} className="state-icon" />
      <p>{missing ? ui.tracks.notFound : ui.tracks.error}</p>
      {missing ? <Link className="btn ghost" to="/">{ui.nav.home}</Link>
        : <button type="button" className="btn ghost" onClick={onRetry}>{ui.tracks.retry}</button>}
    </div>
  );
}

/* Sets the browser tab title. */
export function useTitle(title) {
  useEffect(() => { if (title) document.title = title; }, [title]);
}
