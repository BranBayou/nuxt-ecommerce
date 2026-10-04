<script setup lang="ts">
import { FREE_SHIPPING_THRESHOLD } from '~~/shared/pricing'

const { items, isOpen, count, subtotal, setQuantity, remove } = useCart()
const route = useRoute()
watch(() => route.fullPath, () => (isOpen.value = false))

const toFreeShipping = computed(() => Math.max(FREE_SHIPPING_THRESHOLD - subtotal.value, 0))

const onKeydown = (e: KeyboardEvent) => e.key === 'Escape' && (isOpen.value = false)
onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <Teleport to="body">
    <Transition enter-from-class="opacity-0" leave-to-class="opacity-0" enter-active-class="transition-opacity duration-300" leave-active-class="transition-opacity duration-200">
      <div v-if="isOpen" class="fixed inset-0 z-50 bg-black/40" @click="isOpen = false" />
    </Transition>
    <Transition enter-from-class="translate-x-full" leave-to-class="translate-x-full" enter-active-class="transition-transform duration-300 ease-out" leave-active-class="transition-transform duration-200 ease-in">
      <aside v-if="isOpen" class="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-paper flex flex-col" aria-label="Shopping bag" role="dialog">
        <div class="flex items-center justify-between h-20 px-6 border-b border-line">
          <h2 class="display text-2xl">Bag <span class="text-muted font-normal">({{ count }})</span></h2>
          <button class="p-2 -mr-2 hover:opacity-70" aria-label="Close bag" @click="isOpen = false">
            <Icon name="lucide:x" size="22" />
          </button>
        </div>

        <div v-if="items.length" class="px-6 py-3 text-xs bg-white/50 border-b border-line">
          <template v-if="toFreeShipping > 0">
            Add <strong>{{ formatPrice(toFreeShipping) }}</strong> more for free standard shipping
          </template>
          <template v-else>You've unlocked <strong>free standard shipping</strong></template>
          <div class="mt-2 h-1 bg-field">
            <div class="h-full bg-ink transition-all duration-500" :style="{ width: `${Math.min(subtotal / FREE_SHIPPING_THRESHOLD, 1) * 100}%` }" />
          </div>
        </div>

        <div v-if="!items.length" class="flex-1 flex flex-col items-center justify-center gap-4 px-6 text-center">
          <Icon name="lucide:shopping-bag" size="40" class="text-muted" />
          <p class="text-muted">Your bag is empty.</p>
          <NuxtLink to="/products" class="btn-primary">Start shopping</NuxtLink>
        </div>

        <ul v-else class="flex-1 overflow-y-auto divide-y divide-line px-6">
          <li v-for="item in items" :key="`${item.productId}-${item.size}`" class="flex gap-4 py-5">
            <NuxtLink :to="`/products/${item.productId}`" class="shrink-0 w-24 aspect-[4/5] bg-tile border border-line">
              <NuxtImg :src="item.thumbnail" :alt="item.title" width="96" height="120" class="w-full h-full object-contain" />
            </NuxtLink>
            <div class="flex-1 min-w-0 flex flex-col">
              <p class="eyebrow">{{ item.categoryLabel }}</p>
              <NuxtLink :to="`/products/${item.productId}`" class="text-sm font-medium truncate hover:underline">{{ item.title }}</NuxtLink>
              <p class="text-xs text-muted mt-1">Size: {{ item.size }}</p>
              <div class="mt-auto flex items-center justify-between pt-3">
                <QuantityStepper
                  small
                  :model-value="item.quantity"
                  :max="Math.min(10, item.stock)"
                  @update:model-value="setQuantity(item.productId, item.size, $event)"
                />
                <div class="text-right">
                  <p class="text-sm font-medium">{{ formatPrice(item.price * item.quantity) }}</p>
                  <button class="text-xs text-muted underline hover:text-ink" @click="remove(item.productId, item.size)">Remove</button>
                </div>
              </div>
            </div>
          </li>
        </ul>

        <div v-if="items.length" class="border-t border-line p-6 space-y-4 bg-white/40">
          <div class="flex justify-between text-sm">
            <span>Subtotal</span>
            <span class="font-semibold">{{ formatPrice(subtotal) }}</span>
          </div>
          <p class="text-xs text-muted">Shipping and taxes calculated at checkout.</p>
          <div class="grid grid-cols-2 gap-3">
            <NuxtLink to="/cart" class="btn-ghost">View bag</NuxtLink>
            <NuxtLink to="/checkout" class="btn-primary">Checkout</NuxtLink>
          </div>
        </div>
      </aside>
    </Transition>
  </Teleport>
</template>
