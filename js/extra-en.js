(function () {
  var L = window.LANGS.en;
  L.ui.hero.what = {
    title: "What is Computer Science?",
    text: "Computer Science is the study of how to solve problems with computers: logic, algorithms, data and software. It is behind your phone, mobile money, hospital systems and every AI tool you use."
  };
  L.ui.depts.open = "Open page";
  L.ui.quiz.loading = "Finding your best matches…";
  L.ui.quiz.success = "All done! Your results are ready.";
  L.ui.close = "Close";
  L.ui.hero.photoAlt = "A student using a laptop on campus";
  L.ui.detail.progress = "{n} of {t} steps done";
  L.ui.detail.markDone = "Mark this step as done";
  L.ui.nav.deptAll = "All departments";
  L.ui.dept = {
    crumb: "Departments",
    overview: "Overview",
    fieldsTitle: "Related fields",
    fieldsSub: "Areas you can specialise in or work in after this programme.",
    careersSub: "Roles this department leads to.",
    prereqTitle: "Prerequisites and subjects to be good at",
    prereqSub: "You do not need to be perfect. These are the things that make the programme easier.",
    subjects: "School subjects",
    skills: "Skills and mindset",
    ctaTitle: "Have a question about this department?",
    ctaText: "Message me, or contact the university admissions office.",
    ctaBtn: "Contact",
    admission: "Admissions portal",
    prev: "← Previous",
    nextLabel: "Next →",
    onThisPage: "On this page"
  };
  L.ui.contact.pageTitle = "Contact · CS Career";

  var X = {
    cs: {
      fields: [
        ["Algorithms and theory", "Designing fast, correct solutions and understanding why they work."],
        ["Systems and operating systems", "How memory, processes and hardware cooperate under every program."],
        ["Databases and information systems", "Storing, organising and querying large amounts of data."],
        ["Programming languages and compilers", "How languages are designed and how code becomes machine instructions."],
        ["Graphics and game development", "Drawing 2D and 3D worlds, physics and interaction on screen."]
      ],
      prereq: {
        subjects: [["Mathematics", "Algebra, functions and logic are used every day."], ["English", "Tutorials, documentation and code are mostly in English."], ["Physics (helpful)", "Builds problem-solving and modelling habits."], ["Basic computer use", "Typing, files and installing programs."]],
        skills: ["Logical thinking", "Patience when code does not work", "Persistence with hard problems", "Curiosity to read and experiment"],
        note: "You do not need to know programming before you start. Most students begin from zero."
      }
    },
    it: {
      fields: [
        ["Network administration", "Building and running the networks that connect offices, banks and campuses."],
        ["System and server administration", "Installing, securing and maintaining servers and user accounts."],
        ["Cloud computing", "Running services on AWS, Azure or Google Cloud instead of local machines."],
        ["IT support and service management", "Helping users, tracking problems and keeping services reliable."],
        ["Database administration", "Keeping organisational data fast, safe and backed up."]
      ],
      prereq: {
        subjects: [["Mathematics", "Basic maths and binary numbers help with networking."], ["Physics or ICT", "Understanding devices, electricity and signals."], ["English", "Manuals, error messages and certification exams are in English."], ["Basic computer use", "Operating systems and the parts of a computer."]],
        skills: ["Troubleshooting step by step", "Patience with users", "Good documentation habits", "Willingness to keep learning new tools"],
        note: "Hands-on practice matters more than theory here. A small home lab (even virtual) is a big advantage."
      }
    },
    se: {
      fields: [
        ["Web development", "Websites and web apps that run in the browser."],
        ["Mobile app development", "Android and iOS apps, such as mobile money and delivery apps."],
        ["Backend and APIs", "The servers and databases behind the apps people use."],
        ["DevOps and cloud delivery", "Automating testing, deployment and monitoring."],
        ["Software testing and quality", "Making sure software works before users find the bugs."]
      ],
      prereq: {
        subjects: [["Mathematics", "Logic and problem solving are the heart of programming."], ["English", "Code, documentation and teamwork run on English."], ["Art or design (helpful)", "Helps you build screens people enjoy using."], ["Writing", "Clear requirements, comments and README files."]],
        skills: ["Breaking big problems into small ones", "Teamwork and clear communication", "Attention to detail", "Teaching yourself new tools"],
        note: "No prior coding is required. A laptop and a daily coding habit matter most."
      }
    },
    ds: {
      fields: [
        ["Data analysis and business intelligence", "Turning raw numbers into reports that guide decisions."],
        ["Statistics and modelling", "Measuring uncertainty and finding what is really significant."],
        ["Machine learning", "Models that predict outcomes such as demand or risk."],
        ["Data engineering", "Building the pipelines and databases that deliver clean data."],
        ["Data visualisation and reporting", "Explaining data with dashboards and clear charts."]
      ],
      prereq: {
        subjects: [["Mathematics (strong)", "Algebra, statistics and probability are used constantly."], ["English", "Datasets, libraries and papers are mostly in English."], ["Economics or Geography", "Helps you understand the context behind the data."], ["ICT / Excel", "A friendly first step into tables and formulas."]],
        skills: ["Curiosity about why things happen", "Care with details and accuracy", "Explaining results simply", "Comfort with numbers"],
        note: "If you enjoy maths and finding patterns, this programme will suit you."
      }
    },
    ai: {
      fields: [
        ["Machine learning", "Systems that improve from experience and data."],
        ["Natural language processing", "Computers that read, translate and write human language."],
        ["Computer vision", "Teaching machines to understand images and video."],
        ["Robotics and intelligent systems", "Machines that sense their surroundings and act."],
        ["Generative AI and language models", "Building apps with models that write, code and create."],
        ["Responsible AI and ethics", "Fairness, privacy and safety when AI affects people."]
      ],
      prereq: {
        subjects: [["Mathematics (strong)", "Algebra, calculus and probability underlie every model."], ["Physics", "Builds modelling and problem-solving skills."], ["English", "Research papers and tools are written in English."], ["ICT / programming", "Python is the main language of AI."]],
        skills: ["Patience with experiments that fail", "Reading technical papers", "Comfort with maths", "Thinking about ethics and fairness"],
        note: "Strong maths helps, but you can build it up step by step alongside programming."
      }
    },
    cy: {
      fields: [
        ["Network security", "Protecting networks from intruders and misuse."],
        ["Ethical hacking and penetration testing", "Legally testing systems to find weaknesses before attackers do."],
        ["Digital forensics", "Investigating incidents and recovering digital evidence."],
        ["Cryptography", "Keeping information secret and verifying who sent it."],
        ["Security operations (SOC)", "Monitoring systems and responding to attacks."],
        ["Governance, risk and compliance", "Security policy, audits and data-protection rules."]
      ],
      prereq: {
        subjects: [["Mathematics", "Logic and number theory help with cryptography."], ["ICT", "Networks and operating systems are the foundation."], ["English", "Reports, advisories and training are in English."], ["Civics or Law (helpful)", "Privacy, ethics and cybercrime law."]],
        skills: ["Asking \"how could this break?\"", "Integrity and a strong ethics sense", "Patience and attention to detail", "Staying calm under pressure"],
        note: "Only ever test systems you own or have written permission to test."
      }
    },
    iot: {
      fields: [
        ["Embedded systems", "Programming small computers inside devices."],
        ["Wireless networks and protocols", "Wi-Fi, Bluetooth, LoRa and MQTT for connected devices."],
        ["Smart agriculture and smart cities", "Sensors for irrigation, water, traffic and power."],
        ["Industrial automation", "Monitoring and controlling machines and factories."],
        ["Cloud and edge for IoT", "Storing device data and running smart logic close to it."],
        ["IoT security", "Keeping connected devices safe from attackers."]
      ],
      prereq: {
        subjects: [["Physics", "Electricity, circuits and sensors."], ["Mathematics", "Needed for measurements, signals and logic."], ["ICT or technical drawing", "Reading diagrams and basic computing."], ["English", "Datasheets and tutorials are in English."]],
        skills: ["Enjoying hands-on tinkering", "Careful, safe handling of electronics", "Debugging both hardware and software", "Creativity for local problems"],
        note: "A cheap starter kit (Arduino or ESP32) is enough to start learning at home."
      }
    }
  };
  Object.keys(X).forEach(function (k) { Object.assign(L.depts[k], X[k]); });
})();
