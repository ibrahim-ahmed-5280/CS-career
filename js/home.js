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
    // Clickable areas over the 7 tiles painted on the wall photo (px in the 1941x808 image): x, y, w, h
    var SLOTS = [[725, 198, 201, 204], [942, 207, 186, 191], [1143, 215, 163, 181], [1320, 222, 139, 171],
                 [808, 421, 213, 209], [1037, 417, 187, 197], [1238, 414, 164, 188]];
    var IW = 1941, IH = 808;
    function pc(v, t) { return (v / t * 100).toFixed(2) + "%"; }
    var tiles = DEPTS.map(function (d, i) {
      var s = SLOTS[i];
      return '<a class="wt" style="--x:' + pc(s[0], IW) + ";--y:" + pc(s[1], IH) + ";--w:" + pc(s[2], IW) + ";--h:" + pc(s[3], IH) +
        '" title="' + esc(T.depts[d.id].name) + '" href="department.html?d=' + d.id + '"><span class="sr">' + esc(T.depts[d.id].name) + "</span></a>";
    }).join("");
    $("heroArt").innerHTML =
      '<div class="scene"><img class="scene-img" src="assets/hero-wall.webp" width="1941" height="808" alt="' + esc(h.photoAlt) + '">' +
      '<nav class="wall-tiles" aria-label="' + esc(A.ui().depts.title) + '">' + tiles + "</nav></div>";
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
