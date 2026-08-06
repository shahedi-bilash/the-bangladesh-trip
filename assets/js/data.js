/* =====================================================================
   The Bangladesh Trip — hardcoded data
   ---------------------------------------------------------------------
   Everything the planner needs lives here. No backend, no API.
   All money is in USD and expressed as [low, high] RANGES — never a
   single fake-precise number. planner.js converts to the visitor's
   currency for display only.

   TODO(owner): You are the travel pro. Sanity-check every range below
   against what real trips cost this season, and verify the visa groups
   before you tell anyone they can get a visa on arrival.
   ===================================================================== */

/* ---- Display currencies. Rates are approximate, for display only. ---- */
const FX = {
  USD: { rate: 1,     symbol: "$",   label: "USD" },
  EUR: { rate: 0.92,  symbol: "€",   label: "EUR" },
  GBP: { rate: 0.79,  symbol: "£",   label: "GBP" },
  AUD: { rate: 1.52,  symbol: "A$",  label: "AUD" },
  CAD: { rate: 1.37,  symbol: "C$",  label: "CAD" },
  INR: { rate: 83,    symbol: "₹",   label: "INR" },
  JPY: { rate: 150,   symbol: "¥",   label: "JPY" }
};

/* ---- Shared per-trip / per-unit costs (not region-specific) ---- */
const COST = {
  // One-off intercity travel budget for the WHOLE trip (buses, trains,
  // the odd domestic flight). Scales a little with number of regions.
  intercityUSD:   { backpacker: [15, 45],  comfort: [45, 120], premium: [120, 320] },
  // Per hotel night.
  hotelNightUSD:  { backpacker: [8, 20],   comfort: [30, 70],  premium: [90, 220] },
  // Per day of eating.
  foodDayUSD:     { backpacker: [4, 9],    comfort: [10, 22],  premium: [25, 55] },
  // Tourist eSIM data pack for the trip.
  esimUSD:        [6, 18],
  // Travel insurance, per week of travel.
  insuranceWeekUSD: [8, 25]
};

