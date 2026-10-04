<script setup lang="ts">
import type { Order, PaymentMethod, ShippingMethod } from '~~/types/types'
import { SHIPPING_OPTIONS, shippingCost } from '~~/shared/pricing'

useSeoMeta({ title: 'Checkout', robots: 'noindex' })

const { items, subtotal, clear } = useCart()
const { user } = useAuth()

const steps = ['Information', 'Shipping', 'Payment'] as const
const step = ref(0)

const form = reactive({
  email: user.value?.email ?? '',
  phone: '',
  firstName: user.value?.firstName ?? '',
  lastName: user.value?.lastName ?? '',
  country: 'United States',
  region: '',
  address: '',
  city: '',
  postalCode: '',
  shippingMethod: 'standard' as ShippingMethod,
  paymentMethod: 'card' as PaymentMethod,
})

const shipping = computed(() => shippingCost(form.shippingMethod, subtotal.value))
const total = computed(() => subtotal.value + shipping.value)

const submitting = ref(false)
const error = ref('')

function next() {
  error.value = ''
  step.value = Math.min(step.value + 1, steps.length - 1)
  if (import.meta.client) window.scrollTo({ top: 0, behavior: 'smooth' })
}

async function placeOrder() {
  submitting.value = true
  error.value = ''
  try {
    const { order } = await $fetch<{ order: Order }>('/api/orders', {
      method: 'POST',
      body: {
        items: items.value.map(({ productId, size, quantity }) => ({ productId, size, quantity })),
        contact: { email: form.email, phone: form.phone },
        shippingAddress: {
          firstName: form.firstName,
          lastName: form.lastName,
          country: form.country,
          region: form.region,
          address: form.address,
          city: form.city,
          postalCode: form.postalCode,
        },
        shippingMethod: form.shippingMethod,
        paymentMethod: form.paymentMethod,
      },
    })
    clear()
    await navigateTo({ path: '/checkout/success', query: { order: order.id } })
  } catch (err) {
    error.value = errorMessage(err)
  } finally {
    submitting.value = false
  }
}

const countries = ['United States', 'Canada', 'United Kingdom', 'Germany', 'France', 'Netherlands', 'Australia', 'Ethiopia', 'Kenya', 'Japan']
</script>

