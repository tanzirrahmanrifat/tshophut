# Tshophut — Next.js storefront

A self-contained e-commerce store for Tshophut, built with Next.js 14 (App
Router). No Shopify account, external database, or paid services required to
run it locally.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000. The storefront and admin both work out of the box.

Admin panel: http://localhost:3000/admin — password `tshophut2026` (change it
by copying `.env.example` to `.env` and setting `ADMIN_PASSWORD`).

## Deploying to Vercel

Two things were fixed specifically for a Vercel deploy — worth knowing if you
pull this apart further:

1. **No event handlers in Server Components.** The homepage is a Server
   Component; its newsletter form now lives in its own `"use client"`
   component (`components/NewsletterForm.jsx`) instead of an inline
   `onSubmit` on the page itself, which Next.js can't serialize.
2. **Read-only filesystem at runtime.** Vercel's serverless functions can't
   write to the project folder — only to `/tmp`, and `/tmp` is wiped on
   cold starts/redeploys. `lib/db.js` now writes to `/tmp` when
   `process.env.VERCEL` is set, so checkout and the admin panel work for a
   demo instead of crashing with `EROFS`. **This means real order/product
   data still won't persist long-term on Vercel** — for a real launch,
   replace the file-based functions in `lib/db.js` with calls to a real
   database (Vercel Postgres, Neon, PlanetScale, Supabase all work fine with
   Next.js) — every route already goes through this one file.

## Design pass (v3)

The homepage and header were redesigned with layout patterns adapted from
premium e-commerce sites (mega-menu navigation, a rotating campaign hero,
tabbed horizontal product rails, an animated stats/impact section, and a
trust-badge row) — reimplemented from scratch in Tshophut's own visual
language. No third-party photography, copy, or certification logos were
copied; the "impact" numbers and trust badges are placeholder content for a
small Bangladesh streetwear brand (tee count, drop count, GSM weight, COD,
returns) — edit `components/StatsCounter.jsx` and `components/TrustBadges.jsx`
directly to reflect your real numbers before launch.

## What's included

- **Storefront**: homepage, collection pages (Tees / Caps / Print on Demand)
  with fit/colour/sort filters, product detail pages with size selection and
  live stock, search, wishlist (saved locally per device), recently viewed
  products, and a live countdown to when the current drop closes.
- **Print on Demand designer** (`/custom`): choose a tee or cap, pick a
  colour, upload your own artwork per placement (front, back, neck label,
  left sleeve, right sleeve — tee only), drag/resize it, and add the
  finished design straight to the cart. Pricing updates live per placement
  used. Any product can also link straight into the designer pre-loaded
  with its colour — see "Print on Demand control" below.
- **Buy Now / quick checkout**: every product card and the product detail
  page has a "Buy now" button that skips the cart entirely — it opens a
  popup that takes shipping details and places a single-item Cash on
  Delivery order immediately.
- **Cart & checkout**: cart drawer + full cart page (both show a free
  -shipping progress bar), a checkout form with a discount code field, that
  writes a real order to `data/orders.json` and decrements stock in
  `data/products.json`, and an order confirmation / tracking page.
  Starter discount codes (`lib/discounts.js`): `WELCOME10` (10% off),
  `FLAT100` (৳100 off), `FREESHIP` (free shipping) — edit that file to
  add/remove codes; the server re-validates every code at checkout so
  nothing client-sent is trusted.
- **Frequently bought together**: on every product page, a bundle of the
  current product + 2 related items with a combined "add selected to cart".
- **Admin**: password-gated dashboard, full product CRUD (add/edit/delete,
  price, stock, images-as-colour-swatch, featured/new flags), a one-click
  **Print on Demand toggle per product** right in the product list (flips
  whether customers see a "Personalize this design" button on that
  product), and an orders view with status updates (Processing → Confirmed
  → Shipped → Delivered).

## Real customer accounts (v9)

Customer login/registration is now a real (if intentionally minimal)
system — not the device-local wishlist from before, which still exists
alongside it for guest checkout:

- **Register / log in / log out**: `/register` and `/login`, phone-or-email
  + password. Passwords are salted and hashed with Node's built-in
  `crypto.scrypt` (no external auth library needed); sessions are an
  HMAC-signed cookie (`AUTH_SECRET` in `.env` — **set this to a real random
  value before deploying**, the default is a placeholder).
- **Header reflects login state**: the account icon becomes your initial in
  a circle when logged in, and the mobile menu greets you by name.
- **Checkout prefill**: name and phone auto-fill from your profile in both
  the full checkout and the Buy Now popup, without overwriting anything
  you've already typed.
- **Orders tied to your account**: orders placed while logged in are
  tagged with your customer ID and show up in "Your order history" on
  `/account` from any device (via `/api/my-orders`) — not just the
  per-device cache guests get.
