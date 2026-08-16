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

/* ---- Display currencies. Rates are approximate, for display only.
   hidden:true = auto-selected by country but NOT shown in the currency switcher. ---- */
const FX = {
  /* ── Main switcher currencies ── */
  USD: { rate: 1,     symbol: "$",    label: "USD" },
  EUR: { rate: 0.92,  symbol: "€",    label: "EUR" },
  GBP: { rate: 0.79,  symbol: "£",    label: "GBP" },
  AUD: { rate: 1.52,  symbol: "A$",   label: "AUD" },
  CAD: { rate: 1.37,  symbol: "C$",   label: "CAD" },
  INR: { rate: 83,    symbol: "₹",    label: "INR" },
  JPY: { rate: 150,   symbol: "¥",    label: "JPY" },
  CNY: { rate: 7.2,   symbol: "¥",    label: "CNY" },
  SGD: { rate: 1.35,  symbol: "S$",   label: "SGD" },
  MYR: { rate: 4.7,   symbol: "RM",   label: "MYR" },
  THB: { rate: 34,    symbol: "฿",    label: "THB" },
  AED: { rate: 3.67,  symbol: "AED",  label: "AED" },
  SAR: { rate: 3.75,  symbol: "SAR",  label: "SAR" },
  BDT: { rate: 110,   symbol: "৳",    label: "BDT" },
  /* ── Hidden — auto-selected by country, not shown as switcher buttons ── */
  NPR: { rate: 133,   symbol: "Rs",   label: "NPR",  hidden: true },
  NZD: { rate: 1.62,  symbol: "NZ$",  label: "NZD",  hidden: true },
  NOK: { rate: 10.5,  symbol: "kr",   label: "NOK",  hidden: true },
  SEK: { rate: 10.4,  symbol: "kr",   label: "SEK",  hidden: true },
  DKK: { rate: 6.9,   symbol: "kr",   label: "DKK",  hidden: true },
  CHF: { rate: 0.91,  symbol: "Fr",   label: "CHF",  hidden: true },
  KRW: { rate: 1310,  symbol: "₩",    label: "KRW",  hidden: true },
  BRL: { rate: 5.1,   symbol: "R$",   label: "BRL",  hidden: true },
  TRY: { rate: 32,    symbol: "₺",    label: "TRY",  hidden: true },
  ZAR: { rate: 18.5,  symbol: "R",    label: "ZAR",  hidden: true },
  MXN: { rate: 17.5,  symbol: "$",    label: "MXN",  hidden: true },
  PHP: { rate: 57,    symbol: "₱",    label: "PHP",  hidden: true },
  PKR: { rate: 278,   symbol: "Rs",   label: "PKR",  hidden: true },
  LKR: { rate: 300,   symbol: "Rs",   label: "LKR",  hidden: true },
  QAR: { rate: 3.64,  symbol: "QR",   label: "QAR",  hidden: true },
  KWD: { rate: 0.31,  symbol: "KD",   label: "KWD",  hidden: true },
  IDR: { rate: 16000, symbol: "Rp",   label: "IDR",  hidden: true }
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
      { title: "Old Dhaka on foot", note: "Shankhari Bazar lanes, Ahsan Manzil (the Pink Palace), and a cycle-rickshaw through the crush.", affiliate: "klook" },
      { title: "Sunset boat on the Buriganga", note: "A rented rowboat through the busiest river port you'll ever see. Go with the light low.", affiliate: "wegotrip" },
      { title: "Day trip to Sonargaon", note: "The old capital and Panam City's abandoned merchant street, about an hour out of town.", affiliate: "klook" }
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
      { title: "3-day live-aboard cruise", note: "Sleep on the boat, wake in the mangroves. Permits, guide and forest fees are bundled by the operator.", affiliate: "wegotrip" },
      { title: "Guided creek safari", note: "Small-boat runs up the narrow channels at dawn — the best window for wildlife.", affiliate: "klook" },
      { title: "Watchtower & village stop", note: "Karamjal or Kotka watchtowers, plus a visit to a forest-edge community.", affiliate: "klook" }
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
      { title: "Saint Martin's day or overnight", note: "Boat out to the coral island for snorkelling and a night under very dark skies. Check current access rules first.", affiliate: "klook" },
      { title: "Himchari & Inani Beach drive", note: "The coast road south past waterfalls and the quieter, rockier southern beaches.", affiliate: "wegotrip" },
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
      { title: "Tea-estate walk & seven-layer tea", note: "Wander the estates around Srimangal, then the famous layered tea in a roadside cabin.", affiliate: "klook" },
      { title: "Lawachara rainforest trek", note: "A guided walk for gibbons and birds in the national park.", affiliate: "wegotrip" },
      { title: "Ratargul swamp forest by boat", note: "A rowboat through Bangladesh's freshwater swamp forest — best when water is high.", affiliate: "klook" }
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
      { title: "Boat on Kaptai Lake", note: "A long, quiet day on the reservoir around Rangamati, hopping islands and hanging bridges.", affiliate: "klook" },
      { title: "Nilgiri & Chimbuk ridgeline", note: "The high road above Bandarban — cloud-level viewpoints and hill villages.", affiliate: "wegotrip" },
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
  },
  {
    id: "northbengal",
    name: "North Bengal",
    slug: "north-bengal",
    tagline: "Bangladesh's oldest civilisation — Buddhist ruins, Mughal mosques and mango orchards.",
    bestMonths: ["Nov", "Dec", "Jan", "Feb"],
    gettingThere: "Rajshahi is 6–7 hrs by Intercity train from Dhaka; Bogura is ~4 hrs by bus. The Paharpur ruins are 13 km from Bogura by auto-rickshaw.",
    minDays: 2,
    perDayUSD: { backpacker: [12, 22], comfort: [32, 68], premium: [85, 180] },
    experiences: [
      { title: "Somapura Mahavihara (Paharpur)", note: "The largest Buddhist monastery south of the Himalayas — 177 cells around a stepped vihara. UNESCO World Heritage.", affiliate: "klook" },
      { title: "Mahasthangarh", note: "Bangladesh's oldest known city, occupied from at least the 3rd century BCE. Fortified mound, site museum, river views.", affiliate: "" },
      { title: "Puthia temple complex", note: "The greatest concentration of historic Hindu temples in Bangladesh — five temples in a single 19th-century royal compound.", affiliate: "" },
      { title: "Varendra Research Museum", note: "The oldest museum in Bangladesh (est. 1910) — Pala bronzes, Sultanate coins and 2,000 years of Bengal artefacts.", affiliate: "" }
    ],
    dayTemplates: [
      { title: "Bogura + Paharpur", detail: "Travel overnight from Dhaka to Bogura. Morning at Somapura Mahavihara, afternoon at Mahasthangarh." },
      { title: "Puthia & Rajshahi", detail: "Bus to Rajshahi, stop at Puthia temples, afternoon at the Varendra Research Museum." },
      { title: "Rajshahi riverfront", detail: "The silk quarter, Rajshahi waterfront, and mango orchards in season (May–Jun)." }
    ],
    image: "assets/img/north-bengal.webp",
    imageCredit: "TODO(owner): add — suggest Somapura Mahavihara (Wikimedia CC BY-SA)"
  },
  {
    id: "kuakata",
    name: "Kuakata",
    slug: "kuakata",
    tagline: "The only beach in Bangladesh where you can watch both sunrise and sunset from the same sand.",
    bestMonths: ["Nov", "Dec", "Jan", "Feb", "Mar"],
    gettingThere: "Bus from Dhaka to Patuakhali (~7 hrs) then local transport (~2 hrs), or direct Kuakata bus (~9 hrs) from Gabtoli. Launches via Barisal also run.",
    minDays: 2,
    perDayUSD: { backpacker: [10, 20], comfort: [28, 58], premium: [70, 145] },
    experiences: [
      { title: "Sunrise & sunset at Zero Point", note: "The only place in Bangladesh where both are visible from the same beach — sunrise east, sunset west, same day.", affiliate: "" },
      { title: "Fatrar Char mangrove forest", note: "A tidal char reached by trawler — dense mangroves, herons, deer, crocodiles and complete quiet.", affiliate: "klook" },
      { title: "Rakhine village visit", note: "A Buddhist Rakhine community with small pagodas and hand-woven textiles — a culture entirely distinct from Bengali coastal life.", affiliate: "" },
      { title: "Gangamati Reserve Forest", note: "The forest strip behind the beach, good for birds and a shaded walk when the midday sun is at its height.", affiliate: "" }
    ],
    dayTemplates: [
      { title: "Arrive & sunrise", detail: "Travel from Dhaka, arrive by evening. Up before dawn for the famous sunrise from Zero Point beach." },
      { title: "Mangroves & village", detail: "Morning trawler to Fatrar Char mangrove forest, then the Rakhine village, long sunset watch." }
    ],
    image: "assets/img/kuakata.webp",
    imageCredit: "TODO(owner): add — suggest Kuakata beach sunrise (Wikimedia CC BY-SA)"
  },
  {
    id: "bagerhat",
    name: "Bagerhat",
    slug: "bagerhat",
    tagline: "A city of medieval mosques — UNESCO World Heritage, built by a saint-governor in the 15th century.",
    bestMonths: ["Nov", "Dec", "Jan", "Feb"],
    gettingThere: "Bus from Dhaka to Khulna (~7 hrs), then 1-hr bus to Bagerhat. Pairs naturally with the Sundarbans — both are in the Khulna region.",
    minDays: 1,
    perDayUSD: { backpacker: [10, 18], comfort: [26, 55], premium: [65, 135] },
    experiences: [
      { title: "Sixty Dome Mosque (Shat Gombuj)", note: "77 domes, 60 pillars, 26 doors — surrounded by water on three sides. Bangladesh's finest medieval mosque. UNESCO.", affiliate: "klook" },
      { title: "Khan Jahan Ali's shrine & pond", note: "The founder's mausoleum and a sacred pond whose tame crocodiles are fed by worshippers every Friday afternoon.", affiliate: "" },
      { title: "Nine Dome Mosque (Nau Gumbad)", note: "Nine carved domes, fine terracotta brickwork — less visited than the main site and often more atmospheric.", affiliate: "" },
      { title: "Singair Mosque & Bagerhat Museum", note: "The finest terracotta-ornamented mosque in the city, and a small but thorough museum of the medieval sultanate.", affiliate: "" }
    ],
    dayTemplates: [
      { title: "Bagerhat full day", detail: "Sixty Dome Mosque first, Khan Jahan Ali's shrine and crocodile pond, Nine Dome Mosque, Singair at golden hour." },
      { title: "Bagerhat + Khulna + Sundarbans", detail: "Bagerhat in the morning, Khulna for lunch, connect to Mongla for the Sundarbans boat tour." }
    ],
    image: "assets/img/bagerhat.webp",
    imageCredit: "TODO(owner): add — suggest Sixty Dome Mosque (Wikimedia CC BY-SA)"
  },
  {
    id: "comilla",
    name: "Comilla & Mainamati",
    slug: "comilla-mainamati",
    tagline: "Buddhist monastery ruins from the 7th century — an easy stop between Dhaka and the east.",
    bestMonths: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
    gettingThere: "Bus from Dhaka (~2 hrs). Perfectly placed en route to Cox's Bazar or the Hill Tracts — breaks a long journey with a half-day of history.",
    minDays: 1,
    perDayUSD: { backpacker: [10, 18], comfort: [25, 52], premium: [60, 120] },
    experiences: [
      { title: "Shalban Vihara", note: "A 7th–12th century Buddhist monastery with 115 meditation cells around a stepped central vihara. Still being excavated.", affiliate: "" },
      { title: "Mainamati Museum", note: "5,000+ artefacts from the hilltop excavations — bronzes, coins, votive stupas and jewellery spanning seven centuries.", affiliate: "" },
      { title: "Mainamati War Cemetery", note: "736 Allied soldiers who died in the 1943–44 Burma campaign. Immaculate Commonwealth War Graves grounds, quiet and moving.", affiliate: "" },
      { title: "Dharmasagar Lake", note: "An 18th-century ornamental tank in Comilla town — ghats, morning light on the water and a gentle circuit walk.", affiliate: "" }
    ],
    dayTemplates: [
      { title: "Mainamati half-day", detail: "Arrive from Dhaka mid-morning. Shalban Vihara, the museum, the War Cemetery in the afternoon." },
      { title: "Comilla town + onwards", detail: "Morning at Dharmasagar, lunch in Comilla, bus east toward Cox's Bazar or Chittagong." }
    ],
    image: "assets/img/comilla.webp",
    imageCredit: "TODO(owner): add — suggest Shalban Vihara (Wikimedia CC BY-SA)"
  }
];

