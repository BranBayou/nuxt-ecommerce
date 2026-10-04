<script setup lang="ts">
import { FREE_SHIPPING_THRESHOLD, shippingCost } from '~~/shared/pricing'

useSeoMeta({ title: 'Shopping Bag' })

const { items, count, subtotal, setQuantity, remove } = useCart()
const { toggle: toggleWishlist, has } = useWishlist()

const shipping = computed(() => shippingCost('standard', subtotal.value))
const agreed = ref(false)

const api = useApi()
const { data: suggestions } = await useAsyncData('cart-suggestions', () => api.products({ sort: 'rating', limit: 8 }), {
  transform: (r) => r.products,
})

async function saveForLater(productId: number, size: string) {
  if (!has(productId)) {
    const { product } = await api.product(productId)
    toggleWishlist(product)
  }
  remove(productId, size)
}
</script>

<template>
  <div class="container pt-4">
    <Breadcrumb :items="[{ label: 'Shopping Bag' }]" />
    <h1 class="display text-4xl sm:text-5xl mt-6">Shopping Bag <sup class="text-accent text-lg font-medium tracking-normal">({{ count }})</sup></h1>

    <ClientOnly>
      <div v-if="!items.length" class="py-24 text-center">
        <Icon name="lucide:shopping-bag" size="44" class="text-muted" />
        <p class="display text-2xl mt-4">Your bag is empty</p>
        <p class="mt-2 text-sm text-muted">Looks like you haven't added anything yet.</p>
        <NuxtLink to="/products" class="btn-primary mt-6">Start shopping</NuxtLink>
      </div>

      <div v-else class="mt-10 grid lg:grid-cols-[1fr_24rem] gap-10 items-start">
        <ul class="divide-y divide-line border-y border-line">
          <li v-for="item in items" :key="`${item.productId}-${item.size}`" class="grid grid-cols-[6rem_1fr] sm:grid-cols-[8rem_1fr] gap-5 py-6">
            <NuxtLink :to="`/products/${item.productId}`" class="aspect-[4/5] bg-tile border border-line">
              <NuxtImg :src="item.thumbnail" :alt="item.title" width="128" height="160" class="w-full h-full object-contain p-2" />
            </NuxtLink>
            <div class="flex flex-col sm:flex-row sm:items-start gap-4 justify-between">
              <div>
                <p class="eyebrow">{{ item.categoryLabel }}</p>
                <NuxtLink :to="`/products/${item.productId}`" class="font-medium hover:underline">{{ item.title }}</NuxtLink>
                <p class="text-sm text-muted mt-1">Size: {{ item.size }} · {{ formatPrice(item.price) }}</p>
                <div class="mt-4 flex gap-4 text-xs">
                  <button class="text-muted underline hover:text-ink" @click="saveForLater(item.productId, item.size)">Save for later</button>
                  <button class="text-muted underline hover:text-ink" @click="remove(item.productId, item.size)">Remove</button>
                </div>
              </div>
              <div class="flex sm:flex-col items-center sm:items-end justify-between gap-4">
                <QuantityStepper :model-value="item.quantity" :max="Math.min(10, item.stock)" @update:model-value="setQuantity(item.productId, item.size, $event)" />
                <p class="font-semibold">{{ formatPrice(item.price * item.quantity) }}</p>
              </div>
            </div>
          </li>
        </ul>

        <aside class="border border-line bg-white/50 p-6 space-y-4 lg:sticky lg:top-24">
          <h2 class="font-semibold uppercase tracking-label text-sm">Order Summary</h2>
          <dl class="space-y-3 text-sm">
            <div class="flex justify-between"><dt>Subtotal</dt><dd>{{ formatPrice(subtotal) }}</dd></div>
            <div class="flex justify-between">
              <dt>Shipping</dt>
              <dd>{{ shipping === 0 ? 'Free' : formatPrice(shipping) }}</dd>
            </div>
            <p v-if="shipping > 0" class="text-xs text-muted">
              Add {{ formatPrice(FREE_SHIPPING_THRESHOLD - subtotal) }} more for free standard shipping.
            </p>
          </dl>
          <div class="flex justify-between border-t border-line pt-4 font-semibold">
            <span>Total <span class="text-xs font-normal text-muted">(incl. taxes)</span></span>
            <span>{{ formatPrice(subtotal + shipping) }}</span>
          </div>
          <label class="flex items-start gap-3 text-xs text-muted cursor-pointer">
            <input v-model="agreed" type="checkbox" class="mt-0.5 w-4 h-4 accent-black" />
            I agree to the Terms and Conditions and the Returns Policy.
          </label>
          <NuxtLink
            to="/checkout"
            class="btn-primary w-full"
            :class="{ 'pointer-events-none opacity-50': !agreed }"
            :aria-disabled="!agreed"
            :tabindex="agreed ? 0 : -1"
          >
            Continue to checkout
          </NuxtLink>
          <div class="flex items-center justify-center gap-2 text-xs text-muted">
            <Icon name="lucide:lock" size="12" /> Secure checkout
          </div>
        </aside>
      </div>

      <template #fallback>
        <div class="mt-10 h-64 shimmer" />
      </template>
    </ClientOnly>

    <section v-if="suggestions?.length" class="mt-24">
      <h2 class="display text-3xl sm:text-4xl mb-8">Top Rated<br />Picks</h2>
      <ProductRail :products="suggestions" />
    </section>
  </div>
</template>
