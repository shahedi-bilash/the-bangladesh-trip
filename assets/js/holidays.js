/* =====================================================================
   The Bangladesh Trip — public holiday lookup
   ---------------------------------------------------------------------
   Nager.Date (free, keyless, unlimited): date.nager.at/api/v3/publicholidays
   A published year's holiday list never changes, so once fetched it's
   cached in localStorage indefinitely (no TTL, unlike currency/weather).
   If the fetch fails, holidays are simply not shown for that year — the
   plan itself still renders fine either way.

   Exposes window.getHolidaysInRange(startDate, endDate) — both
   "YYYY-MM-DD" strings, inclusive — returning a Promise of
   [{date, name}, ...] for Bangladesh public holidays in that range
   (empty array if none, or if the lookup failed).
   ===================================================================== */
(function () {
  "use strict";

  var CACHE_PREFIX = "btrip_holidays_";

  function readCache(year) {
    try {
      var raw = localStorage.getItem(CACHE_PREFIX + year);
      if (!raw) return null;
      var obj = JSON.parse(raw);
      return (obj && Array.isArray(obj.data)) ? obj.data : null;
    } catch (e) {
      return null;
    }
  }

  function writeCache(year, data) {
    try {
      localStorage.setItem(CACHE_PREFIX + year, JSON.stringify({ data: data, fetchedAt: Date.now() }));
    } catch (e) { /* storage full/disabled — non-fatal */ }
  }

  function fetchYear(year) {
    var cached = readCache(year);
    if (cached) return Promise.resolve(cached);
    return fetch("https://date.nager.at/api/v3/publicholidays/" + year + "/BD")
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .then(function (data) {
        if (!Array.isArray(data)) throw new Error("unexpected payload");
        writeCache(year, data);
        return data;
      })
      .catch(function () {
        return null; // graceful — that year's holidays just won't be flagged
      });
  }

  window.getHolidaysInRange = function (startDate, endDate) {
    if (!startDate || !endDate) return Promise.resolve([]);
    var y1 = parseInt(startDate.slice(0, 4), 10);
    var y2 = parseInt(endDate.slice(0, 4), 10);
    if (!y1 || !y2) return Promise.resolve([]);
    var years = y1 === y2 ? [y1] : [y1, y2]; // a trip spanning New Year's needs both years' lists
    return Promise.all(years.map(fetchYear)).then(function (lists) {
      var all = [];
      lists.forEach(function (list) { if (list) all = all.concat(list); });
      return all
        .filter(function (h) { return h.date >= startDate && h.date <= endDate; })
        .map(function (h) { return { date: h.date, name: h.name }; })
        .sort(function (a, b) { return a.date < b.date ? -1 : 1; });
    });
  };
})();
