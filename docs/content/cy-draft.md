# Cybersecurity: tracks and track quiz (DRAFT)

Status: draft for review by Cybersecurity lecturers · Language: English (Somali and Arabic after approval) · Last reviewed: 2026-10-28

Same structure as [se-draft.md](se-draft.md). Scoring and starting-level rules are the same as in se-draft.md, section 2.

Every page in this department repeats one rule: **only test systems you own or have written permission to test.**

---

## 1. The tracks

| Id | Track | In one line |
|---|---|---|
| `soc` | SOC & Blue Team | Detect attacks and respond to them, every day. |
| `red` | Penetration Testing & Red Team | Find weaknesses legally, before criminals do. |
| `cloud` | Cloud Security | Protect systems and data in AWS, Azure and Google Cloud. |
| `appsec` | Application Security & DevSecOps | Build security into software from the start. |
| `dfir` | Digital Forensics & Incident Response | Investigate what happened and recover after an attack. |
| `grc` | Governance, Risk & Compliance | Manage risk, policies and regulations. |
| `aisec` | AI Security | Protect AI systems, and defend against AI-powered attacks. |

### SOC & Blue Team (`soc`)
- **A day in the job:** review alerts in the SIEM, decide which are real, investigate a suspicious login, write a new detection rule.
- **AI already does:** first triage of alerts, summarising incidents, writing detection queries.
- **Humans still own:** judgement on real vs false alarms, investigation, response decisions.
- **Careers:** SOC analyst, security analyst, detection engineer.
- Full sample page in section 3.

### Penetration Testing & Red Team (`red`)
- **A day in the job:** test a bank's web app (with a signed contract), find a vulnerability, prove the impact safely, write a clear report with fixes.
- **AI already does:** scanning, generating payload ideas, drafting reports.
- **Humans still own:** creativity, chaining small issues into real impact, ethics and scope, explaining risk to the client.
- **Careers:** penetration tester, red team operator, bug bounty hunter.

### Cloud Security (`cloud`)
- **A day in the job:** review permissions in a cloud account, fix a public storage bucket, set up alerts for risky changes.
- **AI already does:** misconfiguration scanning and policy suggestions.
- **Humans still own:** architecture, access design, trade-offs between security and speed.
- **Careers:** cloud security engineer, cloud security analyst.

### Application Security & DevSecOps (`appsec`)
- **A day in the job:** review code for security bugs, add security scanning to the CI pipeline, teach developers to fix common issues.
- **AI already does:** finding many common vulnerabilities in code and suggesting fixes; also *creating* new ones when developers accept AI code blindly.
- **Humans still own:** threat modelling, design reviews, judging real risk, working with developers.
- **Careers:** application security engineer, DevSecOps engineer, secure code reviewer.

### Digital Forensics & Incident Response (`dfir`)
- **A day in the job:** a company was hit by ransomware. Collect evidence, build the timeline, find how the attacker got in, help recover safely.
- **AI already does:** sorting large volumes of logs and evidence, timeline drafts.
- **Humans still own:** evidence handling that holds up legally, conclusions, calm leadership during a crisis.
- **Careers:** incident responder, forensic investigator, threat hunter.

### Governance, Risk & Compliance (`grc`)
- **A day in the job:** assess risk for a new system, check that controls meet a standard like ISO 27001, write policy, prepare for an audit.
- **AI already does:** drafting policies, mapping controls, summarising regulations.
- **Humans still own:** risk decisions, accountability, working with leadership and regulators.
- **Careers:** GRC analyst, information security officer, IT auditor, later CISO.

### AI Security (`aisec`)
- **A day in the job:** test a company chatbot for prompt injection and data leaks, secure the data used to train models, defend against AI-generated phishing and deepfakes.
- **AI already does:** automated red-teaming of models.
- **Humans still own:** a new and fast-changing field where human creativity and judgement matter most.
- **Careers:** AI security engineer, AI red-teamer, ML security researcher.

---

## 2. The track quiz

| # | Statement | Weights |
|---|---|---|
| 1 | I enjoy watching for unusual activity and spotting the one log line that looks wrong. | soc 2 · dfir 1 |
| 2 | Finding a way into a system, with permission, sounds exciting to me. | red 2 · appsec 1 |
| 3 | I'm curious how companies keep their data safe in AWS, Azure or Google Cloud. | cloud 2 |
| 4 | I like reading code and finding the mistake that makes it unsafe. | appsec 2 · red 1 |
| 5 | After an attack, I'd want to find out exactly what happened, step by step. | dfir 2 · soc 1 |
| 6 | Writing policies, checking rules are followed and assessing risk appeals to me. | grc 2 |
| 7 | I'm curious whether an AI chatbot can be tricked into doing things it shouldn't. | aisec 2 · red 1 |
| 8 | Staying calm and acting fast during an emergency describes me. | soc 2 · dfir 1 |
| 9 | I'd like to help developers build security into software from the start. | appsec 2 · cloud 1 |
| 10 | Recovering deleted files or tracing evidence on a phone or disk interests me. | dfir 2 |
| 11 | I enjoy explaining risk to managers in plain language. | grc 2 · aisec 1 |
| 12 | Securing systems that use AI models, and the data they learn from, interests me. | aisec 2 · cloud 1 |

