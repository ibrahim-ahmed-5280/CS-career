# Computer Science: tracks and track quiz (DRAFT)

Status: draft for review by CS lecturers · Language: English (Somali and Arabic after approval) · Last reviewed: 2026-10-28

Same structure as [se-draft.md](se-draft.md). Scoring and starting-level rules are the same as in se-draft.md, section 2.

---

## 1. The tracks

| Id | Track | In one line |
|---|---|---|
| `swe` | Software Engineering | Turn CS foundations into real products used by people. |
| `algo` | Algorithms & Problem Solving | Find fast, correct solutions to hard problems. |
| `sys` | Systems & Cloud Infrastructure | Understand and build what runs underneath every program. |
| `ml` | AI & Machine Learning | Build software that learns from data. |
| `res` | Research & Academia | Discover new ideas, publish and teach. |

### Software Engineering (`swe`)
- **A day in the job:** pick a task from the board, design and write the code, write tests, open a pull request, review a teammate's work.
- **AI already does:** large parts of routine code, tests and documentation.
- **Humans still own:** design decisions, code review, correctness, understanding what the user really needs. A strong CS base is what lets you judge AI-written code.
- **Careers:** software developer, backend or full-stack engineer, later technical lead.
- For deeper specialisation, see the Software Engineering department tracks.

### Algorithms & Problem Solving (`algo`)
- **A day in the job:** design an efficient solution for a slow part of a system, prove it is correct, measure it. Many students also train for programming contests.
- **AI already does:** AI models now solve many contest-level problems and write standard algorithms instantly.
- **Humans still own:** choosing the right approach for a real system, proving correctness, explaining trade-offs. Technical interviews still test this skill directly.
- **Careers:** software engineer at product companies, algorithm engineer, quantitative developer, contest coach.
- Full sample page in section 3.

### Systems & Cloud Infrastructure (`sys`)
- **A day in the job:** find why a service uses too much memory, tune a database, work on the servers and networks that host applications.
- **AI already does:** config files, scripts, explaining kernel and network errors.
- **Humans still own:** performance analysis, reliability, security of the platform, understanding how the parts interact.
- **Careers:** systems engineer, cloud engineer, site reliability engineer (SRE), database engineer.

### AI & Machine Learning (`ml`)
- **A day in the job:** prepare data, train and evaluate a model, connect it to an application, check it works fairly on real users.
- **AI already does:** a lot of the code and even model selection (AutoML).
- **Humans still own:** framing the problem, data quality, evaluation, knowing when a model is wrong or unfair.
- **Careers:** ML engineer, AI engineer, data scientist. For deeper specialisation, see the Artificial Intelligence department tracks.

### Research & Academia (`res`)
- **A day in the job:** read papers, run experiments, write up results, teach and supervise students.
- **AI already does:** searching and summarising papers, writing experiment code, checking writing.
- **Humans still own:** asking original questions, designing honest experiments, interpreting results, teaching.
- **Careers:** university lecturer, research assistant, PhD student, research engineer at a lab.

---

## 2. The track quiz

| # | Statement | Weights |
|---|---|---|
| 1 | I enjoy puzzles where the real challenge is finding the fastest solution. | algo 2 · res 1 |
| 2 | I like building complete programs that other people actually use. | swe 2 |
| 3 | I'm curious what happens inside the computer when a program runs: memory, processes, the CPU. | sys 2 · algo 1 |
| 4 | Training a computer to learn from data sounds exciting to me. | ml 2 · res 1 |
| 5 | I enjoy reading about new ideas and asking "why does this work?" | res 2 · ml 1 |
| 6 | Timed programming contests, like ICPC or Codeforces, sound fun to me. | algo 2 |
| 7 | I like making slow software run fast. | sys 2 · algo 1 |
| 8 | I enjoy working in a team to ship features before a deadline. | swe 2 |
| 9 | Mathematics like linear algebra and probability doesn't scare me. I enjoy it. | ml 2 · res 1 |
| 10 | I'd like to understand how servers, networks and the cloud keep big services running. | sys 2 · swe 1 |
| 11 | Writing a clear explanation or paper about something I discovered appeals to me. | res 2 |
| 12 | I'd love to turn an AI model into a real feature inside an app. | ml 2 · swe 1 |

