/* =====================================================================
   The Bangladesh Trip — shared site behaviour
   A subtle sticky "Plan my trip" button that keeps the core action
   within reach on every page (except the planner itself). Vanilla JS,
   no dependencies. Honours prefers-reduced-motion.
   ===================================================================== */
(function () {
  "use strict";

  var path = (location.pathname || "").toLowerCase();
  // Don't show it on the planner page — you're already there.
  if (/\/plan\.html$/.test(path) || path === "/plan") return;

  function ready(fn) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
    else fn();
  }

  ready(function () {
    var a = document.createElement("a");
    a.className = "sticky-plan";
    a.href = "/plan.html";
    a.setAttribute("aria-label", "Plan my trip");
    a.innerHTML = '<span class="sticky-plan-emoji" aria-hidden="true">🧭</span> Plan my trip';
    document.body.appendChild(a);

    var shown = false;
    function onScroll() {
      var y = window.pageYOffset || document.documentElement.scrollTop;
      var show = y > 420;
      if (show !== shown) {
        shown = show;
        a.classList.toggle("is-visible", show);
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  });
})();
