<script setup lang="ts">
import type { Order } from '~~/types/types'
import { SHIPPING_OPTIONS } from '~~/shared/pricing'

useSeoMeta({ title: 'Order Confirmed', robots: 'noindex' })

const route = useRoute()
const { loggedIn } = useAuth()
const { data, error } = await useFetch<{ order: Order }>(() => `/api/orders/${route.query.order}`, { key: `order-${route.query.order}` })
const order = computed(() => data.value?.order)
</script>

<template>
  <div class="container pt-10 max-w-3xl">
    <div v-if="error || !order" class="py-24 text-center">
      <p class="display text-3xl">Order not found</p>
      <NuxtLink to="/products" class="btn-primary mt-6">Continue shopping</NuxtLink>
    </div>

    <template v-else>
      <div class="text-center">
        <div class="mx-auto grid place-items-center w-16 h-16 rounded-full bg-ink text-white">
          <Icon name="lucide:check" size="28" />
        </div>
        <h1 class="display text-4xl sm:text-5xl mt-6">Thank You</h1>
        <p class="mt-3 text-muted">Your order <strong class="text-ink">{{ order.id }}</strong> is confirmed.<br />A confirmation was sent to {{ order.contact.email }}.</p>
      </div>

      <div class="mt-12 border border-line bg-white/50">
        <ul class="divide-y divide-line">
          <li v-for="item in order.items" :key="`${item.productId}-${item.size}`" class="flex gap-4 p-4">
            <div class="shrink-0 w-16 aspect-[4/5] bg-tile border border-line">
              <NuxtImg :src="item.thumbnail" :alt="item.title" width="64" height="80" class="w-full h-full object-contain p-1" />
            </div>
            <div class="flex-1 text-sm">
              <NuxtLink :to="`/products/${item.productId}`" class="font-medium hover:underline">{{ item.title }}</NuxtLink>
              <p class="text-xs text-muted">Size {{ item.size }} · Qty {{ item.quantity }}</p>
            </div>
            <p class="text-sm">{{ formatPrice(item.lineTotal) }}</p>
          </li>
        </ul>
        <dl class="border-t border-line p-4 space-y-2 text-sm">
          <div class="flex justify-between"><dt>Subtotal</dt><dd>{{ formatPrice(order.subtotal) }}</dd></div>
          <div class="flex justify-between"><dt>Shipping ({{ SHIPPING_OPTIONS[order.shippingMethod].label }})</dt><dd>{{ order.shipping === 0 ? 'Free' : formatPrice(order.shipping) }}</dd></div>
          <div class="flex justify-between font-semibold pt-2 border-t border-line"><dt>Total</dt><dd>{{ formatPrice(order.total) }}</dd></div>
        </dl>
        <div class="border-t border-line p-4 grid sm:grid-cols-2 gap-4 text-sm">
          <div>
            <p class="eyebrow mb-1">Shipping to</p>
            <p>{{ order.shippingAddress.firstName }} {{ order.shippingAddress.lastName }}<br />{{ order.shippingAddress.address }}<br />{{ order.shippingAddress.city }}, {{ order.shippingAddress.region }} {{ order.shippingAddress.postalCode }}<br />{{ order.shippingAddress.country }}</p>
          </div>
          <div>
            <p class="eyebrow mb-1">Delivery</p>
            <p>{{ SHIPPING_OPTIONS[order.shippingMethod].eta }}</p>
            <p class="eyebrow mt-3 mb-1">Payment</p>
            <p>{{ order.paymentMethod === 'cod' ? 'Cash on delivery' : 'Card on delivery' }}</p>
          </div>
        </div>
      </div>

      <div class="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
        <NuxtLink to="/products" class="btn-primary">Continue shopping</NuxtLink>
        <NuxtLink v-if="loggedIn" to="/account" class="btn-outline">View my orders</NuxtLink>
        <NuxtLink v-else to="/register" class="btn-outline">Create an account</NuxtLink>
      </div>
    </template>
  </div>
</template>
