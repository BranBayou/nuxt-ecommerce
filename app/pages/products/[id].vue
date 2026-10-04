<script setup lang="ts">
const route = useRoute()
const { data, error } = await useFetch(() => `/api/products/${route.params.id}`, { key: `product-${route.params.id}` })

if (error.value) {
  throw createError({ statusCode: error.value.statusCode ?? 404, statusMessage: error.value.statusMessage ?? 'Product not found', fatal: true })
}

const product = computed(() => data.value!.product)
const related = computed(() => data.value!.related)

useSeoMeta({
  title: () => product.value.title,
  description: () => product.value.description,
  ogTitle: () => product.value.title,
  ogDescription: () => product.value.description,
  ogImage: () => product.value.thumbnail,
  twitterCard: 'summary_large_image',
})

const { add } = useCart()
const { has, toggle } = useWishlist()

const activeImage = ref(0)
const onlySize = computed(() => (product.value.sizes.length === 1 ? product.value.sizes[0]!.label : ''))
const size = ref(onlySize.value)
const quantity = ref(1)
const sizeError = ref(false)
const added = ref(false)
watch(() => route.params.id, () => {
  activeImage.value = 0
  size.value = onlySize.value
  quantity.value = 1
})

function addToBag() {
  if (!size.value) {
    sizeError.value = true
    return
  }
  add(product.value, size.value, quantity.value)
  added.value = true
  setTimeout(() => (added.value = false), 2000)
}

const tab = ref<'details' | 'shipping' | 'reviews'>('details')
const discount = computed(() =>
  product.value.compareAtPrice ? Math.round((1 - product.value.price / product.value.compareAtPrice) * 100) : 0,
)
</script>