- **Still fully optional**: every page says plainly that guest checkout
  works with no account, and registering is framed as "saves your
  history," not a requirement.

No email verification, password reset, or social login — those would need
either an email-sending service or an OAuth provider, neither of which
exists in this project yet. If you want password reset specifically, that
just needs an email service (e.g. Resend) wired in.

## Buy Now hardening

Went through the whole flow again looking for real issues:

- Phone fields now use `type="tel"` with the right mobile keyboard, in
  both the Buy Now popup and the full checkout.
- Buy Now from a product card now has its own quantity adjuster (it was
  previously locked to 1).
- Buy Now prefills name/phone from your account the same way checkout
  does, if you're logged in.
- Re-verified there's no Rules-of-Hooks violation or state leak between
  opening Buy Now for different products back-to-back (each card owns its
  own modal instance; state resets correctly on open).

If something specific is still off, the most useful thing to send is the
exact error text or a screenshot of what happens when you click Place
Order — "not working perfectly" without more detail means I'm hardening
against the most likely causes rather than the one you actually hit.

## Eye-catching / premium pass (v8)

- **Scroll reveals**: homepage sections (trust badges, product rails, the
  category grid, story collage, stats, newsletter) now fade/slide in as you
  scroll to them instead of just appearing — makes the page feel alive
  rather than static. New reusable `components/Reveal.jsx`.
- **Bento-style category grid**: "Shop the range" went from four equal
  squares to an asymmetric editorial layout — one large featured tile, two
  small ones, one wide one — each with a hover-scaling icon and a "Shop
  now" micro-link.
- **Hero carousel polish**: the slide dots are now a real auto-advance
  progress bar (fills over the 6s interval), not just static dots.
- **Quick View**: hovering a product card now reveals a "Quick view" button
  that opens the product in a modal (image, price, size picker, add to
  cart) without leaving the page you're on.
- **Richer link previews**: Open Graph / Twitter card metadata added, so
  sharing the site link shows a proper title/description instead of
  whatever a browser guesses.

## More premium features + visual polish (v7)

- **Product gallery**: product pages now have a front/back view toggle with
  thumbnails (reusing the same illustrated-art system, with matching back
  views added — neck label, yoke seam, back strap on caps). Products with
  a real `imageUrl` set still just show that photo, unchanged.
- **Stock urgency bar**: when a size has 5 or fewer left, there's now a
  small progress bar under the size selector, not just text.
- **Size guide modal**: a "Size guide" link next to the size selector opens
  a real measurement chart (chest/length/shoulder per size).
- **Back-in-stock notifications**: sold-out sizes show a "Notify me" field
  instead of just being disabled. Requests are saved and visible in a new
  **Restock alerts** admin page — there's no automatic SMS/email sender
  wired up, so you'd reach out manually once restocked.
- **Honest social proof**: product pages can show "N ordered in the last 7
  days" — but only when it's true. It's computed from real rows in
  `data/orders.json` via `/api/social-proof`; if nothing's actually sold
  recently, nothing is shown. No fabricated names or fake activity.
- **WhatsApp quick-contact button**: a floating button (bottom-right) that
  opens a WhatsApp chat pre-filled with a greeting — only appears once you
  set a support phone number in `/admin/settings`.
- **FAQ page** (`/faq`, linked from the footer) covering drops, payment,
  delivery, returns, and the Print on Demand designer.

## Bug fixes (v6)

- **Buy Now modal cut off / submit button unreachable**: the modal now has
  a fixed header and a fixed footer (with the Place Order button and
  total), and only the middle section scrolls — so the button is always
  visible no matter how tall the content gets or how short the screen is.
  Background scroll is also locked while it's open, and Escape closes it.
- **"View order" 404ing right after checkout**: this was an infrastructure
  issue, not a UI bug. Vercel's serverless functions don't reliably share
  `/tmp` between invocations, so the order your checkout just wrote could
  be invisible to the very next request that loads the confirmation page.
  Every successful checkout (both the full checkout page and the Buy Now
  popup) now also caches the order in the browser's `localStorage`
  (`lib/orderCache.js`), and the confirmation page tries the server first,
  then falls back to that cache. This fixes the common case reliably; it's
  still a stopgap — see "What's intentionally stubbed" below for the real
  fix (a proper database).
- **Account icon felt broken**: there was never a login system (documented
  from the start), so clicking it landed on a page that looked like it was
  missing something. `/account` now says plainly that no sign-in is needed,
  and leads with **"Recent orders placed from this device"** — pulled from
  the same local order cache above — before wishlist and the manual
  order-ID lookup.
- **No mobile navigation**: the header's nav links were `hidden` below the
  `md` breakpoint with no alternative, so phones had no way to reach
  Tees/Caps/Custom from the header. Added a slide-in mobile menu (hamburger
  icon) with nav links, search, account, and wishlist.

## Visual design pass (v5)

