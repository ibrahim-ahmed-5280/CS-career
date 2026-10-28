import { useState } from "react";
import { CONFIG } from "../data.js";
import { useLang } from "../i18n/index.jsx";
import { Crumbs, Icon, useTitle } from "../components/bits.jsx";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const isReal = (url) => url && !url.includes("YOUR-");

function LinkRow({ k, v, href, ext }) {
  return (
    <li>
      <a href={href} {...(ext ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
        <span className="k">{k}</span><span className="v">{v}</span>
      </a>
    </li>
  );
}

export default function Contact() {
  const { ui } = useLang();
  const c = ui.contact, U = CONFIG.university, C = CONFIG;
  useTitle(c.pageTitle);
  const [f, setF] = useState({ name: "", email: "", msg: "" });
  const [err, setErr] = useState(null);
  const set = (k) => (e) => { setErr(null); setF({ ...f, [k]: e.target.value }); };

  const text = () => {
    const email = f.email.trim(), msg = f.msg.trim();
    const fail = !email ? ["email", c.needEmail] : !EMAIL.test(email) ? ["email", c.badEmail] : !msg ? ["msg", c.needMsg] : null;
    if (fail) { setErr(fail); document.getElementById(`f-${fail[0]}`)?.focus(); return null; }
    return (f.name.trim() ? f.name.trim() + "\n" : "") + email + "\n\n" + msg;
  };
  const strip = (u) => u.replace(/^https?:\/\/(www\.)?/, "");

  return (
    <>
      <div className="page-head">
        <div className="wrap">
          <Crumbs items={[{ to: "/", label: ui.nav.home }, { label: c.title }]} />
          <div className="dh-grid">
            <div className="dh-copy"><h1>{c.title}</h1><p className="lead">{c.sub}</p></div>
            <img className="dh-art" src="/assets/contact.svg" alt="" width="480" height="340" />
          </div>
        </div>
      </div>
      <div className="wrap sec">
        <div className="two contact">
          <div className="panel">
            <p className="muted small">{c.by}</p>
            <p className="who">{C.name}</p>
            <p className="muted">{c.role}</p>
            <ul className="links">
              <LinkRow k={c.email} v={C.email} href={`mailto:${C.email}`} />
              <LinkRow k={c.phone} v={C.phone} href={`tel:${C.phone}`} />
              <LinkRow k="WhatsApp" v={C.phone} href={`https://wa.me/${C.whatsapp}`} ext />
              {isReal(C.linkedin) && <LinkRow k={c.linkedin} v={strip(C.linkedin)} href={C.linkedin} ext />}
              {isReal(C.github) && <LinkRow k={c.github} v={strip(C.github)} href={C.github} ext />}
            </ul>
            <h3 className="h3 mt">{c.uniTitle}</h3>
            <ul className="links">
              <LinkRow k={c.uniSite} v={U.site.replace("https://", "")} href={U.site} ext />
              <LinkRow k={c.uniAdm} v="students.hu.edu.so" href={U.admission} ext />
              <LinkRow k={c.email} v={U.email} href={`mailto:${U.email}`} />
              <LinkRow k={c.phone} v={U.phone} href={`tel:${U.phone}`} />
            </ul>
          </div>
          <form className="panel" id="contactForm" noValidate onSubmit={(e) => e.preventDefault()}>
            <h3 className="h3">{c.formTitle}</h3>
            <label htmlFor="f-name">{c.fName}</label>
            <input id="f-name" type="text" autoComplete="name" placeholder={c.phName} value={f.name} onChange={set("name")} />
            <label htmlFor="f-email">{c.fEmail}</label>
            <input id="f-email" type="email" inputMode="email" dir="auto" autoComplete="email" placeholder={c.phEmail} required value={f.email} onChange={set("email")} aria-invalid={err?.[0] === "email" || undefined} />
            <label htmlFor="f-msg">{c.fMsg}</label>
            <textarea id="f-msg" rows="6" placeholder={c.phMsg} value={f.msg} onChange={set("msg")} aria-invalid={err?.[0] === "msg" || undefined} />
            {err && <p className="err" role="alert">{err[1]}</p>}
            <div className="cta">
              <button type="button" className="btn primary" id="sendMail" onClick={() => { const t = text(); if (t) location.href = `mailto:${C.email}?subject=${encodeURIComponent(c.subject)}&body=${encodeURIComponent(t)}`; }}>
                <Icon name="mail" /><span>{c.sendMail}</span>
              </button>
              <button type="button" className="btn ghost" id="sendWa" onClick={() => { const t = text(); if (t) window.open(`https://wa.me/${C.whatsapp}?text=${encodeURIComponent(c.waIntro + "\n\n" + t)}`, "_blank", "noopener"); }}>
                <Icon name="brand-whatsapp" /><span>{c.sendWa}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
