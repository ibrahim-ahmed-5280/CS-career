(function () {
  "use strict";
  var A = window.App, esc = A.esc, DEPTS = window.DEPTS, R = window.RESOURCES;
  function $(id) { return document.getElementById(id); }

  function renderHero() {
    var h = A.ui().hero;
    document.title = A.T().meta.title;
    $("heroTitle").textContent = h.title;
    $("heroSub").textContent = h.sub;
    $("heroCta1").textContent = h.cta1;
    $("heroCta2").textContent = h.cta2;
    var T = A.T();
    var rows = DEPTS.map(function (d) {
      return '<a href="department.html?d=' + d.id + '"><span class="wall-ic">' + window.icon(d.id) + "</span><span>" + esc(T.depts[d.id].name) + "</span></a>";
    }).join("");
    $("heroArt").innerHTML =
      '<div class="stage"><span class="baseboard"></span>' +
      '<nav class="wall" aria-label="' + esc(A.ui().depts.title) + '"><p class="wall-title">' + esc(A.ui().about.treeFaculty) + "</p>" + rows + "</nav>" +
      '<img class="person" src="assets/student.webp" width="800" height="1000" alt="' + esc(h.photoAlt) + '"></div>';
  }

  function renderAbout() {
    var a = A.ui().about, h = A.ui().hero;
    $("aboutTitle").textContent = h.what.title;
    $("aboutSub").textContent = h.what.text;
    $("aboutCards").innerHTML = a.cards.map(function (c, i) {
      return "<article><h3>" + esc(c.title) + "</h3><p>" + esc(c.text) + "</p></article>";
    }).join("");
    $("aboutTips").innerHTML = '<h3 class="h3">' + esc(a.tipTitle) + "</h3><ol>" +
      a.tips.map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") + "</ol>";
  }

  function renderDepts() {
    var d = A.ui().depts, T = A.T();
    $("deptsTitle").textContent = d.title;
    $("deptsSub").textContent = d.sub;
    $("deptCards").innerHTML = DEPTS.map(function (x) {
      var t = T.depts[x.id];
      return '<a class="dcard" href="department.html?d=' + x.id + '"><span class="badge">' + window.icon(x.id) + "</span><h3>" +
        esc(t.name) + '</h3><p class="tag">' + esc(t.tag) + '</p><span class="go">' + esc(d.open) + "</span></a>";
    }).join("");
  }

  function renderPaths() {
    var p = A.ui().paths;
    $("pathsTitle").textContent = p.title;
    $("pathsSub").textContent = p.sub;
    $("startTitle").textContent = p.startTitle;
    $("startSub").textContent = p.startSub;
    $("commonRes").innerHTML = A.resLinks(R.common);
    $("payTitle").textContent = p.payTitle;
    $("payList").innerHTML = p.pay.map(function (x) { return "<li><b>" + esc(x.t) + "</b><span>" + esc(x.d) + "</span></li>"; }).join("");
    $("habitTitle").textContent = p.habitTitle;
    $("habitList").innerHTML = p.habits.map(function (h) { return "<li>" + esc(h) + "</li>"; }).join("");
  }

  function renderBand() {
    var q = A.ui().quiz;
    $("quizTitle").textContent = q.title;
    $("quizSub").textContent = q.sub;
    $("quizGo").textContent = q.start;
  }

  A.init(function () { renderHero(); renderAbout(); renderDepts(); renderBand(); renderPaths(); });
})();