/* ---- Country → currency & visa route mapping.
   currency: key into FX table (unknown currencies fall back to USD in planner).
   visa:     "visa_on_arrival" | "e_visa" | "embassy"
   TODO(owner): Verify visa entries against current Bangladesh government policy. ---- */
const COUNTRIES = [
  { name: "Afghanistan", currency: "USD", visa: "embassy" },
  { name: "Albania", currency: "EUR", visa: "embassy" },
  { name: "Algeria", currency: "USD", visa: "embassy" },
  { name: "Andorra", currency: "EUR", visa: "visa_on_arrival" },
  { name: "Angola", currency: "USD", visa: "embassy" },
  { name: "Antigua and Barbuda", currency: "USD", visa: "embassy" },
  { name: "Argentina", currency: "USD", visa: "embassy" },
  { name: "Armenia", currency: "USD", visa: "embassy" },
  { name: "Australia", currency: "AUD", visa: "visa_on_arrival" },
  { name: "Austria", currency: "EUR", visa: "visa_on_arrival" },
  { name: "Azerbaijan", currency: "USD", visa: "embassy" },
  { name: "Bahamas", currency: "USD", visa: "embassy" },
  { name: "Bahrain", currency: "AED", visa: "visa_on_arrival" },
  { name: "Barbados", currency: "USD", visa: "embassy" },
  { name: "Belarus", currency: "USD", visa: "embassy" },
  { name: "Belgium", currency: "EUR", visa: "visa_on_arrival" },
  { name: "Belize", currency: "USD", visa: "embassy" },
  { name: "Benin", currency: "USD", visa: "embassy" },
  { name: "Bhutan", currency: "INR", visa: "embassy" },
  { name: "Bolivia", currency: "USD", visa: "embassy" },
  { name: "Bosnia and Herzegovina", currency: "EUR", visa: "embassy" },
  { name: "Botswana", currency: "USD", visa: "embassy" },
  { name: "Brazil", currency: "BRL", visa: "embassy" },
  { name: "Brunei", currency: "SGD", visa: "embassy" },
  { name: "Bulgaria", currency: "EUR", visa: "visa_on_arrival" },
  { name: "Burkina Faso", currency: "USD", visa: "embassy" },
  { name: "Burundi", currency: "USD", visa: "embassy" },
  { name: "Cabo Verde", currency: "EUR", visa: "embassy" },
  { name: "Cambodia", currency: "USD", visa: "embassy" },
  { name: "Cameroon", currency: "USD", visa: "embassy" },
  { name: "Canada", currency: "CAD", visa: "visa_on_arrival" },
  { name: "Central African Republic", currency: "USD", visa: "embassy" },
  { name: "Chad", currency: "USD", visa: "embassy" },
  { name: "Chile", currency: "USD", visa: "embassy" },
  { name: "China", currency: "CNY", visa: "embassy" },
  { name: "Colombia", currency: "USD", visa: "embassy" },
  { name: "Comoros", currency: "USD", visa: "embassy" },
  { name: "Congo", currency: "USD", visa: "embassy" },
  { name: "Costa Rica", currency: "USD", visa: "embassy" },
  { name: "Croatia", currency: "EUR", visa: "visa_on_arrival" },
  { name: "Cuba", currency: "USD", visa: "embassy" },
  { name: "Cyprus", currency: "EUR", visa: "visa_on_arrival" },
  { name: "Czech Republic", currency: "EUR", visa: "visa_on_arrival" },
  { name: "Denmark", currency: "DKK", visa: "visa_on_arrival" },
  { name: "Djibouti", currency: "USD", visa: "embassy" },
  { name: "Dominica", currency: "USD", visa: "embassy" },
  { name: "Dominican Republic", currency: "USD", visa: "embassy" },
  { name: "DR Congo", currency: "USD", visa: "embassy" },
  { name: "Ecuador", currency: "USD", visa: "embassy" },
  { name: "Egypt", currency: "USD", visa: "embassy" },
  { name: "El Salvador", currency: "USD", visa: "embassy" },
  { name: "Equatorial Guinea", currency: "USD", visa: "embassy" },
  { name: "Eritrea", currency: "USD", visa: "embassy" },
  { name: "Estonia", currency: "EUR", visa: "visa_on_arrival" },
  { name: "Eswatini", currency: "USD", visa: "embassy" },
  { name: "Ethiopia", currency: "USD", visa: "embassy" },
  { name: "Fiji", currency: "AUD", visa: "embassy" },
  { name: "Finland", currency: "EUR", visa: "visa_on_arrival" },
  { name: "France", currency: "EUR", visa: "visa_on_arrival" },
  { name: "Gabon", currency: "USD", visa: "embassy" },
  { name: "Gambia", currency: "USD", visa: "embassy" },
  { name: "Georgia", currency: "USD", visa: "embassy" },
  { name: "Germany", currency: "EUR", visa: "visa_on_arrival" },
  { name: "Ghana", currency: "USD", visa: "embassy" },
  { name: "Greece", currency: "EUR", visa: "visa_on_arrival" },
  { name: "Grenada", currency: "USD", visa: "embassy" },
  { name: "Guatemala", currency: "USD", visa: "embassy" },
  { name: "Guinea", currency: "USD", visa: "embassy" },
  { name: "Guinea-Bissau", currency: "USD", visa: "embassy" },
  { name: "Guyana", currency: "USD", visa: "embassy" },
  { name: "Haiti", currency: "USD", visa: "embassy" },
  { name: "Honduras", currency: "USD", visa: "embassy" },
  { name: "Hungary", currency: "EUR", visa: "visa_on_arrival" },
  { name: "Iceland", currency: "EUR", visa: "visa_on_arrival" },
  { name: "India", currency: "INR", visa: "embassy" },
  { name: "Indonesia", currency: "IDR", visa: "embassy" },
  { name: "Iran", currency: "USD", visa: "embassy" },
  { name: "Iraq", currency: "USD", visa: "embassy" },
  { name: "Ireland", currency: "EUR", visa: "visa_on_arrival" },
  { name: "Israel", currency: "EUR", visa: "embassy" },
  { name: "Italy", currency: "EUR", visa: "visa_on_arrival" },
  { name: "Jamaica", currency: "USD", visa: "embassy" },
  { name: "Japan", currency: "JPY", visa: "visa_on_arrival" },
  { name: "Jordan", currency: "USD", visa: "embassy" },
  { name: "Kazakhstan", currency: "USD", visa: "embassy" },
  { name: "Kenya", currency: "USD", visa: "embassy" },
  { name: "Kiribati", currency: "AUD", visa: "embassy" },
  { name: "Kosovo", currency: "EUR", visa: "embassy" },
  { name: "Kuwait", currency: "KWD", visa: "visa_on_arrival" },
  { name: "Kyrgyzstan", currency: "USD", visa: "embassy" },
  { name: "Laos", currency: "USD", visa: "embassy" },
  { name: "Latvia", currency: "EUR", visa: "visa_on_arrival" },
  { name: "Lebanon", currency: "USD", visa: "embassy" },
  { name: "Lesotho", currency: "USD", visa: "embassy" },
  { name: "Liberia", currency: "USD", visa: "embassy" },
  { name: "Libya", currency: "USD", visa: "embassy" },
  { name: "Liechtenstein", currency: "EUR", visa: "visa_on_arrival" },
  { name: "Lithuania", currency: "EUR", visa: "visa_on_arrival" },
  { name: "Luxembourg", currency: "EUR", visa: "visa_on_arrival" },
  { name: "Madagascar", currency: "USD", visa: "embassy" },
  { name: "Malawi", currency: "USD", visa: "embassy" },
  { name: "Malaysia", currency: "MYR", visa: "embassy" },
  { name: "Maldives", currency: "USD", visa: "embassy" },
  { name: "Mali", currency: "USD", visa: "embassy" },
  { name: "Malta", currency: "EUR", visa: "visa_on_arrival" },
  { name: "Marshall Islands", currency: "USD", visa: "embassy" },
  { name: "Mauritania", currency: "USD", visa: "embassy" },
  { name: "Mauritius", currency: "USD", visa: "embassy" },
  { name: "Mexico", currency: "MXN", visa: "embassy" },
  { name: "Micronesia", currency: "USD", visa: "embassy" },
  { name: "Moldova", currency: "EUR", visa: "embassy" },
  { name: "Monaco", currency: "EUR", visa: "visa_on_arrival" },
  { name: "Mongolia", currency: "USD", visa: "embassy" },
  { name: "Montenegro", currency: "EUR", visa: "embassy" },
  { name: "Morocco", currency: "USD", visa: "embassy" },
  { name: "Mozambique", currency: "USD", visa: "embassy" },
  { name: "Myanmar", currency: "USD", visa: "embassy" },
  { name: "Namibia", currency: "USD", visa: "embassy" },
  { name: "Nauru", currency: "AUD", visa: "embassy" },
  { name: "Nepal", currency: "NPR", visa: "embassy" },
  { name: "Netherlands", currency: "EUR", visa: "visa_on_arrival" },
  { name: "New Zealand", currency: "NZD", visa: "visa_on_arrival" },
  { name: "Nicaragua", currency: "USD", visa: "embassy" },
  { name: "Niger", currency: "USD", visa: "embassy" },
  { name: "Nigeria", currency: "USD", visa: "embassy" },
  { name: "North Korea", currency: "USD", visa: "embassy" },
  { name: "North Macedonia", currency: "EUR", visa: "embassy" },
  { name: "Norway", currency: "NOK", visa: "visa_on_arrival" },
  { name: "Oman", currency: "USD", visa: "visa_on_arrival" },
  { name: "Pakistan", currency: "PKR", visa: "embassy" },
  { name: "Palau", currency: "USD", visa: "embassy" },
  { name: "Palestine", currency: "USD", visa: "embassy" },
  { name: "Panama", currency: "USD", visa: "embassy" },
  { name: "Papua New Guinea", currency: "AUD", visa: "embassy" },
  { name: "Paraguay", currency: "USD", visa: "embassy" },
  { name: "Peru", currency: "USD", visa: "embassy" },
  { name: "Philippines", currency: "PHP", visa: "embassy" },
  { name: "Poland", currency: "EUR", visa: "visa_on_arrival" },
  { name: "Portugal", currency: "EUR", visa: "visa_on_arrival" },
  { name: "Qatar", currency: "QAR", visa: "visa_on_arrival" },
  { name: "Romania", currency: "EUR", visa: "visa_on_arrival" },
  { name: "Russia", currency: "USD", visa: "embassy" },
  { name: "Rwanda", currency: "USD", visa: "embassy" },
  { name: "Saint Kitts and Nevis", currency: "USD", visa: "embassy" },
  { name: "Saint Lucia", currency: "USD", visa: "embassy" },
  { name: "Saint Vincent and the Grenadines", currency: "USD", visa: "embassy" },
  { name: "Samoa", currency: "AUD", visa: "embassy" },
  { name: "San Marino", currency: "EUR", visa: "visa_on_arrival" },
  { name: "São Tomé and Príncipe", currency: "USD", visa: "embassy" },
  { name: "Saudi Arabia", currency: "SAR", visa: "visa_on_arrival" },
  { name: "Senegal", currency: "USD", visa: "embassy" },
  { name: "Serbia", currency: "EUR", visa: "embassy" },
  { name: "Seychelles", currency: "USD", visa: "embassy" },
  { name: "Sierra Leone", currency: "USD", visa: "embassy" },
  { name: "Singapore", currency: "SGD", visa: "visa_on_arrival" },
  { name: "Slovakia", currency: "EUR", visa: "visa_on_arrival" },
  { name: "Slovenia", currency: "EUR", visa: "visa_on_arrival" },
  { name: "Solomon Islands", currency: "AUD", visa: "embassy" },
  { name: "Somalia", currency: "USD", visa: "embassy" },
  { name: "South Africa", currency: "ZAR", visa: "embassy" },
  { name: "South Korea", currency: "KRW", visa: "visa_on_arrival" },
  { name: "South Sudan", currency: "USD", visa: "embassy" },
  { name: "Spain", currency: "EUR", visa: "visa_on_arrival" },
  { name: "Sri Lanka", currency: "LKR", visa: "embassy" },
  { name: "Sudan", currency: "USD", visa: "embassy" },
  { name: "Suriname", currency: "USD", visa: "embassy" },
  { name: "Sweden", currency: "SEK", visa: "visa_on_arrival" },
  { name: "Switzerland", currency: "CHF", visa: "visa_on_arrival" },
  { name: "Syria", currency: "USD", visa: "embassy" },
  { name: "Taiwan", currency: "USD", visa: "embassy" },
  { name: "Tajikistan", currency: "USD", visa: "embassy" },
  { name: "Tanzania", currency: "USD", visa: "embassy" },
  { name: "Thailand", currency: "THB", visa: "embassy" },
  { name: "Timor-Leste", currency: "USD", visa: "embassy" },
  { name: "Togo", currency: "USD", visa: "embassy" },
  { name: "Tonga", currency: "AUD", visa: "embassy" },
  { name: "Trinidad and Tobago", currency: "USD", visa: "embassy" },
  { name: "Tunisia", currency: "USD", visa: "embassy" },
  { name: "Turkey", currency: "TRY", visa: "embassy" },
  { name: "Turkmenistan", currency: "USD", visa: "embassy" },
  { name: "Tuvalu", currency: "AUD", visa: "embassy" },
  { name: "Uganda", currency: "USD", visa: "embassy" },
  { name: "Ukraine", currency: "EUR", visa: "embassy" },
  { name: "United Arab Emirates", currency: "AED", visa: "visa_on_arrival" },
  { name: "United Kingdom", currency: "GBP", visa: "visa_on_arrival" },
  { name: "United States", currency: "USD", visa: "visa_on_arrival" },
  { name: "Uruguay", currency: "USD", visa: "embassy" },
  { name: "Uzbekistan", currency: "USD", visa: "embassy" },
  { name: "Vanuatu", currency: "AUD", visa: "embassy" },
  { name: "Venezuela", currency: "USD", visa: "embassy" },
  { name: "Vietnam", currency: "USD", visa: "embassy" },
  { name: "Yemen", currency: "USD", visa: "embassy" },
  { name: "Zambia", currency: "USD", visa: "embassy" },
  { name: "Zimbabwe", currency: "USD", visa: "embassy" }
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

/* ---- Affiliate program IDs.
   All Travelpayouts links embed tracking in the URL itself, so AFF is ""
   (falsy) — affLink() returns AFF_BASE directly without appending ?aff=.
   booking/agoda still need their IDs — set to "TODO" until live. ---- */
const AFF = {
  booking:   "",      // Booking.com: tracking is in AFF_BASE CJ URL
  agoda:     "TODO",  // Agoda affiliate ID — pending
  flights:   "",      // Aviasales via Travelpayouts
  transfer:  "",      // Kiwitaxi via Travelpayouts
  klook:     "",      // Klook via Travelpayouts
  wegotrip:  "",      // WeGoTrip via Travelpayouts
  tiqets:    "",      // Tiqets via Travelpayouts
  storage:   "",      // Radical Storage via Travelpayouts
  airalo:    "",      // Airalo eSIM via Travelpayouts
  insurance: ""       // SafetyWing — tracking params in AFF_BASE below
};

/* ---- Where each affiliate slug points (used to build outbound links) ---- */
const AFF_BASE = {
  booking:   "https://www.tkqlhce.com/click-101858699-17293139?url=https%3A%2F%2Fwww.booking.com%2Fcountry%2Fbd.html",
  agoda:     "https://www.agoda.com/",
  flights:   "https://aviasales.tpm.li/GsTszCxG",
  transfer:  "https://kiwitaxi.tpm.li/pROaHRyF",
  klook:     "https://klook.tpm.li/KKQ1Iup8",
  wegotrip:  "https://wegotrip.tpm.li/7ePkVwoe",
  tiqets:    "https://tiqets.tpm.li/Fc1NrTjO",
  storage:   "https://radicalstorage.tpm.li/2tNxaXr7",
  airalo:    "https://airalo.tpm.li/L8mCQlNF",
  insurance: "https://safetywing.com/?referenceID=26580082&utm_source=26580082&utm_medium=Ambassador",
  getyourguide: "https://www.getyourguide.com/?partner_id=PNM6R9P&utm_medium=online_publisher"  // site.js rail
};
