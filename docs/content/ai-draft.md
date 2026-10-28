# Artificial Intelligence: tracks and track quiz (DRAFT)

Status: draft for review by AI lecturers · Language: English (Somali and Arabic after approval) · Last reviewed: 2026-10-28

Same structure as [se-draft.md](se-draft.md). Scoring and starting-level rules are the same as in se-draft.md, section 2.

---

## 1. The tracks

| Id | Track | In one line |
|---|---|---|
| `mle` | Machine Learning Engineering | Train, evaluate and improve models that solve real problems. |
| `gen` | Generative AI & Agents | Build products and agents on top of large AI models. |
| `nlp` | NLP & Somali-Language AI | Make computers understand and produce human language, including Somali. |
| `cv` | Computer Vision | Teach computers to understand images and video. |
| `mlops` | MLOps | Take models to production and keep them reliable. |
| `gov` | AI Safety, Ethics & Governance | Make sure AI is safe, fair and used responsibly. |

### Machine Learning Engineering (`mle`)
- **A day in the job:** prepare a dataset, train several models, compare them on a fair test set, ship the best one.
- **AI already does:** training code, hyper-parameter search, first analysis of results.
- **Humans still own:** framing the problem, data quality, honest evaluation, deciding when a model is good enough.
- **Careers:** ML engineer, applied scientist, data scientist.

### Generative AI & Agents (`gen`)
- **A day in the job:** connect an app to a language model, give it tools, build search over documents (RAG), measure answer quality, cut cost per request.
- **AI already does:** much of the code itself, which is why this track is about judgement and evaluation.
- **Humans still own:** deciding where AI is safe and useful, evaluation, security against prompt injection, privacy, cost.
- **Careers:** AI engineer, LLM/agent engineer, AI product engineer.
- Full sample page in section 3.

### NLP & Somali-Language AI (`nlp`)
- **A day in the job:** collect and clean Somali text or speech, test how well models understand it, fine-tune or evaluate a model for translation, speech or search.
- **AI already does:** large models handle major languages well; Somali is still a low-resource language where they make many mistakes.
- **Humans still own:** language knowledge, good datasets, evaluation by native speakers. This is a real opportunity for Somali engineers.
- **Careers:** NLP engineer, speech engineer, language data specialist, researcher.

### Computer Vision (`cv`)
- **A day in the job:** label images, train a model to detect objects, test it in real lighting and camera conditions, run it on a phone or camera.
- **AI already does:** strong pre-trained models and auto-labelling tools.
- **Humans still own:** collecting representative data, testing in real conditions, privacy around cameras and faces.
- **Careers:** computer vision engineer, robotics perception engineer, medical imaging or agritech AI engineer.

### MLOps (`mlops`)
- **A day in the job:** package a model as a service, automate retraining, monitor drift and cost, roll back a bad model.
- **AI already does:** deployment configs and monitoring scripts.
- **Humans still own:** reliability, incident decisions, governance, cost control.
- **Careers:** MLOps engineer, ML platform engineer.

### AI Safety, Ethics & Governance (`gov`)
- **A day in the job:** test an AI system for bias and harmful answers, write an organisation's AI usage policy, assess risk before a launch, follow AI regulations.
- **AI already does:** automated red-teaming and evaluation at scale.
- **Humans still own:** values, judgement, accountability, communicating risk to leaders.
- **Careers:** AI governance specialist, responsible-AI analyst, AI policy advisor, AI evaluation engineer.

---

## 2. The track quiz

| # | Statement | Weights |
|---|---|---|
| 1 | I enjoy training models and tuning them until they perform better. | mle 2 · cv 1 |
| 2 | Building assistants or agents that use tools and complete tasks excites me. | gen 2 · mlops 1 |
| 3 | I'd love to build AI that understands and speaks Somali. | nlp 2 · gen 1 |
| 4 | Teaching computers to recognise objects in photos or videos sounds exciting. | cv 2 · mle 1 |
| 5 | I care whether AI is fair, safe and used responsibly. | gov 2 · nlp 1 |
| 6 | I want to take a model from a notebook to a reliable product that real users depend on. | mlops 2 · mle 1 |
| 7 | Language fascinates me: grammar, meaning, translation. | nlp 2 |
| 8 | Writing prompts, connecting tools and testing how well an AI system answers sounds fun. | gen 2 · gov 1 |
| 9 | I like maths such as linear algebra, probability and calculus. | mle 2 · cv 1 |
| 10 | Using drones, cameras or satellite images to solve real problems interests me. | cv 2 |
| 11 | I enjoy automating, monitoring and keeping systems running smoothly. | mlops 2 · gen 1 |
| 12 | I'd like to help write rules and policies for how organisations use AI. | gov 2 |

