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
  // lat/lon: approximate coordinates of the region's main hub town/city —
  // there's no real geo-data anywhere else in the codebase (the homepage
  // map is a hand-illustrated SVG with arbitrary pixel positions, not
  // geographic ones), so these are sourced fresh, only for the weather card.
  var RAIL = {
    "regions/dhaka-gateway":            { region: "dhaka",      days: 3, season: "Nov–Feb", name: "Dhaka Gateway", exp: true, lat: 23.8103, lon: 90.4125 },
    "regions/sundarbans":               { region: "sundarbans", days: 5, season: "Nov–Feb", name: "the Sundarbans", exp: true, lat: 22.4869, lon: 89.6083 },
    "regions/coxs-bazar-saint-martin":  { region: "coxsbazar",  days: 4, season: "Nov–Mar", name: "Cox's Bazar", exp: true, lat: 21.4272, lon: 92.0058 },
    "regions/sylhet-srimangal":         { region: "sylhet",     days: 3, season: "Oct–Mar", name: "Sylhet & Srimangal", exp: true, lat: 24.8949, lon: 91.8687 },
    "regions/hill-tracts":              { region: "hilltracts", days: 4, season: "Nov–Feb", name: "the Hill Tracts", exp: true, lat: 22.6533, lon: 92.1722 },
    "regions/north-bengal":             { region: "northbengal", days: 3, season: "Nov–Feb", name: "North Bengal", exp: true, lat: 24.8465, lon: 89.3773 },
    "regions/kuakata":                  { region: "kuakata",     days: 3, season: "Nov–Mar", name: "Kuakata", exp: false, lat: 21.8153, lon: 90.1197 },
    "regions/bagerhat":                 { region: "bagerhat",    days: 2, season: "Nov–Feb", name: "Bagerhat", exp: true, lat: 22.6602, lon: 89.7895 },
    "regions/comilla-mainamati":        { region: "comilla",     days: 2, season: "Oct–Mar", name: "Comilla–Mainamati", exp: false, lat: 23.4607, lon: 91.1809 },
    "regions/mymensingh-haor":          { region: "mymensingh",  days: 4, season: "Nov–Feb", name: "Mymensingh & the Haors", exp: true, lat: 24.7471, lon: 90.4203 },
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

  function affButton(label, href, domain) {
    var a = document.createElement("a");
    a.className = "rail-book";
    a.href = href;
    a.target = "_blank";
    a.rel = "sponsored noopener";
    if (domain) {
      var img = document.createElement("img");
      img.className = "aff-icon";
      img.src = "https://www.google.com/s2/favicons?domain=" + domain + "&sz=32";
      img.alt = "";
      img.width = 18;
      img.height = 18;
      a.appendChild(img);
    }
    var span = document.createElement("span");
    span.textContent = label;
    a.appendChild(span);
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
    card.appendChild(affButton("Find hotels on Booking", "https://www.tkqlhce.com/click-101858699-17293139?url=https%3A%2F%2Fwww.booking.com%2Fcountry%2Fbd.html", "booking.com"));
    card.appendChild(affButton("Compare airlines (Aviasales)", "https://aviasales.tpm.li/GsTszCxG", "aviasales.com"));
    if (cfg.exp) card.appendChild(affButton("Book experiences", "https://www.getyourguide.com/?partner_id=PNM6R9P&utm_medium=online_publisher", "getyourguide.com"));

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
    var rail = buildRail(cfg);
    if (typeof cfg.lat === "number" && typeof cfg.lon === "number") {
      mountWeather(cfg, rail);
    }
    wrap.appendChild(rail);
  }

  /* ---- Weather card (region pages only) ----
     Open-Meteo: free, keyless, unlimited, no attribution required.
     Cached per region in localStorage for 3h (weather goes stale faster
     than exchange rates, but travellers don't need to-the-minute data).
     If the fetch fails and there's no cache, the card is simply omitted —
     never shows blank/broken data, just quietly isn't there. */
  var WMO = {
    0: ["☀️", "Clear"], 1: ["🌤️", "Mostly clear"], 2: ["⛅", "Partly cloudy"], 3: ["☁️", "Overcast"],
    45: ["🌫️", "Fog"], 48: ["🌫️", "Fog"],
    51: ["🌦️", "Light drizzle"], 53: ["🌦️", "Drizzle"], 55: ["🌦️", "Dense drizzle"],
    56: ["🌦️", "Freezing drizzle"], 57: ["🌦️", "Freezing drizzle"],
    61: ["🌧️", "Light rain"], 63: ["🌧️", "Rain"], 65: ["🌧️", "Heavy rain"],
    66: ["🌧️", "Freezing rain"], 67: ["🌧️", "Freezing rain"],
    71: ["🌨️", "Light snow"], 73: ["🌨️", "Snow"], 75: ["🌨️", "Heavy snow"], 77: ["🌨️", "Snow grains"],
    80: ["🌦️", "Rain showers"], 81: ["🌦️", "Rain showers"], 82: ["⛈️", "Violent showers"],
    85: ["🌨️", "Snow showers"], 86: ["🌨️", "Snow showers"],
    95: ["⛈️", "Thunderstorm"], 96: ["⛈️", "Thunderstorm"], 99: ["⛈️", "Thunderstorm"]
  };
  function wmoInfo(code) { return WMO[code] || ["🌡️", ""]; }
  var WX_DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  var WX_MAX_AGE_MS = 3 * 60 * 60 * 1000; // 3h

  function wxCacheKey(cfg) { return "btrip_wx_" + cfg.region.replace(/[^a-z0-9]/gi, "_"); }

  function readWxCache(cfg) {
    try {
      var raw = localStorage.getItem(wxCacheKey(cfg));
      if (!raw) return null;
      var obj = JSON.parse(raw);
      if (!obj || !obj.data || !obj.fetchedAt) return null;
      return obj;
    } catch (e) { return null; }
  }
  function writeWxCache(cfg, data) {
    try {
      localStorage.setItem(wxCacheKey(cfg), JSON.stringify({ data: data, fetchedAt: Date.now() }));
    } catch (e) { /* storage full/disabled — non-fatal */ }
  }

  function renderWeatherCard(card, data) {
    card.innerHTML = "";
    var cur = data.current;
    var curInfo = wmoInfo(cur.weather_code);
    var head = document.createElement("div");
    head.className = "wx-now";
    head.innerHTML = '<span class="wx-now-icon" aria-hidden="true">' + curInfo[0] + '</span>' +
      '<span class="wx-now-temp">' + Math.round(cur.temperature_2m) + '°C</span>' +
      '<span class="wx-now-label">' + curInfo[1] + '</span>';
    card.appendChild(head);

    var days = document.createElement("div");
    days.className = "wx-days";
    var time = data.daily.time, tmax = data.daily.temperature_2m_max, tmin = data.daily.temperature_2m_min, wcode = data.daily.weather_code;
    for (var i = 0; i < time.length && i < 5; i++) {
      var d = new Date(time[i] + "T00:00:00");
      var info = wmoInfo(wcode[i]);
      var cell = document.createElement("div");
      cell.className = "wx-day";
      cell.innerHTML = '<span class="wx-day-lbl">' + (i === 0 ? "Today" : WX_DAY_LABELS[d.getDay()]) + '</span>' +
        '<span class="wx-day-icon" aria-hidden="true">' + info[0] + '</span>' +
        '<span class="wx-day-temp">' + Math.round(tmax[i]) + '°/' + Math.round(tmin[i]) + '°</span>';
      days.appendChild(cell);
    }
    card.appendChild(days);
    card.hidden = false;
  }

  function mountWeather(cfg, rail) {
    var card = document.createElement("div");
    card.className = "rail-card wx-card";
    card.hidden = true; // stays hidden until we actually have data to show
    rail.appendChild(card);

    var cached = readWxCache(cfg);
    var isFresh = cached && (Date.now() - cached.fetchedAt) < WX_MAX_AGE_MS;
    if (cached) renderWeatherCard(card, cached.data); // show stale data immediately rather than nothing
    if (isFresh) return;

    var url = "https://api.open-meteo.com/v1/forecast?latitude=" + cfg.lat + "&longitude=" + cfg.lon +
      "&current=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=5";
    fetch(url).then(function (res) {
      if (!res.ok) throw new Error("HTTP " + res.status);
      return res.json();
    }).then(function (data) {
      if (!data || !data.current || !data.daily) throw new Error("unexpected payload");
      renderWeatherCard(card, data);
      writeWxCache(cfg, data);
    }).catch(function () {
      // Fetch failed. If we had stale cache, it's already showing above —
      // leave it. If there was no cache at all, the card stays hidden;
      // never show a broken/empty weather card.
    });
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

  /* ---- Auto-inject brand icons into static .cta-aff links ---- */
  // Maps a URL substring to the canonical domain for favicon lookup.
  var AFF_DOMAIN_MAP = [
    ["tkqlhce.com",      "booking.com"],   // CJ redirect → Booking
    ["booking.com",      "booking.com"],
    ["agoda.com",        "agoda.com"],
    ["aviasales.",       "aviasales.com"],
    ["kiwitaxi.",        "kiwitaxi.com"],
    ["klook.",           "klook.com"],
    ["wegotrip.",        "wegotrip.com"],
    ["tiqets.",          "tiqets.com"],
    ["radicalstorage.",  "radicalstorage.com"],
    ["airalo.",          "airalo.com"],
    ["safetywing.",      "safetywing.com"],
    ["getyourguide.",    "getyourguide.com"]
  ];
  function injectAffIcons() {
    var btns = document.querySelectorAll("a.cta-aff");
    for (var i = 0; i < btns.length; i++) {
      var a = btns[i];
      if (a.querySelector(".aff-icon")) continue; // already injected by JS
      var domain = null;
      for (var j = 0; j < AFF_DOMAIN_MAP.length; j++) {
        if (a.href.indexOf(AFF_DOMAIN_MAP[j][0]) !== -1) { domain = AFF_DOMAIN_MAP[j][1]; break; }
      }
      if (!domain) continue;
      var img = document.createElement("img");
      img.className = "aff-icon";
      img.src = "https://www.google.com/s2/favicons?domain=" + domain + "&sz=32";
      img.alt = "";
      img.width = 18;
      img.height = 18;
      a.insertBefore(img, a.firstChild);
    }
  }

  /* ---- Active nav link ---- */
  function mountNavActive() {
    // Normalise via a real URL resolution (a.href, not getAttribute) so
    // page-relative hrefs on nested pages (regions/*.html use "index.html",
    // "../visa.html" etc.) resolve against *their* document, not the site
    // root — string-matching the raw attribute breaks on every nested page.
    // A trailing "/index" collapses to its parent, so the "Regions" link
    // (→ regions/index.html) stays active on every regions/*.html subpage,
    // not just the listing page itself.
    function normPath(p) {
      return (p.replace(/\.html$/, '').replace(/\/+$/, '').replace(/\/index$/, '')) || '/';
    }
    var cur = normPath(location.pathname);
    document.querySelectorAll('.nav a').forEach(function (a) {
      if (a.classList.contains('nav-cta')) return;
      var raw = a.getAttribute('href') || '';
      if (!raw || raw.charAt(0) === '#') return;
      var resolvedPath;
      try { resolvedPath = new URL(a.href).pathname; } catch (e) { return; }
      var norm = normPath(resolvedPath);
      if (cur === norm || cur.startsWith(norm + '/')) {
        a.classList.add('nav-active');
      }
    });
  }

  ready(function () {
    mountRail();
    mountStickyPlan();
    mountProgress();
    injectAffIcons();
    mountNavActive();
  });
})();
