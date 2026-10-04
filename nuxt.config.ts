// https://nuxt.com/docs/api/configuration/nuxt-config

// NUXT_STATIC=true builds a fully static SPA for GitHub Pages: there is no Nitro server at runtime,
// so the app talks to DummyJSON from the browser and keeps sessions/orders in localStorage (see app/utils/staticBackend.ts).
const staticMode = process.env.NUXT_STATIC === 'true'

export default defineNuxtConfig({
  ssr: !staticMode,

  compatibilityDate: '2025-03-01',

  future: {
    compatibilityVersion: 4,
  },

  experimental: {
    scanPageMeta: 'after-resolve',
    sharedPrerenderData: false,
    compileTemplate: true,
    resetAsyncDataToUndefined: true,
    templateUtils: true,
    relativeWatchPaths: true,
    normalizeComponentNames: false,
    spaLoadingTemplateLocation: 'within',
    defaults: {
      useAsyncData: {
        deep: true
      }
    }
  },

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        // Archivo is variable on both weight and width, so one family covers body copy and the wide display headlines
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,100..900&display=swap' },
      ],
    },
  },

  runtimeConfig: {
    public: {
      staticMode,
      dummyjsonBase: 'https://dummyjson.com',
    },
  },

  nitro: {
    storage: {
      // users, sessions and orders live here (file-backed so they survive restarts)
      db: { driver: 'fs', base: './.data/db' },
    },
  },

  image: {
    // IPX needs a server, so static builds load images straight from the DummyJSON CDN
    provider: staticMode ? 'none' : 'ipx',
    domains: ['cdn.dummyjson.com']
  },

  tailwindcss: {
    cssPath: '~/assets/css/main.css',
  },

  features: {
    inlineStyles: true
  },

  unhead: {
    renderSSRHeadOptions: {
      omitLineBreaks: false
    }
  },

  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/icon',
    '@nuxt/image'
  ],
})
