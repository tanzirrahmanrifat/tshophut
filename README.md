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
