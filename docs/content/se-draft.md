# Software Engineering: tracks and track quiz (DRAFT)

Status: draft for review by SE lecturers · Language: English (Somali and Arabic after approval) · Last reviewed: 2026-10-28

This file is the content sample for the new per-department system. Once approved, the same structure becomes the `tracks` and `questions` data in MongoDB, editable from the admin.

---

## 1. The tracks

| Id | Track | In one line |
|---|---|---|
| `fe` | Frontend & Web | Build what users see and touch in the browser. |
| `be` | Backend & APIs | Build the logic, data and APIs behind every app. |
| `mob` | Mobile Apps | Build apps people install on Android and iPhone. |
| `aia` | AI-Powered Apps | Build products on top of AI models: assistants, chatbots, agents. |
| `ops` | DevOps & Cloud | Ship code safely and keep systems online at scale. |
| `qa` | Quality & Test Automation | Prove software works, and catch problems before users do. |
| `ux` | UI/UX & Product | Decide what to build and design how it feels to use. |

### Frontend & Web (`fe`)
- **A day in the job:** turn a Figma design into components, connect them to an API, fix a layout bug on small phones, review a teammate's pull request.
- **AI already does:** first drafts of components and styles, converting designs to starter code, writing simple tests.
- **Humans still own:** accessibility, performance on slow networks and cheap phones, consistent design systems, judging whether the UI actually makes sense.
- **Careers:** frontend developer, web developer, design engineer, full-stack developer (with backend).

### Backend & APIs (`be`)
- **A day in the job:** design an API endpoint, write a database query, add authentication, investigate why a payment request was slow.
- **AI already does:** boilerplate routes and models, simple queries, explaining error logs.
- **Humans still own:** data modelling, security, correctness with money and personal data, system design when traffic grows.
- **Careers:** backend developer, API engineer, full-stack developer, later software architect.
- Full sample page in section 3.

### Mobile Apps (`mob`)
- **A day in the job:** build a screen in Flutter or React Native, make it work offline, fix a crash reported on an old Android phone, publish an update to the Play Store.
- **AI already does:** screen layouts, state boilerplate, translating code between platforms.
- **Humans still own:** offline-first design for unstable networks, battery and data usage, app-store rules, testing on real devices.
- **Careers:** mobile developer (Flutter, React Native, Android/Kotlin, iOS/Swift).

### AI-Powered Apps (`aia`)
- **A day in the job:** connect an app to a language-model API, give the model tools it can call, build search over company documents (RAG), measure answer quality with evaluations, reduce cost per request.
- **AI already does:** a lot of the code. That is exactly why this track is about judgement.
- **Humans still own:** deciding where AI helps and where it is risky, evaluations, privacy, safety, cost control, Somali-language quality.
- **Careers:** AI application engineer, LLM/agent engineer, AI product engineer, full-stack developer with AI skills.

### DevOps & Cloud (`ops`)
- **A day in the job:** fix a failing CI pipeline, containerise a service with Docker, set up monitoring alerts, respond to an outage at night, cut the cloud bill.
- **AI already does:** config files, scripts, first reading of logs.
- **Humans still own:** reliability decisions, incident response, security of the infrastructure, cost trade-offs.
- **Careers:** DevOps engineer, site reliability engineer (SRE), cloud engineer, platform engineer.

### Quality & Test Automation (`qa`)
- **A day in the job:** write automated end-to-end tests, test an API, find the edge case that breaks checkout, decide whether a release is safe.
- **AI already does:** generating test cases and test code, summarising failures.
- **Humans still own:** knowing *what* matters to test, exploratory testing, release decisions, and testing AI features themselves (a fast-growing need).
- **Careers:** QA engineer, test automation engineer (SDET), quality lead.

