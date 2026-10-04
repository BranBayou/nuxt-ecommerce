<script setup lang="ts">

definePageMeta({ middleware: 'auth' })
useSeoMeta({ title: 'My Account', robots: 'noindex' })

const { user, logout } = useAuth()
const { items: wishlist } = useWishlist()
const api = useApi()
const { data, status } = await useAsyncData('my-orders', () => api.orders())

const orders = computed(() => data.value?.orders ?? [])
const totalSpent = computed(() => orders.value.reduce((s, o) => s + o.total, 0))
const expanded = ref<string | null>(null)
</script>

<template>
  <div v-if="user" class="container pt-4">
    <Breadcrumb :items="[{ label: 'My Account' }]" />

    <div class="mt-6 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
      <div class="flex items-center gap-5">
        <div class="w-20 h-20 rounded-full bg-ink text-white grid place-items-center overflow-hidden shrink-0">
          <img v-if="user.image" :src="user.image" alt="" class="w-full h-full object-cover bg-white" />
          <span v-else class="display text-2xl">{{ user.firstName[0] }}{{ user.lastName[0] }}</span>
        </div>
        <div>
          <p class="eyebrow">Welcome back</p>
          <h1 class="display text-4xl sm:text-5xl">{{ user.firstName }}</h1>
        </div>
      </div>
      <button class="btn-outline self-start sm:self-auto" @click="logout">
        <Icon name="lucide:log-out" size="16" /> Sign out
      </button>
    </div>

    <div class="mt-10 grid sm:grid-cols-3 gap-px bg-line border border-line">
      <div class="bg-paper p-6">
        <p class="eyebrow">Orders</p>
        <p class="display text-4xl mt-2">{{ orders.length }}</p>
      </div>
      <div class="bg-paper p-6">
        <p class="eyebrow">Total spent</p>
        <p class="display text-4xl mt-2">{{ formatPrice(totalSpent) }}</p>
      </div>
      <NuxtLink to="/wishlist" class="bg-paper p-6 hover:bg-white/60 transition-colors">
        <p class="eyebrow">Wishlist</p>
        <p class="display text-4xl mt-2">{{ wishlist.length }}</p>
      </NuxtLink>
    </div>

    <div class="mt-14 grid lg:grid-cols-[1fr_20rem] gap-10 items-start">
      <section>
        <h2 class="font-semibold uppercase tracking-label text-sm mb-4">Order History</h2>

        <div v-if="status === 'pending' && !data" class="h-40 shimmer" />

        <div v-else-if="!orders.length" class="border border-dashed border-line p-10 text-center">
          <Icon name="lucide:package" size="32" class="text-muted" />
          <p class="mt-3 text-sm text-muted">You haven't placed any orders yet.</p>
          <NuxtLink to="/products" class="btn-primary mt-6">Start shopping</NuxtLink>
        </div>

        <ul v-else class="border border-line divide-y divide-line bg-white/40">
          <li v-for="order in orders" :key="order.id">
            <button class="w-full grid grid-cols-2 sm:grid-cols-[1fr_auto_auto_auto] gap-x-8 gap-y-1 items-center p-5 text-left text-sm hover:bg-white/60 transition-colors" :aria-expanded="expanded === order.id" @click="expanded = expanded === order.id ? null : order.id">
              <span class="font-medium">{{ order.id }}</span>
              <span class="text-muted text-right sm:text-left">{{ formatDate(order.createdAt) }}</span>
              <span class="inline-flex items-center gap-1.5 text-xs uppercase tracking-label">
                <span class="w-1.5 h-1.5 rounded-full bg-green-600" /> {{ order.status }}
              </span>
              <span class="font-semibold text-right flex items-center justify-end gap-2">
                {{ formatPrice(order.total) }}
                <Icon :name="expanded === order.id ? 'lucide:chevron-up' : 'lucide:chevron-down'" size="16" />
              </span>
            </button>
            <div v-if="expanded === order.id" class="px-5 pb-5">
              <ul class="grid sm:grid-cols-2 gap-3">
                <li v-for="item in order.items" :key="`${item.productId}-${item.size}`" class="flex gap-3 items-center">
                  <div class="shrink-0 w-14 aspect-[4/5] bg-tile border border-line">
                    <NuxtImg :src="item.thumbnail" :alt="item.title" width="56" height="70" class="w-full h-full object-contain p-1" />
                  </div>
                  <div class="text-sm min-w-0">
                    <NuxtLink :to="`/products/${item.productId}`" class="block truncate hover:underline">{{ item.title }}</NuxtLink>
                    <p class="text-xs text-muted">Size {{ item.size }} · Qty {{ item.quantity }} · {{ formatPrice(item.lineTotal) }}</p>
                  </div>
                </li>
              </ul>
              <p class="mt-4 text-xs text-muted">
                Ship to {{ order.shippingAddress.address }}, {{ order.shippingAddress.city }}, {{ order.shippingAddress.country }}
              </p>
            </div>
          </li>
        </ul>
      </section>

      <aside class="border border-line bg-white/50 p-6 text-sm space-y-4">
        <h2 class="font-semibold uppercase tracking-label">Profile</h2>
        <dl class="space-y-3">
          <div><dt class="eyebrow">Name</dt><dd>{{ user.firstName }} {{ user.lastName }}</dd></div>
          <div><dt class="eyebrow">Email</dt><dd class="break-all">{{ user.email }}</dd></div>
          <div v-if="user.username"><dt class="eyebrow">Username</dt><dd>{{ user.username }}</dd></div>
          <div>
            <dt class="eyebrow">Account type</dt>
            <dd>{{ user.provider === 'dummyjson' ? 'DummyJSON demo account' : 'Nuxtwear member' }}</dd>
          </div>
        </dl>
      </aside>
    </div>
  </div>
</template>