/* ---- The five region clusters ---- */
const REGIONS = [
  {
    id: "dhaka",
    name: "Dhaka Gateway",
    slug: "dhaka-gateway",
    tagline: "The loud, layered capital most trips start and end in.",
    bestMonths: ["Nov", "Dec", "Jan", "Feb"],
    gettingThere: "You'll almost certainly land here — Hazrat Shahjalal International (DAC) is the country's main gateway. Everywhere else connects out of Dhaka by bus, train, launch or a short domestic flight.",
    minDays: 2,
    perDayUSD: { backpacker: [14, 28], comfort: [40, 85], premium: [110, 240] },
    experiences: [
      { title: "Old Dhaka on foot", note: "Shankhari Bazar lanes, Ahsan Manzil (the Pink Palace), and a cycle-rickshaw through the crush.", affiliate: "getyourguide" },
      { title: "Sunset boat on the Buriganga", note: "A rented rowboat through the busiest river port you'll ever see. Go with the light low.", affiliate: "viator" },
      { title: "Day trip to Sonargaon", note: "The old capital and Panam City's abandoned merchant street, about an hour out of town.", affiliate: "getyourguide" }
    ],
    dayTemplates: [
      { title: "Land, settle, first walk", detail: "Arrive, drop bags, and ease in with an evening wander and street food near your neighbourhood." },
      { title: "Old Dhaka deep dive", detail: "Ahsan Manzil, the spice and shankha lanes, Star Mosque, and a rickshaw through the old city." },
      { title: "Rivers & Sonargaon", detail: "Morning boat on the Buriganga, then a half-day out to Sonargaon and Panam City." },
      { title: "Museums & modern Dhaka", detail: "Liberation War Museum, Dhaka University area, and a slower afternoon in the newer city." }
    ],
    image: "assets/img/dhaka-gateway.webp",
    imageCredit: "TODO(owner): add photographer + license"
  },
  {
    id: "sundarbans",
    name: "Sundarbans",
    slug: "sundarbans",
    tagline: "The world's largest mangrove forest, reached only by boat.",
    bestMonths: ["Nov", "Dec", "Jan", "Feb"],
    gettingThere: "Reached on a multi-day boat tour, almost always out of Khulna or Mongla. Get to Khulna from Dhaka by overnight bus or train (~7–9 hrs); tours run from there into the forest.",
    minDays: 3,
    perDayUSD: { backpacker: [45, 80], comfort: [80, 150], premium: [160, 300] },
    experiences: [
      { title: "3-day live-aboard cruise", note: "Sleep on the boat, wake in the mangroves. Permits, guide and forest fees are bundled by the operator.", affiliate: "viator" },
      { title: "Guided creek safari", note: "Small-boat runs up the narrow channels at dawn — the best window for wildlife.", affiliate: "getyourguide" },
      { title: "Watchtower & village stop", note: "Karamjal or Kotka watchtowers, plus a visit to a forest-edge community.", affiliate: "getyourguide" }
    ],
    dayTemplates: [
      { title: "Khulna & board the boat", detail: "Travel to Khulna/Mongla, meet the operator, board, and cruise into the forest as the light drops." },
      { title: "Deep in the mangroves", detail: "Dawn creek safari by small boat, watchtower walk, and slow cruising between channels." },
      { title: "Forest edge & return", detail: "A final morning run, a village or beach stop, then cruise back toward Khulna." }
    ],
    image: "assets/img/sundarbans.webp",
    imageCredit: "TODO(owner): add photographer + license"
  },
  {
    id: "coxsbazar",
    name: "Cox's Bazar & Saint Martin",
    slug: "coxs-bazar-saint-martin",
    tagline: "A very long beach, and the country's only coral island.",
    bestMonths: ["Nov", "Dec", "Jan", "Feb", "Mar"],
    gettingThere: "Cox's Bazar has its own airport (CXB) — a ~1 hr flight from Dhaka, or ~10 hr overnight bus. Saint Martin's Island is a boat from Teknaf; note that access is seasonal and sometimes restricted.",
    minDays: 3,
    perDayUSD: { backpacker: [16, 32], comfort: [45, 95], premium: [120, 260] },
    experiences: [
      { title: "Saint Martin's day or overnight", note: "Boat out to the coral island for snorkelling and a night under very dark skies. Check current access rules first.", affiliate: "getyourguide" },
      { title: "Himchari & Inani Beach drive", note: "The coast road south past waterfalls and the quieter, rockier southern beaches.", affiliate: "viator" },
      { title: "Fishing harbour at dawn", note: "The catch coming in at Cox's Bazar's working harbour — early, raw, and free.", affiliate: "" }
    ],
    dayTemplates: [
      { title: "Down to the coast", detail: "Fly or bus in, check into a sea-view room, and walk the long beach at sunset." },
      { title: "The southern coast road", detail: "Himchari waterfalls, Inani's rock beaches, and time to actually swim." },
      { title: "Saint Martin's Island", detail: "Boat to the coral island, snorkel the shallows, and either return or stay the night." },
      { title: "Slow beach morning", detail: "Fishing harbour at dawn, a long breakfast, and one last swim before moving on." }
    ],
    image: "assets/img/coxs-bazar.webp",
    imageCredit: "TODO(owner): add photographer + license"
  },
  {
    id: "sylhet",
    name: "Sylhet & Srimangal",
    slug: "sylhet-srimangal",
    tagline: "Tea-carpet hills, wetlands, and the greenest corner of the country.",
    bestMonths: ["Oct", "Nov", "Dec", "Feb", "Mar"],
    gettingThere: "Sylhet has an airport (ZYL) and a scenic overnight train from Dhaka (~6–7 hrs). Srimangal — the tea capital — is a few hours short of Sylhet city and is the base most travellers actually want.",
    minDays: 2,
    perDayUSD: { backpacker: [13, 26], comfort: [38, 80], premium: [100, 210] },
    experiences: [
      { title: "Tea-estate walk & seven-layer tea", note: "Wander the estates around Srimangal, then the famous layered tea in a roadside cabin.", affiliate: "getyourguide" },
      { title: "Lawachara rainforest trek", note: "A guided walk for gibbons and birds in the national park.", affiliate: "viator" },
      { title: "Ratargul swamp forest by boat", note: "A rowboat through Bangladesh's freshwater swamp forest — best when water is high.", affiliate: "getyourguide" }
    ],
    dayTemplates: [
      { title: "Into the tea hills", detail: "Train or fly in, base yourself in Srimangal, and walk the nearest estates at golden hour." },
      { title: "Rainforest & wetlands", detail: "Morning in Lawachara for gibbons, afternoon rowboat through Ratargul swamp forest." },
      { title: "Estates, lakes & shrines", detail: "Madhabpur Lake, a working tea factory tour, and the seven-layer tea ritual." }
    ],
    image: "assets/img/sylhet.webp",
    imageCredit: "TODO(owner): add photographer + license"
  },
  {
    id: "hilltracts",
    name: "Chittagong Hill Tracts",
    slug: "hill-tracts",
    tagline: "Bangladesh's mountain country — lakes, ridgelines and Indigenous cultures.",
    bestMonths: ["Nov", "Dec", "Jan", "Feb"],
    gettingThere: "Reached via Chittagong, then road up to Rangamati, Bandarban or Khagrachari. Some areas require permits and a guide, and access can change — check the current situation before you commit.",
    minDays: 3,
    perDayUSD: { backpacker: [15, 30], comfort: [42, 90], premium: [110, 230] },
    experiences: [
      { title: "Boat on Kaptai Lake", note: "A long, quiet day on the reservoir around Rangamati, hopping islands and hanging bridges.", affiliate: "getyourguide" },
      { title: "Nilgiri & Chimbuk ridgeline", note: "The high road above Bandarban — cloud-level viewpoints and hill villages.", affiliate: "viator" },
      { title: "Golden Temple & local markets", note: "The Buddhist temple above Bandarban and the weekly markets where hill communities trade.", affiliate: "" }
    ],
    dayTemplates: [
      { title: "Up into the hills", detail: "Travel via Chittagong to Bandarban or Rangamati, sort any permits, and settle in." },
      { title: "Lake or ridgeline day", detail: "A full day on Kaptai Lake, or the climb to Nilgiri and Chimbuk viewpoints." },
      { title: "Villages & temples", detail: "Golden Temple, a hill-community market, and a slower afternoon between valleys." },
      { title: "Back down to the plains", detail: "A last viewpoint at dawn, then the road back down toward Chittagong." }
    ],
    image: "assets/img/hill-tracts.webp",
    imageCredit: "TODO(owner): add photographer + license"
  }
];

