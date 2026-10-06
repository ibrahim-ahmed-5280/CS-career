(function () {
  "use strict";
  var A = window.App, esc = A.esc, DEPTS = window.DEPTS, R = window.RESOURCES, C = window.CONFIG;

  var id = (new URLSearchParams(location.search).get("d") || "").toLowerCase();
  var d = A.deptById(id);
  if (!d) { location.replace("index.html#departments"); return; }

  var KEY = "road-" + id;
  function loadDone(n) {
    var a = [];
    try { a = JSON.parse(localStorage.getItem(KEY) || "[]"); } catch (e) {}
    var out = []; for (var i = 0; i < n; i++) out.push(!!a[i]); return out;
  }
  function saveDone(a) { try { localStorage.setItem(KEY, JSON.stringify(a)); } catch (e) {} }

  function list(items) { return "<ul>" + items.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul>"; }

  function render() {
    var T = A.T(), u = T.ui, dt = u.detail, x = u.dept, t = T.depts[id];
    var idx = DEPTS.indexOf(d);
    var prev = DEPTS[(idx + DEPTS.length - 1) % DEPTS.length], nxt = DEPTS[(idx + 1) % DEPTS.length];
    var res = R[id] || [];
    var free = res.filter(function (r) { return r.free; }), paid = res.filter(function (r) { return !r.free; });
    document.title = t.name + " · " + T.meta.title.split("·")[0].trim();

    var fields = t.fields.map(function (f, i) {
      return '<article class="field"><span class="fn">' + (i + 1) + "</span><div><h3>" + esc(f[0]) + "</h3><p>" + esc(f[1]) + "</p></div></article>";
    }).join("");
    var subjects = t.prereq.subjects.map(function (s) {
      return "<article><h3>" + esc(s[0]) + "</h3><p>" + esc(s[1]) + "</p></article>";
    }).join("");
    var skills = t.prereq.skills.map(function (s) { return '<li class="chip">' + esc(s) + "</li>"; }).join("");
    var done = loadDone(t.steps.length);
    var doneCount = done.filter(Boolean).length;
    var steps = t.steps.map(function (s, i) {
      return '<li class="' + (done[i] ? "is-done" : "") + '"><span class="rm-num" aria-hidden="true">' + String(i + 1).padStart(2, "0") + "</span>" +
        '<button type="button" class="rm-check" data-i="' + i + '" aria-pressed="' + !!done[i] + '" aria-label="' + esc(dt.markDone) + ": " + esc(s[0]) + '"><i class="ti ti-check" aria-hidden="true"></i></button>' +
        "<h4>" + esc(s[0]) + "</h4><p>" + esc(s[1]) + "</p></li>";
    }).join("");
    var progress = '<div class="rm-progress"><div class="bar-track"><div class="bar-fill" id="rmFill" style="width:' + Math.round(doneCount / t.steps.length * 100) + '%"></div></div><p class="small muted" id="rmText">' +
      esc(dt.progress.replace("{n}", doneCount).replace("{t}", t.steps.length)) + "</p></div>";

    document.getElementById("deptRoot").innerHTML =
      '<div class="detail-hero"><div class="wrap">' +
      '<nav class="crumbs" aria-label="Breadcrumb"><a href="index.html">' + esc(u.nav.home) + '</a><span aria-hidden="true">/</span><a href="index.html#departments">' + esc(x.crumb) + '</a><span aria-hidden="true">/</span><span>' + esc(t.name) + "</span></nav>" +
      '<div class="dh-grid"><div class="dh-copy">' +
      '<div class="detail-title"><span class="badge">' + window.icon(id) + '</span><div><p class="tagline">' + esc(t.tag) + "</p><h1>" + esc(t.name) + "</h1></div></div>" +
      '<p class="lead">' + esc(t.about) + '</p></div>' +
      '<img class="dh-art" src="assets/dept/' + id + '.svg" alt="" width="480" height="340"></div></div></div>' +

      '<div class="wrap detail-body">' +
      '<section aria-labelledby="sFields"><h2 id="sFields">' + esc(x.fieldsTitle) + '</h2><p class="muted sub">' + esc(x.fieldsSub) + '</p><div class="fields">' + fields + "</div></section>" +

      '<section class="cols" aria-label="' + esc(dt.careers) + '">' +
      '<div class="plain"><h3 class="h3">' + esc(dt.careers) + '</h3><p class="muted small">' + esc(x.careersSub) + "</p>" + list(t.careers) + "</div>" +
      '<div class="plain"><h3 class="h3">' + esc(dt.learn) + "</h3>" + list(t.learn) + "</div></section>" +

      '<section aria-labelledby="sPre"><h2 id="sPre">' + esc(x.prereqTitle) + '</h2><p class="muted sub">' + esc(x.prereqSub) + "</p>" +
      '<h3 class="h3 mt-s">' + esc(x.subjects) + '</h3><div class="subjects">' + subjects + "</div>" +
      '<h3 class="h3 mt-s">' + esc(x.skills) + '</h3><ul class="chips">' + skills + "</ul>" +
      '<p class="note">' + esc(t.prereq.note) + "</p></section>" +

      '<section aria-labelledby="sRoad"><h2 id="sRoad">' + esc(dt.roadmap) + '</h2><p class="muted sub">' + esc(dt.roadmapSub) + '</p>' + progress + '<ol class="rm" id="rm">' + steps + "</ol></section>" +

      '<section aria-labelledby="sRes"><h2 id="sRes">' + esc(dt.resources) + "</h2>" +
      '<div class="res-group"><h3 class="h3">' + esc(dt.free) + '</h3><div class="res">' + A.resLinks(free) + "</div></div>" +
      (paid.length ? '<div class="res-group"><h3 class="h3">' + esc(dt.paid) + '</h3><div class="res">' + A.resLinks(paid) + "</div></div>" : "") + "</section>" +

      '<section class="cta-band"><div><h2>' + esc(x.ctaTitle) + "</h2><p>" + esc(x.ctaText) + '</p></div><div class="cta">' +
      '<a class="btn invert" href="contact.html">' + esc(x.ctaBtn) + '</a><a class="btn outline-light" href="' + esc(C.university.admission) + '" target="_blank" rel="noopener noreferrer">' + esc(x.admission) + "</a></div></section>" +

      '<nav class="pn" aria-label="Departments"><a href="department.html?d=' + prev.id + '"><small>' + esc(x.prev) + "</small><b>" + esc(T.depts[prev.id].name) + "</b></a>" +
      '<a href="department.html?d=' + nxt.id + '" class="pn-next"><small>' + esc(x.nextLabel) + "</small><b>" + esc(T.depts[nxt.id].name) + "</b></a></nav></div>";
  }

  function bindRoadmap() {
    var rm = document.getElementById("rm"); if (!rm) return;
    var total = rm.children.length;
    rm.querySelectorAll(".rm-check").forEach(function (b) {
      b.onclick = function () {
        var done = loadDone(total), i = +b.dataset.i;
        done[i] = !done[i];
        saveDone(done);
        b.setAttribute("aria-pressed", String(done[i]));
        b.parentNode.classList.toggle("is-done", done[i]);
        var n = done.filter(Boolean).length;
        document.getElementById("rmFill").style.width = Math.round(n / total * 100) + "%";
        document.getElementById("rmText").textContent = A.ui().detail.progress.replace("{n}", n).replace("{t}", total);
      };
    });
  }

  A.init(function () { render(); bindRoadmap(); });
})();
