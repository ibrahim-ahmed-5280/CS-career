/* Track quiz scoring (docs/content/se-draft.md, section 2).
   answers: values 1–5, in the same order as questions.
   For each track: score = Σ weight × (answer − 1) / 4, percent = score / Σ weight. */
export function scoreTracks(questions, answers, trackSlugs) {
  const score = {}, max = {};
  trackSlugs.forEach((t) => { score[t] = 0; max[t] = 0; });
  questions.forEach((q, i) => {
    const v = (answers[i] - 1) / 4;
    for (const [t, w] of q.weights) {
      if (!(t in max)) continue;
      score[t] += w * v;
      max[t] += w;
    }
  });
  const percents = trackSlugs
    .filter((t) => max[t] > 0)
    .map((t) => ({ track: t, pct: Math.round((100 * score[t]) / max[t]) }))
    .sort((a, b) => b.pct - a.pct);

  const top = percents.slice(0, 2).map((p) => p.track);
  if (percents[2] && percents[1].pct - percents[2].pct <= 5) top.push(percents[2].track);

  // "You like a bit of everything": weak best match, or the top four very close together
  const four = percents.slice(0, 4);
  const flat = percents[0].pct < 55 || (four.length > 1 && four[0].pct - four[four.length - 1].pct <= 10);

  // The two statements that added the most to the best track
  const best = percents[0].track;
  const reasons = questions
    .map((q, i) => ({ id: q._id, pts: (q.weights.get(best) || 0) * (answers[i] - 1) / 4 }))
    .filter((r) => r.pts > 0)
    .sort((a, b) => b.pts - a.pts)
    .slice(0, 2)
    .map((r) => r.id);

  return { percents, top, flat, reasons };
}

/* Starting level of the roadmap: year (0–3) + built (0–3) + one point per skill. */
export function scoreLevel({ year, built, skills }) {
  const points = year + built + skills.length;
  const name = points <= 3 ? "beginner" : points <= 7 ? "intermediate" : "jobReady";
  return { year, built, skills, points, name };
}
