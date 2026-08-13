/* =====================================================================
   The Bangladesh Trip — shared site behaviour (vanilla JS, no deps)
   - A subtle sticky "Plan my trip" button (except on the planner).
   - An inner-page sticky action rail on region/guide pages: best-season
     chip, "Plan this region" (prefilled planner) and "Book" affiliate
     buttons — filling the empty gutter AND driving Plan/Book.
   - A fast top progress bar on navigation.
   Honours prefers-reduced-motion throughout.
   ===================================================================== */
(function () {
  "use strict";

  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var path = (location.pathname || "").toLowerCase();
  var isPlan = /\/plan\.html$/.test(path) || path === "/plan";

  function ready(fn) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
    else fn();
  }
  function key() {
    // normalise: strip leading slash + trailing .html
    var p = path.replace(/^\/+/, "").replace(/\.html$/, "");
    if (p === "" || p === "index") return "index";
    return p;
  }

  /* ---- Sticky action-rail config, keyed by page ---- */
  // region: planner region id · days: prefill length · season: best months
  var RAIL = {
    "regions/dhaka-gateway":            { region: "dhaka",      days: 3, season: "Nov–Feb", name: "Dhaka Gateway", exp: true },
    "regions/sundarbans":               { region: "sundarbans", days: 5, season: "Nov–Feb", name: "the Sundarbans", exp: true },
    "regions/coxs-bazar-saint-martin":  { region: "coxsbazar",  days: 4, season: "Nov–Mar", name: "Cox's Bazar", exp: true },
    "regions/sylhet-srimangal":         { region: "sylhet",     days: 3, season: "Oct–Mar", name: "Sylhet & Srimangal", exp: true },
    "regions/hill-tracts":              { region: "hilltracts", days: 4, season: "Nov–Feb", name: "the Hill Tracts", exp: true },
    "sundarbans-tour-cost-from-dhaka":  { region: "dhaka,sundarbans", days: 5, season: "Nov–Feb", name: "a Sundarbans trip", exp: true },
    "7-day-bangladesh-itinerary-cost":  { region: "dhaka,sundarbans,sylhet", days: 7, season: "Nov–Feb", name: "this 7-day trip", exp: true },
    "bangladesh-trip-budget-2-weeks":   { region: "dhaka,sylhet,sundarbans,coxsbazar,hilltracts", days: 14, season: "Nov–Feb", name: "the full loop", exp: false },
    "cost-of-traveling-in-bangladesh":  { region: "", days: 7, season: "Nov–Feb", name: "your trip", exp: false },
    "bangladesh-visa-on-arrival":       { region: "", days: 7, season: "Nov–Feb", name: "your trip", exp: false },
    "bangladesh-visa-for-us-citizens":  { region: "", days: 7, season: "Nov–Feb", name: "your trip", exp: false },
    "is-bangladesh-safe-for-tourists":  { region: "", days: 7, season: "Nov–Feb", name: "your trip", exp: false },
    "bangladesh-itinerary-for-first-time-visitors": { region: "dhaka,sundarbans,sylhet", days: 7, season: "Nov–Feb", name: "your first trip", exp: true },
    "about":                            { region: "", days: 7, season: "Nov–Feb", name: "your trip", exp: false }
  };

  function affButton(label, href) {
    var a = document.createElement("a");
    a.className = "rail-book";
    a.href = href;
    a.target = "_blank";
    a.rel = "sponsored noopener";
    a.textContent = label;
    return a;
  }

  function buildRail(cfg) {
    var rail = document.createElement("aside");
    rail.className = "page-rail";

    var card = document.createElement("div");
    card.className = "rail-card";

    var h = document.createElement("p"); h.className = "rail-title"; h.textContent = "Ready to go?";
    card.appendChild(h);
    var sub = document.createElement("p"); sub.className = "rail-sub"; sub.textContent = "Turn this into a real, costed plan in a few taps.";
    card.appendChild(sub);

    var chip = document.createElement("span"); chip.className = "rail-season";
    chip.innerHTML = '<span aria-hidden="true">☀</span> Best season: ' + cfg.season;
    card.appendChild(chip);

    var plan = document.createElement("a");
    plan.className = "cta";
    plan.href = "/plan.html" + (cfg.region ? ("?regions=" + cfg.region + "&days=" + cfg.days + "&style=comfort") : "");
    plan.textContent = cfg.region ? "Plan this region →" : "Plan your trip →";
    card.appendChild(plan);

    // Affiliate "Book" buttons
    card.appendChild(affButton("Find hotels on Booking", "https://www.booking.com/"));
    card.appendChild(affButton("Compare airlines in one search", "https://aviasales.tpm.li/GsTszCxG"));
    if (cfg.exp) card.appendChild(affButton("Book experiences", "https://www.getyourguide.com/?partner_id=PNM6R9P&utm_medium=online_publisher"));

    var note = document.createElement("p"); note.className = "rail-note";
    note.textContent = "We may earn a commission from bookings, at no extra cost to you.";
    card.appendChild(note);

    rail.appendChild(card);
    return rail;
  }

  function mountRail() {
    var cfg = RAIL[key()];
    if (!cfg) return;
    var wrap = document.querySelector("main .wrap.article");
    if (!wrap) return;
    // Turn the centred column into: [ .article content ] [ sticky rail ]
    var content = document.createElement("div");
    content.className = "article";
    while (wrap.firstChild) content.appendChild(wrap.firstChild);
    wrap.classList.remove("article");
    wrap.classList.add("page-layout");
    wrap.appendChild(content);
    wrap.appendChild(buildRail(cfg));
  }

  function mountStickyPlan() {
    if (isPlan) return;
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
      if (show !== shown) { shown = show; a.classList.toggle("is-visible", show); }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  function mountProgress() {
    if (reduce) return;
    var bar = document.createElement("div");
    bar.className = "route-progress";
    document.body.appendChild(bar);
    document.addEventListener("click", function (e) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      var a = e.target.closest && e.target.closest("a");
      if (!a) return;
      if (a.target === "_blank" || a.hasAttribute("download")) return;
      if (a.origin !== location.origin) return;
      var href = a.getAttribute("href");
      if (!href || href.charAt(0) === "#") return;
      // same-page hash / same URL — ignore
      if (a.pathname === location.pathname && a.search === location.search && a.hash) return;
      bar.classList.add("active");
    }, true);
    // reset if the page is restored from bfcache
    window.addEventListener("pageshow", function () { bar.classList.remove("active"); bar.style.width = ""; });
  }

  ready(function () {
    mountRail();
    mountStickyPlan();
    mountProgress();
  });
})();
