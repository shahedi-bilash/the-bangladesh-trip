/* =====================================================================
   The Bangladesh Trip — planner engine
   ---------------------------------------------------------------------
   State lives entirely in the URL, so every plan is shareable and
   regenerates with no backend:
     plan.html?regions=dhaka,sundarbans&days=7&style=comfort
               &from=United%20States&month=Dec&cur=USD
   This file: reads those params, drives the input form, computes an
   honest cost range, stitches a day-by-day skeleton, resolves the visa
   summary, and builds the share bar. Pure vanilla JS.
   ===================================================================== */
(function () {
  "use strict";

  var STYLES = ["backpacker", "comfort", "premium"];
  var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

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

  function getParams() {
    var p = new URLSearchParams(window.location.search);
    var regions = (p.get("regions") || "").split(",").map(function (s) { return s.trim(); }).filter(Boolean);
    var style = (p.get("style") || "comfort").toLowerCase();
    if (STYLES.indexOf(style) === -1) style = "comfort";
    var days = parseInt(p.get("days"), 10);
    if (isNaN(days)) days = 0;
    days = clamp(days, 0, 60);
    var cur = (p.get("cur") || "USD").toUpperCase();
    if (!FX[cur]) cur = "USD";
    return {
      regions: regions,
      days: days,
      style: style,
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
    if (v >= 1000) return Math.round(v / 50) * 50;
    if (v >= 100) return Math.round(v / 10) * 10;
    if (v >= 20) return Math.round(v / 5) * 5;
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

  /* ---------- visa resolver ---------- */
  function resolveVisa(country) {
    if (!country) return null;
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

  /* ---------- cost model ---------- */
  function computeCost(params) {
    var style = params.style;
    var days = params.days;
    var regions = params.regions.map(regionById).filter(Boolean);
    var nRegions = Math.max(regions.length, 1);
    var nights = Math.max(days - 1, 1); // last day you fly out

    // Region day-rates cover local transport + activities baseline per day.
    // We average the selected regions' per-day rate, then multiply by days.
    var perDay = [0, 0];
    regions.forEach(function (r) { perDay = addR(perDay, r.perDayUSD[style]); });
    perDay = scaleR(perDay, 1 / nRegions);
    var regionDays = scaleR(perDay, Math.max(days, 1));

    // Hotels, food, intercity, eSIM, insurance.
    var hotels = scaleR(COST.hotelNightUSD[style], nights);
    var food = scaleR(COST.foodDayUSD[style], Math.max(days, 1));
    // Intercity scales with how many regions you're hopping between.
    var intercity = scaleR(COST.intercityUSD[style], clamp(nRegions, 1, 5) * 0.6 + 0.4);
    var esim = COST.esimUSD.slice();
    var insurance = scaleR(COST.insuranceWeekUSD, Math.max(days / 7, 0.5));

    // Named experiences (one signature experience budgeted per region).
    var experiences = scaleR([12, 45], nRegions); // indicative, style-agnostic entry/permits
    if (style === "premium") experiences = scaleR(experiences, 1.8);
    if (style === "backpacker") experiences = scaleR(experiences, 0.6);

    var lines = [
      { key: "Local days (transport + activities)", range: regionDays },
      { key: "Hotels · " + nights + " night" + (nights === 1 ? "" : "s"), range: hotels },
      { key: "Experiences & permits", range: experiences },
      { key: "Food · " + Math.max(days, 1) + " day" + (days === 1 ? "" : "s"), range: food },
      { key: "Intercity travel", range: intercity },
      { key: "Tourist eSIM", range: esim },
      { key: "Travel insurance", range: insurance }
    ];
    var total = [0, 0];
    lines.forEach(function (l) { total = addR(total, l.range); });
    return { lines: lines, total: total, nights: nights };
  }

  /* ---------- day-by-day skeleton ---------- */
  function buildItinerary(params) {
    var regions = params.regions.map(regionById).filter(Boolean);
    var days = params.days;
    if (!regions.length || !days) return [];

    // Distribute days across regions, respecting each region's minDays
    // as a soft floor, proportionally otherwise.
    var weights = regions.map(function (r) { return r.minDays; });
    var wSum = weights.reduce(function (a, b) { return a + b; }, 0);
    var alloc = regions.map(function (r, i) {
      return Math.max(1, Math.round(days * (weights[i] / wSum)));
    });
    // Fix rounding drift to match the requested day count.
    var diff = days - alloc.reduce(function (a, b) { return a + b; }, 0);
    var idx = 0;
    while (diff !== 0 && regions.length) {
      alloc[idx % regions.length] += diff > 0 ? 1 : -1;
      if (alloc[idx % regions.length] < 1) alloc[idx % regions.length] = 1;
      diff = days - alloc.reduce(function (a, b) { return a + b; }, 0);
      idx++;
      if (idx > 500) break; // safety
    }

    var plan = [];
    var dayNo = 1;
    regions.forEach(function (r, ri) {
      var n = alloc[ri];
      for (var d = 0; d < n; d++) {
        var tmpl = r.dayTemplates[d % r.dayTemplates.length];
        var title = tmpl.title;
        // Vary repeated titles so days don't read identically.
        if (d >= r.dayTemplates.length) title += " · more time";
        plan.push({
          day: dayNo++,
          region: r.name,
          title: title,
          detail: tmpl.detail
        });
      }
    });
    return plan;
  }

  /* ---------- affiliate link builder ---------- */
  function affLink(slug) {
    if (!slug || !AFF_BASE[slug]) return null;
    var base = AFF_BASE[slug];
    var id = AFF[slug];
    // Real programs use their own param names; this is a safe generic tag
    // that the owner swaps for the correct tracking parameter later.
    if (id && id !== "TODO") {
      base += (base.indexOf("?") === -1 ? "?" : "&") + "aff=" + encodeURIComponent(id);
    }
    return base;
  }
  function affLabel(slug) {
    return { booking: "Find hotels on Booking", agoda: "Find hotels on Agoda",
      getyourguide: "Book on GetYourGuide", viator: "Book on Viator",
      airalo: "Get an eSIM (Airalo)", insurance: "Compare travel insurance" }[slug] || "Book";
  }
  function ctaButton(slug) {
    var href = affLink(slug);
    if (!href) return null;
    var a = el("a", "cta cta-aff", affLabel(slug));
    a.href = href;
    a.target = "_blank";
    a.rel = "sponsored noopener";
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
    var styleName = params.style.charAt(0).toUpperCase() + params.style.slice(1);

    /* Summary header */
    var head = el("div", "result-head");
    head.appendChild(el("p", "eyebrow", "Your Bangladesh plan"));
    var h = el("h2", null, regions.map(function (r) { return r.name; }).join(" · "));
    head.appendChild(h);
    var meta = el("p", "result-meta",
      params.days + " days · " + styleName + " style" +
      (params.from ? " · from " + params.from : "") +
      (params.month ? " · " + params.month : ""));
    head.appendChild(meta);
    root.appendChild(head);

    /* Cost card */
    var cost = computeCost(params);
    var costCard = el("section", "card cost-card");
    costCard.appendChild(el("h3", "card-title", "Estimated cost"));
    var table = el("div", "cost-lines");
    cost.lines.forEach(function (l) {
      var row = el("div", "cost-row");
      row.appendChild(el("span", "cost-key", l.key));
      row.appendChild(el("span", "cost-val", fmtRange(l.range, cur)));
      table.appendChild(row);
    });
    var totalRow = el("div", "cost-row cost-total");
    totalRow.appendChild(el("span", "cost-key", "Estimated total, per person"));
    totalRow.appendChild(el("span", "cost-val", fmtRange(cost.total, cur)));
    table.appendChild(totalRow);
    costCard.appendChild(table);
    costCard.appendChild(el("p", "small-print",
      "Indicative estimate only — real cost varies with season, operator, group size and how you travel. Currency shown is approximate. Excludes international flights to and from Bangladesh."));
    // Currency switcher
    var curWrap = el("div", "cur-switch");
    curWrap.appendChild(el("span", "cur-label", "Show in:"));
    Object.keys(FX).forEach(function (code) {
      var b = el("button", "cur-btn" + (code === cur ? " is-active" : ""), code);
      b.type = "button";
      b.addEventListener("click", function () {
        var p = new URLSearchParams(window.location.search);
        p.set("cur", code);
        history.replaceState(null, "", "plan.html?" + p.toString());
        renderResult(getParams());
      });
      curWrap.appendChild(b);
    });
    costCard.appendChild(curWrap);
    // (costCard built above; assembled into the top grid below.)

    /* Compact plan summary — pulls the trip shape up into the top-right rail */
    var summaryCard = el("section", "card plan-summary");
    summaryCard.appendChild(el("h3", "card-title", "Your plan"));
    var sumList = el("dl", "summary-list");
    function sumRow(k, v) { sumList.appendChild(el("dt", null, k)); sumList.appendChild(el("dd", null, v)); }
    sumRow("Regions", regions.map(function (r) { return r.name; }).join(", "));
    sumRow("Days", String(params.days));
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

    /* Trip essentials (booking basics), pulled up to the top rail */
    var essCard = el("section", "card essentials-card");
    essCard.appendChild(el("h3", "card-title", "Trip essentials"));
    essCard.appendChild(el("p", "muted", "Book the basics — rooms, data and cover."));
    ["booking", "agoda", "airalo", "insurance"].forEach(function (slug) {
      var b = ctaButton(slug);
      if (b) { b.classList.add("cta-block"); essCard.appendChild(b); }
    });
    essCard.appendChild(el("p", "small-print",
      "We may earn a commission from bookings made through these links, at no extra cost to you."));

    /* TOP row: cost (left) + compact rail (right) — 2-column from the top */
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
    itinCard.appendChild(el("p", "muted",
      "A skeleton to shape your own trip around — not a fixed schedule."));
    var list = el("ol", "itinerary");
    buildItinerary(params).forEach(function (d) {
      var li = el("li", "itin-day");
      var top = el("div", "itin-top");
      top.appendChild(el("span", "itin-num", "Day " + d.day));
      top.appendChild(el("span", "itin-region", d.region));
      li.appendChild(top);
      li.appendChild(el("h4", "itin-title", d.title));
      li.appendChild(el("p", "itin-detail", d.detail));
      list.appendChild(li);
    });
    itinCard.appendChild(list);
    mainGrid.appendChild(itinCard);

    var rail = el("div", "result-rail");

    // Visa (full)
    var visa = resolveVisa(params.from);
    var visaCard = el("section", "card visa-card");
    visaCard.appendChild(el("h3", "card-title", "Visa"));
    if (visa) {
      visaCard.appendChild(el("span", "visa-badge visa-" + visa.summary, visaLabel(visa.summary)));
      visaCard.appendChild(el("p", "muted", visa.note));
    } else {
      visaCard.appendChild(el("p", "muted", "Tell us your country to see the visa route."));
    }
    visaCard.appendChild(el("p", "verify-note",
      "⚠ Visa rules change often. Always confirm with an official Bangladesh mission or e-visa portal before booking flights."));
    var visaMore = el("a", "text-link", "See the full visa summary →");
    visaMore.href = "visa.html";
    visaCard.appendChild(visaMore);
    rail.appendChild(visaCard);

    // Experiences + booking CTAs
    var expCard = el("section", "card");
    expCard.appendChild(el("h3", "card-title", "Experiences to book"));
    regions.forEach(function (r) {
      expCard.appendChild(el("p", "exp-region", r.name));
      r.experiences.forEach(function (x) {
        var item = el("div", "exp-item");
        item.appendChild(el("p", "exp-title", x.title));
        item.appendChild(el("p", "exp-note", x.note));
        var cta = ctaButton(x.affiliate);
        if (cta) item.appendChild(cta);
        expCard.appendChild(item);
      });
    });
    rail.appendChild(expCard);

    mainGrid.appendChild(rail);
    root.appendChild(mainGrid);

    /* Share bar */
    root.appendChild(buildShareBar());

    /* JSON-LD: describe the plan honestly as an ItemList (no govt entity) */
    injectItineraryJsonLd(params, regions);
  }

  function buildShareBar() {
    var bar = el("div", "share-bar");
    bar.appendChild(el("p", "share-lead", "Share this plan"));
    bar.appendChild(el("p", "muted", "The link holds your whole plan — send it and it rebuilds exactly."));
    var row = el("div", "share-row");
    var input = el("input", "share-input");
    input.type = "text";
    input.readOnly = true;
    input.value = window.location.href;
    var copyBtn = el("button", "cta", "Copy plan link");
    copyBtn.type = "button";
    copyBtn.addEventListener("click", function () {
      input.select();
      var done = function () {
        copyBtn.textContent = "Copied ✓";
        setTimeout(function () { copyBtn.textContent = "Copy plan link"; }, 1800);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(input.value).then(done, function () {
          try { document.execCommand("copy"); done(); } catch (e) {}
        });
      } else {
        try { document.execCommand("copy"); done(); } catch (e) {}
      }
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
    // regions checkboxes
    $all("input[name='regions']", form).forEach(function (cb) {
      cb.checked = params.regions.indexOf(cb.value) !== -1;
    });
    // days
    var days = $("#f-days", form);
    if (days && params.days) days.value = params.days;
    var daysOut = $("#f-days-out");
    if (daysOut) daysOut.textContent = (days ? days.value : "7") + " days";
    // style
    $all("input[name='style']", form).forEach(function (r) {
      r.checked = r.value === params.style;
    });
    // from
    var from = $("#f-from", form);
    if (from && params.from) from.value = params.from;
    // month
    var month = $("#f-month", form);
    if (month && params.month) month.value = params.month;
  }

  function readForm() {
    var form = $("#planner-form");
    var regions = $all("input[name='regions']:checked", form).map(function (c) { return c.value; });
    var style = ($("input[name='style']:checked", form) || {}).value || "comfort";
    var days = parseInt($("#f-days", form).value, 10) || 7;
    var from = ($("#f-from", form).value || "").trim();
    var month = ($("#f-month", form).value || "").trim();
    return { regions: regions, style: style, days: days, from: from, month: month };
  }

  function buildQuery(state) {
    var p = new URLSearchParams();
    if (state.regions.length) p.set("regions", state.regions.join(","));
    p.set("days", state.days);
    p.set("style", state.style);
    if (state.from) p.set("from", state.from);
    if (state.month) p.set("month", state.month);
    var cur = getParams().cur;
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

  function initPlanner() {
    var form = $("#planner-form");
    var params = getParams();

    if (form) {
      fillForm(params);
      // live day readout
      var days = $("#f-days", form);
      var daysOut = $("#f-days-out");
      if (days && daysOut) {
        days.addEventListener("input", function () { daysOut.textContent = days.value + " days"; });
      }
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
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }

    // If we arrived with a full plan in the URL, show the result.
    if (params.regions.length && params.days) {
      showResult();
      renderResult(params);
    } else {
      showForm();
    }

    window.addEventListener("popstate", function () {
      var p = getParams();
      if (p.regions.length && p.days) { showResult(); renderResult(p); }
      else { showForm(); fillForm(p); }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initPlanner);
  } else {
    initPlanner();
  }
})();
