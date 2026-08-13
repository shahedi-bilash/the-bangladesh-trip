# Affiliate Monetization Setup — The Bangladesh Trip

**Site:** the-bangladesh-trip.pages.dev — free client-side trip-planning tool for foreign tourists visiting Bangladesh
**Goal:** wire real affiliate IDs into the `AFF` object in `assets/js/data.js`
**Prepared:** August 2026

---

## ⚠️ Read this first — the Bangladesh payout reality

This single fact reorders everything below:

- **PayPal does NOT operate in Bangladesh.** You cannot receive affiliate money into a Bangladeshi account via PayPal. Any program that "pays via PayPal only" is effectively **not directly usable** unless you own a foreign PayPal account.
- **The rails that DO work for Bangladesh:**
  1. **Payoneer** → instant transfer to **bKash** (via the official bKash–Payoneer link). This is the standard method BD freelancers use. Networks that support Payoneer are your best friends.
  2. **International bank/wire transfer** to a BD bank account (USD). Works everywhere but has higher minimums and wire fees.
- **Wise** partially works for BD but is unreliable for *receiving* — treat it like PayPal (weak for BD).

So when a source says "pays via PayPal," the practical question for you is always: *does this program (or its network) also offer Payoneer or bank transfer?* That's what the tables below answer.

---

## Priority order (best → worst for a Bangladesh payout)

| Rank | Program | Why | Payout for BD | Approval |
|------|---------|-----|---------------|----------|
| 1 | **Airalo (eSIM)** | Runs on Impact; low $10 threshold; fast approval | Bank transfer / Payoneer via Impact | ~Instant/auto |
| 2 | **Viator (tours)** | Runs on Impact; same payout rail as Airalo | Bank transfer / Payoneer via Impact | Review |
| 3 | **Agoda (hotels)** | Direct bank transfer, strong in Asia/BD | Direct bank wire (USD) | Review |
| 4 | **Booking.com (hotels)** | Direct bank transfer, €100 min | Direct bank wire (EUR) | Review (1–5 days) |
| 5 | **World Nomads (insurance)** | Via CJ → **Payoneer + local currency** = very BD-friendly | Payoneer / local bank via CJ | Review (CJ) |
| 6 | **GetYourGuide (tours)** | Bank transfer available, but PayPal-leaning | Bank transfer ($50 min) | Review (3–5 days) |
| — | SafetyWing (insurance, alt) | Easiest instant signup BUT pays PayPal/Wise only → weak for BD | PayPal/Wise only | Instant |

**Consolidation tip:** Airalo + Viator both pay through **Impact.com**, so one Impact payout setup (Payoneer or bank) covers two of your six programs. If you also take World Nomads on CJ, you'd have just three payout accounts total (Impact, CJ, plus Booking/Agoda direct) instead of six.

**Company requirement:** None of these *require* a registered company. You sign up as an individual website owner. Impact and CJ will ask you to complete a **W-8BEN** tax form (standard for non-US individuals — takes 2 minutes, no company needed). Booking/Agoda may request basic tax info but accept individuals.

---

## Program-by-program detail

### 1. Booking.com (hotels)

1. **Signup URL:** https://www.booking.com/affiliate-program/v2/index.html (direct "Affiliate Partner Program" / Partner Hub)
2. **Pays to Bangladesh?** Yes — **direct bank transfer (wire)**, minimum **€100**. No PayPal in the direct program. (You can alternatively join via **Awin** or **CJ**, which can route through Payoneer.)
3. **Get your ID:** After approval, log in to **Partner Center → Account Settings → Other Affiliates** to see your **AID** (Affiliate ID). Use their **Deep Link Builder** to target specific pages.
4. **Link format for AFF object:**
   `https://www.booking.com/index.html?aid=YOUR_AID`
   Deep-link to a Bangladesh city: `https://www.booking.com/city/bd/dhaka.html?aid=YOUR_AID`
5. **Maps to:** Primary **"Book a hotel"** CTA — accommodation section / itinerary day cards / city pages.
6. **Approval:** Manual review, **1–5 business days**. Individual OK.

### 2. Agoda (hotels — strong in Asia)

1. **Signup URL:** https://partners.agoda.com/
2. **Pays to Bangladesh?** Yes — **direct bank transfer**, minimum **~$200**. (Some tiers list PayPal, but bank transfer is the BD-usable route.) Paid the month following guest checkout.
3. **Get your ID:** In **Partner Center → Profile → Manage My Sites**, register your domain and grab your **CID** (tracking/campaign ID). Any link from your registered domain containing your CID is tracked.
4. **Link format for AFF object:**
   `https://www.agoda.com/?cid=YOUR_CID`
   Deep-link example: `https://www.agoda.com/city/dhaka-bd.html?cid=YOUR_CID`
