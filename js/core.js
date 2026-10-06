/* Shared code for every page: language, theme, navbar, footer.
   The navbar is generated from window.NAV and window.DEPTS, so each link exists once. */
(function () {
  "use strict";

  var DEPTS = window.DEPTS, NAV = window.NAV;
  var App = { state: { lang: "en" } };
  var renderPage = function () {};

  function $(id) { return document.getElementById(id); }
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) {} return null; }
  App.esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  App.T = function () { return window.LANGS[App.state.lang]; };
  App.ui = function () { return App.T().ui; };
  App.deptById = function (id) { return DEPTS.filter(function (d) { return d.id === id; })[0]; };
  App.isReal = function (url) { return url && url.indexOf("YOUR-") === -1; };
  App.page = function () { return document.body.getAttribute("data-page") || "home"; };
  var esc = App.esc;

  App.resLinks = function (list) {
    var ui = App.ui(), k = ui.detail.kinds;
    return list.map(function (r) {
      return '<a href="' + r.url + '" target="_blank" rel="noopener noreferrer"><span>' + esc(r.name) + "</span>" +
        '<span class="meta"><small>' + esc(k[r.kind]) + '</small><span class="pill ' + (r.free ? "free" : "paid") + '">' +
        esc(r.free ? ui.detail.free : ui.detail.paid) + "</span></span></a>";
    }).join("");
  };

  /* ---------- language / theme ---------- */
  function initLang() {
    var saved = store("lang");
    if (saved && window.LANGS[saved]) { App.state.lang = saved; return; }
    var nav = (navigator.language || "en").slice(0, 2);
    if (window.LANGS[nav]) App.state.lang = nav;
  }

  function setLang(l) {
    App.state.lang = l;
    store("lang", l);
    buildChrome();
    renderPage();
  }

  /* ---------- header / footer ---------- */
  function navItem(item, T, page) {
    var u = T.ui, label = esc(u.nav[item.key]);
    if (item.menu) {
      var items = DEPTS.map(function (d) {
        var cur = page === "dept" && new URLSearchParams(location.search).get("d") === d.id;
        return '<a role="menuitem" href="department.html?d=' + d.id + '"' + (cur ? ' aria-current="page"' : "") + ">" +
          window.icon(d.id) + "<span>" + esc(T.depts[d.id].name) + "</span></a>";
      }).join("");
      return '<li class="has-dd' + (page === "dept" ? " on" : "") + '"><button type="button" class="dd-btn" id="ddBtn" aria-haspopup="true" aria-expanded="false" aria-controls="ddMenu">' +
        label + ' <i class="ti ti-chevron-down" aria-hidden="true"></i></button><div class="dd-menu" id="ddMenu" role="menu">' + items + "</div></li>";
    }
    var on = item.page && item.page === page;
    return '<li><a href="' + item.href + '"' + (on ? ' class="on" aria-current="page"' : "") + ">" + label + "</a></li>";
  }

  /* ---------- language dropdown (flags from the flag-icons library) ---------- */
  var FLAGS = { en: "gb", so: "so", ar: "sa" };   // English: UK, Somali: Somalia, Arabic: Saudi Arabia
  function flag(l) { return '<span class="fi fi-' + FLAGS[l] + ' flag" aria-hidden="true"></span>'; }
  function langMenu() {
    var cur = App.state.lang;
    return '<div class="lang-dd" id="langDd"><button type="button" class="lang-btn" id="langBtn" aria-haspopup="listbox" aria-expanded="false" aria-controls="langList" aria-label="Language">' +
      flag(cur) + '<span class="lang-name">' + esc(window.LANGS[cur].meta.label) + '</span><i class="ti ti-chevron-down" aria-hidden="true"></i></button>' +
      '<ul class="lang-list" id="langList" role="listbox" aria-label="Language">' +
      Object.keys(FLAGS).map(function (l) {
        return '<li role="presentation"><button type="button" role="option" data-lang="' + l + '" aria-selected="' + (l === cur) + '">' +
          flag(l) + "<span>" + esc(window.LANGS[l].meta.label) + "</span></button></li>";
      }).join("") + "</ul></div>";
  }

  function buildChrome() {
    var T = App.T(), u = T.ui, page = App.page();
    document.documentElement.lang = T.meta.code;
    document.documentElement.dir = T.meta.dir;

    $("siteHeader").innerHTML =
      '<div class="wrap bar">' +
      '<a class="brand" href="index.html" aria-label="CS Career, home"><span class="logo"><b>CS</b><span>career</span><i class="cursor"></i></span></a>' +
      '<nav class="nav" id="nav" aria-label="Main">' +
      '<div class="nav-head"><a class="brand" href="index.html" aria-label="CS Career, home"><span class="logo"><b>CS</b><span>career</span><i class="cursor"></i></span></a>' +
      '<button type="button" class="icon-btn nav-close" id="navClose" aria-label="' + esc(u.close) + '"><i class="ti ti-x" aria-hidden="true"></i></button></div>' +
      "<ul>" + NAV.map(function (n) { return navItem(n, T, page); }).join("") + "</ul></nav>" +
      '<div class="nav-overlay" id="navOverlay"></div>' +
      '<div class="tools">' +
      '<button type="button" class="theme-switch" id="themeBtn" role="switch" aria-checked="' + (document.documentElement.getAttribute("data-theme") === "dark") + '" aria-label="' + esc(u.theme) + '">' +
      '<i class="ti ti-sun" aria-hidden="true"></i><i class="ti ti-moon" aria-hidden="true"></i><span class="knob"></span></button>' +
      langMenu() +
      '<button type="button" class="icon-btn menu-btn" id="menuBtn" aria-label="Menu" aria-expanded="false" aria-controls="nav"><i class="ti ti-menu-2" aria-hidden="true"></i></button></div></div>';

    $("siteFooter").innerHTML = '<div class="wrap foot"><div class="foot-text"><p class="copy">' + esc(u.copy.replace("{year}", new Date().getFullYear())) +
      '</p><p class="foot-note">' + esc(u.footer) + '</p></div><a href="#top">' + esc(u.top) + "</a></div>";
    bindChrome();
    ensureBackTop(u.top);
  }

  /* ---------- back-to-top button (shown by an IntersectionObserver, no scroll listener) ---------- */
  function ensureBackTop(label) {
    var btn = $("backTop");
    if (!btn) {
      var sentinel = document.createElement("div");
      sentinel.className = "top-sentinel"; sentinel.setAttribute("aria-hidden", "true");
      document.body.appendChild(sentinel);
      btn = document.createElement("button");
      btn.type = "button"; btn.id = "backTop"; btn.className = "back-top";
      btn.innerHTML = '<i class="ti ti-arrow-up" aria-hidden="true"></i>';
      btn.onclick = function () {
        var calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: 0, behavior: calm ? "auto" : "smooth" });
      };
      document.body.appendChild(btn);
      if ("IntersectionObserver" in window) {
        new IntersectionObserver(function (entries) {
          var e = entries[entries.length - 1];
          btn.classList.toggle("show", !e.isIntersecting && e.boundingClientRect.top < 0);
        }).observe(sentinel);
      } else { btn.classList.add("show"); }
    }
    btn.setAttribute("aria-label", label);
    btn.title = label;
  }

  function bindChrome() {
    var langDd = $("langDd"), langBtn = $("langBtn");
    function setLangOpen(open) { langDd.classList.toggle("open", open); langBtn.setAttribute("aria-expanded", String(open)); }
    langBtn.onclick = function (e) { e.stopPropagation(); setLangOpen(!langDd.classList.contains("open")); };
    langDd.addEventListener("keydown", function (e) { if (e.key === "Escape") { setLangOpen(false); langBtn.focus(); } });
    langDd.querySelectorAll("[data-lang]").forEach(function (b) { b.onclick = function () { setLang(b.dataset.lang); }; });
    $("themeBtn").onclick = function () {
      var t = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", t);
      store("theme", t);
      $("themeBtn").setAttribute("aria-checked", String(t === "dark"));
    };
    var nav = $("nav"), menuBtn = $("menuBtn"), dd = document.querySelector(".has-dd"), ddBtn = $("ddBtn");
    var overlay = $("navOverlay"), closeBtn = $("navClose");
    function setNav(open, returnFocus) {
      nav.classList.toggle("open", open);
      overlay.classList.toggle("open", open);
      menuBtn.setAttribute("aria-expanded", String(open));
      document.documentElement.classList.toggle("nav-open", open);
      if (open) closeBtn.focus(); else if (returnFocus) menuBtn.focus();
    }
    menuBtn.onclick = function () { setNav(!nav.classList.contains("open")); };
    closeBtn.onclick = function () { setNav(false, true); };
    overlay.onclick = function () { setNav(false, true); };
    navKey = function (e) { if (e.key === "Escape" && nav.classList.contains("open")) setNav(false, true); };
    navResize = function () { if (window.innerWidth > 860 && nav.classList.contains("open")) setNav(false); };
    function setDd(open) { dd.classList.toggle("open", open); ddBtn.setAttribute("aria-expanded", String(open)); }
    var hoverable = function () { return window.matchMedia("(hover:hover) and (min-width: 861px)").matches; };
    ddBtn.onclick = function (e) { e.stopPropagation(); setDd(!dd.classList.contains("open")); };
    dd.addEventListener("mouseenter", function () { if (hoverable()) setDd(true); });
    dd.addEventListener("mouseleave", function () { if (hoverable()) setDd(false); });
    dd.addEventListener("keydown", function (e) { if (e.key === "Escape") { setDd(false); ddBtn.focus(); } });
    nav.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", function () { setDd(false); setNav(false); }); });
  }

  /* page-level listeners (bound once; they call the handlers set by bindChrome) */
  var navKey = function () {}, navResize = function () {};
  document.addEventListener("keydown", function (e) { navKey(e); });
  window.addEventListener("resize", function () { navResize(); });

  document.addEventListener("click", function (e) {
    var ld = $("langDd");
    if (ld && !ld.contains(e.target)) { ld.classList.remove("open"); var lb = $("langBtn"); if (lb) lb.setAttribute("aria-expanded", "false"); }
    var dd = document.querySelector(".has-dd");
    if (dd && !dd.contains(e.target)) { dd.classList.remove("open"); var b = $("ddBtn"); if (b) b.setAttribute("aria-expanded", "false"); }
  });

  /* ---------- start ---------- */
  App.init = function (render) {
    renderPage = render;
    document.addEventListener("DOMContentLoaded", function () {
      initLang();
      buildChrome();
      renderPage();
      if (location.hash.length > 1) {
        var el = document.getElementById(location.hash.slice(1));
        if (el) requestAnimationFrame(function () { el.scrollIntoView(); });
      }
    });
  };

  window.App = App;
})();
