/* ------------------------------------------------------------------
   Shared, language-independent data.
   Edit CONFIG to change contact details. Resource links are real
   public sites; verify them before the event in case any moved.
------------------------------------------------------------------- */

window.CONFIG = {
  name: "Ibrahim Ahmed Abdirahmaan",
  email: "ibrahimahmedabdirahmaan@gmail.com",
  phone: "+252616875280",           // calls + WhatsApp
  whatsapp: "252616875280",         // digits only, for wa.me
  // Put your real profile URLs here. Buttons stay hidden while a URL contains "YOUR-".
  linkedin: "https://www.linkedin.com/in/YOUR-USERNAME",
  github: "https://github.com/YOUR-USERNAME",
  university: {
    site: "https://hu.edu.so",
    email: "info@hu.edu.so",
    phone: "+252613311119",
    admission: "https://students.hu.edu.so/admission/home",
    address: "Wadajir District, Mogadishu, Somalia"
  }
};

/* Department ids, order and colour hue */
window.DEPTS = [
  { id: "cs",  code: "CS",  hue: 222 },
  { id: "it",  code: "IT",  hue: 190 },
  { id: "se",  code: "SE",  hue: 158 },
  { id: "ds",  code: "DS",  hue: 36  },
  { id: "ai",  code: "AI",  hue: 275 },
  { id: "cy",  code: "CY",  hue: 350 },
  { id: "iot", code: "IoT", hue: 120 }
];

/* kind: course | practice | docs | video | cert | tool
   free: true = free to learn (some offer paid certificates)           */
window.RESOURCES = {
  common: [
    { name: "CS50 (Harvard)",          url: "https://cs50.harvard.edu/x/",          kind: "course",   free: true },
    { name: "freeCodeCamp",            url: "https://www.freecodecamp.org/",        kind: "course",   free: true },
    { name: "roadmap.sh",              url: "https://roadmap.sh/",                  kind: "docs",     free: true },
    { name: "MIT OpenCourseWare",      url: "https://ocw.mit.edu/",                 kind: "course",   free: true },
    { name: "GitHub Student Pack",     url: "https://education.github.com/pack",    kind: "tool",     free: true },
    { name: "Coursera (financial aid)",url: "https://www.coursera.org/",            kind: "course",   free: false },
    { name: "Udemy",                   url: "https://www.udemy.com/",               kind: "course",   free: false }
  ],
  cs: [
    { name: "CS50x",                          url: "https://cs50.harvard.edu/x/",                       kind: "course",   free: true },
    { name: "Teach Yourself CS",              url: "https://teachyourselfcs.com/",                      kind: "docs",     free: true },
    { name: "NeetCode",                       url: "https://neetcode.io/",                              kind: "practice", free: true },
    { name: "LeetCode",                       url: "https://leetcode.com/",                             kind: "practice", free: true },
    { name: "MIT: The Missing Semester",      url: "https://missing.csail.mit.edu/",                    kind: "course",   free: true },
    { name: "Algorithms Specialization",      url: "https://www.coursera.org/specializations/algorithms", kind: "course", free: false }
  ],
  it: [
    { name: "Cisco Networking Academy",       url: "https://www.netacad.com/",                          kind: "course",   free: true },
    { name: "Professor Messer (A+/Network+)", url: "https://www.professormesser.com/",                  kind: "video",    free: true },
    { name: "Microsoft Learn",                url: "https://learn.microsoft.com/training/",             kind: "course",   free: true },
    { name: "AWS Skill Builder",              url: "https://skillbuilder.aws/",                         kind: "course",   free: true },
    { name: "Linux Journey",                  url: "https://linuxjourney.com/",                         kind: "docs",     free: true },
    { name: "CompTIA certifications",         url: "https://www.comptia.org/certifications",            kind: "cert",     free: false }
  ],
  se: [
    { name: "The Odin Project",               url: "https://www.theodinproject.com/",                   kind: "course",   free: true },
    { name: "freeCodeCamp",                   url: "https://www.freecodecamp.org/",                     kind: "course",   free: true },
    { name: "MDN Web Docs",                   url: "https://developer.mozilla.org/",                    kind: "docs",     free: true },
    { name: "Full Stack Open",                url: "https://fullstackopen.com/en/",                     kind: "course",   free: true },
    { name: "Pro Git book",                   url: "https://git-scm.com/book/en/v2",                    kind: "docs",     free: true },
    { name: "Frontend Masters",               url: "https://frontendmasters.com/",                      kind: "course",   free: false }
  ],
  ds: [
    { name: "Kaggle Learn",                   url: "https://www.kaggle.com/learn",                      kind: "course",   free: true },
    { name: "Mode SQL Tutorial",              url: "https://mode.com/sql-tutorial/",                    kind: "practice", free: true },
    { name: "Khan Academy Statistics",        url: "https://www.khanacademy.org/math/statistics-probability", kind: "course", free: true },
    { name: "StatQuest (YouTube)",            url: "https://www.youtube.com/@statquest",                kind: "video",    free: true },
    { name: "Google Data Analytics Certificate", url: "https://www.coursera.org/professional-certificates/google-data-analytics", kind: "cert", free: false },
    { name: "DataCamp",                       url: "https://www.datacamp.com/",                         kind: "course",   free: false }
  ],
  ai: [
    { name: "Google ML Crash Course",         url: "https://developers.google.com/machine-learning/crash-course", kind: "course", free: true },
    { name: "fast.ai Practical Deep Learning",url: "https://course.fast.ai/",                           kind: "course",   free: true },
    { name: "3Blue1Brown (Neural networks)",  url: "https://www.youtube.com/@3blue1brown",              kind: "video",    free: true },
    { name: "Hugging Face Course",            url: "https://huggingface.co/learn",                      kind: "course",   free: true },
    { name: "CS50's AI with Python",          url: "https://cs50.harvard.edu/ai/",                      kind: "course",   free: true },
    { name: "Machine Learning Specialization",url: "https://www.coursera.org/specializations/machine-learning-introduction", kind: "course", free: false }
  ],
  cy: [
    { name: "TryHackMe",                      url: "https://tryhackme.com/",                            kind: "practice", free: true },
    { name: "PortSwigger Web Security Academy", url: "https://portswigger.net/web-security",            kind: "course",   free: true },
    { name: "OverTheWire",                    url: "https://overthewire.org/wargames/",                 kind: "practice", free: true },
    { name: "picoCTF",                        url: "https://picoctf.org/",                              kind: "practice", free: true },
    { name: "Cisco Networking Academy",       url: "https://www.netacad.com/",                          kind: "course",   free: true },
    { name: "CompTIA Security+",              url: "https://www.comptia.org/certifications/security",   kind: "cert",     free: false }
  ],
  iot: [
    { name: "Arduino Docs & Tutorials",       url: "https://docs.arduino.cc/",                          kind: "docs",     free: true },
    { name: "Random Nerd Tutorials (ESP32)",  url: "https://randomnerdtutorials.com/",                  kind: "docs",     free: true },
    { name: "Wokwi Simulator",                url: "https://wokwi.com/",                                kind: "tool",     free: true },
    { name: "Cisco IoT courses",              url: "https://www.netacad.com/",                          kind: "course",   free: true },
    { name: "MQTT Essentials",                url: "https://www.hivemq.com/mqtt/mqtt-essentials/",      kind: "docs",     free: true },
    { name: "IoT Specialization (UC San Diego)", url: "https://www.coursera.org/specializations/internet-of-things", kind: "course", free: false }
  ]
};

