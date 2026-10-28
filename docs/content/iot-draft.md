# Internet of Things: tracks and track quiz (DRAFT)

Status: draft for review by IoT lecturers · Language: English (Somali and Arabic after approval) · Last reviewed: 2026-10-28

Same structure as [se-draft.md](se-draft.md). Scoring and starting-level rules are the same as in se-draft.md, section 2.

---

## 1. The tracks

| Id | Track | In one line |
|---|---|---|
| `emb` | Embedded Systems & Firmware | Write the code that runs inside devices. |
| `edge` | Edge AI & TinyML | Run AI directly on small, low-power devices. |
| `plat` | IoT Cloud & Platforms | Connect thousands of devices to the cloud and show their data. |
| `auto` | Industrial Automation & Robotics | Control machines, motors and industrial systems. |
| `sec` | IoT Security | Protect devices and the networks they connect to. |
| `agri` | Smart Agriculture & Water | Use sensors and data to help farmers, herders and water systems. |

### Embedded Systems & Firmware (`emb`)
- **A day in the job:** write C code for a microcontroller, read a new sensor, fix a bug that only happens after 3 days of running, reduce power use.
- **AI already does:** drivers and boilerplate code, explaining datasheets.
- **Humans still own:** working with real hardware, timing and memory limits, debugging with instruments, reliability.
- **Careers:** embedded software engineer, firmware engineer.

### Edge AI & TinyML (`edge`)
- **A day in the job:** collect sensor data, train a small model that recognises a sound or movement, shrink it to fit a microcontroller, test it in the field.
- **AI already does:** AutoML tools that design and compress models for you.
- **Humans still own:** collecting real data, choosing what is worth detecting, power and memory trade-offs, field testing.
- **Careers:** edge AI engineer, embedded ML engineer.
- Full sample page in section 3.

### IoT Cloud & Platforms (`plat`)
- **A day in the job:** connect devices with MQTT, store their data, build a live dashboard and alerts, update device software over the air.
- **AI already does:** backend and dashboard code, anomaly detection on sensor data.
- **Humans still own:** architecture for unreliable networks, scale, security, cost.
- **Careers:** IoT developer, IoT solutions architect, backend developer for connected devices.

### Industrial Automation & Robotics (`auto`)
- **A day in the job:** program a PLC to control a water pump station, add sensors to a production line, tune a robot's movement.
- **AI already does:** predictive maintenance and vision inspection.
- **Humans still own:** safety, wiring and commissioning on site, control design.
- **Careers:** automation engineer, PLC programmer, robotics engineer, SCADA engineer.

### IoT Security (`sec`)
- **A day in the job:** test a smart device for weak passwords and open ports, secure firmware updates, isolate devices on the network.
- **AI already does:** spotting unusual device traffic.
- **Humans still own:** hardware and firmware analysis, secure design, the risks of devices that control physical things.
- **Careers:** IoT security engineer, OT/ICS security specialist.

### Smart Agriculture & Water (`agri`)
- **A day in the job:** install soil-moisture sensors on a farm, build an irrigation controller that runs on solar, show the farmer simple alerts by SMS.
- **AI already does:** analysing satellite images, predicting irrigation needs.
- **Humans still own:** understanding farmers' and herders' real needs, rugged low-cost design, working in the field.
- **Careers:** agritech engineer, water and environment monitoring engineer, IoT solutions builder at NGOs and startups.

---

## 2. The track quiz

| # | Statement | Weights |
|---|---|---|
| 1 | I enjoy wiring circuits and making hardware respond to my code. | emb 2 · auto 1 |
| 2 | Running AI directly on a tiny device, without the internet, sounds exciting. | edge 2 · emb 1 |
| 3 | Building a live dashboard that shows data from many sensors interests me. | plat 2 · agri 1 |
| 4 | Making machines, motors or robots move precisely sounds fun. | auto 2 · emb 1 |
| 5 | I'd want to know whether a smart device can be hacked, and how to stop it. | sec 2 |
| 6 | I'd love to use technology to help farmers save water and grow more. | agri 2 · edge 1 |
| 7 | Writing low-level C or C++ where every byte of memory counts appeals to me. | emb 2 · sec 1 |
| 8 | I'm curious how thousands of devices send data to the cloud reliably. | plat 2 · sec 1 |
| 9 | Teaching a sensor to recognise a sound, a movement or an image interests me. | edge 2 |
| 10 | Water pumps, power plants or factories controlled by computers interest me. | auto 2 · sec 1 |
| 11 | I like working outdoors and testing solutions in real conditions. | agri 2 · auto 1 |
| 12 | Making a device run for months on a battery or solar panel is a challenge I'd enjoy. | edge 2 · agri 1 |

