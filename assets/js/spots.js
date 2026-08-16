/* ==========================================================
   The Bangladesh Trip — spot-level planner data (spots.js)
   Globals exposed: SPOTS, SPOT_HOTEL_COSTS, INTER_REGION_COSTS,
                    REGION_LABELS, REGION_PLAN_SLUG
   ========================================================== */

/* Display labels for region keys */
var REGION_LABELS = {
  "dhaka-gateway": "Dhaka",
  "sundarbans":    "Sundarbans",
  "coxs-bazar":   "Cox's Bazar & St Martin's",
  "sylhet":        "Sylhet & Srimangal",
  "hill-tracts":   "Chittagong Hill Tracts"
};

/* Slugs used in plan.html?regions= */
var REGION_PLAN_SLUG = {
  "dhaka-gateway": "dhaka",
  "sundarbans":    "sundarbans",
  "coxs-bazar":   "coxsbazar",
  "sylhet":        "sylhet",
  "hill-tracts":   "hilltracts"
};

/* Hotel cost ranges: [min, max] USD per person per night */
var SPOT_HOTEL_COSTS = {
  "Dhaka":        { budget: [15, 25], comfort: [55,  90] },
  "Mongla":       { budget: [10, 18], comfort: [35,  60] },
  "Cox's Bazar":  { budget: [15, 28], comfort: [60, 100] },
  "St Martin's":  { budget: [20, 35], comfort: [50,  80] },
  "Sylhet":       { budget: [12, 20], comfort: [40,  70] },
  "Srimangal":    { budget: [10, 18], comfort: [30,  55] },
  "Rangamati":    { budget: [10, 18], comfort: [35,  60] },
  "Bandarban":    { budget: [8,  16], comfort: [30,  55] }
};

/* Inter-region transfers: cost[0]=budget, cost[1]=comfort USD/person one-way */
var INTER_REGION_COSTS = {
  "dhaka-gateway:sundarbans":  { label: "Dhaka → Khulna/Mongla (bus or night launch)", cost: [5,  15] },
  "dhaka-gateway:coxs-bazar": { label: "Dhaka → Cox's Bazar (bus or domestic flight)", cost: [10, 38] },
  "dhaka-gateway:sylhet":     { label: "Dhaka → Sylhet (overnight train or bus)",       cost: [4,  15] },
  "dhaka-gateway:hill-tracts":{ label: "Dhaka → Chittagong (bus or train)",             cost: [7,  20] },
  "sundarbans:coxs-bazar":    { label: "Khulna → Cox's Bazar (bus)",                    cost: [12, 25] },
  "sundarbans:sylhet":        { label: "Khulna → Sylhet (bus + train)",                 cost: [12, 26] },
  "sundarbans:hill-tracts":   { label: "Khulna → Chittagong (bus)",                     cost: [10, 22] },
  "coxs-bazar:sylhet":        { label: "Cox's Bazar → Sylhet",                          cost: [15, 32] },
  "coxs-bazar:hill-tracts":   { label: "Cox's Bazar → Chittagong (bus)",                cost: [5,  12] },
  "sylhet:hill-tracts":       { label: "Sylhet → Chittagong (bus)",                     cost: [10, 22] }
};

/* ---- SPOT DATA -------------------------------------------------------
   Each spot:
     id        — url-safe slug (unique across all regions)
     name      — display name
     photo     — /assets/img/... (preloaded, lazy beyond fold)
     duration  — 0.5 = half-day · 1 = full-day · 2 = two-day / overnight
     base      — hotel base town (key into SPOT_HOTEL_COSTS)
     transfer  — { cost:[budget,comfort], note } — USD/person from region hub
     aff       — { label, url } affiliate CTA, or null
     desc      — 1–2 line editorial description
     tags      — string[]
   -------------------------------------------------------------------- */

