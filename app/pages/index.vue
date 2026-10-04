<script setup lang="ts">
import type { Gender } from '~~/types/types'

useSeoMeta({
  title: 'New Collection',
  description: 'Shop the new collection — shirts, dresses, shoes, bags and accessories for men and women.',
  ogTitle: 'NUXTWEAR — New Collection',
  ogDescription: 'Shop the new collection — shirts, dresses, shoes, bags and accessories.',
  twitterCard: 'summary_large_image',
})

const year = new Date().getFullYear()

// Hero + "New this week"
const { data: fresh, status: freshStatus } = await useFetch('/api/products', {
  query: { new: 'true', limit: 10, sort: 'featured' },
  key: 'home-new',
})

const heroSlides = computed(() =>
  (fresh.value?.products ?? []).filter((p) => p.images.length).map((p) => ({ id: p.id, title: p.title, src: p.images[0]! })),
)
const slide = ref(0)
const visibleSlides = computed(() => {
  const s = heroSlides.value
  return s.length ? [s[slide.value % s.length]!, s[(slide.value + 1) % s.length]!] : []
})
const step = (d: number) => {
  const n = heroSlides.value.length
  if (n) slide.value = (slide.value + d + n) % n
}

// Collections grid with gender tabs and "More"
const tabs: { label: string; value: Gender | '' }[] = [
  { label: 'All', value: '' },
  { label: 'Men', value: 'men' },
  { label: 'Women', value: 'women' },
]
const gender = ref<Gender | ''>('')
const sort = ref<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured')
const limit = ref(6)
watch([gender, sort], () => (limit.value = 6))

const { data: collection, status: collectionStatus } = await useFetch('/api/products', {
  query: { gender, sort, limit },
  key: 'home-collection',
})

const approachImages = computed(() =>
  (collection.value?.products ?? []).concat(fresh.value?.products ?? []).slice(0, 4).map((p) => p.images.at(-1) ?? p.thumbnail),
)

const perks = [
  { icon: 'lucide:truck', title: 'Free shipping', text: 'On standard orders over $150' },
  { icon: 'lucide:refresh-ccw', title: '30-day returns', text: 'Easy, no-questions returns' },
  { icon: 'lucide:shield-check', title: 'Secure checkout', text: 'Your data stays protected' },
]
</script>

