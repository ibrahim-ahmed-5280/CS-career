# Data Science: tracks and track quiz (DRAFT)

Status: draft for review by DS lecturers · Language: English (Somali and Arabic after approval) · Last reviewed: 2026-10-28

Same structure as [se-draft.md](se-draft.md). Scoring and starting-level rules are the same as in se-draft.md, section 2.

---

## 1. The tracks

| Id | Track | In one line |
|---|---|---|
| `ba` | Data Analyst & BI | Answer business questions with data, charts and dashboards. |
| `de` | Data Engineering | Build the pipelines and storage that move data reliably. |
| `dsml` | Data Scientist & ML | Use statistics and machine learning to predict and explain. |
| `ae` | Analytics Engineering | Turn raw data into clean, trusted models everyone can use. |
| `mlops` | MLOps | Deploy machine-learning models and keep them working. |

### Data Analyst & BI (`ba`)
- **A day in the job:** a manager asks why sales dropped in one region. Query the data, build a chart, find the reason, present it clearly.
- **AI already does:** writing SQL from plain questions, generating charts and first summaries.
- **Humans still own:** asking the right question, checking the data is right, understanding the business, telling the story honestly.
- **Careers:** data analyst, BI analyst, reporting analyst, monitoring & evaluation (M&E) analyst at NGOs.
- Full sample page in section 3.

### Data Engineering (`de`)
- **A day in the job:** build a pipeline that loads daily transactions into a warehouse, fix a job that failed overnight, make queries cheaper.
- **AI already does:** pipeline code, SQL transformations, schema suggestions.
- **Humans still own:** architecture, data quality, reliability, privacy and access control.
- **Careers:** data engineer, ETL developer, big-data engineer.

### Data Scientist & ML (`dsml`)
- **A day in the job:** explore a dataset, build a model that predicts customer churn or rainfall, test whether it is accurate and fair, explain it.
- **AI already does:** feature code, model selection (AutoML), first-pass analysis.
- **Humans still own:** framing the problem, experiment design, statistics that hold up, knowing when a model should not be trusted.
- **Careers:** data scientist, ML analyst, research analyst.

### Analytics Engineering (`ae`)
- **A day in the job:** write tested SQL models that turn raw tables into clean "customers" and "orders" tables, document metrics so every team uses the same numbers.
- **AI already does:** SQL and documentation drafts.
- **Humans still own:** defining metrics correctly, testing, agreement across teams.
- **Careers:** analytics engineer, BI developer, data modeller.

### MLOps (`mlops`)
- **A day in the job:** package a model as an API, automate retraining, monitor whether accuracy drops as real data changes.
- **AI already does:** deployment configs, monitoring scripts.
- **Humans still own:** reliability, deciding when to retrain or roll back, cost, governance.
- **Careers:** MLOps engineer, ML platform engineer, ML engineer.

---

## 2. The track quiz

| # | Statement | Weights |
|---|---|---|
| 1 | I enjoy turning messy numbers into a clear chart or dashboard. | ba 2 · ae 1 |
| 2 | I like building pipelines that move data automatically from one place to another. | de 2 · mlops 1 |
| 3 | Predicting the future from past data, like sales or rainfall, excites me. | dsml 2 · ba 1 |
| 4 | I like presenting findings and persuading people with evidence. | ba 2 |
| 5 | Writing clean, tested SQL that other analysts rely on sounds satisfying. | ae 2 · de 1 |
| 6 | I'm curious how machine-learning models are deployed and kept accurate over time. | mlops 2 · dsml 1 |
| 7 | Statistics and probability are subjects I enjoy. | dsml 2 |
| 8 | I care that data is correct, documented and consistent across a whole organisation. | ae 2 · de 1 |
| 9 | Working with big-data tools and cloud databases interests me. | de 2 · mlops 1 |
| 10 | I enjoy experimenting: try a model, measure it, improve it. | dsml 2 · mlops 1 |
| 11 | I'd rather automate and monitor systems than analyse the results myself. | mlops 2 · de 1 |
| 12 | I like understanding a business problem before touching the data. | ba 2 · ae 1 |

Weight totals per track: ba 7 · de 7 · dsml 7 · ae 6 · mlops 7.

### Level questions
- **L1 and L2:** same as se-draft.md.
- **L3 (1 point each):** Excel or Google Sheets formulas and pivot tables · Write SQL queries · Use Python with pandas · Build a dashboard (Power BI, Tableau or Looker Studio) · Explain mean, median and standard deviation.