var SPOTS = {

  /* ── DHAKA GATEWAY ─────────────────────────────────────────────────── */
  "dhaka-gateway": [
    {
      id:       "lalbagh-fort",
      name:     "Lalbagh Fort",
      photo:    "/assets/img/dhaka-1.webp",
      duration: 0.5,
      base:     "Dhaka",
      transfer: { cost: [0, 0], note: "City rickshaw" },
      aff:      { label: "Book a guided tour (Klook)", url: "https://klook.tpm.li/KKQ1Iup8" },
      desc:     "17th-century Mughal citadel in Old Dhaka — three-domed mosque, an audience hall, and the ornate underground tomb of Pari Bibi. 90 minutes well spent.",
      tags:     ["history", "architecture"]
    },
    {
      id:       "ahsan-manzil",
      name:     "Ahsan Manzil — Pink Palace",
      photo:    "/assets/img/dhaka-2.webp",
      duration: 0.5,
      base:     "Dhaka",
      transfer: { cost: [0, 0], note: "City rickshaw" },
      aff:      null,
      desc:     "The coral-pink riverfront palace of the Dhaka Nawabs, now a museum of colonial-era Bengal with rooms still dressed in gilded originals.",
      tags:     ["history", "museum"]
    },
    {
      id:       "sadarghat",
      name:     "Sadarghat River Terminal",
      photo:    "/assets/img/dhaka-3.webp",
      duration: 0.5,
      base:     "Dhaka",
      transfer: { cost: [0, 0], note: "City rickshaw to riverfront" },
      aff:      null,
      desc:     "Asia's busiest river port — a constant theatre of rocket steamers, country boats and river life. Go at dusk to watch the giant launches depart.",
      tags:     ["culture", "photography"]
    },
    {
      id:       "star-mosque",
      name:     "Star Mosque (Tara Masjid)",
      photo:    "/assets/img/dhaka-1.webp",
      duration: 0.5,
      base:     "Dhaka",
      transfer: { cost: [0, 0], note: "City rickshaw" },
      aff:      null,
      desc:     "Every interior surface inlaid with Chinese porcelain star motifs and broken Japanese china — a quiet gem a 10-minute rickshaw ride from the Pink Palace.",
      tags:     ["architecture", "religion"]
    },
    {
      id:       "old-dhaka-food",
      name:     "Old Dhaka Street Food Walk",
      photo:    "/assets/img/dhaka-2.webp",
      duration: 0.5,
      base:     "Dhaka",
      transfer: { cost: [0, 0], note: "City rickshaw to Nazira Bazar" },
      aff:      { label: "Book guided food tour (Klook)", url: "https://klook.tpm.li/KKQ1Iup8" },
      desc:     "Kacchi biryani from 150-year-old pot-shops, bakarkhani bread, shingara and mishti doi — half a day eating through Nazira Bazar and Shakhari Bazar.",
      tags:     ["food", "culture"]
    },
    {
      id:       "buriganga-cruise",
      name:     "Buriganga River Cruise",
      photo:    "/assets/img/dhaka-3.webp",
      duration: 0.5,
      base:     "Dhaka",
      transfer: { cost: [0, 0], note: "Departs Sadarghat" },
      aff:      { label: "Book river cruise (Klook)", url: "https://klook.tpm.li/KKQ1Iup8" },
      desc:     "A wooden nouka drifting past dye-yards, river temples and launches. Old Dhaka's skyline — minarets and crumbling colonial facades — reads completely differently from the water.",
      tags:     ["nature", "photography"]
    },
    {
      id:       "liberation-war-museum",
      name:     "Liberation War Museum",
      photo:    "/assets/img/dhaka-gateway.webp",
      duration: 0.5,
      base:     "Dhaka",
      transfer: { cost: [0, 0], note: "CNG auto (Segunbagicha)" },
      aff:      null,
      desc:     "A moving archive of Bangladesh's 1971 independence war — photographs, personal testimonies and artefacts from the nine months that built the nation.",
      tags:     ["history", "culture"]
    },
    {
      id:       "national-museum",
      name:     "Bangladesh National Museum",
      photo:    "/assets/img/dhaka-1.webp",
      duration: 1,
      base:     "Dhaka",
      transfer: { cost: [0, 0], note: "CNG auto (Shahbag)" },
      aff:      null,
      desc:     "Four floors covering natural history, fine arts, folklore and 2,500 years of Bengal delta civilisation. Plan a full morning — there is a lot here.",
      tags:     ["history", "museum"]
    },
    {
      id:       "sonargaon",
      name:     "Sonargaon & Panam City",
      photo:    "/assets/img/dhaka-2.webp",
      duration: 1,
      base:     "Dhaka",
      transfer: { cost: [2, 6], note: "Bus/micro 30 km east" },
      aff:      { label: "Book day tour (Klook)", url: "https://klook.tpm.li/KKQ1Iup8" },
      desc:     "The medieval capital of Bengal and its ghost town of abandoned merchant mansions — crumbling Italianate facades lining one silent street. An easy day trip from Dhaka.",
      tags:     ["history", "photography"]
    }
  ],

  /* ── SUNDARBANS ─────────────────────────────────────────────────────── */
  "sundarbans": [
    {
      id:       "sundarbans-safari",
      name:     "Sundarbans Boat Safari",
      photo:    "/assets/img/sundarbans-1.webp",
      duration: 1,
      base:     "Mongla",
      transfer: { cost: [5, 12], note: "Bus + launch from Khulna" },
      aff:      { label: "Book guided safari (Klook)", url: "https://klook.tpm.li/KKQ1Iup8" },
      desc:     "Navigate the labyrinth of mangrove creeks on a country boat. Royal Bengal tigers, spotted deer, Irrawaddy dolphins and giant kingfishers populate the silence.",
      tags:     ["wildlife", "nature"]
    },
    {
      id:       "hiron-point",
      name:     "Hiron Point (Nilkamal)",
      photo:    "/assets/img/sundarbans-2.webp",
      duration: 2,
      base:     "Mongla",
      transfer: { cost: [8, 18], note: "Overnight boat from Mongla" },
      aff:      null,
      desc:     "The remote southern tip of the Sundarbans — a UNESCO core zone where tiger pugmarks appear in the tidal mud at dawn. Accessible only by overnight boat.",
      tags:     ["wildlife", "nature", "adventure"]
    },
    {
      id:       "katka-sanctuary",
      name:     "Katka Wildlife Sanctuary",
      photo:    "/assets/img/sundarbans-3.webp",
      duration: 1,
      base:     "Mongla",
      transfer: { cost: [6, 15], note: "Boat from Mongla" },
      aff:      null,
      desc:     "Tidal creeks, mudflats and one of the Sundarbans' best spots for seeing deer, otters and wading birds. The beach at Katka Point faces the open Bay of Bengal.",
      tags:     ["wildlife", "nature"]
    },
    {
      id:       "karamjal",
      name:     "Karamjal Wildlife Centre",
      photo:    "/assets/img/sundarbans-1.webp",
      duration: 0.5,
      base:     "Mongla",
      transfer: { cost: [3, 8], note: "Short boat from Mongla" },
      aff:      null,
      desc:     "A gentle intro to the Sundarbans: resident saltwater crocs, spotted deer and a tiger-rearing enclosure — all within easy reach of the jetty.",
      tags:     ["wildlife", "family"]
    }
  ],

  /* ── COX'S BAZAR & ST MARTIN'S ───────────────────────────────────── */
  "coxs-bazar": [
    {
      id:       "coxs-beach",
      name:     "Cox's Bazar Beach",
      photo:    "/assets/img/coxs-1.webp",
      duration: 1,
      base:     "Cox's Bazar",
      transfer: { cost: [0, 0], note: "On the beach strip" },
      aff:      { label: "Find hotels on Booking", url: "https://www.tkqlhce.com/click-101858699-17293139?url=https%3A%2F%2Fwww.booking.com%2Fcountry%2Fbd.html" },
      desc:     "120 km of unbroken golden sand — the world's longest natural sea beach. Go at sunrise for empty sands, then watch the trawlers return with their catch.",
      tags:     ["beach", "nature"]
    },
    {
      id:       "inani-beach",
      name:     "Inani Beach",
      photo:    "/assets/img/coxs-2.webp",
      duration: 0.5,
      base:     "Cox's Bazar",
      transfer: { cost: [2, 5], note: "CNG auto 32 km south" },
      aff:      null,
      desc:     "A quieter cove of smooth coral rocks and jade-green water 32 km from Cox's. Tide pools, coloured stones and almost none of the main-beach crowds.",
      tags:     ["beach", "photography"]
    },
    {
      id:       "himchari",
      name:     "Himchari National Park",
      photo:    "/assets/img/coxs-3.webp",
      duration: 0.5,
      base:     "Cox's Bazar",
      transfer: { cost: [2, 4], note: "CNG auto south" },
      aff:      null,
      desc:     "Forested hills meeting the sea — a seasonal waterfall, a short trail and the best elevated viewpoint over the Cox's Bazar coastline.",
      tags:     ["nature", "hiking"]
    },
    {
      id:       "st-martins",
      name:     "St Martin's Island",
      photo:    "/assets/img/coxs-bazar.webp",
      duration: 2,
      base:     "St Martin's",
      transfer: { cost: [8, 15], note: "Speed ferry from Teknaf" },
      aff:      { label: "Book ferry (Klook)", url: "https://klook.tpm.li/KKQ1Iup8" },
      desc:     "Bangladesh's only coral island: turquoise shallows, coconut groves, no motor traffic. An overnight stay is the only way to have it to yourself at dawn.",
      tags:     ["beach", "island", "snorkeling"]
    }
  ],

  /* ── SYLHET & SRIMANGAL ─────────────────────────────────────────── */
  "sylhet": [
    {
      id:       "ratargul",
      name:     "Ratargul Swamp Forest",
      photo:    "/assets/img/sylhet-1.webp",
      duration: 1,
      base:     "Sylhet",
      transfer: { cost: [3, 8], note: "Boat + auto from Sylhet" },
      aff:      { label: "Book guided tour (Klook)", url: "https://klook.tpm.li/KKQ1Iup8" },
      desc:     "Bangladesh's own Amazon — a freshwater swamp forest best explored by flat-bottomed boat when flooded (June–Oct). Eerie, beautiful, absolute silence.",
      tags:     ["nature", "photography"]
    },
    {
      id:       "lawachara",
      name:     "Lawachara National Park",
      photo:    "/assets/img/sylhet-2.webp",
      duration: 0.5,
      base:     "Srimangal",
      transfer: { cost: [4, 8], note: "Train or bus to Srimangal" },
      aff:      null,
      desc:     "Semi-evergreen forest and the best place in Bangladesh to spot the endangered hoolock gibbon. Guided morning walks are mandatory — no independent entry.",
      tags:     ["wildlife", "nature"]
    },
    {
      id:       "tea-estate",
      name:     "Tea Estate Walk",
      photo:    "/assets/img/sylhet-3.webp",
      duration: 0.5,
      base:     "Srimangal",
      transfer: { cost: [4, 8], note: "Train or bus to Srimangal" },
      aff:      { label: "Book tea experience (Klook)", url: "https://klook.tpm.li/KKQ1Iup8" },
      desc:     "Roll after roll of emerald tea bushes plucked by hand — Srimangal's estates produce some of Asia's finest Orthodox. Walk among the pluckers at first light.",
      tags:     ["photography", "culture"]
    },
    {
      id:       "jaflong",
      name:     "Jaflong & the Dawki River",
      photo:    "/assets/img/sylhet-1.webp",
      duration: 1,
      base:     "Sylhet",
      transfer: { cost: [5, 10], note: "Bus north from Sylhet" },
      aff:      null,
      desc:     "The Dawki rolls crystal boulders down from the Meghalaya hills. Boats drift between India and Bangladesh; children sort river stones on the bank in the golden hour.",
      tags:     ["nature", "photography"]
    },
    {
      id:       "hakaluki-haor",
      name:     "Hakaluki Haor Wetlands",
      photo:    "/assets/img/sylhet-2.webp",
      duration: 1,
      base:     "Sylhet",
      transfer: { cost: [5, 10], note: "Local transport from Sylhet" },
      aff:      null,
      desc:     "South Asia's largest wetland — a vast shallow lake in monsoon, a mosaic of rice and water in winter. Migratory birds arrive Oct–Feb in their thousands.",
      tags:     ["nature", "birdwatching"]
    }
  ],

  /* ── CHITTAGONG HILL TRACTS ──────────────────────────────────────── */
  "hill-tracts": [
    {
      id:       "kaptai-lake",
      name:     "Kaptai Lake",
      photo:    "/assets/img/hilltracts-1.webp",
      duration: 1,
      base:     "Rangamati",
      transfer: { cost: [5, 12], note: "Bus from Chittagong" },
      aff:      { label: "Book boat tour (Klook)", url: "https://klook.tpm.li/KKQ1Iup8" },
      desc:     "Bangladesh's largest artificial lake ringed by forested hills and Chakma stilt villages. Rent a motorboat at dawn when river mist still hugs the hills.",
      tags:     ["nature", "photography"]
    },
    {
      id:       "hanging-bridge",
      name:     "Hanging Bridge, Rangamati",
      photo:    "/assets/img/hilltracts-2.webp",
      duration: 0.5,
      base:     "Rangamati",
      transfer: { cost: [5, 12], note: "Bus from Chittagong" },
      aff:      null,
      desc:     "A 335-metre suspension footbridge swaying above Kaptai Lake — the postcard of Rangamati, and one of the most photographed sights in the country.",
      tags:     ["photography", "architecture"]
    },
    {
      id:       "nilgiri",
      name:     "Nilgiri Hill Station",
      photo:    "/assets/img/hilltracts-3.webp",
      duration: 1,
      base:     "Bandarban",
      transfer: { cost: [6, 14], note: "CNG/jeep from Bandarban town" },
      aff:      { label: "Find hill resort (Booking)", url: "https://www.tkqlhce.com/click-101858699-17293139?url=https%3A%2F%2Fwww.booking.com%2Fcountry%2Fbd.html" },
      desc:     "At 1,600m, Nilgiri floats above the clouds at sunrise. The Army-run resort is the only accommodation — book months in advance.",
      tags:     ["hiking", "photography"]
    },
    {
      id:       "boga-lake",
      name:     "Boga Lake Trek",
      photo:    "/assets/img/hilltracts-1.webp",
      duration: 2,
      base:     "Bandarban",
      transfer: { cost: [8, 18], note: "Jeep from Bandarban town" },
      aff:      { label: "Book guided trek (Klook)", url: "https://klook.tpm.li/KKQ1Iup8" },
      desc:     "A crater lake at 1,246m reached by a demanding 6-hour trail through forested ridges. Camp by emerald water under undiluted stars. Permits and guide required.",
      tags:     ["hiking", "adventure"]
    },
    {
      id:       "bandarban-market",
      name:     "Bandarban Morning Market",
      photo:    "/assets/img/hilltracts-2.webp",
      duration: 0.5,
      base:     "Bandarban",
      transfer: { cost: [6, 12], note: "Bus from Chittagong" },
      aff:      null,
      desc:     "A hillside market where Marma, Bawm and Chakma communities trade — handwoven fabric, bamboo shoots, tropical fruit and local silver jewellery.",
      tags:     ["culture", "photography"]
    }
  ]

};
