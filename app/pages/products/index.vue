<script setup lang="ts">
import type { LocationQueryRaw } from 'vue-router'

const route = useRoute()
const router = useRouter()

// All filter state lives in the URL so results are shareable and survive refresh
const qs = (key: string) => (typeof route.query[key] === 'string' ? (route.query[key] as string) : '')
const qsList = (key: string) => qs(key).split(',').filter(Boolean)

// Build on any navigation still in flight so rapid clicks don't overwrite each other
let pending: LocationQueryRaw | null = null

function setQuery(patch: Record<string, string | string[] | null>, resetPage = true) {
  const next: LocationQueryRaw = { ...(pending ?? route.query) }
  for (const [k, v] of Object.entries(patch)) {
    const value = Array.isArray(v) ? v.join(',') : v
    if (value) next[k] = value
    else delete next[k]
  }
  if (resetPage) delete next.page
  pending = next
  router.replace({ query: next }).finally(() => {
    if (pending === next) pending = null
  })
}

const toggleInList = (key: string, value: string) => {
  const current = (pending ?? route.query)[key]
  const list = typeof current === 'string' ? current.split(',').filter(Boolean) : []
  setQuery({ [key]: list.includes(value) ? list.filter((v) => v !== value) : [...list, value] })
}

const { data, status, error, refresh } = await useFetch('/api/products', {
  query: computed(() => ({ ...route.query, limit: 12 })),
  key: 'products-list',
})

const title = computed(() => {
  if (qs('new')) return 'New Arrivals'
  if (qs('sale')) return 'Sale'
  if (qs('gender') === 'men') return "Men's"
  if (qs('gender') === 'women') return "Women's"
  return 'Products'
})
useSeoMeta({
  title: () => title.value,
  description: 'Browse shirts, tops, dresses, shoes, bags and accessories. Filter by size, price and availability.',
})

// Quick chips across the top, like the design's category row
const chips = [
  { label: 'New', key: 'new', value: 'true' },
  { label: 'Sale', key: 'sale', value: 'true' },
  { label: 'Shirts', key: 'category', value: 'mens-shirts' },
  { label: 'Tops', key: 'category', value: 'tops' },
  { label: 'Dresses', key: 'category', value: 'womens-dresses' },
  { label: 'Shoes', key: 'category', value: 'mens-shoes,womens-shoes' },
  { label: 'Bags', key: 'category', value: 'womens-bags' },
  { label: 'Sunglasses', key: 'category', value: 'sunglasses' },
  { label: 'Watches', key: 'category', value: 'mens-watches,womens-watches' },
  { label: 'Jewellery', key: 'category', value: 'womens-jewellery' },
]
const chipActive = (c: (typeof chips)[number]) =>
  c.key === 'category' ? qs('category') === c.value : qs(c.key) === c.value
const toggleChip = (c: (typeof chips)[number]) => setQuery({ [c.key]: chipActive(c) ? null : c.value })

// Sidebar sections (collapsible)
const open = reactive<Record<string, boolean>>({ size: true, availability: true, category: true, price: false, collections: false, rating: false })
const filtersOpen = ref(false)
watch(() => route.query, () => (filtersOpen.value = false))

const minPrice = ref(qs('minPrice'))
const maxPrice = ref(qs('maxPrice'))
watch(() => [route.query.minPrice, route.query.maxPrice], () => {
  minPrice.value = qs('minPrice')
  maxPrice.value = qs('maxPrice')
})
const applyPrice = () => setQuery({ minPrice: minPrice.value || null, maxPrice: maxPrice.value || null })

const activeCount = computed(() =>
  ['category', 'size', 'availability', 'minPrice', 'maxPrice', 'gender', 'rating', 'new', 'sale', 'q'].filter((k) => qs(k)).length,
)
const clearAll = () => router.replace({ query: {} })