---

## 3. Full sample track page: Data Analyst & BI

### What it is
Data analysts turn raw data into answers people can act on. A telecom wants to know which areas have the most dropped calls; an NGO needs to show donors whether a programme worked; a bank wants to understand who stops using its app. The analyst finds the data, checks it, analyses it and explains the answer clearly.

### A day in the job
Morning: update the weekly dashboard and notice an odd spike. Midday: query the database to find the cause (a data entry error in one branch). Afternoon: build an analysis for a manager's question and present three charts with a clear recommendation.

### How AI is changing this job
- **AI already does well:** turning plain questions into SQL, generating charts, summarising tables, drafting reports. Many BI tools now have a built-in AI assistant.
- **What humans still own:** knowing which question really matters; checking that the data and the AI-written query are correct; understanding the local context behind the numbers; presenting honestly without misleading charts.
- **AI tools to learn:** the AI assistant inside your BI tool (Power BI or similar), and an AI chat for writing and explaining SQL and Python. Always read and test the SQL AI writes: a wrong JOIN gives confident, wrong numbers.
- **Learn with AI, not instead of learning:** write the query yourself first, then compare with the AI's version. Ask AI to find flaws in your conclusions.

### Roadmap

**Beginner**
1. **Spreadsheets properly:** formulas, lookups, pivot tables, cleaning data.
2. **Basic statistics:** averages, spread, percentages, correlation vs causation.
3. **SQL:** SELECT, WHERE, JOIN, GROUP BY on real datasets.
4. **Charts that are honest:** choosing the right chart, labelling it clearly.

**Intermediate**
5. **A BI tool:** Power BI (common in local organisations) or Looker Studio (free).
6. **Python for analysis:** pandas for cleaning and analysing larger data.
7. **Data storytelling:** turning an analysis into a short presentation with one clear message.
8. **Survey and M&E data:** sampling, indicators, before/after comparison (very common in Somali NGO work).

**Job-ready**
9. **Advanced SQL:** window functions, CTEs, query performance.
10. **Experiments:** A/B testing and what statistical significance really means.
11. **AI-assisted analysis:** use AI to speed up queries and drafts, with a habit of verifying every number.
12. **Portfolio:** 3 public projects with real data, each with a dashboard and a written summary.

### Projects to build
- **Beginner:** analyse Somalia rainfall or food-price data from the Humanitarian Data Exchange in Google Sheets.
- **Intermediate:** a Power BI dashboard for a fictional mobile-money company: transactions per region, growth, top users.
- **Job-ready:** a full analysis of a real public dataset (health, education or markets in Somalia) with Python, a dashboard and a 1-page report for decision makers.

### Where to learn

**Free**
- [Kaggle Learn](https://www.kaggle.com/learn): Pandas, Data Visualization, Intro to SQL (course)
- [SQLBolt](https://sqlbolt.com/): interactive SQL lessons (practice)
- [Khan Academy Statistics](https://www.khanacademy.org/math/statistics-probability): statistics from the start (course)
- [StatQuest](https://www.youtube.com/@statquest): clear statistics videos (video)
- [Microsoft Learn: Power BI](https://learn.microsoft.com/training/powerplatform/power-bi): official free Power BI training (course)
- [Looker Studio](https://lookerstudio.google.com/): free dashboard tool (tool)
- [Humanitarian Data Exchange](https://data.humdata.org/): real datasets about Somalia (data)

**Paid (worth it later)**
- [Google Data Analytics Certificate](https://www.coursera.org/professional-certificates/google-data-analytics): beginner-friendly, financial aid available (cert)
- Microsoft PL-300 (Power BI Data Analyst): useful where organisations use Power BI (cert)

### Certifications
Helpful, not required. The Google certificate is a good structured start; PL-300 helps where Microsoft tools are used. A portfolio of real analyses still matters more.

### Careers
- **In Somalia:** data and M&E analysts at NGOs and UN agencies, banks, telecoms, mobile money, government statistics offices.
- **Remote and freelance:** dashboard building and data cleaning are common freelance jobs.
- **Growth path:** junior analyst → data analyst → senior analyst or analytics engineer → analytics manager, or move into data science.

### Related tracks
Analytics Engineering · Data Scientist & ML · Data Engineering