<template>
  <div>
    <!-- Hero -->
    <section class="container pt-6 pb-20">
      <div class="grid lg:grid-cols-[minmax(0,26rem)_1fr] gap-10 lg:gap-16">
        <div class="flex flex-col">
          <ul class="text-sm uppercase leading-relaxed">
            <li><NuxtLink to="/products?gender=men" class="hover:opacity-60">Men</NuxtLink></li>
            <li><NuxtLink to="/products?gender=women" class="hover:opacity-60">Women</NuxtLink></li>
            <li><NuxtLink to="/products?category=sunglasses,womens-bags,mens-watches,womens-watches,womens-jewellery" class="hover:opacity-60">Accessories</NuxtLink></li>
          </ul>
          <SearchField class="mt-4" />

          <div class="mt-16 lg:mt-auto">
            <h1 class="display text-[2.5rem] sm:text-5xl">New<br />Collection</h1>
            <p class="mt-4 text-base leading-snug">Fall / Winter<br />{{ year }}</p>
          </div>

          <div class="mt-10 flex items-center gap-6">
            <NuxtLink to="/products?new=true" class="btn-ghost flex-1 justify-between max-w-[13rem]">
              Go To Shop
              <svg width="40" height="10" viewBox="0 0 40 10" fill="none" aria-hidden="true"><path d="M0 5h38m0 0-4-4m4 4-4 4" stroke="currentColor" /></svg>
            </NuxtLink>
            <div class="flex gap-2">
              <button class="grid place-items-center w-10 h-10 border border-line bg-white/60 hover:border-ink" aria-label="Previous slide" @click="step(-1)">
                <Icon name="lucide:chevron-left" size="18" />
              </button>
              <button class="grid place-items-center w-10 h-10 border border-line bg-white/60 hover:border-ink" aria-label="Next slide" @click="step(1)">
                <Icon name="lucide:chevron-right" size="18" />
              </button>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4 sm:gap-6 lg:pt-24">
          <template v-if="freshStatus === 'pending' && !visibleSlides.length">
            <div v-for="n in 2" :key="n" class="aspect-[4/5] shimmer" />
          </template>
          <NuxtLink
            v-for="s in visibleSlides"
            v-else
            :key="s.id + '-' + slide"
            :to="`/products/${s.id}`"
            class="group relative aspect-[4/5] bg-white border border-line overflow-hidden animate-fade-in-up"
          >
            <NuxtImg :src="s.src" :alt="s.title" sizes="50vw lg:35vw" class="absolute inset-0 w-full h-full object-contain p-6 transition-transform duration-700 group-hover:scale-105" />
            <span class="absolute left-4 bottom-4 text-xs bg-white/90 px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">{{ s.title }}</span>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- New this week -->
    <section class="container py-16">
      <div class="flex items-end justify-between mb-10">
        <h2 class="display text-4xl sm:text-5xl">
          New<br />This Week <sup class="text-accent text-lg font-medium align-super tracking-normal">({{ fresh?.total ?? 0 }})</sup>
        </h2>
        <NuxtLink to="/products?new=true" class="text-sm text-muted hover:text-ink">See All</NuxtLink>
      </div>
      <ProductRail :products="fresh?.products ?? []" :loading="freshStatus === 'pending' && !fresh" />
    </section>

    <!-- Collections -->
    <section class="container py-16">
      <h2 class="display text-4xl sm:text-5xl">Nuxtwear<br />Collections<br />{{ String(year).slice(2) }}–{{ String(year + 1).slice(2) }}</h2>

      <div class="mt-10 flex flex-wrap items-center justify-between gap-4">
        <div class="flex gap-6 text-sm" role="tablist">
          <button
            v-for="t in tabs"
            :key="t.label"
            role="tab"
            :aria-selected="gender === t.value"
            class="transition-colors"
            :class="gender === t.value ? 'font-semibold' : 'text-muted hover:text-ink'"
            @click="gender = t.value"
          >
            <template v-if="gender === t.value">({{ t.label }})</template>
            <template v-else>{{ t.label }}</template>
          </button>
        </div>
        <label class="flex items-center gap-2 text-sm text-muted">
          Sort
          <select v-model="sort" class="bg-transparent text-ink focus:outline-none cursor-pointer">
            <option value="featured">Featured</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
            <option value="rating">Top rated</option>
          </select>
        </label>
      </div>

      <div class="mt-8 grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-10">
        <template v-if="collectionStatus === 'pending' && !collection">
          <ProductCardSkeleton v-for="n in 6" :key="n" />
        </template>
        <ProductCard v-for="p in collection?.products" v-else :key="p.id" :product="p" class="animate-fade-in-up" />
      </div>

      <div class="mt-12 flex justify-center">
        <button
          v-if="collection && collection.total > limit"
          class="flex flex-col items-center gap-2 text-sm text-muted hover:text-ink transition-colors disabled:opacity-50"
          :disabled="collectionStatus === 'pending'"
          @click="limit += 6"
        >
          More
          <Icon :name="collectionStatus === 'pending' ? 'lucide:loader-circle' : 'lucide:chevron-down'" size="18" :class="{ 'animate-spin': collectionStatus === 'pending' }" />
        </button>
        <NuxtLink v-else to="/products" class="btn-outline">View all products</NuxtLink>
      </div>
    </section>

    <!-- Approach -->
    <section class="container py-20">
      <div class="max-w-3xl mx-auto text-center">
        <h2 class="display text-4xl sm:text-5xl">Our Approach<br />to Fashion Design</h2>
        <p class="mt-6 text-sm sm:text-base text-muted leading-relaxed">
          At Nuxtwear we blend creativity with craftsmanship to create pieces that transcend trends and time.
          Each design is meticulously made, keeping the highest quality and a considered, timeless look.
        </p>
      </div>
      <div class="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <div
          v-for="(src, i) in approachImages"
          :key="src"
          class="aspect-[3/4] bg-white border border-line overflow-hidden"
          :class="i % 2 === 1 ? 'md:mt-16' : ''"
        >
          <NuxtImg :src="src" alt="" loading="lazy" sizes="50vw md:25vw" class="w-full h-full object-contain p-6 hover:scale-105 transition-transform duration-700" />
        </div>
      </div>
    </section>

    <!-- Perks -->
    <section class="container">
      <div class="grid sm:grid-cols-3 border border-line divide-y sm:divide-y-0 sm:divide-x divide-line bg-white/40">
        <div v-for="perk in perks" :key="perk.title" class="flex items-center gap-4 p-6">
          <Icon :name="perk.icon" size="24" />
          <div>
            <p class="text-sm font-semibold">{{ perk.title }}</p>
            <p class="text-xs text-muted">{{ perk.text }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
