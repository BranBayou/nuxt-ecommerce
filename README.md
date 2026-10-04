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
npm run build      # production build
npm run preview    # preview the production build
```