### UI/UX & Product (`ux`)
- **A day in the job:** interview users, sketch flows, build a clickable Figma prototype, run a usability test, write requirements with developers.
- **AI already does:** quick mock-ups, first copy, summarising interview notes.
- **Humans still own:** understanding real users (especially local users with low bandwidth and different languages), deciding priorities, taste.
- **Careers:** UI/UX designer, product designer, product manager (later), UX researcher.

---

## 2. The track quiz

### Format
- 12 statements. The student answers each with a 5-point scale: **Strongly disagree (1) · Disagree (2) · Not sure (3) · Agree (4) · Strongly agree (5)**.
- Each statement gives weight **2** to its main track and **1** to a secondary track.
- After that, 3 short **level questions**. They do not change the track result. They choose where the roadmap starts.

### Statements and weights

| # | Statement | Weights |
|---|---|---|
| 1 | I like making screens look exactly right: spacing, colours and smooth animations. | fe 2 · ux 1 |
| 2 | I enjoy designing how data is stored and how parts of a system talk to each other. | be 2 · ops 1 |
| 3 | I would love to build an app that people install on their phones. | mob 2 · fe 1 |
| 4 | Building apps that use AI models, like assistants, chatbots or agents, excites me. | aia 2 · be 1 |
| 5 | I'm curious how big apps stay online when thousands of people use them at once. | ops 2 · be 1 |
| 6 | When I use an app, I notice bugs and strange cases that other people miss. | qa 2 · ux 1 |
| 7 | I like talking to users to understand their problem before anything gets built. | ux 2 · aia 1 |
| 8 | Making a slow page or a slow database query fast feels satisfying to me. | be 2 · fe 1 |
| 9 | I like writing scripts and tests that check my work automatically. | qa 2 · ops 1 |
| 10 | I enjoy experimenting with prompts and comparing how different AI models answer. | aia 2 · qa 1 |
| 11 | Phone features like the camera, GPS, notifications and offline mode interest me. | mob 2 |
| 12 | I would rather sketch and prototype an idea first than start writing code. | ux 2 · fe 1 |

Weight totals per track (the scoring below evens these out): fe 5 · be 6 · mob 4 · aia 5 · ops 4 · qa 5 · ux 6.

### Level questions (roadmap starting point)

| # | Question | Options and points |
|---|---|---|
| L1 | Which year are you in? | Year 1 (0) · Year 2 (1) · Year 3 (2) · Year 4 or graduate (3) |
| L2 | What is the biggest thing you have built? | Nothing yet (0) · Small exercises (1) · A complete project (2) · A project other people use (3) |
| L3 | Which of these can you already do? (choose all that apply) | Use Git and GitHub · Write HTML, CSS and JavaScript · Program comfortably in one language · Write SQL queries · Put an app online (1 point each) |

**Starting level:** total 0–3 → **Beginner** · 4–7 → **Intermediate** · 8 or more → **Job-ready**.

### Scoring (done on the server)

For each track `t`:

```
score_t = Σ  weight(q, t) × (answer_q − 1) / 4
max_t   = Σ  weight(q, t)
percent = round(100 × score_t / max_t)
```

- Dividing by `max_t` means a track is not favoured just because more statements point to it.
- **Result shown:** the top 2 tracks, or the top 3 when the third is within 5 points of the second.
- **"Why" line:** the 2 statements that added the most points to the top track, for example: *"You matched Backend & APIs 85% because you enjoy designing how data is stored and making slow queries fast."*
- **Flat result** (top track below 55%, or the top 4 within 10 points): show *"You like a bit of everything. Start with Backend & APIs or Frontend & Web, because both build the base every other track needs."*
- Answers, percentages and level are saved in `attempts`, so results can be recalculated if the weights change.

---

## 3. Full sample track page: Backend & APIs

> Template for all 35 track pages. Every page has the same 8 sections.

### What it is
Backend engineers build the part of an app you don't see: the server, the database and the APIs the app talks to. When you send money with a mobile wallet, log in, or search for a product, backend code checks who you are, does the work and stores the result safely.

