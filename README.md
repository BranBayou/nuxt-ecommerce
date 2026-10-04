# NUXTWEAR — Nuxt Fashion Store

A full-stack fashion e-commerce app built with Nuxt 3 (Nuxt 4 compatibility mode), Tailwind CSS and Nitro, styled after the
[Cloth Store | Fashion Store | E-commerce UI Kit](https://www.figma.com/community/file/1365263619600313207/cloth-store-fashion-store-e-commerce-ui-kit) Figma community file.
Product data comes from the [DummyJSON products API](https://dummyjson.com/docs/products).

## Features

- **Storefront** — home (hero, new this week, collections, editorial), product listing with filters, product detail with gallery, sizes, reviews and related products, collections and about pages.
- **Filtering & search** — server-side search, category, size, availability, price range, gender, rating, sort and pagination. Filter state lives in the URL.
- **Bag & wishlist** — slide-over bag, quantity limits, a free-shipping progress bar and "save for later". Persisted in `localStorage` and synced across tabs.
- **Checkout** — information → shipping → payment steps. Orders are **re-priced and validated on the server**, so the client can't change prices, sizes or stock.
- **Accounts** — register, login, logout and an account page with order history. Sessions use an httpOnly cookie, and passwords are hashed with scrypt.
- **Errors** — custom 404 and error page.

## Architecture

```
app/                    Nuxt app (pages, components, composables, layouts, middleware, plugins)
server/api/             Nitro API routes
  products/             GET list (filters + facets), GET :id (detail + related)
  categories.get.ts     category groups for /collections
  auth/                 login, register, logout, me
  orders/               POST create, GET mine, GET :id
  newsletter.post.ts
server/utils/           catalog (DummyJSON proxy + cache), sessions, validation
shared/pricing.ts       shipping rules used by both client and server
types/types.ts          shared TypeScript types
```

- The fashion categories from DummyJSON (shirts, tops, dresses, shoes, bags, watches, jewellery, sunglasses) are fetched once and cached for an hour with `defineCachedFunction`.
- DummyJSON has no clothing sizes, so each product gets a stable derived size run (XS–2X, EU 39–45, or One Size). Some sizes are marked sold out.
- Users, sessions and orders are stored with Nitro storage in `.data/db` (file system driver). To use Redis, a database, or another backend, change `nitro.storage.db` in `nuxt.config.ts`.

## Demo accounts

Either create an account on `/register`, or sign in with any [DummyJSON user](https://dummyjson.com/users).
For example, use username `emilys` with password `emilyspass` (the login page has a "Fill demo login" shortcut).

## Setup

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (Node server)
npm run preview    # preview the production build
```

## Deployment (GitHub Pages)

`.github/workflows/deploy.yml` runs on GitHub Actions:

| Event | What happens |
| --- | --- |
| Pull request → `main` | Installs, builds the server version, and generates the static site (no deploy) |
| Push / merge to `main` | Same checks, then deploys `.output/public` to GitHub Pages |
| Manual (`workflow_dispatch`) | Re-deploys `main` |

One-time setup: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
The site is published at `https://<user>.github.io/<repo>/`.

### Static mode

GitHub Pages can't run a server, so the Pages build sets `NUXT_STATIC=true`. That produces a client-side SPA
(`ssr: false`, with `404.html` as the deep-link fallback). All data access goes through `useApi()`:

- **Server build** — calls the Nitro `/api` routes (sessions in httpOnly cookies, data in `.data/db`).
- **Static build** — `app/utils/staticBackend.ts` runs the same shared catalog and order code (`shared/`) in the browser.
  It calls DummyJSON directly. Accounts, sessions and orders are stored in that browser's `localStorage`.

That makes the static deployment **demo-grade**: accounts and orders exist only in the visitor's own browser.
For real accounts and orders, deploy the server build to a Node host (Vercel, Netlify, Render and so on).

To build the Pages version locally (PowerShell):

```powershell
$env:NUXT_STATIC='true'; $env:NUXT_APP_BASE_URL='/nuxt-ecommerce/'; $env:NITRO_PRESET='github_pages'; npx nuxi generate
```
