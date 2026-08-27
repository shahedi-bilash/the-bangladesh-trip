/* =====================================================================
   The Bangladesh Trip — live currency rates
   ---------------------------------------------------------------------
   Shared by plan.html and spots.html. Fetches USD-base rates from
   open.er-api.com (free, keyless, no signup, updates ~daily) and merges
   them into the FX table already defined in data.js — only the numeric
   `rate` is replaced; the hand-picked `symbol`/`label`/`hidden` metadata
   for the curated currencies is left untouched, so formatting (₹, $, ৳…)
   is unaffected. A currency the API returns that isn't already in FX
   gets a plain-code fallback entry (e.g. "ARS 1,234") so it still
   displays something sane rather than breaking.

   Caching: the fetched table is stored in localStorage with a
   timestamp. A cache under 24h old is reused with no network call.
   A cache 24h+ old is applied immediately (so the page never shows
   nothing) while a background refresh is attempted; if that refresh
   fails, the stale cache stays in effect. If there is no cache at all
   and the fetch fails (e.g. first-ever visit, offline), FX simply keeps
   the static approximate rates already hardcoded in data.js — the site
   never shows a blank or broken cost figure either way.

   Exposes window.CURRENCY_READY — a Promise (never rejects) that pages
   await before their first cost render, so the very first paint uses
   the freshest rates available rather than racing the fetch.
   ===================================================================== */
(function () {
  "use strict";

  var ENDPOINT = "https://open.er-api.com/v6/latest/USD";
  var CACHE_KEY = "btrip_fx_cache_v1";
  var MAX_AGE_MS = 24 * 60 * 60 * 1000; // 24h — matches the API's own daily update cycle

  function readCache() {
    try {
      var raw = localStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      var obj = JSON.parse(raw);
      if (!obj || !obj.rates || !obj.fetchedAt) return null;
      return obj;
    } catch (e) {
      return null; // localStorage disabled/unavailable — just skip caching
    }
  }

  function writeCache(rates) {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({ rates: rates, fetchedAt: Date.now() }));
    } catch (e) {
      /* storage full or disabled — non-fatal, live rates still applied this load */
    }
  }

  function applyRates(rates) {
    if (typeof FX === "undefined" || !rates) return;
    Object.keys(rates).forEach(function (code) {
      var r = rates[code];
      if (typeof r !== "number" || !isFinite(r) || r <= 0) return;
      if (FX[code]) {
        FX[code].rate = r; // preserve existing symbol/label/hidden
      } else {
        // A currency our curated FX table doesn't have a symbol for yet
        // (e.g. from a country mapping). Fall back to the plain code
        // rather than an unknown symbol.
        FX[code] = { rate: r, symbol: code + " ", label: code, hidden: true };
      }
    });
  }

  function fetchLive() {
    return fetch(ENDPOINT, { cache: "no-store" })
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .then(function (data) {
        if (!data || data.result !== "success" || !data.rates) throw new Error("unexpected payload");
        applyRates(data.rates);
        writeCache(data.rates);
        return "live";
      });
  }

  function init() {
    var cached = readCache();
    var isFresh = cached && (Date.now() - cached.fetchedAt) < MAX_AGE_MS;

    // Apply whatever we have immediately (even if stale) so a slow/failed
    // network never leaves the page any worse off than before this module
    // existed — FX already has the static hardcoded rates as its baseline.
    if (cached) applyRates(cached.rates);

    if (isFresh) return Promise.resolve("cached-fresh");

    return fetchLive().then(
      function (status) { return status; },
      function () {
        // Network/parse failure. We've already applied the stale cache
        // above if one existed; if there was none, FX keeps its static
        // data.js values. Either way the page has valid numbers to show.
        return cached ? "cached-stale-fetch-failed" : "static-fallback";
      }
    );
  }

  window.CURRENCY_READY = (typeof FX !== "undefined") ? init() : Promise.resolve("no-fx-table");
})();
