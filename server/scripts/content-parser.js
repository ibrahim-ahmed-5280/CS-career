/* Reads a department draft (docs/content/<dept>-draft.md) into plain objects:
   { tracks: [{ slug, order, en: { name, line, day, aiDoes, humansOwn, careers, page? } }],
     questions: [{ order, en, weights }], levelSkills: [...] }
   The drafts are the format lecturers review; see docs/content/README.md. */

const clean = (s) => s
  .replace(/\*\*(.+?)\*\*/g, "$1")
  .replace(/(^|[^*\w])\*([^*\n]+)\*/g, "$1$2")
  .replace(/`([^`]+)`/g, "$1")
  .trim();

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const stripLinks = (s) => s.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");

/* Split markdown into { heading: body } for one heading level ("## " or "### "). */
function sections(md, level) {
  const mark = "#".repeat(level) + " ";
  const out = [];
  let cur = null;
  for (const ln of md.split(/\r?\n/)) {
    if (ln.startsWith(mark)) { cur = { title: ln.slice(mark.length).trim(), body: [] }; out.push(cur); }
    else if (cur) cur.body.push(ln);
  }
  return out.map((s) => ({ title: s.title, body: s.body.join("\n").trim() }));
}

const bullets = (body) => body.split("\n").filter((l) => l.startsWith("- ")).map((l) => l.slice(2).trim());
const paragraph = (body) => body.split("\n").filter((l) => l.trim() && !l.startsWith(">")).join(" ").trim();

/* "- **Label:** text" → { label, text } */
function labelled(body) {
  return bullets(body).map((b) => {
    const m = b.match(/^\*\*(.+?):?\*\*:?\s*(.*)$/);
    return m ? { label: clean(m[1]).replace(/:$/, ""), text: cap(clean(m[2])) } : { label: "", text: clean(b) };
  });
}

/* Blocks introduced by a bold line such as "**Beginner**" or "**Free**". */
function boldBlocks(body) {
  const out = {};
  let key = null;
  for (const ln of body.split("\n")) {
    const m = ln.match(/^\*\*(.+)\*\*$/);
    if (m) { key = m[1]; out[key] = []; } else if (key && ln.trim()) out[key].push(ln);
  }
  return out;
}

function roadmap(body) {
  const blocks = boldBlocks(body);
  const steps = (lines = []) => lines.filter((l) => /^\d+\.\s/.test(l)).map((l) => {
    const m = l.replace(/^\d+\.\s+/, "").match(/^\*\*(.+?)\*\*\s*(.*)$/);
    if (!m) return { title: clean(l.replace(/^\d+\.\s+/, "")), text: "" };
    return { title: clean(m[1]).replace(/[:.]$/, ""), text: cap(clean(m[2].replace(/^:\s*/, ""))) };
  });
  return { beginner: steps(blocks.Beginner), intermediate: steps(blocks.Intermediate), jobReady: steps(blocks["Job-ready"]) };
}

/* "- [Name](url): what it is (kind)"; two links in one line become two resources. */
function resources(body) {
  const out = [];
  for (const [title, lines] of Object.entries(boldBlocks(body))) {
    const free = /^free/i.test(title);
    for (const l of lines.filter((x) => x.startsWith("- "))) {
      let s = l.slice(2).trim();
      let kind = "docs";
      const k = s.match(/\s\((\w+)\)$/);
      if (k) { kind = k[1]; s = s.slice(0, k.index).trim(); }
      const links = [...s.matchAll(/\[([^\]]+)\]\(([^)]+)\)/g)];
      // The note starts at the first ": " after the last link (link names can contain colons)
      const last = links.at(-1);
      const colon = s.indexOf(": ", last ? last.index + last[0].length : 0);
      const desc = colon >= 0 ? cap(clean(stripLinks(s.slice(colon + 2)))) : "";
      if (links.length > 1) links.forEach((m) => out.push({ name: m[1], url: m[2], desc, kind, free }));
      else out.push({ name: clean(stripLinks(colon >= 0 ? s.slice(0, colon) : s)), url: links[0]?.[2] || "", desc, kind, free });
    }
  }
  return out;
}

function fullPage(md) {
  const s = Object.fromEntries(sections(md, 3).map((x) => [x.title, x.body]));
  const related = paragraph(s["Related tracks"] || "");
  return {
    what: clean(paragraph(s["What it is"] || "")),
    day: clean(paragraph(s["A day in the job"] || "")),
    ai: labelled(s["How AI is changing this job"] || ""),
    roadmap: roadmap(s.Roadmap || ""),
    projects: labelled(s["Projects to build"] || ""),
    resources: resources(s["Where to learn"] || ""),
    certifications: clean(paragraph(s.Certifications || "")),
    careers: labelled(s.Careers || ""),
    related: related ? related.split(" · ").map(clean) : []
  };
}

export function parseDepartment(md) {
  const top = sections(md, 2);
  const part = (prefix) => top.find((x) => x.title.startsWith(prefix))?.body || "";

  // 1. Tracks: the table gives slug, name and one line; each "### Name (`slug`)" gives the rest
  const tracksMd = part("1.");
  const tracks = [...tracksMd.matchAll(/^\| `(\w+)` \| (.+?) \| (.+?) \|$/gm)].map((m, i) => ({
    slug: m[1], order: i + 1, en: { name: m[2].trim(), line: clean(m[3]) }
  }));
  for (const sec of sections(tracksMd, 3)) {
    const slug = sec.title.match(/\(`(\w+)`\)/)?.[1];
    const t = tracks.find((x) => x.slug === slug);
    if (!t) continue;
    const info = Object.fromEntries(labelled(sec.body).map((x) => [x.label, cap(x.text)]));
    Object.assign(t.en, {
      day: info["A day in the job"] || "",
      aiDoes: info["AI already does"] || "",
      humansOwn: info["Humans still own"] || "",
      careers: info.Careers || ""
    });
  }

  // 2. Quiz: "| n | statement | be 2 · ops 1 |"
  const quizMd = part("2.");
  const questions = [...quizMd.matchAll(/^\| (\d+) \| (.+?) \| ([a-z]+ \d(?: · [a-z]+ \d)*) \|$/gm)].map((m) => ({
    order: Number(m[1]),
    en: clean(m[2]),
    weights: Object.fromEntries([...m[3].matchAll(/([a-z]+) (\d)/g)].map((w) => [w[1], Number(w[2])]))
  }));
  const l3 = quizMd.match(/^\| L3 \| .+? \| (.+?) \(1 point each\) \|$/m)?.[1] || quizMd.match(/\*\*L3 \(1 point each\):\*\* (.+)$/m)?.[1] || "";
  const levelSkills = l3.split(" · ").map((x) => clean(x).replace(/\.$/, "")).filter(Boolean);

  // 3. One full track page
  const pageSec = top.find((x) => x.title.startsWith("3. Full sample track page:"));
  if (pageSec) {
    const name = pageSec.title.split(":").slice(1).join(":").trim();
    const t = tracks.find((x) => x.en.name === name);
    if (t) t.en.page = fullPage(pageSec.body);
  }

  return { tracks, questions, levelSkills };
}
