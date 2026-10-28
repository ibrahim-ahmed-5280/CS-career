# Information Technology: tracks and track quiz (DRAFT)

Status: draft for review by IT lecturers · Language: English (Somali and Arabic after approval) · Last reviewed: 2026-10-28

Same structure as [se-draft.md](se-draft.md). Scoring and starting-level rules are the same as in se-draft.md, section 2.

---

## 1. The tracks

| Id | Track | In one line |
|---|---|---|
| `cloud` | Cloud & DevOps | Run company systems in the cloud and automate how they are managed. |
| `net` | Networking | Design, build and fix the networks everything depends on. |
| `sys` | Systems Admin & IT Support | Keep computers, servers and users working every day. |
| `db` | Databases | Store, protect and serve the data organisations run on. |
| `itsm` | IT Service Management | Plan, lead and improve how IT serves an organisation. |

### Cloud & DevOps (`cloud`)
- **A day in the job:** create servers and databases in AWS or Azure with code, automate a deployment, check costs and alerts.
- **AI already does:** infrastructure-as-code templates, scripts, first reading of error logs.
- **Humans still own:** architecture choices, security settings, cost control, decisions during outages.
- **Careers:** cloud engineer, DevOps engineer, cloud support associate.

### Networking (`net`)
- **A day in the job:** configure switches and firewalls for a new office, fix a slow link, plan Wi-Fi coverage, monitor the network.
- **AI already does:** generating device configurations, spotting unusual traffic patterns, suggesting fixes from logs.
- **Humans still own:** network design, physical installation, troubleshooting real faults, security decisions.
- **Careers:** network administrator, network engineer, NOC engineer at an ISP or telecom.
- Full sample page in section 3.

### Systems Admin & IT Support (`sys`)
- **A day in the job:** set up laptops and accounts for new staff, patch servers, restore a lost file from backup, help a user who can't print.
- **AI already does:** answering common help-desk questions through chatbots, writing scripts, drafting documentation.
- **Humans still own:** hands-on fixes, trust with users, backups and recovery, security hygiene.
- **Careers:** IT support specialist, help-desk technician, system administrator.

### Databases (`db`)
- **A day in the job:** design tables for a new system, tune a slow query, schedule backups, manage who can see which data.
- **AI already does:** writing SQL from plain questions, suggesting indexes.
- **Humans still own:** data modelling, backup and recovery planning, access control, protecting personal data.
- **Careers:** database administrator, database developer, data engineer (with more programming).

### IT Service Management (`itsm`)
- **A day in the job:** run the help-desk process, plan a system upgrade with minimal disruption, report to management, manage IT vendors and budgets.
- **AI already does:** routing and summarising tickets, drafting reports and policies.
- **Humans still own:** priorities, people management, vendor negotiation, choosing what IT should do next.
- **Careers:** IT service manager, IT project manager, IT manager, later CIO.

---

## 2. The track quiz

| # | Statement | Weights |
|---|---|---|
| 1 | I enjoy figuring out why the internet or Wi-Fi isn't working. | net 2 · sys 1 |
| 2 | Helping people fix their computer problems makes me feel useful. | sys 2 · itsm 1 |
| 3 | I'm curious how companies run their apps on AWS, Azure or Google Cloud. | cloud 2 |
| 4 | I like organising information neatly so it is easy to find later. | db 2 · itsm 1 |
| 5 | Configuring routers, switches and firewalls sounds interesting to me. | net 2 |
| 6 | I like automating repeated tasks with scripts instead of doing them by hand. | cloud 2 · sys 1 |
| 7 | I enjoy writing queries to answer questions from data. | db 2 |
| 8 | I like planning, setting priorities and making sure work gets done on time. | itsm 2 |
| 9 | Keeping servers and computers updated, backed up and secure matters to me. | sys 2 · db 1 |
| 10 | Designing how an office or campus connects, like cables, Wi-Fi and VPNs, interests me. | net 2 |
| 11 | Being responsible for a system that must never go down sounds exciting. | cloud 2 · db 1 |
| 12 | I'd enjoy explaining technology to non-technical people and training them. | itsm 2 · sys 1 |