- **Richer product illustrations**: the tee/cap line art now has shading
  (a gradient instead of flat fill), collar/seam/hem detail lines, and a
  soft drop shadow — used everywhere (cards, product page, cart, hero), so
  this one change lifts the whole site's perceived quality.
- **Decorative backgrounds**: a subtle halftone-dot texture and soft glow
  behind the hero art, the stats section, and the footer, instead of flat
  colour blocks.
- **Deeper shadows & motion**: product cards, the hero CTA, and the Print on
  Demand studio now lift with a soft shadow on hover instead of a flat
  border change; hero copy fades/slides in on each slide change.
- **Small refinements**: trust-badge icons sit in soft circular chips,
  filter dropdowns highlight on focus, product titles tint cobalt on hover.

## Storefront polish pass (v4)

- **Buy Now, more prominent**: product cards now have both "Add to cart" and
  "Buy now" side by side (plus size-availability chips), and the product
  page gets a **sticky mobile buy bar** that slides up once you scroll past
  the main buy box — a common premium mobile pattern. The quick-checkout
  popup itself was redesigned with an item thumbnail and a real
  subtotal/shipping/total breakdown instead of just a single price line.
- **Toast confirmations**: adding to cart now shows a small toast
  ("Added X to cart — View cart") instead of only an inline button state
  change, site-wide.
- **Breadcrumbs** on collection and product pages.
- **Checkout step indicator** (Cart → Information → Payment) at the top of
  the checkout page.

## Admin dashboard (v2)

`/admin` is now a proper dashboard shell — a persistent sidebar (Dashboard,
Products, Orders, Discounts, Settings) wraps every admin page, and the whole
`/admin/*` tree is gated by one shared layout rather than each page checking
auth itself.

- **Dashboard**: revenue trend (last 7 days), orders-by-status breakdown,
  recent orders, and a low-stock table — all computed live from
  `data/orders.json` / `data/products.json`, no external analytics needed.
- **Products**: stock is now editable **per size** directly in the form (not
  just a single number), plus an optional **image URL** field — paste a
  hosted photo URL and it replaces the illustrated placeholder everywhere
  (product cards, product page, admin list); leave it blank to keep the
  illustration. The Print-on-Demand toggle from before is still there.
- **Orders**: search by order ID/name/phone, filter by status, **export the
  current view to CSV**, and click through to a full order detail page
  (`/admin/orders/[id]`) with the shipping address, line items, payment
  breakdown, and a status selector.
- **Discounts** (`/admin/discounts`): discount codes are no longer
  hardcoded — create/edit/delete percent, flat-amount, or free-shipping
  codes and flip them active/inactive with a switch. The checkout route
  re-validates every code against this same list server-side.
- **Settings** (`/admin/settings`): store name, currency symbol, support
  contact info, the free-shipping threshold, the standard shipping fee, and
  a kill switch for Cash on Delivery — all editable without touching code.
  The storefront (cart drawer, cart page, checkout) reads these live via a
  public `/api/settings` endpoint, so changing the threshold here updates
  the free-shipping progress bar and checkout math everywhere at once.

## Print on Demand control

Every product has a `podEnabled` flag. In `/admin/products`, each row has a
toggle switch on the right — flip it and that product's detail page
immediately shows a "Personalize this design →" button that opens `/custom`
pre-loaded with that product's colour and tee/cap type. The two dedicated
"Custom Print Tee/Cap" blanks and a few example products ship with it on;
everything else ships with it off so you decide what's customizable.

## What's intentionally stubbed

- **Payments**: only **Cash on Delivery** is wired up (the default for the
  Bangladesh market). bKash and card are shown in checkout as "coming soon."
  Wiring up a real gateway needs your merchant credentials and their SDK —
  happy to help with that next once you have an account with them.
- **Product photography**: products render as colour-tinted line-art tee/cap
  icons instead of real photos, since no photography was provided. Swap
  `components/ProductArt.jsx` for an `<img>` once you have real shots — every
  page already reads from a single shared component.
- **"Database"**: `data/products.json` and `data/orders.json` are plain JSON
  files read/written by `lib/db.js`. This is genuinely functional (stock
  really decrements, orders really persist) but won't survive a serverless
  deploy that wipes the filesystem between requests (e.g. plain Vercel). For
  a real launch, swap `lib/db.js`'s internals for Postgres/MySQL/PlanetScale
  — every route already calls through this one file, so nothing else needs
  to change.
- **Customer accounts**: `/account` shows wishlist + order tracking by ID,
  but there's no real login/signup — cart and wishlist are stored per device
  in `localStorage`, not tied to an identity.

## Project layout

```
app/            Next.js App Router pages + API routes
components/     Shared React components (cards, header, cart drawer, designer…)
context/        CartContext (client-side cart + wishlist state)
lib/db.js       JSON-file "database" — swap this for a real DB later
data/           products.json (catalog) and orders.json (orders), plus the seed file
```
