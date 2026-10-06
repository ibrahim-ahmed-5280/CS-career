(function () {
  "use strict";
  var A = window.App, esc = A.esc, C = window.CONFIG;
  function $(id) { return document.getElementById(id); }

  function linkRow(k, v, href, ext) {
    return '<li><a href="' + esc(href) + '"' + (ext ? ' target="_blank" rel="noopener noreferrer"' : "") +
      '><span class="k">' + esc(k) + '</span><span class="v">' + esc(v) + "</span></a></li>";
  }

  var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function formText() {
    var c = A.ui().contact, name = $("fName").value.trim(), email = $("fEmail").value.trim(), msg = $("fMsg").value.trim(), err = $("formErr");
    function fail(text, field) { err.textContent = text; err.hidden = false; $(field).focus(); $(field).setAttribute("aria-invalid", "true"); return null; }
    ["fName", "fEmail", "fMsg"].forEach(function (id) { $(id).removeAttribute("aria-invalid"); });
    if (!email) return fail(c.needEmail, "fEmail");
    if (!EMAIL.test(email)) return fail(c.badEmail, "fEmail");
    if (!msg) return fail(c.needMsg, "fMsg");
    err.hidden = true;
    return (name ? name + "\n" : "") + email + "\n\n" + msg;
  }

  function render() {
    var c = A.ui().contact, U = C.university;
    document.title = c.pageTitle;
    var rows = linkRow(c.email, C.email, "mailto:" + C.email) +
      linkRow(c.phone, C.phone, "tel:" + C.phone) +
      linkRow("WhatsApp", C.phone, "https://wa.me/" + C.whatsapp, true);
    if (A.isReal(C.linkedin)) rows += linkRow(c.linkedin, C.linkedin.replace(/^https?:\/\/(www\.)?/, ""), C.linkedin, true);
    if (A.isReal(C.github)) rows += linkRow(c.github, C.github.replace(/^https?:\/\/(www\.)?/, ""), C.github, true);

    $("contactRoot").innerHTML =
      '<div class="page-head"><div class="wrap"><nav class="crumbs" aria-label="Breadcrumb"><a href="index.html">' + esc(A.ui().nav.home) + "</a><span aria-hidden=\"true\">/</span><span>" + esc(c.title) + "</span></nav>" +
      '<div class="dh-grid"><div class="dh-copy"><h1>' + esc(c.title) + '</h1><p class="lead">' + esc(c.sub) + "</p></div>" +
      '<img class="dh-art" src="assets/contact.svg" alt="" width="480" height="340"></div></div></div>' +
      '<div class="wrap sec"><div class="two contact">' +
      '<div class="panel"><p class="muted small">' + esc(c.by) + '</p><p class="who">' + esc(C.name) + '</p><p class="muted">' + esc(c.role) + "</p>" +
      '<ul class="links">' + rows + "</ul>" +
      '<h3 class="h3 mt">' + esc(c.uniTitle) + '</h3><ul class="links">' +
      linkRow(c.uniSite, U.site.replace("https://", ""), U.site, true) +
      linkRow(c.uniAdm, "students.hu.edu.so", U.admission, true) +
      linkRow(c.email, U.email, "mailto:" + U.email) +
      linkRow(c.phone, U.phone, "tel:" + U.phone) + "</ul></div>" +
      '<form class="panel" id="contactForm" novalidate><h3 class="h3">' + esc(c.formTitle) + "</h3>" +
      '<label for="fName">' + esc(c.fName) + '</label><input id="fName" type="text" autocomplete="name" placeholder="' + esc(c.phName) + '">' +
      '<label for="fEmail">' + esc(c.fEmail) + '</label><input id="fEmail" type="email" inputmode="email" dir="auto" autocomplete="email" placeholder="' + esc(c.phEmail) + '" required>' +
      '<label for="fMsg">' + esc(c.fMsg) + '</label><textarea id="fMsg" rows="6" placeholder="' + esc(c.phMsg) + '"></textarea>' +
      '<p class="err" id="formErr" role="alert" hidden></p>' +
      '<div class="cta"><button type="button" class="btn primary" id="sendMail"><i class="ti ti-mail" aria-hidden="true"></i><span>' + esc(c.sendMail) + '</span></button><button type="button" class="btn ghost" id="sendWa"><i class="ti ti-brand-whatsapp" aria-hidden="true"></i><span>' + esc(c.sendWa) + '</span></button></div></form>' +
      "</div></div>";

    $("sendMail").onclick = function () {
      var txt = formText(); if (!txt) return;
      location.href = "mailto:" + C.email + "?subject=" + encodeURIComponent(c.subject) + "&body=" + encodeURIComponent(txt);
    };
    $("sendWa").onclick = function () {
      var txt = formText(); if (!txt) return;
      window.open("https://wa.me/" + C.whatsapp + "?text=" + encodeURIComponent(c.waIntro + "\n\n" + txt), "_blank", "noopener");
    };
    $("contactForm").addEventListener("submit", function (e) { e.preventDefault(); });
    ["fName", "fEmail", "fMsg"].forEach(function (id) { $(id).addEventListener("input", function () { $("formErr").hidden = true; $(id).removeAttribute("aria-invalid"); }); });
  }

  A.init(render);
})();