/* ---- Visa groups. Summary is one of: visa_on_arrival | e_visa | embassy ----
   TODO(owner): VERIFY these groupings against current government policy
   before publishing. Rules change; keep the "verify officially" caveat
   visible on every visa result. This is guidance, not legal advice. */
const VISA = [
  {
    group: "Visa on arrival (subject to conditions)",
    summary: "visa_on_arrival",
    countries: ["United States", "United Kingdom", "Canada", "Australia", "Germany", "France", "Italy", "Spain", "Netherlands", "Japan", "South Korea", "Singapore", "United Arab Emirates", "Saudi Arabia"],
    note: "Several nationalities may be granted a visa on arrival at Dhaka airport for tourism, typically with proof of onward travel, a hotel booking and sufficient funds. Conditions and eligibility change — always confirm with an official Bangladesh mission before you fly."
  },
  {
    group: "Apply in advance (e-visa / embassy)",
    summary: "embassy",
    countries: ["India", "China", "Brazil", "Mexico", "South Africa", "Nigeria", "Egypt", "Turkey", "Indonesia", "Philippines", "Thailand", "Vietnam", "Pakistan", "Russia"],
    note: "Travellers from many countries should arrange a visa before arrival, through an official e-visa portal (where available) or a Bangladesh embassy/consulate. Processing times vary — start early."
  }
];

/* ---- Affiliate program IDs. Fill these in when your accounts are live. ---- */
const AFF = {
  booking:      "TODO",  // Booking.com
  agoda:        "TODO",  // Agoda
  getyourguide: "TODO",  // GetYourGuide
  viator:       "TODO",  // Viator
  airalo:       "TODO",  // Airalo (eSIM)
  insurance:    "TODO"   // Insurance provider
};

/* ---- Where each affiliate slug points (used to build outbound links) ---- */
const AFF_BASE = {
  booking:      "https://www.booking.com/",
  agoda:        "https://www.agoda.com/",
  getyourguide: "https://www.getyourguide.com/",
  viator:       "https://www.viator.com/",
  airalo:       "https://www.airalo.com/",
  insurance:    "https://example.com/"  // TODO(owner): real provider URL
};