<template>
  <div v-if="data" class="container pt-4">
    <Breadcrumb :items="[{ label: 'Products', to: '/products' }, { label: product.categoryLabel, to: `/products?category=${product.category}` }, { label: product.title }]" />

    <div class="mt-8 grid lg:grid-cols-[1fr_minmax(0,26rem)] gap-10 xl:gap-16">
      <!-- Gallery -->
      <div class="grid md:grid-cols-[5rem_1fr] gap-4">
        <div class="order-2 md:order-1 flex md:flex-col gap-3 overflow-x-auto">
          <button
            v-for="(img, i) in product.images"
            :key="img"
            class="shrink-0 w-20 aspect-[4/5] bg-tile border transition-colors"
            :class="i === activeImage ? 'border-ink' : 'border-line hover:border-muted'"
            :aria-label="`View image ${i + 1}`"
            @click="activeImage = i"
          >
            <NuxtImg :src="img" alt="" width="80" height="100" class="w-full h-full object-contain p-1" />
          </button>
        </div>
        <div class="order-1 md:order-2 relative aspect-[4/5] bg-white border border-line overflow-hidden">
          <NuxtImg
            :key="product.images[activeImage]"
            :src="product.images[activeImage] ?? product.thumbnail"
            :alt="product.title"
            sizes="100vw lg:50vw"
            class="absolute inset-0 w-full h-full object-contain p-8 animate-fade-in-up"
          />
          <span v-if="discount" class="absolute left-4 top-4 px-2 py-1 bg-ink text-white text-xs uppercase tracking-label">-{{ discount }}%</span>
        </div>
      </div>

      <!-- Info -->
      <div class="lg:sticky lg:top-24 self-start">
        <div class="border border-line bg-white/50 p-6 sm:p-8">
          <div class="flex items-start justify-between gap-4">
            <div>
              <p class="eyebrow">{{ product.brand }} · {{ product.categoryLabel }}</p>
              <h1 class="mt-2 text-xl font-semibold uppercase leading-tight">{{ product.title }}</h1>
            </div>
            <button
              class="shrink-0 grid place-items-center w-10 h-10 border border-line hover:border-ink"
              :aria-pressed="has(product.id)"
              :aria-label="has(product.id) ? 'Remove from wishlist' : 'Add to wishlist'"
              @click="toggle(product)"
            >
              <Icon name="lucide:heart" mode="svg" size="18" :class="has(product.id) ? 'fill-ink' : ''" />
            </button>
          </div>

          <div class="mt-4 flex items-baseline gap-3">
            <span class="text-2xl font-semibold">{{ formatPrice(product.price) }}</span>
            <span v-if="product.compareAtPrice" class="text-muted line-through">{{ formatPrice(product.compareAtPrice) }}</span>
          </div>
          <p class="text-xs text-muted mt-1">MRP incl. of all taxes</p>

          <div class="mt-3 flex items-center gap-2 text-sm">
            <div class="flex" :aria-label="`Rated ${product.rating} out of 5`">
              <Icon v-for="n in 5" :key="n" name="lucide:star" mode="svg" size="14" :class="n <= Math.round(product.rating) ? 'fill-ink' : 'text-line'" />
            </div>
            <button class="text-muted underline hover:text-ink" @click="tab = 'reviews'">{{ product.reviews.length }} reviews</button>
          </div>

          <p class="mt-6 text-sm leading-relaxed text-muted">{{ product.description }}</p>

          <!-- Sizes -->
          <div class="mt-8">
            <div class="flex items-center justify-between">
              <p class="text-sm font-medium">Size</p>
              <NuxtLink to="/about#sizes" class="text-xs text-muted underline hover:text-ink flex items-center gap-1">
                <Icon name="lucide:ruler" size="14" /> Size guide
              </NuxtLink>
            </div>
            <div class="mt-3 grid grid-cols-6 gap-1.5" :class="{ 'grid-cols-1': product.sizes.length === 1 }" role="radiogroup" aria-label="Choose a size">
              <button
                v-for="s in product.sizes"
                :key="s.label"
                role="radio"
                :aria-checked="size === s.label"
                :disabled="!s.available"
                class="chip !min-w-0 relative disabled:opacity-40 disabled:cursor-not-allowed disabled:line-through"
                :class="{ 'chip-active': size === s.label }"
                @click="size = s.label; sizeError = false"
              >
                {{ s.label }}
              </button>
            </div>
            <p v-if="sizeError" class="mt-2 text-xs text-sale">Please choose a size.</p>
          </div>

          <!-- Add -->
          <div class="mt-6 flex gap-3">
            <QuantityStepper v-model="quantity" :max="Math.max(1, Math.min(10, product.stock))" />
            <button class="btn-primary flex-1" :disabled="!product.inStock" @click="addToBag">
              <template v-if="!product.inStock">Sold out</template>
              <template v-else-if="added"><Icon name="lucide:check" size="18" /> Added to bag</template>
              <template v-else>Add to bag</template>
            </button>
          </div>
          <p v-if="product.inStock && product.stock < 10" class="mt-3 text-xs text-sale">Only {{ product.stock }} left in stock</p>

          <ul class="mt-6 pt-6 border-t border-line space-y-2 text-xs text-muted">
            <li class="flex items-center gap-2"><Icon name="lucide:truck" size="14" /> {{ product.shippingInformation }}</li>
            <li class="flex items-center gap-2"><Icon name="lucide:refresh-ccw" size="14" /> {{ product.returnPolicy }}</li>
            <li class="flex items-center gap-2"><Icon name="lucide:shield-check" size="14" /> {{ product.warrantyInformation }}</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <section class="mt-16 max-w-4xl">
      <div class="flex gap-8 border-b border-line text-sm" role="tablist">
        <button
          v-for="t in (['details', 'shipping', 'reviews'] as const)"
          :key="t"
          role="tab"
          :aria-selected="tab === t"
          class="pb-3 -mb-px capitalize border-b-2 transition-colors"
          :class="tab === t ? 'border-ink font-medium' : 'border-transparent text-muted hover:text-ink'"
          @click="tab = t"
        >
          {{ t }} <template v-if="t === 'reviews'">({{ product.reviews.length }})</template>
        </button>
      </div>

      <div class="py-8 text-sm leading-relaxed">
        <dl v-if="tab === 'details'" class="grid sm:grid-cols-2 gap-x-10 gap-y-3">
          <div class="flex justify-between border-b border-line pb-2"><dt class="text-muted">Brand</dt><dd>{{ product.brand }}</dd></div>
          <div class="flex justify-between border-b border-line pb-2"><dt class="text-muted">Category</dt><dd>{{ product.categoryLabel }}</dd></div>
          <div class="flex justify-between border-b border-line pb-2"><dt class="text-muted">SKU</dt><dd>{{ product.sku }}</dd></div>
          <div class="flex justify-between border-b border-line pb-2"><dt class="text-muted">Tags</dt><dd class="capitalize">{{ product.tags.join(', ') }}</dd></div>
        </dl>

        <div v-else-if="tab === 'shipping'" class="space-y-3 text-muted">
          <p><strong class="text-ink">Standard:</strong> 3–5 business days, free on orders over $150 (otherwise $9.99).</p>
          <p><strong class="text-ink">Express:</strong> 1–2 business days for $19.99.</p>
          <p><strong class="text-ink">Returns:</strong> {{ product.returnPolicy }}. Items must be unworn with tags attached.</p>
        </div>

        <ul v-else class="divide-y divide-line">
          <li v-for="(r, i) in product.reviews" :key="i" class="py-4 first:pt-0">
            <div class="flex items-center justify-between">
              <p class="font-medium">{{ r.reviewerName }}</p>
              <p class="text-xs text-muted">{{ formatDate(r.date) }}</p>
            </div>
            <div class="flex mt-1">
              <Icon v-for="n in 5" :key="n" name="lucide:star" mode="svg" size="12" :class="n <= r.rating ? 'fill-ink' : 'text-line'" />
            </div>
            <p class="mt-2 text-muted">{{ r.comment }}</p>
          </li>
        </ul>
      </div>
    </section>

    <!-- Related -->
    <section v-if="related.length" class="mt-8">
      <div class="flex items-end justify-between mb-8">
        <h2 class="display text-3xl sm:text-4xl">You May<br />Also Like</h2>
        <NuxtLink :to="`/products?category=${product.category}`" class="text-sm text-muted hover:text-ink">See All</NuxtLink>
      </div>
      <ProductRail :products="related" />
    </section>
  </div>
</template>
