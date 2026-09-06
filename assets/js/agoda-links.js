/* =====================================================================
   The Bangladesh Trip — Agoda affiliate links
   ---------------------------------------------------------------------
   One entry per region. Every entry points at the same generic Agoda
   search link for now, since per-destination deep links need Agoda's
   own numeric city ID (from the Partner Center Link Builder), which we
   don't have yet per region. When a proper per-city link is available
   for a region, replace ONLY that region's value below — every page
   reads from this one object, so nothing else needs to change.

   cid=1972585 is our Agoda affiliate CID and MUST be present on every
   link — it's how commissions are tracked. Do not strip it when editing
   this file or adding new region entries.

   Keys match the region-id vocabulary used by data.js/planner.js
   (REGIONS[].id) — plan.html and site.js's region-page rail already use
   these directly; spots.html maps its own region keys to these via
   REGION_PLAN_SLUG (defined in spots.js) before looking up here.
   ===================================================================== */
var AGODA_CID = "1972585"; // Agoda affiliate CID — required on every Agoda link, do not remove
var AGODA_GENERIC_LINK = "https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=" + AGODA_CID;

var AGODA_LINKS = {
  dhaka:        AGODA_GENERIC_LINK,
  sundarbans:   AGODA_GENERIC_LINK,
  coxsbazar:    AGODA_GENERIC_LINK,
  sylhet:       AGODA_GENERIC_LINK,
  hilltracts:   AGODA_GENERIC_LINK,
  northbengal:  AGODA_GENERIC_LINK,
  kuakata:      AGODA_GENERIC_LINK,
  bagerhat:     AGODA_GENERIC_LINK,
  comilla:      AGODA_GENERIC_LINK,
  mymensingh:   AGODA_GENERIC_LINK
};

/* Returns the Agoda link for a region id, falling back to the generic
   CID-tagged link (never a bare, untracked agoda.com URL). */
function getAgodaLink(regionId) {
  return (AGODA_LINKS && AGODA_LINKS[regionId]) || AGODA_GENERIC_LINK;
}