Weight totals per track: soc 5 · red 4 · cloud 4 · appsec 5 · dfir 6 · grc 4 · aisec 5.

### Level questions
- **L1 and L2:** same as se-draft.md.
- **L3 (1 point each):** Explain IP addresses, ports and DNS · Use the Linux command line · Complete beginner rooms on TryHackMe or a CTF · Read and filter logs · Write a simple script in Python or Bash.

---

## 3. Full sample track page: SOC & Blue Team

### What it is
A Security Operations Centre (SOC) is the team that watches an organisation's systems around the clock, detects attacks and responds. Blue-team defenders are the first line of protection for banks, telecoms, mobile money and government systems: they find the attacker before real damage is done.

### A day in the job
Start the shift by reviewing overnight alerts. Most are harmless; one shows a staff account logging in from two countries within an hour. Investigate: check the login history, the device, the emails received. It was phishing. Lock the account, reset the password, find who else received the email, and write a detection rule so it is caught faster next time.

### How AI is changing this job
- **AI already does well:** first triage of alerts, summarising an incident from many logs, writing search queries, mapping activity to attacker techniques. Many security tools now include an AI assistant.
- **Attackers use AI too:** phishing messages are now well-written, even in Somali, and voice and video deepfakes exist. Defenders must expect this.
- **What humans still own:** deciding what is real; investigating unusual cases AI hasn't seen; response decisions that affect the business; explaining incidents to leadership.
- **Learn with AI, not instead of learning:** investigate first, then ask AI what you missed. Never paste real company logs or personal data into a public AI tool.

### Roadmap

**Beginner**
1. **Networking:** TCP/IP, ports, DNS, HTTP. You cannot defend what you don't understand.
2. **Linux and Windows basics:** command line, users, processes, where logs live.
3. **Security fundamentals:** CIA triad, authentication, common attacks, phishing.
4. **First labs:** TryHackMe beginner paths.

**Intermediate**
5. **Logs and SIEM:** search and correlate events in a SIEM such as Splunk or Wazuh.
6. **MITRE ATT&CK:** learn how attacker techniques are described and detected.
7. **Investigation practice:** blue-team challenges on LetsDefend or CyberDefenders.
8. **Email and endpoint analysis:** phishing headers, suspicious processes, basic malware triage.

**Job-ready**
9. **Detection engineering:** write and test your own detection rules.
10. **Incident response process:** contain, eradicate, recover, report.
11. **Automation and AI:** Python scripts and AI assistants to speed up triage, with human review.
12. **Certify and show:** Security+ or CySA+, plus write-ups of investigations you solved.

### Projects to build
- **Beginner:** a home lab with two virtual machines; generate normal and attack activity and find it in the logs.
- **Intermediate:** set up the free Wazuh SIEM, collect logs from your lab, write 5 detection rules mapped to MITRE ATT&CK.
- **Job-ready:** a phishing analysis toolkit: a script that extracts links, headers and attachments from an email and produces a report, with an AI summary checked by you.

### Where to learn

**Free**
- [TryHackMe](https://tryhackme.com/): beginner and SOC paths (many rooms free) (practice)
- [LetsDefend](https://letsdefend.io/): SOC analyst simulations (free tier) (practice)
- [CyberDefenders](https://cyberdefenders.org/): blue-team investigation labs (practice)
- [Wazuh](https://wazuh.com/): free open-source SIEM to build your lab (tool)
- [MITRE ATT&CK](https://attack.mitre.org/): the standard map of attacker techniques (docs)
- [Splunk free training](https://www.splunk.com/en_us/training/free-courses/overview.html): learn a widely used SIEM (course)
- [Professor Messer: Security+](https://www.professormesser.com/): free Security+ videos (video)

**Paid (worth it later)**
- CompTIA Security+: the most common first security certificate (cert)
- CompTIA CySA+: focused on SOC and analysis work (cert)
- TryHackMe subscription: unlocks the full SOC Level 1 and 2 paths (course)

### Certifications
For SOC roles, certificates help a lot with your first job. Security+ first, then CySA+ or a vendor SIEM certificate. Combine them with published write-ups to stand out.

### Careers
- **In Somalia:** banks, telecoms, mobile money, government cybersecurity teams, NGOs and UN agencies that handle sensitive data.
- **Remote and abroad:** many SOCs work in shifts across time zones and hire remotely.
- **Growth path:** SOC analyst (tier 1) → senior analyst / incident responder → detection engineer or SOC manager.

### Related tracks
Digital Forensics & Incident Response · Cloud Security · AI Security
