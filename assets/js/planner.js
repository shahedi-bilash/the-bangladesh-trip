/* =====================================================================
   The Bangladesh Trip — planner engine
   ---------------------------------------------------------------------
   State lives entirely in the URL, so every plan is shareable and
   regenerates with no backend:
     plan.html?regions=dhaka,sundarbans&days=7&style=comfort
               &from=United%20States&month=Dec&cur=USD&pax=2
   This file: reads those params, drives the input form, computes an
   honest cost range, stitches a day-by-day skeleton, resolves the visa
   summary, and builds the share bar. Pure vanilla JS.
   ===================================================================== */
(function () {
  "use strict";

  var STYLES = ["backpacker", "comfort", "premium"];
  var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  /* Region-planner slug → spot-planner region key (inverse of spots.js's
     REGION_PLAN_SLUG). Used only to pre-filter spots.html's "Adjust spots →"
     link when a plan covers exactly one region. */
  var REGION_SPOT_SLUG = {
    dhaka: "dhaka-gateway", sundarbans: "sundarbans", coxsbazar: "coxs-bazar",
    sylhet: "sylhet", hilltracts: "hill-tracts", northbengal: "north-bengal",
    kuakata: "kuakata", bagerhat: "bagerhat", comilla: "comilla", mymensingh: "mymensingh"
  };

  /* ---------- small helpers ---------- */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function el(tag, cls, txt) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (txt != null) n.textContent = txt;
    return n;
  }
  function clamp(n, lo, hi) { return Math.max(lo, Math.min(hi, n)); }

  /* Track whether the user has manually clicked a currency button this session. */
  var _userPickedCur = false;

  function getParams() {
    var p = new URLSearchParams(window.location.search);
    var regions = (p.get("regions") || "").split(",").map(function (s) { return s.trim(); }).filter(Boolean);
    var style = (p.get("style") || "comfort").toLowerCase();
    if (STYLES.indexOf(style) === -1) style = "comfort";
    var days = parseInt(p.get("days"), 10);
    if (isNaN(days)) days = 0;
    days = clamp(days, 0, 60);
    var pax = parseInt(p.get("pax"), 10);
    if (isNaN(pax) || pax < 1) pax = 1;
    pax = clamp(pax, 1, 12);
    var cur = (p.get("cur") || "USD").toUpperCase();
    if (!FX[cur]) cur = "USD";
    return {
      regions: regions,
      days: days,
      style: style,
      pax: pax,
      from: p.get("from") || "",
      month: p.get("month") || "",
      cur: cur
    };
  }

  function regionById(id) {
    for (var i = 0; i < REGIONS.length; i++) if (REGIONS[i].id === id) return REGIONS[i];
    return null;
  }

  /* Convert a USD range into the target currency, rounded sensibly. */
  function convert(rangeUSD, cur) {
    var fx = FX[cur] || FX.USD;
    return [rangeUSD[0] * fx.rate, rangeUSD[1] * fx.rate];
  }
  function roundNice(v) {
    if (v >= 10000) return Math.round(v / 500) * 500;
    if (v >= 1000)  return Math.round(v / 50) * 50;
    if (v >= 100)   return Math.round(v / 10) * 10;
    if (v >= 20)    return Math.round(v / 5) * 5;
    return Math.round(v);
  }
  function fmtMoney(v, cur) {
    var fx = FX[cur] || FX.USD;
    var n = roundNice(v);
    return fx.symbol + n.toLocaleString("en-US");
  }
  function fmtRange(rangeUSD, cur) {
    var r = convert(rangeUSD, cur);
    return "≈ " + fmtMoney(r[0], cur) + "–" + fmtMoney(r[1], cur);
  }
  function addR(a, b) { return [a[0] + b[0], a[1] + b[1]]; }
  function scaleR(a, k) { return [a[0] * k, a[1] * k]; }

  /* ---------- country helpers ---------- */
  function findCountry(country) {
    if (!country || typeof COUNTRIES === "undefined") return null;
    var lc = country.trim().toLowerCase();
    for (var i = 0; i < COUNTRIES.length; i++) {
      if (COUNTRIES[i].name.toLowerCase() === lc) return COUNTRIES[i];
    }
    return null;
  }

  /* Return FX currency code for a country, or null if unknown / no FX entry. */
  function resolveCountryCurrency(country) {
    var c = findCountry(country);
    if (!c) return null;
    return FX[c.currency] ? c.currency : "USD";
  }

  /* ---------- visa resolver ---------- */
  function resolveVisa(country) {
    if (!country) return null;
    var c = findCountry(country);
    if (c) {
      var v = c.visa;
      for (var k = 0; k < VISA.length; k++) {
        if (VISA[k].summary === v) return VISA[k];
      }
      if (v === "visa_on_arrival") return { group: "Visa on arrival", summary: "visa_on_arrival",
        note: "Your nationality may qualify for a visa on arrival at Dhaka airport. Conditions and eligibility change — always confirm with an official Bangladesh mission before you fly." };
      if (v === "e_visa") return { group: "e-Visa", summary: "e_visa",
        note: "An e-visa may be available for your nationality. Check the official Bangladesh e-visa portal and apply well in advance." };
      return { group: "Apply in advance", summary: "embassy",
        note: "Travellers from " + country + " should arrange a visa before arrival through a Bangladesh embassy, consulate or e-visa portal." };
    }
    var lc = country.trim().toLowerCase();
    for (var i = 0; i < VISA.length; i++) {
      var g = VISA[i];
      for (var j = 0; j < g.countries.length; j++) {
        if (g.countries[j].toLowerCase() === lc) return g;
      }
    }
    return { group: "Check with a Bangladesh mission", summary: "embassy",
      note: "We don't have a rule on file for " + country + ". Confirm your visa route with an official Bangladesh embassy, consulate or e-visa portal before you travel." };
  }
  function visaLabel(summary) {
    if (summary === "visa_on_arrival") return "Visa on arrival (conditions apply)";
    if (summary === "e_visa") return "e-Visa — apply online in advance";
    return "Apply in advance (e-visa / embassy)";
  }

  /* ---------- cost model — pax-aware ----------
     Cost types:
       PER_PERSON : × pax               (food, eSIM, insurance, intercity seats, activities)
       ROOM_BASED : ceil(pax/2) rooms   (hotels — 2 travellers share a room)
       SHARED     : flat per trip       (nothing here at region level — spot planner handles private boats)
  ---------------------------------------------------------------- */
  function computeCost(params) {
    var style = params.style;
    var days  = params.days;
    var pax   = params.pax || 1;
    var regions = params.regions.map(regionById).filter(Boolean);
    var nRegions = Math.max(regions.length, 1);
    var nights  = Math.max(days - 1, 1); // last day = departure, no hotel
    var doubles = Math.floor(pax / 2);   // double rooms
    var singles = pax % 2;               // 1 if odd pax (solo or odd group), else 0
    var rooms   = doubles + singles;     // total room count

    /* Region day-rates: local transport + activities, PER PERSON per day */
    var perDay = [0, 0];
    regions.forEach(function (r) { perDay = addR(perDay, r.perDayUSD[style]); });
    perDay = scaleR(perDay, 1 / nRegions);
    var regionDays = scaleR(perDay, Math.max(days, 1) * pax);

    /* Hotels: doubles at base rate; single room carries 27% premium over half a double */
    var roomMultiplier = doubles + singles * 1.27;
    var hotels = scaleR(COST.hotelNightUSD[style], roomMultiplier * nights);

    /* Experiences & entry permits: PER_PERSON */
    var experiences = scaleR([12, 45], nRegions * pax);
    if (style === "premium")    experiences = scaleR(experiences, 1.8);
    if (style === "backpacker") experiences = scaleR(experiences, 0.6);

    /* Food: PER_PERSON per day */
    var food = scaleR(COST.foodDayUSD[style], Math.max(days, 1) * pax);

    /* Intercity: PER_PERSON (bus/train seats) */
    var intercityBase = scaleR(COST.intercityUSD[style], clamp(nRegions, 1, 5) * 0.6 + 0.4);
    var intercity = scaleR(intercityBase, pax);

    /* eSIM: PER_PERSON */
    var esim = scaleR(COST.esimUSD.slice(), pax);

    /* Insurance: PER_PERSON per week */
    var insurance = scaleR(COST.insuranceWeekUSD, Math.max(days / 7, 0.5) * pax);

    var roomConfig = pax === 1
      ? "1 single room (solo premium)"
      : (doubles > 0 ? doubles + " double" + (doubles > 1 ? "s" : "") : "") +
        (doubles > 0 && singles > 0 ? " + " : "") +
        (singles > 0 ? "1 single" : "") +
        " · " + pax + " traveller" + (pax > 1 ? "s" : "");
    var roomNote = roomConfig + " · " + nights + " night" + (nights === 1 ? "" : "s");

    var lines = [
      { key: "Local days (transport + activities)",                  range: regionDays },
      { key: "Hotels · " + roomConfig, subkey: roomNote, range: hotels },
      { key: "Experiences & permits",                               range: experiences },
      { key: "Food · " + Math.max(days, 1) + " day" + (days === 1 ? "" : "s"), range: food },
      { key: "Intercity travel",                                    range: intercity },
      { key: "Tourist eSIM" + (pax > 1 ? " · " + pax + " SIMs" : ""), range: esim },
      { key: "Travel insurance",                                    range: insurance }
    ];
    var total = [0, 0];
    lines.forEach(function (l) { total = addR(total, l.range); });
    var perPerson = scaleR(total, 1 / pax);
    return { lines: lines, total: total, perPerson: perPerson, nights: nights, rooms: rooms, pax: pax };
  }

  /* ---------- day-by-day skeleton ---------- */
  function buildItinerary(params) {
    var regions = params.regions.map(regionById).filter(Boolean);
    var days = params.days;
    if (!regions.length || !days) return [];

    var weights = regions.map(function (r) { return r.minDays; });
    var wSum = weights.reduce(function (a, b) { return a + b; }, 0);
    var alloc = regions.map(function (r, i) {
      return Math.max(1, Math.round(days * (weights[i] / wSum)));
    });
    var diff = days - alloc.reduce(function (a, b) { return a + b; }, 0);
    var idx = 0;
    while (diff !== 0 && regions.length) {
      alloc[idx % regions.length] += diff > 0 ? 1 : -1;
      if (alloc[idx % regions.length] < 1) alloc[idx % regions.length] = 1;
      diff = days - alloc.reduce(function (a, b) { return a + b; }, 0);
      idx++;
      if (idx > 500) break;
    }

    var plan = [];
    var dayNo = 1;
    regions.forEach(function (r, ri) {
      var n = alloc[ri];
      for (var d = 0; d < n; d++) {
        var tmpl = r.dayTemplates[d % r.dayTemplates.length];
        var title = tmpl.title;
        if (d >= r.dayTemplates.length) title += " · more time";
        plan.push({ day: dayNo++, region: r.name, title: title, detail: tmpl.detail });
      }
    });

    /* Last day = departure — no sightseeing on flight day */
    if (plan.length > 0) {
      var last = plan[plan.length - 1];
      var leavingFromDhaka = last.region === "Dhaka Gateway";
      last.title = leavingFromDhaka ? "Fly home from Dhaka" : "Return to Dhaka — fly home";
      last.detail = leavingFromDhaka
        ? "Head to Hazrat Shahjalal International Airport (DAC). Allow extra time for Dhaka traffic — no new sightseeing on departure day."
        : "Travel back to Dhaka today so you're not rushing on flight day. International flights leave from Hazrat Shahjalal (DAC) — aim to arrive in the city the evening before. No new sightseeing on departure day.";
    }

    return plan;
  }

  /* ---------- affiliate link builder ---------- */
  function affLink(slug) {
    if (!slug || !AFF_BASE[slug]) return null;
    var base = AFF_BASE[slug];
    var id = AFF[slug];
    if (id && id !== "TODO") {
      base += (base.indexOf("?") === -1 ? "?" : "&") + "aff=" + encodeURIComponent(id);
    }
    return base;
  }
  function affLabel(slug) {
    return {
      booking:   "Find hotels on Booking",
      agoda:     "Find hotels on Agoda",
      flights:   "Search flights (Aviasales)",
      transfer:  "Book airport transfer (Kiwitaxi)",
      klook:     "Book on Klook",
      wegotrip:  "Self-guided tours (WeGoTrip)",
      tiqets:    "Buy attraction tickets (Tiqets)",
      storage:   "Luggage storage (Radical Storage)",
      airalo:    "Get an eSIM (Airalo)",
      insurance: "Compare travel insurance"
    }[slug] || "Book";
  }
  function affNote(slug) {
    return {
      flights:  "Compare airlines in one search",
      transfer: "Fixed price, meet you at arrivals",
      klook:    "Free cancellation on most tours",
      wegotrip: "Free cancellation on most tours",
      tiqets:   "Skip the ticket queue",
      storage:  "City-centre drop-off from a few $/day",
      airalo:   "Get online the minute you land"
    }[slug] || null;
  }
  var AFF_ICON = {
    booking:   "booking.com",
    agoda:     "agoda.com",
    flights:   "aviasales.com",
    transfer:  "kiwitaxi.com",
    klook:     "klook.com",
    wegotrip:  "wegotrip.com",
    tiqets:    "tiqets.com",
    storage:   "radicalstorage.com",
    airalo:    "airalo.com",
    insurance: "safetywing.com"
  };
  function ctaButton(slug) {
    var href = affLink(slug);
    if (!href) return null;
    var a = document.createElement("a");
    a.className = "cta cta-aff";
    a.href = href;
    a.target = "_blank";
    a.rel = "sponsored noopener";
    var domain = AFF_ICON[slug];
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
    span.textContent = affLabel(slug);
    a.appendChild(span);
    return a;
  }

  /* ---------- rendering ---------- */
  function renderResult(params) {
    var root = $("#plan-result");
    if (!root) return;
    root.innerHTML = "";

    var regions = params.regions.map(regionById).filter(Boolean);
    if (!regions.length || !params.days) {
      root.appendChild(el("p", "muted", "Choose at least one region and a number of days to see your estimate."));
      return;
    }

    var cur = params.cur;
    var pax = params.pax || 1;
    var styleName = params.style.charAt(0).toUpperCase() + params.style.slice(1);

    /* Summary header */
    var head = el("div", "result-head");
    head.appendChild(el("p", "eyebrow", "Your Bangladesh plan"));
    head.appendChild(el("h2", null, regions.map(function (r) { return r.name; }).join(" · ")));
    var paxLabel = pax === 1 ? "1 traveller" : pax + " travellers";
    head.appendChild(el("p", "result-meta",
      params.days + " days · " + paxLabel + " · " + styleName + " style" +
      (params.from ? " · from " + params.from : "") +
      (params.month ? " · " + params.month : "")));
    root.appendChild(head);

    /* Cost card */
    var cost = computeCost(params);
    var costCard = el("section", "card cost-card");

    var costTitle = el("h3", "card-title", "Estimated cost");
    costCard.appendChild(costTitle);

    /* Currency note for hidden/auto-switched currencies */
    var curFx = FX[cur] || FX.USD;
    if (curFx.hidden) {
      var curNote = el("p", "cur-auto-note", "Showing in " + curFx.label + " (approx.) · " + curFx.symbol + "1 ≈ $" + (1 / curFx.rate).toFixed(3));
      costCard.appendChild(curNote);
    }

    var table = el("div", "cost-lines");
    cost.lines.forEach(function (l) {
      var row = el("div", "cost-row");
      var keyWrap = el("div", "cost-key-wrap");
      keyWrap.appendChild(el("span", "cost-key", l.key));
      if (l.subkey) keyWrap.appendChild(el("span", "cost-subkey", l.subkey));
      row.appendChild(keyWrap);
      row.appendChild(el("span", "cost-val", fmtRange(l.range, cur)));
      table.appendChild(row);
      /* Inline Airalo CTA below the eSIM line */
      if (l.key.indexOf("eSIM") !== -1) {
        var esimBtn = ctaButton("airalo");
        if (esimBtn) { esimBtn.style.fontSize = ".8rem"; esimBtn.style.marginTop = ".25rem"; table.appendChild(esimBtn); }
        table.appendChild(el("p", "aff-note", "Get online the minute you land"));
      }
    });

    /* Total + per-person rows */
    var totalRow = el("div", "cost-row cost-total");
    var totalKeyWrap = el("div", "cost-key-wrap");
    totalKeyWrap.appendChild(el("span", "cost-key", "Total for " + paxLabel));
    totalRow.appendChild(totalKeyWrap);
    totalRow.appendChild(el("span", "cost-val", fmtRange(cost.total, cur)));
    table.appendChild(totalRow);

    if (pax > 1) {
      var ppRow = el("div", "cost-row cost-per-person");
      ppRow.appendChild(el("span", "cost-key", "≈ per person"));
      ppRow.appendChild(el("span", "cost-val", fmtRange(cost.perPerson, cur)));
      table.appendChild(ppRow);
    }

    costCard.appendChild(table);
    costCard.appendChild(el("p", "small-print",
      "Indicative estimate only — real cost varies with season, operator, group size and how you travel. " +
      "Currency conversions are approximate. Hotels estimated at " + cost.rooms + " room" +
      (cost.rooms === 1 ? "" : "s") + " (2 per room). Excludes international flights."));
    var flightsBtn = ctaButton("flights");
    if (flightsBtn) { flightsBtn.classList.add("cta-block"); costCard.appendChild(flightsBtn); }
    costCard.appendChild(el("p", "aff-note", "Compare airlines in one search"));

    /* Currency switcher — only non-hidden currencies as buttons */
    var curWrap = el("div", "cur-switch");
    curWrap.appendChild(el("span", "cur-label", "Show in:"));
    Object.keys(FX).forEach(function (code) {
      if (FX[code].hidden) return; // don't show hidden currencies as buttons
      var b = el("button", "cur-btn" + (code === cur ? " is-active" : ""), code);
      b.type = "button";
      b.addEventListener("click", function () {
        _userPickedCur = true;
        var p2 = new URLSearchParams(window.location.search);
        p2.set("cur", code);
        history.replaceState(null, "", "plan.html?" + p2.toString());
        renderResult(getParams());
      });
      curWrap.appendChild(b);
    });
    /* If cur is a hidden currency (auto-selected), show it as a label, not a button */
    if (curFx.hidden) {
      var hiddenLabel = el("span", "cur-auto-chip", curFx.label + " (auto)");
      curWrap.appendChild(hiddenLabel);
    }
    costCard.appendChild(curWrap);

    /* Compact plan summary */
    var summaryCard = el("section", "card plan-summary");
    summaryCard.appendChild(el("h3", "card-title", "Your plan"));
    var sumList = el("dl", "summary-list");
    function sumRow(k, v) { sumList.appendChild(el("dt", null, k)); sumList.appendChild(el("dd", null, v)); }
    sumRow("Regions", regions.map(function (r) { return r.name; }).join(", "));
    sumRow("Days", String(params.days));
    sumRow("Travellers", paxLabel);
    sumRow("Style", styleName);
    if (params.month) sumRow("When", params.month);
    if (params.from) sumRow("From", params.from);
    summaryCard.appendChild(sumList);
    var visaQuick = resolveVisa(params.from);
    if (visaQuick) summaryCard.appendChild(el("span", "visa-badge visa-" + visaQuick.summary, visaLabel(visaQuick.summary)));
    var editLink = el("a", "text-link", "← Change these choices");
    editLink.href = "plan.html?" + new URLSearchParams(window.location.search).toString();
    editLink.addEventListener("click", function (e) { e.preventDefault(); showForm(); fillForm(getParams()); window.scrollTo({ top: 0, behavior: "smooth" }); });
    summaryCard.appendChild(editLink);

    /* Trip essentials */
    var essCard = el("section", "card essentials-card");
    essCard.appendChild(el("h3", "card-title", "Trip essentials"));
    essCard.appendChild(el("p", "muted", "Book the basics — flights, rooms, data and cover."));
    ["flights", "booking", "agoda", "airalo", "insurance"].forEach(function (slug) {
      var b = ctaButton(slug);
      if (b) { b.classList.add("cta-block"); essCard.appendChild(b); }
    });
    essCard.appendChild(el("p", "small-print", "We may earn a commission from bookings made through these links, at no extra cost to you."));

    /* TOP row: cost (left) + compact rail (right) */
    var topGrid = el("div", "result-grid");
    topGrid.appendChild(costCard);
    var topRail = el("div", "result-rail");
    topRail.appendChild(summaryCard);
    topRail.appendChild(essCard);
    topGrid.appendChild(topRail);
    root.appendChild(topGrid);

    /* MAIN row: day-by-day (left) + visa & experiences (right) */
    var mainGrid = el("div", "result-grid");

    var itinCard = el("section", "card");
    itinCard.appendChild(el("h3", "card-title", "Day by day"));
    itinCard.appendChild(el("p", "muted", "A skeleton to shape your own trip around — not a fixed schedule."));
    var IMG_SLUG = {
      "Dhaka Gateway":          "dhaka-gateway",
      "Sundarbans":             "sundarbans",
      "Cox's Bazar & St Martin":"coxs-bazar",
      "Sylhet & Srimangal":     "sylhet",
      "Chittagong Hill Tracts": "hill-tracts"
    };
    var list = el("ol", "itinerary");
    buildItinerary(params).forEach(function (d) {
      var li = el("li", "itin-day");
      var slug = IMG_SLUG[d.region] || d.region.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      var img = document.createElement("img");
      img.className = "itin-thumb";
      img.src = "/assets/img/" + slug + ".webp";
      img.alt = d.region;
      img.width = 96;
      img.height = 72;
      img.loading = "lazy";
      img.decoding = "async";
      img.onerror = function () { this.style.display = "none"; };
      li.appendChild(img);
      var body = el("div", "itin-body");
      var top = el("div", "itin-top");
      top.appendChild(el("span", "itin-num", "Day " + d.day));
      top.appendChild(el("span", "itin-region", d.region));
      body.appendChild(top);
      body.appendChild(el("h4", "itin-title", d.title));
      body.appendChild(el("p", "itin-detail", d.detail));
      li.appendChild(body);
      list.appendChild(li);
    });
    itinCard.appendChild(list);

    var actCard = el("div", "plan-actions-card");
    actCard.appendChild(el("p", "pac-label", "What next?"));
    var editBtn = el("button", "cta-sm", "✎ Adjust these choices");
    editBtn.type = "button";
    editBtn.addEventListener("click", function () { showForm(); fillForm(getParams()); window.scrollTo({ top: 0, behavior: "smooth" }); });
    actCard.appendChild(editBtn);
    var regionLink = el("a", "cta-sm", "🗺 Plan another region");
    regionLink.href = "plan.html";
    actCard.appendChild(regionLink);
    /* Hand off to the spot-level planner. This skeleton is region+day level,
       not built from named spots, so there is nothing to "carry over" beyond
       scope (region, if the plan is single-region) and traveller/currency
       context — spots.html has no concept of days/style/origin to receive. */
    var adjustSpots = el("a", "cta-sm", "📍 Adjust spots →");
    var spotsParams = new URLSearchParams();
    if (regions.length === 1) {
      var spotSlug = REGION_SPOT_SLUG[regions[0].id];
      if (spotSlug) spotsParams.set("region", spotSlug);
    }
    if (pax > 1) spotsParams.set("pax", pax);
    if (cur && cur !== "USD") spotsParams.set("cur", cur);
    var spotsQs = spotsParams.toString();
    adjustSpots.href = "spots.html" + (spotsQs ? "?" + spotsQs : "");
    actCard.appendChild(adjustSpots);
    var copyBtn2 = el("button", "cta-sm", "🔗 Copy plan link");
    copyBtn2.type = "button";
    copyBtn2.addEventListener("click", function () {
      var url = window.location.href;
      var done = function () { copyBtn2.textContent = "✓ Copied!"; setTimeout(function () { copyBtn2.textContent = "🔗 Copy plan link"; }, 1800); };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(done, function () { try { document.execCommand("copy"); done(); } catch (e) {} });
      } else { try { document.execCommand("copy"); done(); } catch (e) {} }
    });
    actCard.appendChild(copyBtn2);
    itinCard.appendChild(actCard);
    mainGrid.appendChild(itinCard);

    var rail = el("div", "result-rail");

    /* Visa (full) */
    var visa = resolveVisa(params.from);
    var visaCard = el("section", "card visa-card");
    visaCard.appendChild(el("h3", "card-title", "Visa"));
    if (visa) {
      visaCard.appendChild(el("span", "visa-badge visa-" + visa.summary, visaLabel(visa.summary)));
      visaCard.appendChild(el("p", "muted", visa.note));
    } else {
      visaCard.appendChild(el("p", "muted", "Tell us your country to see the visa route."));
    }
    visaCard.appendChild(el("p", "verify-note", "⚠ Visa rules change often. Always confirm with an official Bangladesh mission or e-visa portal before booking flights."));
    var visaMore = el("a", "text-link", "See the full visa summary →");
    visaMore.href = "visa.html";
    visaCard.appendChild(visaMore);
    rail.appendChild(visaCard);

    /* Experiences */
    var expCard = el("section", "card");
    expCard.appendChild(el("h3", "card-title", "Experiences to book"));
    regions.forEach(function (r) {
      expCard.appendChild(el("p", "exp-region", r.name));
      r.experiences.forEach(function (x) {
        var item = el("div", "exp-item");
        item.appendChild(el("p", "exp-title", x.title));
        item.appendChild(el("p", "exp-note", x.note));
        var cta = ctaButton(x.affiliate);
        if (cta) {
          item.appendChild(cta);
          var note = affNote(x.affiliate);
          if (note) item.appendChild(el("p", "aff-note", note));
        }
        expCard.appendChild(item);
      });
    });
    rail.appendChild(expCard);

    mainGrid.appendChild(rail);
    root.appendChild(mainGrid);

    /* Smart travel tips */
    var tipsSection = buildTravelTips(params, regions, cost);
    if (tipsSection) root.appendChild(tipsSection);

    root.appendChild(buildShareBar());
    injectItineraryJsonLd(params, regions);
  }

  function buildTravelTips(params, regions, cost) {
    var tips = [];
    var regionIds = regions.map(function (r) { return r.id; });
    var style   = params.style;
    var pax     = params.pax || 1;
    var month   = params.month || "";
    var days    = params.days || 7;

    /* Seasonal tips */
    var hotMonths   = ["Apr","May","Jun","Jul","Aug","Sep"];
    var cycloneRisk = ["May","Jun","Oct","Nov"];
    var bestMonths  = ["Nov","Dec","Jan","Feb"];
    if (hotMonths.indexOf(month) !== -1) {
      tips.push({ icon: "☀", text: "You've picked a hot, humid month. Pack loose, light clothing and plan outdoor sightseeing before 10 am. Midday is best spent in AC cafes or museums." });
    }
    if (cycloneRisk.indexOf(month) !== -1) {
      tips.push({ icon: "🌀", text: month + " sits in Bangladesh's cyclone window. Coastal areas (Cox's Bazar, Kuakata, Sundarbans) carry some weather risk — check the forecast before heading south." });
    }
    if (bestMonths.indexOf(month) !== -1) {
      tips.push({ icon: "🌿", text: "You've picked peak season — clear skies, low humidity, and lush green countryside after the monsoon. Book accommodation ahead, especially for the Sundarbans." });
    }

    /* Region-specific tips */
    if (regionIds.indexOf("sundarbans") !== -1) {
      tips.push({ icon: "🐅", text: "For the Sundarbans, book a licensed eco-tour from Mongla or Khulna — they include the required forest permit. Budget 2 full nights minimum for a real tiger-territory feel." });
    }
    if (regionIds.indexOf("hilltracts") !== -1) {
      tips.push({ icon: "🪪", text: "The Chittagong Hill Tracts require a special permit for foreign nationals. Apply in advance through your hotel or a local tour operator in Khagrachhari or Rangamati." });
    }
    if (regionIds.indexOf("mymensingh") !== -1) {
      tips.push({ icon: "🚤", text: "For Tanguar Haor, rent a full overnight houseboat from Sunamganj town (book at least 2 days ahead in peak season). Dawn on the water is the highlight — don't rush the morning." });
    }
    if (regionIds.indexOf("coxsbazar") !== -1) {
      tips.push({ icon: "🏝", text: "St Martin Island requires a boat from Teknaf — the last boat usually leaves early afternoon. Stay overnight for the sunrise crowd to thin out and the reef to come alive." });
    }

    /* Style tips */
    if (style === "backpacker") {
      tips.push({ icon: "🏨", text: "Budget guest houses are plentiful in Dhaka, Cox's Bazar and Sylhet. Outside tourist hubs, expect basic rooms — carry a padlock for lockers and a small torch for power-cut evenings." });
    }
    if (style === "premium") {
      tips.push({ icon: "🍽", text: "Premium dining in Bangladesh is excellent value compared to South-East Asia. The best restaurants are in Dhaka's Gulshan/Banani — book in advance for rooftop tables on weekends." });
    }

    /* Pax tips */
    if (pax >= 3) {
      tips.push({ icon: "🚌", text: "For groups of " + pax + ", hiring a private microbus (CNG or Hiace) for inter-city legs is often cheaper per head than individual seats — and much more flexible for stops." });
    }

    /* Duration tips */
    if (days <= 5) {
      tips.push({ icon: "⏱", text: "With " + days + " days, stick to one or two adjacent regions. Dhaka + Sundarbans, or Dhaka + Sylhet, are the two classic tight-schedule loops." });
    }
    if (days >= 10) {
      tips.push({ icon: "🗺", text: "With " + days + " days you have space to slow down. Consider spending 2+ nights in each region rather than rushing — local transport and morning markets reward a slower pace." });
    }

    /* Universal tips (always useful, cap final count at 8) */
    tips.push({ icon: "💵", text: "USD cash is easy to change at banks and exchange booths in Dhaka and main tourist towns. Bkash (mobile money) is widely accepted by local vendors — consider a local SIM with Bkash top-up for small payments." });
    tips.push({ icon: "📶", text: "Grameenphone or Robi SIMs give the best data coverage outside Dhaka. An international eSIM (Airalo) works as backup but local SIMs are 5–10× cheaper for data in Bangladesh." });

    if (!tips.length) return null;
    tips = tips.slice(0, 8);

    var section = el("section", "tips-card card");
    var header = el("button", "tips-toggle", null);
    header.type = "button";
    header.setAttribute("aria-expanded", "false");
    var titleSpan = el("span", null, "💡 Smart travel tips for your trip");
    var chevron = el("span", "tips-chevron", "▾");
    header.appendChild(titleSpan);
    header.appendChild(chevron);
    section.appendChild(header);

    var body = el("div", "tips-body");
    body.hidden = true;
    var list2 = el("ul", "tips-list");
    tips.forEach(function (t) {
      var li = el("li", "tips-item");
      li.innerHTML = '<span class="tips-icon" aria-hidden="true">' + t.icon + '</span><span class="tips-text">' + t.text + '</span>';
      list2.appendChild(li);
    });
    body.appendChild(list2);
    section.appendChild(body);

    header.addEventListener("click", function () {
      var open = body.hidden;
      body.hidden = !open;
      header.setAttribute("aria-expanded", open ? "true" : "false");
      chevron.textContent = open ? "▴" : "▾";
    });
    return section;
  }

  function buildShareBar() {
    var bar = el("div", "share-bar");
    bar.appendChild(el("p", "share-lead", "Share this plan"));
    bar.appendChild(el("p", "muted", "The link holds your whole plan — pax, currency and all. Send it and it rebuilds exactly."));
    var row = el("div", "share-row");
    var input = el("input", "share-input");
    input.type = "text";
    input.readOnly = true;
    input.value = window.location.href;
    var copyBtn = el("button", "cta", "Copy plan link");
    copyBtn.type = "button";
    copyBtn.addEventListener("click", function () {
      input.select();
      var done = function () { copyBtn.textContent = "Copied ✓"; setTimeout(function () { copyBtn.textContent = "Copy plan link"; }, 1800); };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(input.value).then(done, function () { try { document.execCommand("copy"); done(); } catch (e) {} });
      } else { try { document.execCommand("copy"); done(); } catch (e) {} }
    });
    row.appendChild(input);
    row.appendChild(copyBtn);
    bar.appendChild(row);
    var edit = el("a", "text-link", "← Change these choices");
    edit.href = "plan.html?" + new URLSearchParams(window.location.search).toString() + "#planner-form";
    edit.addEventListener("click", function () { showForm(); });
    bar.appendChild(edit);
    return bar;
  }

  function injectItineraryJsonLd(params, regions) {
    var old = document.getElementById("plan-jsonld");
    if (old) old.remove();
    var items = regions.map(function (r, i) {
      return { "@type": "ListItem", position: i + 1, name: r.name, description: r.tagline };
    });
    var data = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "A " + params.days + "-day Bangladesh trip",
      itemListElement: items
    };
    var s = document.createElement("script");
    s.type = "application/ld+json";
    s.id = "plan-jsonld";
    s.textContent = JSON.stringify(data);
    document.head.appendChild(s);
  }

  /* ---------- the input form ---------- */
  function fillForm(params) {
    var form = $("#planner-form");
    if (!form) return;
    $all("input[name='regions']", form).forEach(function (cb) {
      cb.checked = params.regions.indexOf(cb.value) !== -1;
    });
    var days = $("#f-days", form);
    if (days && params.days) days.value = params.days;
    var daysOut = $("#f-days-out");
    if (daysOut) daysOut.textContent = (days ? days.value : "7") + " days";
    $all("input[name='style']", form).forEach(function (r) {
      r.checked = r.value === params.style;
    });
    var from = $("#f-from", form);
    if (from && params.from) from.value = params.from;
    var month = $("#f-month", form);
    if (month && params.month) month.value = params.month;
    /* Pax stepper */
    var paxIn = $("#f-pax", form);
    var paxCount = $("#pax-count");
    if (paxIn) paxIn.value = params.pax || 1;
    if (paxCount) paxCount.textContent = paxLabel(params.pax || 1);
  }

  function paxLabel(n) { return n === 1 ? "1 traveller" : n + " travellers"; }

  function readForm() {
    var form = $("#planner-form");
    var regions = $all("input[name='regions']:checked", form).map(function (c) { return c.value; });
    var style = ($("input[name='style']:checked", form) || {}).value || "comfort";
    var days = parseInt($("#f-days", form).value, 10) || 7;
    var from = ($("#f-from", form).value || "").trim();
    var month = ($("#f-month", form).value || "").trim();
    var pax = parseInt(($("#f-pax", form) || {}).value, 10) || 1;
    pax = clamp(pax, 1, 12);
    return { regions: regions, style: style, days: days, from: from, month: month, pax: pax };
  }

  function buildQuery(state) {
    var p = new URLSearchParams();
    if (state.regions.length) p.set("regions", state.regions.join(","));
    p.set("days", state.days);
    p.set("style", state.style);
    if (state.pax && state.pax > 1) p.set("pax", state.pax);
    if (state.from) p.set("from", state.from);
    if (state.month) p.set("month", state.month);
    /* Currency: if user manually picked one, keep it;
       otherwise auto-derive from country */
    var cur;
    if (_userPickedCur) {
      cur = getParams().cur;
    } else if (state.from) {
      cur = resolveCountryCurrency(state.from) || "USD";
    } else {
      cur = getParams().cur || "USD";
    }
    if (cur && cur !== "USD") p.set("cur", cur);
    return p.toString();
  }

  function showForm() {
    var form = $("#planner-form");
    var result = $("#plan-result");
    if (form) form.closest(".planner-form-wrap").hidden = false;
    if (result) result.hidden = true;
  }
  function showResult() {
    var form = $("#planner-form");
    var result = $("#plan-result");
    if (form) form.closest(".planner-form-wrap").hidden = true;
    if (result) result.hidden = false;
  }
  /* Scroll so the "Your Bangladesh plan" heading sits at the top of the
     viewport — used after both a form submit and a pre-built template load. */
  function scrollToResult() {
    var target = $("#plan-result .result-head") || $("#plan-result");
    if (!target) return;
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function initPlanner() {
    var form = $("#planner-form");
    var params = getParams();

    /* Populate the country datalist */
    if (typeof COUNTRIES !== "undefined") {
      var dl = document.getElementById("country-list");
      if (dl) {
        dl.innerHTML = "";
        COUNTRIES.forEach(function (c) {
          var opt = document.createElement("option");
          opt.value = c.name;
          dl.appendChild(opt);
        });
      }
    }

    if (form) {
      fillForm(params);

      /* Live day readout */
      var daysInput = $("#f-days", form);
      var daysOut = $("#f-days-out");
      if (daysInput && daysOut) {
        daysInput.addEventListener("input", function () { daysOut.textContent = daysInput.value + " days"; });
      }

      /* Pax stepper */
      var paxIn = $("#f-pax", form);
      var paxCount = $("#pax-count");
      var paxDec = $("#pax-dec");
      var paxInc = $("#pax-inc");
      var currentPax = params.pax || 1;
      function updatePax(n) {
        currentPax = clamp(n, 1, 12);
        if (paxIn) paxIn.value = currentPax;
        if (paxCount) paxCount.textContent = paxLabel(currentPax);
        if (paxDec) paxDec.disabled = currentPax <= 1;
        if (paxInc) paxInc.disabled = currentPax >= 12;
      }
      if (paxDec) paxDec.addEventListener("click", function () { updatePax(currentPax - 1); });
      if (paxInc) paxInc.addEventListener("click", function () { updatePax(currentPax + 1); });
      updatePax(currentPax);

      /* Auto-switch currency when country changes */
      var fromInput = $("#f-from", form);
      if (fromInput) {
        fromInput.addEventListener("change", function () {
          if (_userPickedCur) return; // user already picked manually — respect that
          var country = fromInput.value.trim();
          var cur = resolveCountryCurrency(country);
          if (cur) {
            var p2 = new URLSearchParams(window.location.search);
            p2.set("cur", cur);
            history.replaceState(null, "", "plan.html?" + p2.toString());
          }
        });
      }

      /* Form submission */
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var state = readForm();
        if (!state.regions.length) {
          var warn = $("#form-warn");
          if (warn) { warn.hidden = false; warn.focus && warn.focus(); }
          return;
        }
        var qs = buildQuery(state);
        history.pushState(null, "", "plan.html?" + qs);
        var np = getParams();
        showResult();
        renderResult(np);
        scrollToResult();
      });
    }

    if (params.regions.length && params.days) {
      showResult();
      renderResult(params);
      // Arrived with a ready plan (e.g. a "Load this plan →" template card,
      // or a shared link) — scroll straight to the result too.
      scrollToResult();
    } else {
      showForm();
    }

    window.addEventListener("popstate", function () {
      var p = getParams();
      if (p.regions.length && p.days) { showResult(); renderResult(p); scrollToResult(); }
      else { showForm(); fillForm(p); }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initPlanner);
  } else {
    initPlanner();
  }
})();