Weight totals per track: mle 6 · gen 6 · nlp 5 · cv 6 · mlops 5 · gov 5.

### Level questions
- **L1 and L2:** same as se-draft.md.
- **L3 (1 point each):** Python with NumPy and pandas · Train a model with scikit-learn · Build a neural network with PyTorch · Call an AI model through its API · Explain vectors, matrices and probability basics.

---

## 3. Full sample track page: Generative AI & Agents

### What it is
Generative AI engineers build products on top of large AI models: assistants that answer customer questions, tools that summarise documents, and agents that can search, call APIs and complete multi-step tasks. The model is a component; the engineer's job is to make the whole system useful, accurate, safe and affordable.

### A day in the job
Improve a support assistant for a mobile-money company: its answers in Somali were wrong for some questions. Add the missing documents to the search index, adjust the instructions, run the evaluation set of 200 real questions, compare before and after, and check the cost per conversation stayed within budget.

### How AI is changing this job
- **AI already does well:** writing much of the application code, prompts and test cases. AI coding agents can build a working prototype in an afternoon.
- **What humans still own:** choosing problems where AI really helps; building evaluation sets and judging quality; protecting against prompt injection and data leaks; privacy of user data; controlling cost and latency; knowing when *not* to use AI.
- **AI tools to learn:** at least one major model API, an AI coding agent, an evaluation tool, and a way to run open models locally. Concepts last longer than tools: tool use, retrieval (RAG), structured output, evaluation, agents, and the Model Context Protocol (MCP).
- **Learn with AI, not instead of learning:** build the first version of each concept by hand (a RAG pipeline without a framework, an agent loop in 50 lines) before using frameworks, so you understand what they hide.

### Roadmap

**Beginner**
1. **Python and APIs:** functions, JSON, HTTP requests, environment variables for keys.
2. **How language models work:** tokens, context windows, temperature, why they make things up.
3. **Your first AI app:** call a model API, get structured JSON back, show it in a simple web page.
4. **Prompting properly:** clear instructions, examples, asking for a specific format.

**Intermediate**
5. **Tool use:** let the model call your functions, such as checking a balance or searching a database.
6. **Retrieval (RAG):** embeddings, vector search (for example pgvector), chunking documents, citing sources.
7. **Evaluation:** build a test set, measure accuracy, compare versions automatically.
8. **Open models:** run a small open model on your own computer and compare it with an API model.

**Job-ready**
9. **Agents:** multi-step loops, planning, memory, when to stop and ask a human.
10. **MCP and integrations:** connect models to real tools and data safely.
11. **Safety and security:** prompt injection, data leakage, content filters, logging, human review.
12. **Production:** caching, cost and latency budgets, monitoring answer quality over time.

### Projects to build
- **Beginner:** a study helper that turns lecture notes into quiz questions in JSON.
- **Intermediate:** a "Hormuud University FAQ" assistant that answers only from official documents and cites its source, with an evaluation set of 50 questions in Somali and English.
- **Job-ready:** an agent that helps a small shop: reads orders, checks stock through tools, drafts replies for a human to approve, with logs, evaluation and cost tracking.

### Where to learn

**Free**
- [DeepLearning.AI short courses](https://www.deeplearning.ai/short-courses/): short practical courses on RAG, agents and evaluation (course)
- [Hugging Face Learn](https://huggingface.co/learn): LLM and agents courses, open models (course)
- [Anthropic courses](https://github.com/anthropics/courses): prompting and tool use, hands-on notebooks (course)
- [Model Context Protocol](https://modelcontextprotocol.io/): the standard for connecting models to tools and data (docs)
- [Neural Networks: Zero to Hero](https://karpathy.ai/zero-to-hero.html): Andrej Karpathy builds language models from scratch (video)
- [Ollama](https://ollama.com/): run open models on your own computer (tool)

**Paid (worth it later)**
- API credits for model providers: start with free tiers and small budgets; set spending limits from day one (tool)

### Certifications
Not needed. This field moves faster than certificates. A public portfolio of working AI apps with evaluation results is what employers look for.

### Careers
- **In Somalia:** banks, telecoms and mobile-money companies building customer assistants; NGOs automating reports; startups building Somali-language products.
- **Remote and abroad:** one of the fastest-growing engineering roles worldwide, very remote-friendly.
- **Growth path:** software developer → AI engineer → senior AI engineer or AI product lead.

### Related tracks
NLP & Somali-Language AI · MLOps · AI Safety, Ethics & Governance · Software Engineering: AI-Powered Apps