5. **Maps to:** Secondary **"Compare on Agoda"** hotel CTA — shown next to Booking.com in accommodation sections (Agoda often has better Asia rates, so pairing both is smart).
6. **Approval:** Review required. Individual OK.

### 3. GetYourGuide (tours / experiences)

1. **Signup URL:** https://partner.getyourguide.com/ (Affiliate / Content Partnership)
2. **Pays to Bangladesh?** Partial — pays via **bank transfer or PayPal**, minimum **$50**, monthly. For BD, use **bank transfer** (PayPal unusable). Commission ~8%.
3. **Get your ID:** After approval, your **Partner ID / Cookie ID** lives in the Partner Portal account settings. Use the **Affiliate Link Builder** to create `gyg.me/…` short links (they embed your ID automatically).
4. **Link format for AFF object:**
   `https://www.getyourguide.com/?partner_id=YOUR_PARTNER_ID`
   Deep-link example: `https://www.getyourguide.com/dhaka-l163086/?partner_id=YOUR_PARTNER_ID`
5. **Maps to:** Primary **"Book tours & experiences"** CTA — things-to-do / activities sections, attraction cards.
6. **Approval:** Review, **3–5 days**. Individual OK. 31-day cookie.

### 4. Viator (tours)

1. **Signup URL:** https://www.viator.com/partner/affiliates (managed on **Impact.com**)
2. **Pays to Bangladesh?** Yes — via **Impact**: **bank transfer / EFT (and Payoneer)** or PayPal. **$10** Autopay threshold. PayPal payouts weekly; bank monthly. Commission 8–12%.
3. **Get your ID:** Apply → once approved you get a **Viator/Impact account**. Generate tracking links in the Impact dashboard (your **Media Partner ID / PID** is assigned there).
4. **Link format for AFF object:**
   Classic parameter form: `https://www.viator.com/?pid=YOUR_PID&mcid=42383&medium=link`
   (Confirm your exact `mcid`/`pid` in the dashboard, or paste any Viator URL into Impact's deep-link generator.)
5. **Maps to:** Secondary tours CTA — shown alongside GetYourGuide in activities sections (broader global inventory).
6. **Approval:** Review. Individual OK. 30-day cookie.

### 5. Airalo (eSIM — connectivity)

1. **Signup URL:** https://partners.airalo.com/solutions/affiliates (managed on **Impact.com**)
2. **Pays to Bangladesh?** Yes — via **Impact**: **bank transfer / Payoneer** or PayPal, **$10** threshold. Sales validated by the 7th of the next month, paid by end of that month. Commission ~10%.
3. **Get your ID:** Apply through Impact → generate your tracking link in the Impact dashboard.
4. **Link format for AFF object:**
   Impact tracking link (vanity domain), e.g. `https://airalo.pxf.io/YOUR_LINK_TOKEN`
   To deep-link to the Bangladesh eSIM page, use Impact's deep-link param:
   `https://airalo.pxf.io/YOUR_LINK_TOKEN?u=https%3A%2F%2Fwww.airalo.com%2Fbangladesh-esim`
5. **Maps to:** **"Get a travel eSIM / stay connected"** CTA — practical-info / SIM & connectivity section, pre-trip checklist. (Very high fit: every foreign tourist needs data on arrival.)
6. **Approval:** Fast, often **auto-approved** on Impact. Individual OK.

### 6. Travel insurance

**Recommended for BD payout → World Nomads (via CJ):**

1. **Signup URL:** https://www.worldnomads.com/partnerships/affiliates → join **CJ (Commission Junction)** at https://www.cj.com/, then apply to the World Nomads program.
2. **Pays to Bangladesh?** **Yes, and this is the BD win:** CJ pays via **Payoneer or your local bank in local currency** (no foreign account needed). Paid fortnightly. This is why it outranks SafetyWing for you.
3. **Get your ID:** Your **CJ Publisher ID** + the program's link generator produce CJ tracking links.
4. **Link format for AFF object:** CJ wraps the destination, e.g.
   `https://www.anrdoezrs.net/click-XXXXXXX-YYYYYYY?url=https%3A%2F%2Fwww.worldnomads.com%2F`
   (XXXXXXX = your CJ PID, YYYYYYY = the World Nomads ad ID — both from the CJ link builder.)
5. **Maps to:** **"Get travel insurance"** CTA — pre-trip checklist / safety & health section.
6. **Approval:** CJ account approval + program review. Individual OK.

**Easiest instant alternative → SafetyWing** (use only if you have a foreign PayPal/Wise):

1. **Signup URL:** https://safetywing.com/ambassador
2. **Pays to Bangladesh?** ⚠️ **Weak** — PayPal or Wise only, $10 min. Not directly BD-usable.
3. **Get your ID:** Instant Ambassador Dashboard → your reference ID + link.
4. **Link format for AFF object:**
   `https://safetywing.com/nomad-insurance?referenceID=YOUR_ID&utm_source=YOUR_ID&utm_campaign=ambassador&utm_medium=Ambassador`
5. **Maps to:** Same insurance CTA as above.
6. **Approval:** **Instant.** Individual OK.

---

## Instant vs. review — quick reference

- **Instant / auto-approve:** Airalo (Impact), SafetyWing.
- **Needs review:** Booking.com (1–5 days), Agoda, GetYourGuide (3–5 days), Viator, World Nomads (via CJ).
- **Registered company needed:** **None.** All accept individuals; Impact & CJ just need a W-8BEN tax form.

---

## Ready-to-paste AFF object

Once you have each ID, replace the placeholders. This mirrors your six keys in `assets/js/data.js`:

```js
// assets/js/data.js
const AFF = {
  // Hotels — primary
  booking:      "https://www.booking.com/index.html?aid=YOUR_AID",
  // Hotels — secondary (Asia-strong)
  agoda:        "https://www.agoda.com/?cid=YOUR_CID",
  // Tours / experiences — primary
  getyourguide: "https://www.getyourguide.com/?partner_id=YOUR_PARTNER_ID",
  // Tours — secondary
  viator:       "https://www.viator.com/?pid=YOUR_PID&mcid=42383&medium=link",
  // eSIM / connectivity
  airalo:       "https://airalo.pxf.io/YOUR_LINK_TOKEN",
  // Travel insurance (World Nomads via CJ — BD-friendly payout)
  insurance:    "https://www.anrdoezrs.net/click-XXXXXXX-YYYYYYY?url=https%3A%2F%2Fwww.worldnomads.com%2F"
};
```

**Best-practice reminders for the buttons themselves:**
- Add `rel="sponsored noopener"` and `target="_blank"` to every affiliate link (Google requirement + safety).
- Put a one-line disclosure near the CTAs: *"We may earn a commission from bookings made through these links — at no extra cost to you."* (FTC/legal best practice, and it doesn't hurt conversion.)
- For programs that require your traffic to originate from a **registered domain** (Agoda especially), register `the-bangladesh-trip.pages.dev` in that program's site list.

---

## Suggested rollout sequence

1. **Airalo** (instant, Impact) — get one live link working end-to-end first; proves the pipeline.
2. **SafetyWing** (instant) — only as a placeholder if you want insurance live immediately; swap to World Nomads once CJ approves.
3. Apply to **Viator** (same Impact account as Airalo), **Booking.com**, **Agoda**, **GetYourGuide**, **World Nomads/CJ** in parallel — they review over 1–5 days.
4. As each approves, drop the real ID into the AFF object and redeploy.

---

*Note: I couldn't parse your live `assets/js/data.js` (it returned as binary over fetch), so the "maps to" CTA placements above are inferred from your six AFF keys and the trip-planner's purpose. Confirm them against your actual page sections — the key names line up 1:1, so this should match.*

## Sources
- [Booking.com Affiliate Program (official)](https://www.booking.com/affiliate-program/v2/index.html) · [Affiliate ID help](https://affiliates.support.booking.com/kb/s/article/Affiliate-ID) · [Links help](https://affiliates.support.booking.com/kb/s/article/Links)
- [Agoda Partner Center](https://partners.agoda.com/en-us/faq.html) · [How to sign up](https://affiliates.support.agoda.com/kb/s/article/How-to-sign-up-on-Partner-Center)
- [GetYourGuide Partner Resource Center](https://partner.getyourguide.support/hc/en-us/articles/23082933149981-How-to-get-started-with-the-Affiliate-Program-as-a-Creator) · [Cookie/Partner ID tracking](https://partner.getyourguide.support/hc/en-us/articles/13981115983133-How-does-the-cookie-ID-tracking-work)
- [Viator Partner Resource Center](https://partnerresources.viator.com/)
- [Airalo Affiliate Program](https://partners.airalo.com/solutions/affiliates) · [Airalo Affiliate FAQs](https://www.airalo.com/blog/airalo-affiliate-program-faqs)
- [Impact.com — how partners get paid](https://help.impact.com/en/support/solutions/articles/48001233415-how-do-partners-get-paid-) · [Withdraw to bank](https://help.impact.com/partner/what-would-you-like-to-learn-about/platform-features/finance/payments-withdrawals-and-balance/withdraw-funds-to-your-bank-account)
- [World Nomads Affiliates (via CJ)](https://www.worldnomads.com/partnerships/affiliates) · [FAQs](https://www.worldnomads.com/partnerships/affiliates/faqs)
- [SafetyWing Ambassador](https://safetywing.com/ambassador)
- [bKash × Payoneer (BD payout)](https://www.bkash.com/en/products-services/payoneer)
