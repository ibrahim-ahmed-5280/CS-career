import { lazy, Suspense } from "react";
import { Link, Navigate, Route, Routes, useSearchParams } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import { Loading } from "./components/bits.jsx";
import { useLang } from "./i18n/index.jsx";
import Home from "./pages/Home.jsx";
import Department from "./pages/Department.jsx";
import Track from "./pages/Track.jsx";
import TrackQuiz from "./pages/TrackQuiz.jsx";
import Quiz from "./pages/Quiz.jsx";
import Contact from "./pages/Contact.jsx";

// Students never download the dashboard code
const Admin = lazy(() => import("./admin/Admin.jsx"));

/* Old addresses (printed QR codes, shared links) keep working. */
function OldDepartment() {
  const [p] = useSearchParams();
  return <Navigate to={p.get("d") ? `/departments/${p.get("d")}` : "/#departments"} replace />;
}

function NotFound() {
  const { ui } = useLang();
  return (
    <div className="wrap state">
      <p>{ui.tracks.notFound}</p>
      <Link className="btn ghost" to="/">{ui.nav.home}</Link>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/admin/*" element={<Suspense fallback={<Loading />}><Admin /></Suspense>} />
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="departments/:id" element={<Department />} />
        <Route path="departments/:id/quiz" element={<TrackQuiz />} />
        <Route path="departments/:id/tracks/:slug" element={<Track />} />
        <Route path="quiz" element={<Quiz />} />
        <Route path="contact" element={<Contact />} />
        <Route path="index.html" element={<Navigate to="/" replace />} />
        <Route path="department.html" element={<OldDepartment />} />
        <Route path="quiz.html" element={<Navigate to="/quiz" replace />} />
        <Route path="contact.html" element={<Navigate to="/contact" replace />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
