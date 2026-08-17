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
  "hill-tracts":   "Chittagong Hill Tracts",
  "north-bengal":  "North Bengal (Paharpur)",
  "kuakata":       "Kuakata",
  "bagerhat":      "Bagerhat",
  "comilla":       "Comilla–Mainamati",
  "mymensingh":    "Mymensingh & Haor Wetlands"
};

/* Slugs used in plan.html?regions= */
var REGION_PLAN_SLUG = {
  "dhaka-gateway": "dhaka",
  "sundarbans":    "sundarbans",
  "coxs-bazar":   "coxsbazar",
  "sylhet":        "sylhet",
  "hill-tracts":   "hilltracts",
  "north-bengal":  "northbengal",
  "kuakata":       "kuakata",
  "bagerhat":      "bagerhat",
  "comilla":       "comilla",
  "mymensingh":    "mymensingh"
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
  "Bandarban":    { budget: [8,  16], comfort: [30,  55] },
  "Rajshahi":     { budget: [10, 18], comfort: [35,  65] },
  "Bogura":       { budget: [8,  15], comfort: [28,  55] },
  "Kuakata":      { budget: [10, 18], comfort: [30,  60] },
  "Bagerhat":     { budget: [8,  15], comfort: [25,  50] },
  "Comilla":      { budget: [8,  14], comfort: [25,  50] },
  "Mymensingh":   { budget: [8,  14], comfort: [25,  52] },
  "Sunamganj":    { budget: [7,  13], comfort: [20,  42] }
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
  "sylhet:hill-tracts":       { label: "Sylhet → Chittagong (bus)",                     cost: [10, 22] },
  "dhaka-gateway:north-bengal":{ label: "Dhaka → Rajshahi/Bogura (train or bus)",       cost: [5,  18] },
  "dhaka-gateway:kuakata":     { label: "Dhaka → Kuakata (bus)",                        cost: [8,  22] },
  "dhaka-gateway:bagerhat":    { label: "Dhaka → Khulna then Bagerhat (bus)",           cost: [6,  20] },
  "dhaka-gateway:comilla":     { label: "Dhaka → Comilla (bus or train)",               cost: [3,   8] },
  "sundarbans:bagerhat":       { label: "Khulna/Mongla → Bagerhat (bus)",               cost: [2,   8] },
  "sundarbans:kuakata":        { label: "Khulna → Kuakata (bus/launch)",                cost: [8,  20] },
  "bagerhat:kuakata":          { label: "Bagerhat/Khulna → Kuakata (bus)",              cost: [8,  20] },
  "comilla:coxs-bazar":        { label: "Comilla → Cox's Bazar (bus)",                  cost: [8,  22] },
  "comilla:hill-tracts":       { label: "Comilla → Chittagong (bus)",                   cost: [5,  14] },
  "north-bengal:comilla":      { label: "Rajshahi → Comilla (train/bus)",               cost: [12, 28] },
  "dhaka-gateway:mymensingh":  { label: "Dhaka → Mymensingh (train or bus)",             cost: [2,   6] },
  "mymensingh:sylhet":         { label: "Mymensingh → Sylhet (bus)",                     cost: [5,  14] },
  "dhaka-gateway:sylhet":      { label: "Dhaka → Sylhet (overnight train or bus)",       cost: [4,  15] },
  "comilla:mymensingh":        { label: "Comilla → Mymensingh (bus via Dhaka)",          cost: [6,  16] }
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
  ],

  /* ── NORTH BENGAL (PAHARPUR / RAJSHAHI) ─────────────────────────────── */
  "north-bengal": [
    {
      id:       "somapura-mahavihara",
      name:     "Somapura Mahavihara (UNESCO)",
      photo:    "/assets/img/nb-somapura.webp",
      duration: 1,
      base:     "Bogura",
      transfer: { cost: [3, 8], note: "Bus/CNG from Bogura" },
      aff:      null,
      desc:     "The largest Buddhist monastery in South Asia, built in the 8th century under the Pala dynasty. The cross-shaped terracotta ruins rise from vast green plains — a UNESCO World Heritage Site of rare quietness.",
      tags:     ["history", "UNESCO", "archaeology"]
    },
    {
      id:       "mahasthangarh",
      name:     "Mahasthangarh Citadel",
      photo:    "/assets/img/nb-mahasthan.webp",
      duration: 0.5,
      base:     "Bogura",
      transfer: { cost: [2, 6], note: "Bus north from Bogura" },
      aff:      null,
      desc:     "One of the earliest urban archaeological sites in Bangladesh, continuously inhabited from at least the 3rd century BC. Massive mud ramparts overlook the Karatoa River.",
      tags:     ["history", "archaeology"]
    },
    {
      id:       "puthia-temples",
      name:     "Puthia Temple Complex",
      photo:    "/assets/img/nb-puthia.webp",
      duration: 0.5,
      base:     "Rajshahi",
      transfer: { cost: [2, 6], note: "Bus from Rajshahi" },
      aff:      null,
      desc:     "Bangladesh's largest concentration of Hindu temples in a single campus — terracotta-carved towers ranging from the 17th to 19th century, arranged around a sacred tank.",
      tags:     ["history", "architecture", "culture"]
    },
    {
      id:       "varendra-museum",
      name:     "Varendra Research Museum",
      photo:    "/assets/img/nb-varendra.webp",
      duration: 0.5,
      base:     "Rajshahi",
      transfer: { cost: [0, 2], note: "City centre, Rajshahi" },
      aff:      null,
      desc:     "Bangladesh's oldest museum, founded 1910. Remarkable collection of stone sculpture, coins and inscriptions from Bengal's Buddhist and Hindu kingdoms, including Pala masterpieces.",
      tags:     ["history", "culture", "museum"]
    }
  ],

  /* ── KUAKATA ─────────────────────────────────────────────────────────── */
  "kuakata": [
    {
      id:       "kuakata-beach",
      name:     "Kuakata Sunrise & Sunset Point",
      photo:    "/assets/img/kuakata-beach.webp",
      duration: 1,
      base:     "Kuakata",
      transfer: { cost: [0, 2], note: "Town beach, walk from guesthouses" },
      aff:      null,
      desc:     "Bangladesh's only beach where you can watch both sunrise and sunset from the same strip of sand. The sea horizon is unbroken — arrive before dawn for the full spectacle.",
      tags:     ["beach", "photography", "nature"]
    },
    {
      id:       "rakhine-village",
      name:     "Rakhine Village & Weaving",
      photo:    "/assets/img/kuakata-rakhine.webp",
      duration: 0.5,
      base:     "Kuakata",
      transfer: { cost: [1, 3], note: "Rickshaw from Kuakata centre" },
      aff:      null,
      desc:     "A living Rakhine (Arakanese) settlement on the shore, where women weave traditional cloth on backstrap looms. One of the few remaining Rakhine communities in Bangladesh.",
      tags:     ["culture", "photography"]
    },
    {
      id:       "fatrar-char",
      name:     "Fatrar Char Mangrove",
      photo:    "/assets/img/kuakata-fatrar.webp",
      duration: 1,
      base:     "Kuakata",
      transfer: { cost: [4, 10], note: "Trawler from Kuakata beach" },
      aff:      null,
      desc:     "A dense mangrove island accessible by boat — a miniature Sundarbans. Spotted deer and crocodiles have been reported; migratory birds roost in winter.",
      tags:     ["nature", "wildlife", "boat"]
    },
    {
      id:       "gangamati",
      name:     "Gangamati Forest Reserve",
      photo:    "/assets/img/kuakata-gangamati.webp",
      duration: 0.5,
      base:     "Kuakata",
      transfer: { cost: [2, 5], note: "Bicycle/CNG from Kuakata" },
      aff:      null,
      desc:     "A narrow coastal forest belt running behind the beach dunes — a shaded walk of wild shrubs, wild boar tracks and the distant crash of surf.",
      tags:     ["nature", "hiking"]
    }
  ],

  /* ── BAGERHAT ─────────────────────────────────────────────────────────── */
  "bagerhat": [
    {
      id:       "sixty-dome-mosque",
      name:     "Sixty Dome Mosque (UNESCO)",
      photo:    "/assets/img/bagerhat-sixty.webp",
      duration: 1,
      base:     "Bagerhat",
      transfer: { cost: [2, 6], note: "Bus from Khulna" },
      aff:      null,
      desc:     "The largest medieval mosque in Bangladesh, built c. 1450 by Khan Jahan Ali. Eighty-one stone pillars carry seventy-seven terracotta domes in a forest of arches — UNESCO World Heritage.",
      tags:     ["history", "UNESCO", "architecture"]
    },
    {
      id:       "khan-jahan-shrine",
      name:     "Khan Jahan Ali Shrine & Tank",
      photo:    "/assets/img/bagerhat-khanjahan.webp",
      duration: 0.5,
      base:     "Bagerhat",
      transfer: { cost: [2, 6], note: "Bus from Khulna" },
      aff:      null,
      desc:     "The mausoleum of Bagerhat's founder, set beside a sacred tank inhabited by saltwater crocodiles — fed by pilgrims for centuries and still remarkably tame.",
      tags:     ["history", "culture", "pilgrimage"]
    },
    {
      id:       "nine-dome-mosque",
      name:     "Nine Dome Mosque (Nau Gumbad)",
      photo:    "/assets/img/bagerhat-ninedome.webp",
      duration: 0.5,
      base:     "Bagerhat",
      transfer: { cost: [2, 6], note: "Rickshaw from Bagerhat centre" },
      aff:      null,
      desc:     "A perfectly proportioned 15th-century mosque of nine equal domes in a 3×3 grid — considered the finest example of the Sultanate style in Bangladesh.",
      tags:     ["history", "architecture"]
    }
  ],

  /* ── COMILLA–MAINAMATI ───────────────────────────────────────────────── */
  "comilla": [
    {
      id:       "shalban-vihara",
      name:     "Shalban Vihara Buddhist Ruins",
      photo:    "/assets/img/comilla-shalban.webp",
      duration: 1,
      base:     "Comilla",
      transfer: { cost: [2, 5], note: "CNG from Comilla town" },
      aff:      null,
      desc:     "A 7th–12th-century Buddhist monastery complex excavated from Mainamati hill. Over one hundred meditation cells surround a central stupa — terracotta plaques litter the site museum.",
      tags:     ["history", "archaeology", "Buddhism"]
    },
    {
      id:       "mainamati-museum",
      name:     "Mainamati Museum",
      photo:    "/assets/img/comilla-museum.webp",
      duration: 0.5,
      base:     "Comilla",
      transfer: { cost: [2, 5], note: "CNG from Comilla town" },
      aff:      null,
      desc:     "Houses the finest collection of Buddhist artefacts from the Mainamati excavations — gold reliquary caskets, silver bowls, terracotta figurines and illuminated manuscripts.",
      tags:     ["history", "museum", "culture"]
    },
    {
      id:       "war-cemetery-comilla",
      name:     "Comilla War Cemetery",
      photo:    "/assets/img/comilla-cemetery.webp",
      duration: 0.5,
      base:     "Comilla",
      transfer: { cost: [1, 3], note: "CNG or rickshaw from centre" },
      aff:      null,
      desc:     "A Commonwealth War Graves Commission cemetery for 736 WWII soldiers — Britons, Indians, Gurkhas and West Africans who died on the Burma Campaign. Immaculately kept and profoundly moving.",
      tags:     ["history", "memorial"]
    },
    {
      id:       "dharmasagar-lake",
      name:     "Dharmasagar Lake",
      photo:    "/assets/img/comilla-dharmasagar.webp",
      duration: 0.5,
      base:     "Comilla",
      transfer: { cost: [0, 2], note: "City centre, Comilla" },
      aff:      null,
      desc:     "A large medieval lake dug in 1458 by Raja Dharma Manikya. At dawn, fishermen cast hand nets from dugout canoes while egrets stalk the shallows.",
      tags:     ["nature", "photography", "history"]
    }
  ],

  /* ── MYMENSINGH & HAOR WETLANDS ───────────────────────────────────── */
  "mymensingh": [
    {
      id:       "tanguar-haor",
      name:     "Tanguar Haor — the open water",
      photo:    "/assets/img/mymensingh-haor.webp",
      duration: 2,
      base:     "Sunamganj",
      transfer: { cost: [5, 14], note: "Boat from Sunamganj town" },
      aff:      { label: "Book a houseboat tour (Klook)", url: "https://klook.tpm.li/KKQ1Iup8" },
      desc:     "A Ramsar-listed wetland of 100+ inter-connected haors, swollen to a vast inland sea November–April. Overnight houseboats give you dawn on open water surrounded by tens of thousands of migratory waterfowl.",
      tags:     ["nature", "birds", "boat", "photography"]
    },
    {
      id:       "birishiri-cliffs",
      name:     "Birishiri — white clay cliffs",
      photo:    "/assets/img/mymensingh-birishiri.webp",
      duration: 1,
      base:     "Mymensingh",
      transfer: { cost: [2, 6], note: "Bus from Mymensingh to Netrokona then CNG" },
      aff:      null,
      desc:     "Dramatic white china clay cliffs above the shallow, crystal Someshwari River — a surreal landscape you wade across. Popular with local travellers, barely known internationally.",
      tags:     ["nature", "scenery", "photography"]
    },
    {
      id:       "mymensingh-riverside",
      name:     "Mymensingh riverside & Shashi Lodge",
      photo:    "/assets/img/mymensingh-town.webp",
      duration: 0.5,
      base:     "Mymensingh",
      transfer: { cost: [0, 2], note: "City centre" },
      aff:      null,
      desc:     "The old Brahmaputra riverfront, the 1905 Shashi Lodge Zamindar palace (now a government building), and the verdant campus of Bangladesh Agricultural University — a gentler side of urban Bangladesh.",
      tags:     ["history", "architecture", "riverside"]
    },
    {
      id:       "hakaluki-haor",
      name:     "Hakaluki Haor birdwatching",
      photo:    "/assets/img/mymensingh-hakaluki.webp",
      duration: 1,
      base:     "Sylhet",
      transfer: { cost: [4, 10], note: "Bus from Sylhet or Moulvibazar" },
      aff:      null,
      desc:     "Bangladesh's largest single haor — over 90 species of migratory waterfowl winter here, including bar-headed geese, ferruginous ducks and painted storks. Best before 8 am from the embankment.",
      tags:     ["birds", "nature", "wetlands"]
    },
    {
      id:       "someshwari-river",
      name:     "Someshwari River — Netrokona",
      photo:    "/assets/img/mymensingh-someshwari.webp",
      duration: 0.5,
      base:     "Mymensingh",
      transfer: { cost: [2, 6], note: "Bus from Mymensingh to Netrokona" },
      aff:      null,
      desc:     "A shallow, fast-flowing river that emerges from the Meghalaya hills — clear enough to see the riverbed, flanked by tea-coloured sand and the green Garo Hills on the horizon.",
      tags:     ["nature", "scenic", "swimming"]
    }
  ]

};