<template>
  <div class="container pt-4">
    <Breadcrumb :items="[{ label: 'Bag', to: '/cart' }, { label: 'Checkout' }]" />
    <h1 class="display text-4xl sm:text-5xl mt-6">Checkout</h1>

    <ClientOnly>
      <div v-if="!items.length" class="py-24 text-center">
        <p class="display text-2xl">Your bag is empty</p>
        <NuxtLink to="/products" class="btn-primary mt-6">Continue shopping</NuxtLink>
      </div>

      <div v-else class="mt-8 grid lg:grid-cols-[1fr_24rem] gap-10 items-start">
        <div>
          <!-- Steps -->
          <ol class="flex items-center gap-3 text-sm mb-10">
            <li v-for="(s, i) in steps" :key="s" class="flex items-center gap-3">
              <button
                class="transition-colors"
                :class="i === step ? 'font-semibold' : i < step ? 'text-ink underline' : 'text-muted'"
                :disabled="i > step"
                @click="step = i"
              >
                {{ s }}
              </button>
              <Icon v-if="i < steps.length - 1" name="lucide:chevron-right" size="14" class="text-muted" />
            </li>
          </ol>

          <!-- Information -->
          <form v-if="step === 0" class="space-y-10" @submit.prevent="next">
            <fieldset class="space-y-4">
              <legend class="font-semibold uppercase tracking-label text-sm mb-4">Contact Info</legend>
              <div class="grid sm:grid-cols-2 gap-4">
                <div>
                  <label for="email" class="label">Email</label>
                  <input id="email" v-model="form.email" type="email" required autocomplete="email" class="input" />
                </div>
                <div>
                  <label for="phone" class="label">Phone</label>
                  <input id="phone" v-model="form.phone" type="tel" required minlength="6" autocomplete="tel" class="input" />
                </div>
              </div>
              <p v-if="!user" class="text-xs text-muted">
                Have an account? <NuxtLink to="/login?redirect=/checkout" class="underline text-ink">Sign in</NuxtLink> to track this order.
              </p>
            </fieldset>

            <fieldset class="space-y-4">
              <legend class="font-semibold uppercase tracking-label text-sm mb-4">Shipping Address</legend>
              <div class="grid sm:grid-cols-2 gap-4">
                <div>
                  <label for="firstName" class="label">First name</label>
                  <input id="firstName" v-model="form.firstName" required autocomplete="given-name" class="input" />
                </div>
                <div>
                  <label for="lastName" class="label">Last name</label>
                  <input id="lastName" v-model="form.lastName" required autocomplete="family-name" class="input" />
                </div>
                <div>
                  <label for="country" class="label">Country</label>
                  <select id="country" v-model="form.country" required autocomplete="country-name" class="input">
                    <option v-for="c in countries" :key="c">{{ c }}</option>
                  </select>
                </div>
                <div>
                  <label for="region" class="label">State / Region</label>
                  <input id="region" v-model="form.region" required autocomplete="address-level1" class="input" />
                </div>
                <div class="sm:col-span-2">
                  <label for="address" class="label">Address</label>
                  <input id="address" v-model="form.address" required autocomplete="street-address" class="input" />
                </div>
                <div>
                  <label for="city" class="label">City</label>
                  <input id="city" v-model="form.city" required autocomplete="address-level2" class="input" />
                </div>
                <div>
                  <label for="postalCode" class="label">Postal code</label>
                  <input id="postalCode" v-model="form.postalCode" required autocomplete="postal-code" class="input" />
                </div>
              </div>
            </fieldset>

            <button class="btn-primary w-full sm:w-auto sm:min-w-[16rem] justify-between">
              Shipping <Icon name="lucide:arrow-right" size="18" />
            </button>
          </form>

          <!-- Shipping -->
          <form v-else-if="step === 1" class="space-y-6" @submit.prevent="next">
            <div class="border border-line bg-white/50 divide-y divide-line text-sm">
              <div class="flex justify-between gap-4 p-4">
                <span class="text-muted">Contact</span>
                <span class="text-right">{{ form.email }} · {{ form.phone }}</span>
              </div>
              <div class="flex justify-between gap-4 p-4">
                <span class="text-muted">Ship to</span>
                <span class="text-right">{{ form.address }}, {{ form.city }}, {{ form.region }} {{ form.postalCode }}, {{ form.country }}</span>
              </div>
            </div>
            <fieldset class="space-y-3">
              <legend class="font-semibold uppercase tracking-label text-sm mb-4">Shipping Method</legend>
              <label
                v-for="(opt, key) in SHIPPING_OPTIONS"
                :key="key"
                class="flex items-center gap-4 p-4 border cursor-pointer transition-colors"
                :class="form.shippingMethod === key ? 'border-ink bg-white' : 'border-line bg-white/50 hover:border-muted'"
              >
                <input v-model="form.shippingMethod" type="radio" name="shipping" :value="key" class="w-4 h-4 accent-black" />
                <span class="flex-1">
                  <span class="block text-sm font-medium">{{ opt.label }}</span>
                  <span class="block text-xs text-muted">{{ opt.eta }}</span>
                </span>
                <span class="text-sm font-medium">{{ shippingCost(key, subtotal) === 0 ? 'Free' : formatPrice(shippingCost(key, subtotal)) }}</span>
              </label>
            </fieldset>
            <button class="btn-primary w-full sm:w-auto sm:min-w-[16rem] justify-between">
              Payment <Icon name="lucide:arrow-right" size="18" />
            </button>
          </form>

          <!-- Payment -->
          <form v-else class="space-y-6" @submit.prevent="placeOrder">
            <fieldset class="space-y-3">
              <legend class="font-semibold uppercase tracking-label text-sm mb-4">Payment Method</legend>
              <label
                v-for="opt in [
                  { value: 'card', label: 'Pay by card on delivery', hint: 'Demo store — no card details are collected', icon: 'lucide:credit-card' },
                  { value: 'cod', label: 'Cash on delivery', hint: 'Pay in cash when your order arrives', icon: 'lucide:banknote' },
                ]"
                :key="opt.value"
                class="flex items-center gap-4 p-4 border cursor-pointer transition-colors"
                :class="form.paymentMethod === opt.value ? 'border-ink bg-white' : 'border-line bg-white/50 hover:border-muted'"
              >
                <input v-model="form.paymentMethod" type="radio" name="payment" :value="opt.value" class="w-4 h-4 accent-black" />
                <Icon :name="opt.icon" size="20" />
                <span class="flex-1">
                  <span class="block text-sm font-medium">{{ opt.label }}</span>
                  <span class="block text-xs text-muted">{{ opt.hint }}</span>
                </span>
              </label>
            </fieldset>

            <p v-if="error" class="p-4 border border-sale/40 bg-sale/5 text-sm text-sale" role="alert">{{ error }}</p>

            <button class="btn-primary w-full sm:w-auto sm:min-w-[16rem] justify-between" :disabled="submitting">
              <template v-if="submitting">Placing order…</template>
              <template v-else>Place order · {{ formatPrice(total) }}</template>
              <Icon :name="submitting ? 'lucide:loader-circle' : 'lucide:arrow-right'" size="18" :class="{ 'animate-spin': submitting }" />
            </button>
          </form>
        </div>

        <!-- Summary -->
        <aside class="border border-line bg-white/50 p-6 lg:sticky lg:top-24">
          <h2 class="font-semibold uppercase tracking-label text-sm mb-4">Your Order</h2>
          <ul class="divide-y divide-line max-h-80 overflow-y-auto -mx-1 px-1">
            <li v-for="item in items" :key="`${item.productId}-${item.size}`" class="flex gap-3 py-3">
              <div class="relative shrink-0 w-16 aspect-[4/5] bg-tile border border-line">
                <NuxtImg :src="item.thumbnail" :alt="item.title" width="64" height="80" class="w-full h-full object-contain p-1" />
                <span class="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-ink text-white text-[10px] grid place-items-center">{{ item.quantity }}</span>
              </div>
              <div class="flex-1 min-w-0 text-sm">
                <p class="truncate">{{ item.title }}</p>
                <p class="text-xs text-muted">Size {{ item.size }}</p>
              </div>
              <p class="text-sm">{{ formatPrice(item.price * item.quantity) }}</p>
            </li>
          </ul>
          <dl class="mt-4 pt-4 border-t border-line space-y-2 text-sm">
            <div class="flex justify-between"><dt>Subtotal</dt><dd>{{ formatPrice(subtotal) }}</dd></div>
            <div class="flex justify-between"><dt>Shipping</dt><dd>{{ shipping === 0 ? 'Free' : formatPrice(shipping) }}</dd></div>
          </dl>
          <div class="mt-4 pt-4 border-t border-line flex justify-between font-semibold">
            <span>Total</span><span>{{ formatPrice(total) }}</span>
          </div>
        </aside>
      </div>

      <template #fallback>
        <div class="mt-10 h-96 shimmer" />
      </template>
    </ClientOnly>
  </div>
</template>