/* Quiz scoring. Each question has 4 options; each option adds points to departments.
   The question/option TEXT lives in the language files (lang-*.js, quiz.q[i]). */
window.QUIZ_WEIGHTS = [
  [ {cs:2, ai:1, ds:1}, {se:2, it:1},        {ds:2, ai:1},       {cy:2, it:1, iot:1} ],
  [ {se:2, cs:1},       {iot:2, it:1},       {ai:2, ds:1},       {cy:2, it:1} ],
  [ {cs:2, ai:1},       {it:2, cy:1},        {ds:2, ai:1},       {iot:2, se:1} ],
  [ {cs:1, ai:1, ds:1}, {iot:2, it:1},       {se:2, ds:1},       {cy:1, cs:1, it:1} ],
  [ {cs:2, ai:1},       {se:2, ds:1},        {it:1, iot:2},      {cy:2, ds:1} ],
  [ {se:2, it:1},       {ai:2, cs:1},        {cy:2, it:1},       {iot:2, ds:1} ]
];

window.LANGS = {};

/* One icon per department (Tabler webfont class names). */
window.DEPT_ICONS = {
  cs: "binary-tree-2", it: "server-2", se: "code", ds: "chart-bar",
  ai: "brain", cy: "shield-lock", iot: "wifi"
};
window.icon = function (id) {
  return '<i class="ti ti-' + (window.DEPT_ICONS[id] || "point") + '" aria-hidden="true"></i>';
};

/* Navbar is built from this list (labels come from the language files: ui.nav[key]).
   The "depts" entry becomes a dropdown whose items are DEPTS, so nothing is typed twice. */
window.NAV = [
  { key: "about",   href: "index.html#about" },
  { key: "depts",   menu: true },
  { key: "quiz",    href: "quiz.html", page: "quiz" },
  { key: "paths",   href: "index.html#learn" },
  { key: "contact", href: "contact.html", page: "contact" }
];
