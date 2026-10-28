import { useEffect, useRef, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { DEPTS, NAV } from "../data.js";
import { LANGS, useLang } from "../i18n/index.jsx";
import { DeptIcon, Icon, Logo } from "./bits.jsx";

const FLAGS = { en: "gb", so: "so", ar: "sa" };   // English: UK, Somali: Somalia, Arabic: Saudi Arabia
const Flag = ({ l }) => <span className={`fi fi-${FLAGS[l]} flag`} aria-hidden="true" />;

/* Closes a dropdown on outside click or Escape. */
function useDismiss(open, setOpen, ref) {
  useEffect(() => {
    if (!open) return;
    const click = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const key = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("click", click);
    document.addEventListener("keydown", key);
    return () => { document.removeEventListener("click", click); document.removeEventListener("keydown", key); };
  }, [open, setOpen, ref]);
}

function LangMenu() {
  const { lang, setLang } = useLang();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useDismiss(open, setOpen, ref);
  return (
    <div className={`lang-dd${open ? " open" : ""}`} ref={ref}>
      <button type="button" className="lang-btn" aria-haspopup="listbox" aria-expanded={open} aria-label="Language" onClick={() => setOpen(!open)}>
        <Flag l={lang} /><span className="lang-name">{LANGS[lang].meta.label}</span><Icon name="chevron-down" />
      </button>
      <ul className="lang-list" role="listbox" aria-label="Language">
        {Object.keys(FLAGS).map((l) => (
          <li key={l} role="presentation">
            <button type="button" role="option" aria-selected={l === lang} onClick={() => { setLang(l); setOpen(false); }}>
              <Flag l={l} /><span>{LANGS[l].meta.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ThemeSwitch() {
  const { ui } = useLang();
  const [dark, setDark] = useState(() => document.documentElement.getAttribute("data-theme") === "dark");
  const toggle = () => {
    const t = dark ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", t);
    try { localStorage.setItem("theme", t); } catch { /* private mode */ }
    setDark(!dark);
  };
  return (
    <button type="button" className="theme-switch" role="switch" aria-checked={dark} aria-label={ui.theme} onClick={toggle}>
      <Icon name="sun" /><Icon name="moon" /><span className="knob" />
    </button>
  );
}

function DeptMenu({ onPick }) {
  const { T, ui } = useLang();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useDismiss(open, setOpen, ref);
  const hover = () => window.matchMedia("(hover:hover) and (min-width: 861px)").matches;
  const on = pathname.startsWith("/departments/");
  return (
    <li className={`has-dd${on ? " on" : ""}${open ? " open" : ""}`} ref={ref}
      onMouseEnter={() => hover() && setOpen(true)} onMouseLeave={() => hover() && setOpen(false)}>
      <button type="button" className="dd-btn" aria-haspopup="true" aria-expanded={open} onClick={() => setOpen(!open)}>
        {ui.nav.depts} <Icon name="chevron-down" />
      </button>
      <div className="dd-menu" role="menu">
        {DEPTS.map((d) => (
          <NavLink key={d.id} role="menuitem" to={`/departments/${d.id}`} onClick={() => { setOpen(false); onPick(); }}
            aria-current={pathname.startsWith(`/departments/${d.id}`) ? "page" : undefined}>
            <DeptIcon id={d.id} /><span>{T.depts[d.id].name}</span>
          </NavLink>
        ))}
      </div>
    </li>
  );
}

function Header() {
  const { ui } = useLang();
  const { pathname } = useLocation();
  const [navOpen, setNavOpen] = useState(false);
  const menuBtn = useRef(null), closeBtn = useRef(null);

  useEffect(() => {
    document.documentElement.classList.toggle("nav-open", navOpen);
    if (navOpen) closeBtn.current?.focus();
    const key = (e) => { if (e.key === "Escape" && navOpen) { setNavOpen(false); menuBtn.current?.focus(); } };
    const resize = () => { if (window.innerWidth > 860) setNavOpen(false); };
    document.addEventListener("keydown", key);
    window.addEventListener("resize", resize);
    return () => { document.removeEventListener("keydown", key); window.removeEventListener("resize", resize); };
  }, [navOpen]);

  const close = () => setNavOpen(false);
  const brand = <Link className="brand" to="/" aria-label="CS Career, home" onClick={close}><Logo /></Link>;

  return (
    <header className="topbar">
      <div className="wrap bar">
        {brand}
        <nav className={`nav${navOpen ? " open" : ""}`} id="nav" aria-label="Main">
          <div className="nav-head">
            {brand}
            <button type="button" className="icon-btn nav-close" ref={closeBtn} aria-label={ui.close} onClick={() => { close(); menuBtn.current?.focus(); }}><Icon name="x" /></button>
          </div>
          <ul>
            {NAV.map((n) => n.menu
              ? <DeptMenu key={n.key} onPick={close} />
              : (
                <li key={n.key}>
                  <Link to={n.href} onClick={close} className={n.page && pathname.startsWith(n.href) ? "on" : undefined}
                    aria-current={n.page && pathname.startsWith(n.href) ? "page" : undefined}>{ui.nav[n.key]}</Link>
                </li>
              ))}
          </ul>
        </nav>
        <div className={`nav-overlay${navOpen ? " open" : ""}`} onClick={close} />
        <div className="tools">
          <ThemeSwitch />
          <LangMenu />
          <button type="button" className="icon-btn menu-btn" ref={menuBtn} aria-label="Menu" aria-expanded={navOpen} aria-controls="nav" onClick={() => setNavOpen(!navOpen)}>
            <Icon name="menu-2" />
          </button>
        </div>
      </div>
    </header>
  );
}

function BackTop() {
  const { ui } = useLang();
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 480);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const top = () => window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  return (
    <button type="button" className={`back-top${show ? " show" : ""}`} aria-label={ui.top} title={ui.top} onClick={top}>
      <Icon name="arrow-up" />
    </button>
  );
}

/* Scroll to the #hash target, or to the top on a new page. */
function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash.length > 1) {
      const el = document.getElementById(hash.slice(1));
      if (el) { requestAnimationFrame(() => el.scrollIntoView()); return; }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

export default function Layout() {
  const { ui } = useLang();
  return (
    <>
      <ScrollManager />
      <Header />
      <main id="main"><Outlet /></main>
      <footer className="footer">
        <div className="wrap foot">
          <div className="foot-text">
            <p className="copy">{ui.copy.replace("{year}", new Date().getFullYear())}</p>
            <p className="foot-note">{ui.footer}</p>
          </div>
          <a href="#top" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0 }); }}>{ui.top}</a>
        </div>
      </footer>
      <BackTop />
    </>
  );
}