Weight totals per track: emb 6 · edge 7 · plat 4 · auto 6 · sec 5 · agri 6.

### Level questions
- **L1 and L2:** same as se-draft.md.
- **L3 (1 point each):** Build a circuit with Arduino or ESP32 · Program in C or C++ · Read a sensor and send its data over Wi-Fi · Program in Python · Use Ohm's law and read a simple schematic.

---

## 3. Full sample track page: Edge AI & TinyML

### What it is
Edge AI means running AI models directly on small devices, such as a sensor, a camera or a microcontroller, instead of sending everything to the cloud. TinyML is the version for the smallest, cheapest chips. It matters where internet is slow, expensive or missing, which makes it very relevant in Somalia: a device can recognise a problem and act on it by itself, on battery or solar power.

### A day in the job
Collect accelerometer data from a water pump that is working normally and one that is about to fail. Train a small model to tell them apart, compress it to fit in the chip's memory, deploy it to the device, and test it at a real pump site. Adjust when field conditions (heat, dust, vibration) give different results from the lab.

### How AI is changing this job
- **AI already does well:** AutoML platforms can design, train and compress a small model for you; AI assistants write firmware and data-processing code.
- **What humans still own:** collecting good real-world data; choosing what is worth detecting; working within tiny memory, power and cost limits; testing in the field; making devices safe and reliable.
- **AI tools to learn:** an edge ML platform (such as Edge Impulse), a microcontroller ML runtime, and an AI coding assistant for firmware.
- **Learn with AI, not instead of learning:** understand the basics of signals and machine learning yourself, so you can tell when a model is fooled by bad data. AI can't see your field conditions.

### Roadmap

**Beginner**
1. **Electronics and Arduino basics:** circuits, sensors, reading values. Simulate for free with Wokwi.
2. **C/C++ for microcontrollers:** memory, timing, interrupts.
3. **Python for data:** collecting sensor data and plotting it.
4. **Machine learning basics:** what training, testing and overfitting mean.

**Intermediate**
5. **ESP32 and data collection:** stream sensor data, label it properly.
6. **Your first TinyML model:** keyword spotting or motion recognition with Edge Impulse.
7. **Signal processing basics:** filtering, features from audio and motion data.
8. **Deploy and measure:** run the model on the device, measure accuracy, memory and battery use.

**Job-ready**
9. **Model optimisation:** quantisation and pruning to fit smaller chips.
10. **Vision on the edge:** a tiny image classifier on a camera board.
11. **Power design:** sleep modes, solar power, months of battery life.
12. **Field deployment:** over-the-air updates, monitoring devices remotely, handling failures.

### Projects to build
- **Beginner:** a voice-controlled light that recognises two spoken words, starting in the Wokwi simulator, then on real hardware.
- **Intermediate:** a livestock activity monitor: a collar with an accelerometer that recognises resting, walking and unusual movement.
- **Job-ready:** a solar-powered pump health monitor that detects early failure from vibration and sends an SMS alert, tested at a real site.

### Where to learn

**Free**
- [Edge Impulse](https://edgeimpulse.com/): build and deploy TinyML models, free for developers (tool)
- [HarvardX TinyML (edX)](https://www.edx.org/certificates/professional-certificate/harvardx-tiny-machine-learning): full TinyML course series, free to audit (course)
- [Arduino Docs](https://docs.arduino.cc/): hardware and programming basics (docs)
- [Wokwi](https://wokwi.com/): simulate Arduino and ESP32 in the browser (tool)
- [Random Nerd Tutorials](https://randomnerdtutorials.com/): ESP32 projects step by step (docs)
- [LiteRT for Microcontrollers](https://ai.google.dev/edge/litert/microcontrollers/overview): Google's runtime for models on microcontrollers (docs)

**Paid (worth it later)**
- *TinyML* by Pete Warden and Daniel Situnayake (O'Reilly): the classic introduction (book)
- Hardware: an ESP32-S3 board or Arduino Nano 33 BLE Sense with a microphone and motion sensors. Start in the simulator so you buy only what you need (tool)

### Certifications
Not required. The HarvardX certificate (paid version of the free course) is a good structured option. Working devices on video and GitHub matter more.

### Careers
- **In Somalia:** agritech and water projects, NGOs working on livestock, water and climate, telecom and energy companies monitoring remote equipment, startups.
- **Remote and abroad:** edge AI engineers are in demand in manufacturing, health devices and consumer electronics.
- **Growth path:** embedded developer → edge AI engineer → IoT solutions architect or hardware product lead.

### Related tracks
Embedded Systems & Firmware · Smart Agriculture & Water · AI department: Computer Vision
