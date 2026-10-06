(function () {
  "use strict";
  var A = window.App, esc = A.esc, DEPTS = window.DEPTS, W = window.QUIZ_WEIGHTS;
  /* stage: "intro" | "ask" | "loading" | "success" | "result" */
  var quiz = { i: 0, answers: [], stage: "intro" };
  var LOAD_MS = 1300, SUCCESS_MS = 1700;
  function $(id) { return document.getElementById(id); }

  function render() {
    var q = A.ui().quiz;
    document.title = q.title + " · CS Career";
    $("quizRoot").innerHTML =
      '<div class="page-head"><div class="wrap"><nav class="crumbs" aria-label="Breadcrumb"><a href="index.html">' + esc(A.ui().nav.home) +
      '</a><span aria-hidden="true">/</span><span>' + esc(A.ui().nav.quiz) + "</span></nav>" +
      '<div class="dh-grid quiz-grid"><div class="dh-copy"><h1>' + esc(q.title) + '</h1><p class="lead">' + esc(q.sub) + "</p></div>" +
      '<img class="dh-art" src="assets/quiz.svg" alt="" width="480" height="340"></div></div></div>' +
      '<div class="wrap narrow quiz-wrap"><div id="quizBox" class="quiz-box" aria-live="polite"></div></div>';
    draw();
  }

  function focusFirst(sel) {
    var el = document.querySelector(sel);
    if (el) el.focus({ preventScroll: true });
  }

  function draw() {
    var q = A.ui().quiz, T = A.T(), box = $("quizBox"), total = q.q.length;
    box.classList.toggle("fixed", quiz.stage === "ask" || quiz.stage === "loading" || quiz.stage === "success");

    if (quiz.stage === "intro") {
      box.innerHTML = '<div class="q-start"><button class="btn primary big" id="qStart" type="button">' + esc(q.start) + "</button></div>";
      $("qStart").onclick = function () { quiz.stage = "ask"; draw(); focusFirst(".opt"); };
      return;
    }

    if (quiz.stage === "loading") {
      box.innerHTML = '<div class="q-status" role="status"><span class="logo logo-load" aria-hidden="true"><b>CS</b><span>career</span><i class="cursor"></i></span><p>' + esc(q.loading) + "</p></div>";
      return;
    }

    if (quiz.stage === "success") {
      box.innerHTML = '<div class="q-status"><div class="q-success" role="status"><i class="ti ti-circle-check" aria-hidden="true"></i><p>' + esc(q.success) + "</p></div></div>";
      return;
    }

    if (quiz.stage === "result") {
      var score = {};
      DEPTS.forEach(function (d) { score[d.id] = 0; });
      quiz.answers.forEach(function (a, qi) {
        var w = W[qi][a];
        Object.keys(w).forEach(function (k) { score[k] += w[k]; });
      });
      var ranked = DEPTS.slice().sort(function (a, b) { return score[b.id] - score[a.id]; }).slice(0, 3);
      var html = '<h2 class="q-title">' + esc(q.resultTitle) + '</h2><p class="muted">' + esc(q.resultSub) + "</p>";
      ranked.forEach(function (d, i) {
        var t = T.depts[d.id];
        html += '<div class="res-item' + (i === 0 ? " top" : "") + '"><span class="badge">' + window.icon(d.id) +
          '</span><div class="grow"><small>' + esc(i === 0 ? q.best : q.also) + "</small><h3>" + esc(t.name) +
          '</h3></div><a class="btn ghost" href="department.html?d=' + d.id + '">' + esc(q.view) + "</a></div>";
      });
      html += '<div class="q-actions"><button class="btn ghost" id="qRetake" type="button">' + esc(q.retake) + "</button></div>";
      box.innerHTML = html;
      $("qRetake").onclick = function () { quiz = { i: 0, answers: [], stage: "ask" }; draw(); focusFirst(".opt"); };
      return;
    }

    var cur = q.q[quiz.i], pct = Math.round((quiz.i / total) * 100);
    box.innerHTML = '<p class="q-top">' + esc(q.progress.replace("{n}", quiz.i + 1).replace("{t}", total)) +
      '</p><div class="bar-track"><div class="bar-fill" style="width:' + pct + '%"></div></div>' +
      '<h2 class="q-title">' + esc(cur.q) + '</h2><div class="opts">' +
      cur.o.map(function (o, i) { return '<button type="button" class="opt" data-i="' + i + '">' + esc(o) + "</button>"; }).join("") +
      "</div>" + (quiz.i > 0 ? '<button type="button" class="q-back" id="qBack">' + esc(q.back) + "</button>" : "");
    box.querySelectorAll(".opt").forEach(function (b) {
      b.onclick = function () {
        quiz.answers[quiz.i] = +b.dataset.i;
        if (quiz.i + 1 < total) { quiz.i++; draw(); focusFirst(".opt"); return; }
        finish();
      };
    });
    var back = $("qBack");
    if (back) back.onclick = function () { quiz.i--; draw(); focusFirst(".opt"); };
  }

  /* all questions answered: small loader, then a success message, then the result (all inside the quiz box) */
  function finish() {
    quiz.stage = "loading"; draw();
    setTimeout(function () {
      quiz.stage = "success"; draw();
      setTimeout(function () { quiz.stage = "result"; draw(); focusFirst("#qRetake"); }, SUCCESS_MS);
    }, LOAD_MS);
  }

  A.init(render);
})();
