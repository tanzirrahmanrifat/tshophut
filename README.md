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
  live stock, search, wishlist (saved locally per device).
- **Print on Demand designer** (`/custom`): choose a tee or cap, pick a
  colour, upload your own artwork per placement (front, back, neck label,
  left sleeve, right sleeve — tee only), drag/resize it, and add the
  finished design straight to the cart. Pricing updates live per placement
  used.
- **Cart & checkout**: cart drawer + full cart page, a checkout form that
  writes a real order to `data/orders.json` and decrements stock in
  `data/products.json`, and an order confirmation / tracking page.
- **Admin**: password-gated dashboard, full product CRUD (add/edit/delete,
  price, stock, images-as-colour-swatch, featured/new flags), and an orders
  view with status updates (Processing → Confirmed → Shipped → Delivered).

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