Weight totals per track: swe 6 · algo 6 · sys 6 · ml 7 · res 7.

### Level questions
- **L1 and L2:** same as se-draft.md.
- **L3 (1 point each):** Program comfortably in one language · Use Git and GitHub · Implement basic data structures (lists, stacks, trees) · Solve easy LeetCode or Codeforces problems · Use the Linux command line.

---

## 3. Full sample track page: Algorithms & Problem Solving

### What it is
Algorithms are step-by-step methods for solving problems. This track is about finding solutions that are correct and fast, even when the data is huge. It is the skill behind search engines, maps, routing mobile-money transactions, and nearly every technical interview at big software companies.

### A day in the job
At work: a feature is too slow with real data, so you analyse it, find the bottleneck and replace an O(n²) loop with a better data structure. As a student: solve two or three problems a day, join a weekly online contest, then read how others solved what you couldn't.

### How AI is changing this job
- **AI already does well:** AI models now solve many contest problems at a high level and write standard algorithms (sorting, graphs, dynamic programming) instantly.
- **What humans still own:** recognising which known problem a messy real situation really is; proving a solution is correct; understanding trade-offs between speed, memory and simplicity; spotting when AI-written code is subtly wrong.
- **Why still learn it:** interviews still test it without AI, contests ban AI during the contest, and problem-solving skill is what makes you good at directing AI.
- **Learn with AI, not instead of learning:** struggle with a problem for at least 30 minutes before looking. Then ask AI for a *hint*, not the solution. After solving, ask it to compare your approach with a better one.

### Roadmap

**Beginner**
1. **One language well for problem solving:** C++ or Python. Input/output, loops, arrays, strings, functions.
2. **Complexity:** Big-O, and why 10⁸ simple operations is roughly one second.
3. **Core data structures:** arrays, stacks, queues, hash maps, sets.
4. **Sorting, searching and two pointers.** Solve 50 easy problems.

**Intermediate**
5. **Recursion and backtracking.**
6. **Trees and graphs:** BFS, DFS, shortest paths.
7. **Dynamic programming:** start with classic problems, then patterns.
8. **Regular contests:** one rated contest a week on Codeforces or LeetCode.

**Job-ready**
9. **Advanced topics:** segment trees, union-find, advanced graph algorithms.
10. **Interview practice:** explain your solution out loud while coding, under time limits.
11. **Apply it to real systems:** profile and speed up a real project, then write about it.
12. **Teach it:** start or help run a university problem-solving club. Teaching locks the skill in.

### Projects to build
- **Beginner:** solve the first 50 problems of the CSES Problem Set and keep notes on each pattern.
- **Intermediate:** a route planner for Mogadishu districts using graph shortest paths, with a simple map.
- **Job-ready:** a university contest platform, or an open-source contribution that makes a known library faster, with benchmarks.

### Where to learn

**Free**
- [NeetCode](https://neetcode.io/): interview problems organised by pattern (practice)
- [CSES Problem Set](https://cses.fi/problemset/): classic problems from easy to hard (practice)
- [Competitive Programmer's Handbook](https://cses.fi/book/book.pdf): free book by Antti Laaksonen (book)
- [USACO Guide](https://usaco.guide/): structured path from beginner to advanced (course)
- [CP-Algorithms](https://cp-algorithms.com/): explanations of standard algorithms (docs)
- [Codeforces](https://codeforces.com/) and [LeetCode](https://leetcode.com/): weekly contests (practice)
- [MIT 6.006 Introduction to Algorithms](https://ocw.mit.edu/): full university course (course)

**Paid (worth it later)**
- *Introduction to Algorithms* (CLRS): the standard reference book (book)
- LeetCode Premium: only when preparing for specific company interviews (practice)

### Certifications
None needed. Your contest rating, solved-problem count and ICPC participation speak for you. Put them on your CV and GitHub.

### Careers
- **In Somalia:** software engineering roles where performance matters (telecoms, banks, mobile money), lecturing and coaching.
- **Remote and abroad:** strong problem solvers pass the interviews at large international software companies, which hire remotely and relocate.
- **Growth path:** contest training → internships → software engineer → senior engineer or researcher.

### Related tracks
Research & Academia · Software Engineering · AI & Machine Learning
