/* Runs before the page paints, so dark mode never flashes white. */
try {
  var t = localStorage.getItem("theme");
  if (!t) t = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", t);
} catch (e) {}
