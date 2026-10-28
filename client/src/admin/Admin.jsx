import { createContext, useContext, useEffect, useState } from "react";
import { NavLink, Route, Routes, useNavigate } from "react-router-dom";
import { api } from "../lib/api.js";
import { Icon, Loading, Logo, useTitle } from "../components/bits.jsx";
import Overview from "./Overview.jsx";
import { Students, StudentDetail } from "./Students.jsx";
import { Content, TrackEditor } from "./Content.jsx";
import Questions from "./Questions.jsx";

const AdminContext = createContext(null);
export const useAdmin = () => useContext(AdminContext);

function Login({ onIn }) {
  useTitle("Sign in · CS Career admin");
  const [f, setF] = useState({ email: "", password: "" });
  const [err, setErr] = useState(null);
  const [busy, setBusy] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    setBusy(true); setErr(null);
    try { onIn(await api("/admin/login", { method: "POST", body: f })); }
    catch (x) { setErr(x.status === 429 ? "Too many attempts. Wait 15 minutes and try again." : x.message); }
    finally { setBusy(false); }
  };
  return (
    <div className="login-wrap">
      <form className="login" onSubmit={submit}>
        <Logo />
        <h1>Faculty dashboard</h1>
        <p className="muted">Sign in to see students' quiz results and edit the track content.</p>
        <label htmlFor="a-email">Email</label>
        <input id="a-email" type="email" autoComplete="username" required value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
        <label htmlFor="a-pass">Password</label>
        <input id="a-pass" type="password" autoComplete="current-password" required value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} />
        {err && <p className="err" role="alert">{err}</p>}
        <button className="btn primary big" type="submit" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
      </form>
    </div>
  );
}

const LINKS = [
  { to: "/admin", label: "Overview", icon: "chart-bar", end: true },
  { to: "/admin/students", label: "Students", icon: "users" },
  { to: "/admin/content", label: "Tracks", icon: "route" },
  { to: "/admin/questions", label: "Quiz questions", icon: "list-check" }
];

export default function Admin() {
  const [me, setMe] = useState(undefined);   // undefined: checking, null: signed out
  const navigate = useNavigate();
  useEffect(() => { api("/admin/me").then(setMe).catch(() => setMe(null)); }, []);

  if (me === undefined) return <Loading />;
  if (!me) return <Login onIn={setMe} />;

  const logout = async () => { await api("/admin/logout", { method: "POST" }).catch(() => {}); setMe(null); navigate("/admin"); };

  return (
    <AdminContext.Provider value={{ me, canEdit: me.role === "admin" }}>
      <div className="admin">
        <header className="admin-bar">
          <div className="wrap admin-bar-in">
            <NavLink to="/admin" className="brand"><Logo /><span className="admin-tag">Admin</span></NavLink>
            <nav className="admin-nav" aria-label="Dashboard">
              {LINKS.map((l) => <NavLink key={l.to} to={l.to} end={l.end}><Icon name={l.icon} />{l.label}</NavLink>)}
            </nav>
            <div className="admin-me">
              <span className="small muted">{me.name || me.email}{me.role === "viewer" && " · view only"}</span>
              <a className="icon-btn" href="/" title="Open the public site" aria-label="Open the public site"><Icon name="external-link" /></a>
              <button type="button" className="icon-btn" onClick={logout} title="Sign out" aria-label="Sign out"><Icon name="logout" /></button>
            </div>
          </div>
        </header>
        <main className="wrap admin-main">
          <Routes>
            <Route index element={<Overview />} />
            <Route path="students" element={<Students />} />
            <Route path="students/:id" element={<StudentDetail />} />
            <Route path="content" element={<Content />} />
            <Route path="content/:trackId" element={<TrackEditor />} />
            <Route path="questions" element={<Questions />} />
          </Routes>
        </main>
      </div>
    </AdminContext.Provider>
  );
}