Weight totals per track: cloud 6 · net 6 · sys 7 · db 6 · itsm 6.

### Level questions
- **L1 and L2:** same as se-draft.md.
- **L3 (1 point each):** Install an operating system · Set up a home or small office network · Use the Linux command line · Write a simple script (Bash, PowerShell or Python) · Use a cloud console (AWS, Azure or Google Cloud).

---

## 3. Full sample track page: Networking

### What it is
Networking is how computers, phones and servers talk to each other. Network engineers design, build and protect the connections inside a company and across the internet. Every mobile-money transfer, video call and website depends on networks working.

### A day in the job
Check the monitoring dashboard: one branch office link is dropping packets. Trace it, find a faulty cable, replace it. Then configure VLANs and firewall rules for a new floor, and update the network diagram so the team knows what changed.

### How AI is changing this job
- **AI already does well:** generating router and switch configurations, spotting unusual traffic (AIOps), summarising alerts, explaining protocol errors.
- **What humans still own:** designing networks that fit the budget and building; installing and testing physical equipment; troubleshooting faults that span many devices; security decisions; responsibility when something breaks.
- **AI tools to learn:** the AI features in network monitoring tools, and an AI assistant for writing and checking configurations. Always test AI-written configs in a lab first, because one wrong line can take an office offline.
- **Learn with AI, not instead of learning:** do subnetting by hand until it is automatic. Use AI to quiz you and to explain packet captures you don't understand.

### Roadmap

**Beginner**
1. **How networks work:** the OSI and TCP/IP models, what happens when you open a website.
2. **IP addressing and subnetting:** IPv4 and IPv6, practise until it is fast.
3. **Core services:** DNS, DHCP, NAT.
4. **Build a home lab:** Cisco Packet Tracer, with a small office network.

**Intermediate**
5. **Switching:** VLANs, trunking, spanning tree.
6. **Routing:** static routes, OSPF.
7. **Wireless:** planning Wi-Fi coverage and securing it.
8. **Capture and read traffic:** Wireshark, to see the protocols for real.

**Job-ready**
9. **Network security:** firewalls, ACLs, VPNs, segmentation.
10. **Automation:** Python and Ansible to configure many devices at once.
11. **Cloud networking:** virtual networks, load balancers, connecting offices to the cloud.
12. **Certify and document:** CCNA, plus a portfolio of lab designs with diagrams.

### Projects to build
- **Beginner:** design the network for a small school in Packet Tracer: 3 classrooms, an office, Wi-Fi, internet.
- **Intermediate:** a multi-branch company network (Mogadishu, Hargeisa, Kismayo) with VLANs, OSPF and a site-to-site VPN in GNS3.
- **Job-ready:** a Python script that backs up and checks the configuration of every device in your lab, and alerts on changes.

### Where to learn

**Free**
- [Cisco Networking Academy](https://www.netacad.com/): CCNA courses and Packet Tracer (course)
- [Jeremy's IT Lab](https://www.youtube.com/@JeremysITLab): a complete free CCNA video course (video)
- [Professor Messer: Network+](https://www.professormesser.com/): free Network+ videos (video)
- [Wireshark](https://www.wireshark.org/): capture and study real traffic (tool)
- [GNS3](https://www.gns3.com/): build realistic virtual network labs (tool)
- [roadmap.sh: DevOps](https://roadmap.sh/devops): for the networking-to-cloud path (docs)

**Paid (worth it later)**
- Cisco CCNA exam: the most recognised networking certificate (cert)
- CompTIA Network+: a good first certificate if CCNA feels too big (cert)

### Certifications
Networking is one of the fields where certificates really help you get hired. Start with CCNA (or Network+ first). Later, add a security or cloud certificate depending on your direction.

### Careers
- **In Somalia:** telecoms and internet providers, banks, NGOs and UN agencies, government, universities and hospitals all need network staff.
- **Remote and abroad:** NOC roles and network automation work are increasingly remote.
- **Growth path:** IT support → network administrator → network engineer → network architect or security engineer.

### Related tracks
Cloud & DevOps · Systems Admin & IT Support · Cybersecurity department tracks