const page = computed(() => Number(qs('page') || 1))
const goTo = (p: number) => {
  setQuery({ page: p > 1 ? String(p) : null }, false)
  if (import.meta.client) window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <div class="container pt-4 pb-10">
    <Breadcrumb :items="[{ label: 'Products' }]" />

    <div class="mt-6 flex flex-col lg:flex-row lg:items-end gap-6 justify-between">
      <div class="flex-1 max-w-md">
        <h1 class="display text-4xl sm:text-5xl">{{ title }}</h1>
        <SearchField class="mt-6" live :model-value="qs('q')" placeholder="Search products" @update:model-value="setQuery({ q: $event || null })" />
      </div>
      <div class="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 lg:mx-0 lg:px-0 [scrollbar-width:none]">
        <button
          v-for="c in chips"
          :key="c.label"
          class="chip shrink-0"
          :class="{ 'chip-active': chipActive(c) }"
          :aria-pressed="chipActive(c)"
          @click="toggleChip(c)"
        >
          {{ c.label }}
        </button>
      </div>
    </div>

    <div class="mt-10 grid lg:grid-cols-[15rem_1fr] gap-10">
      <!-- Filters (sidebar on desktop, drawer on mobile) -->
      <div
        class="fixed inset-0 z-50 bg-black/40 lg:hidden transition-opacity"
        :class="filtersOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'"
        @click="filtersOpen = false"
      />
      <aside
        class="fixed inset-y-0 left-0 z-50 w-80 max-w-full bg-paper p-6 overflow-y-auto transition-transform lg:static lg:z-auto lg:w-auto lg:bg-transparent lg:p-0 lg:translate-x-0 lg:overflow-visible"
        :class="filtersOpen ? 'translate-x-0' : '-translate-x-full'"
        aria-label="Filters"
      >
        <div class="flex items-center justify-between mb-6">
          <h2 class="font-semibold">Filters</h2>
          <button v-if="activeCount" class="text-xs text-muted underline hover:text-ink" @click="clearAll">Clear all</button>
          <button class="lg:hidden p-1" aria-label="Close filters" @click="filtersOpen = false"><Icon name="lucide:x" size="20" /></button>
        </div>

        <div v-if="data" class="divide-y divide-line border-y border-line">
          <!-- Size -->
          <section class="py-4">
            <button class="w-full flex items-center justify-between text-sm font-medium" :aria-expanded="open.size" @click="open.size = !open.size">
              Size <Icon :name="open.size ? 'lucide:chevron-up' : 'lucide:chevron-right'" size="16" />
            </button>
            <div v-show="open.size" class="mt-4 flex flex-wrap gap-1.5">
              <button
                v-for="s in data.facets.sizes"
                :key="s.value"
                class="chip !min-w-[2.5rem] !h-9 !px-2"
                :class="{ 'chip-active': qsList('size').includes(s.value) }"
                @click="toggleInList('size', s.value)"
              >
                {{ s.value }}
              </button>
            </div>
          </section>

          <!-- Availability -->
          <section class="py-4">
            <button class="w-full flex items-center justify-between text-sm font-medium" :aria-expanded="open.availability" @click="open.availability = !open.availability">
              Availability <Icon :name="open.availability ? 'lucide:chevron-up' : 'lucide:chevron-right'" size="16" />
            </button>
            <div v-show="open.availability" class="mt-4 space-y-2.5 text-sm">
              <label class="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" class="w-4 h-4 accent-black" :checked="qs('availability') === 'in'" @change="setQuery({ availability: qs('availability') === 'in' ? null : 'in' })" />
                In stock <span class="text-accent">({{ data.facets.availability.inStock }})</span>
              </label>
              <label class="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" class="w-4 h-4 accent-black" :checked="qs('availability') === 'out'" @change="setQuery({ availability: qs('availability') === 'out' ? null : 'out' })" />
                Out of stock <span class="text-accent">({{ data.facets.availability.outOfStock }})</span>
              </label>
            </div>
          </section>

          <!-- Category -->
          <section class="py-4">
            <button class="w-full flex items-center justify-between text-sm font-medium" :aria-expanded="open.category" @click="open.category = !open.category">
              Category <Icon :name="open.category ? 'lucide:chevron-up' : 'lucide:chevron-right'" size="16" />
            </button>
            <div v-show="open.category" class="mt-4 space-y-2.5 text-sm">
              <label v-for="c in data.facets.categories" :key="c.value" class="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" class="w-4 h-4 accent-black" :checked="qsList('category').includes(c.value)" @change="toggleInList('category', c.value)" />
                {{ c.label }} <span class="text-muted">({{ c.count }})</span>
              </label>
            </div>
          </section>

          <!-- Price -->
          <section class="py-4">
            <button class="w-full flex items-center justify-between text-sm font-medium" :aria-expanded="open.price" @click="open.price = !open.price">
              Price Range <Icon :name="open.price ? 'lucide:chevron-up' : 'lucide:chevron-right'" size="16" />
            </button>
            <form v-show="open.price" class="mt-4 space-y-3" @submit.prevent="applyPrice">
              <div class="flex items-center gap-2">
                <input v-model="minPrice" type="number" min="0" inputmode="numeric" :placeholder="`$${data.facets.price.min}`" aria-label="Minimum price" class="input !h-10" />
                <span class="text-muted">–</span>
                <input v-model="maxPrice" type="number" min="0" inputmode="numeric" :placeholder="`$${data.facets.price.max}`" aria-label="Maximum price" class="input !h-10" />
              </div>
              <button class="btn-primary w-full !h-10">Apply</button>
            </form>
          </section>

          <!-- Collections -->
          <section class="py-4">
            <button class="w-full flex items-center justify-between text-sm font-medium" :aria-expanded="open.collections" @click="open.collections = !open.collections">
              Collections <Icon :name="open.collections ? 'lucide:chevron-up' : 'lucide:chevron-right'" size="16" />
            </button>
            <div v-show="open.collections" class="mt-4 space-y-2.5 text-sm">
              <label v-for="g in [{ v: '', l: 'All' }, { v: 'men', l: 'Men' }, { v: 'women', l: 'Women' }]" :key="g.v" class="flex items-center gap-3 cursor-pointer">
                <input type="radio" name="gender" class="w-4 h-4 accent-black" :checked="qs('gender') === g.v" @change="setQuery({ gender: g.v || null })" />
                {{ g.l }}
              </label>
            </div>
          </section>

          <!-- Rating -->
          <section class="py-4">
            <button class="w-full flex items-center justify-between text-sm font-medium" :aria-expanded="open.rating" @click="open.rating = !open.rating">
              Ratings <Icon :name="open.rating ? 'lucide:chevron-up' : 'lucide:chevron-right'" size="16" />
            </button>
            <div v-show="open.rating" class="mt-4 space-y-2.5 text-sm">
              <label v-for="r in ['4', '3', '']" :key="r" class="flex items-center gap-3 cursor-pointer">
                <input type="radio" name="rating" class="w-4 h-4 accent-black" :checked="qs('rating') === r" @change="setQuery({ rating: r || null })" />
                <span v-if="r" class="flex items-center gap-1">{{ r }}<Icon name="lucide:star" size="12" /> &amp; up</span>
                <span v-else>Any rating</span>
              </label>
            </div>
          </section>
        </div>
      </aside>

      <!-- Results -->
      <section aria-live="polite">
        <div class="flex items-center justify-between gap-4 mb-6 text-sm">
          <button class="lg:hidden flex items-center gap-2 font-medium" @click="filtersOpen = true">
            <Icon name="lucide:sliders-horizontal" size="16" /> Filters <span v-if="activeCount">({{ activeCount }})</span>
          </button>
          <p class="hidden lg:block text-muted">{{ data?.total ?? 0 }} products</p>
          <label class="flex items-center gap-2 text-muted">
            Sort by
            <select :value="qs('sort') || 'featured'" class="bg-transparent text-ink focus:outline-none cursor-pointer" @change="setQuery({ sort: ($event.target as HTMLSelectElement).value })">
              <option value="featured">Featured</option>
              <option value="newest">Newest</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
              <option value="rating">Top rated</option>
            </select>
          </label>
        </div>

        <div v-if="error" class="py-24 text-center">
          <p class="display text-2xl">Couldn't load products</p>
          <p class="mt-2 text-sm text-muted">{{ error.statusMessage || 'Please check your connection.' }}</p>
          <button class="btn-primary mt-6" @click="refresh()">Try again</button>
        </div>

        <div v-else-if="status === 'pending' && !data" class="grid grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-10">
          <ProductCardSkeleton v-for="n in 9" :key="n" />
        </div>

        <div v-else-if="data?.products.length" class="grid grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-10 transition-opacity" :class="{ 'opacity-50': status === 'pending' }">
          <ProductCard v-for="p in data.products" :key="p.id" :product="p" />
        </div>

        <div v-else class="py-24 text-center">
          <Icon name="lucide:search-x" size="40" class="text-muted" />
          <p class="display text-2xl mt-4">No products found</p>
          <p class="mt-2 text-sm text-muted">Try removing a filter or searching for something else.</p>
          <button class="btn-primary mt-6" @click="clearAll">Clear filters</button>
        </div>

        <!-- Pagination -->
        <nav v-if="data && data.pages > 1" class="mt-14 flex items-center justify-center gap-2" aria-label="Pagination">
          <button class="grid place-items-center w-10 h-10 border border-line hover:border-ink disabled:opacity-30" :disabled="page <= 1" aria-label="Previous page" @click="goTo(page - 1)">
            <Icon name="lucide:chevron-left" size="16" />
          </button>
          <button
            v-for="p in data.pages"
            :key="p"
            class="w-10 h-10 text-sm border transition-colors"
            :class="p === page ? 'bg-ink text-white border-ink' : 'border-line hover:border-ink'"
            :aria-current="p === page ? 'page' : undefined"
            @click="goTo(p)"
          >
            {{ p }}
          </button>
          <button class="grid place-items-center w-10 h-10 border border-line hover:border-ink disabled:opacity-30" :disabled="page >= data.pages" aria-label="Next page" @click="goTo(page + 1)">
            <Icon name="lucide:chevron-right" size="16" />
          </button>
        </nav>
      </section>
    </div>
  </div>
</template>