### A day in the job
Morning stand-up with the team, then design a new API endpoint for a feature. After lunch, write the database query and tests for it, review a teammate's pull request, and look into an alert about slow responses. Small amounts of everything, with correctness always first.

### How AI is changing this job
- **AI already does well:** generating routes, models and simple CRUD code; writing first-draft queries and tests; explaining error messages and logs.
- **What humans still own:** designing data models that last; security (authentication, permissions, protecting personal data); correctness when money is involved; deciding what to do when traffic grows 10×; reviewing AI-written code before it ships.
- **AI tools to learn:** an AI coding assistant in your editor, an AI agent that can run your tests, and AI chat for explaining unfamiliar code. Pick one and learn it well; the names change, the habits don't.
- **Learn with AI, not instead of learning:** write the code yourself first, then ask AI to review it and explain what you missed. If you can't explain the code AI gave you, you are not ready to ship it.

### Roadmap

**Beginner**
1. **One language, properly:** JavaScript (Node.js) or Python. Functions, objects, errors, reading documentation.
2. **Git and GitHub from day one:** commit, branch, pull request.
3. **How the web works:** HTTP methods, status codes, JSON, headers.
4. **SQL basics:** SELECT, JOIN, GROUP BY, then design a small database.

**Intermediate**
5. **Build a REST API:** Express (Node) or FastAPI (Python), with input validation and clear error responses.
6. **Authentication and security:** password hashing, sessions or JWT, the OWASP Top 10 basics.
7. **Testing:** unit tests and API tests that run automatically.
8. **Deploy it:** Docker basics, environment variables, put an API online with HTTPS.

**Job-ready**
9. **Performance:** indexes, caching, pagination, finding slow queries.
10. **System design basics:** queues, background jobs, scaling, logging and monitoring.
11. **Add AI to a backend:** call a language-model API from your server, keep the API key secret, handle cost and failures.
12. **Team-grade work:** code review, documentation, a real contribution to a team or open-source project.

### Projects to build
- **Beginner:** a REST API for a school library (books, students, borrowing).
- **Intermediate:** a mobile-money-style wallet API with accounts, transfers, transaction history and proper authentication. Test what happens with two transfers at the same time.
- **Job-ready:** a deployed booking or delivery backend with background jobs and monitoring, plus one AI feature, such as answering customer questions in Somali using your own data.

### Where to learn

**Free**
- [Full Stack Open](https://fullstackopen.com/en/): Node.js, Express, MongoDB, testing (course)
- [The Odin Project: NodeJS path](https://www.theodinproject.com/): projects-first (course)
- [roadmap.sh: Backend](https://roadmap.sh/backend): the full map of topics (docs)
- [MDN: HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP): how the web really works (docs)
- [SQLBolt](https://sqlbolt.com/): interactive SQL lessons (practice)
- [Docker: Get started](https://docs.docker.com/get-started/): containers for beginners (docs)
- [PortSwigger Web Security Academy](https://portswigger.net/web-security): understand the attacks you must defend against (course)

**Paid (worth it later)**
- *Designing Data-Intensive Applications* by Martin Kleppmann: the classic system design book (book)
- [Boot.dev](https://www.boot.dev/): backend-focused path with lots of practice (course)

### Certifications
Not required for backend jobs: a strong GitHub portfolio matters more. If you want one, a cloud certificate such as AWS Certified Developer – Associate is the most useful. Skip paying for language-specific certificates.

### Careers
- **In Somalia:** backend and full-stack roles at telecoms, banks, mobile money and fintech companies, e-commerce and delivery startups, NGOs and government systems.
- **Remote and freelance:** backend work is one of the most remote-friendly roles. A deployed portfolio and good written English matter most.
- **Growth path:** junior backend developer → backend engineer → senior engineer → software architect or engineering lead.

### Related tracks
DevOps & Cloud · AI-Powered Apps · Frontend & Web (together they make full-stack)
