<script setup lang="ts">
const email = ref('')
const subscribed = ref(false)
const error = ref('')

const columns = [
  {
    title: 'Shop',
    links: [
      { label: 'Men', to: '/products?gender=men' },
      { label: 'Women', to: '/products?gender=women' },
      { label: 'New Arrivals', to: '/products?new=true' },
      { label: 'Sale', to: '/products?sale=true' },
    ],
  },
  {
    title: 'Info',
    links: [
      { label: 'About Us', to: '/about' },
      { label: 'Collections', to: '/collections' },
      { label: 'My Account', to: '/account' },
      { label: 'Wishlist', to: '/wishlist' },
    ],
  },
  {
    title: 'Help',
    links: [
      { label: 'Shipping & Returns', to: '/about#shipping' },
      { label: 'Size Guide', to: '/about#sizes' },
      { label: 'Track Order', to: '/account' },
      { label: 'Contact', to: '/about#contact' },
    ],
  },
]

async function subscribe() {
  error.value = ''
  try {
    await $fetch('/api/newsletter', { method: 'POST', body: { email: email.value } })
    subscribed.value = true
  } catch (err) {
    error.value = errorMessage(err)
  }
}
</script>

<template>
  <footer class="mt-24 border-t border-line">
    <div class="container py-16 grid gap-12 lg:grid-cols-[1.2fr_2fr]">
      <div class="space-y-6 max-w-sm">
        <p class="display text-3xl">Stay in the loop</p>
        <p class="text-sm text-muted">New drops, restocks and members-only offers. No spam — unsubscribe anytime.</p>
        <form v-if="!subscribed" class="flex" @submit.prevent="subscribe">
          <label for="newsletter" class="sr-only">Email address</label>
          <input id="newsletter" v-model="email" type="email" required placeholder="Email address" class="input flex-1" />
          <button class="btn-primary shrink-0" aria-label="Subscribe">
            <Icon name="lucide:arrow-right" size="18" />
          </button>
        </form>
        <p v-if="error" class="text-xs text-sale">{{ error }}</p>
        <p v-else-if="subscribed" class="text-sm flex items-center gap-2"><Icon name="lucide:check" size="16" /> Thanks — you're subscribed.</p>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 gap-8">
        <div v-for="col in columns" :key="col.title">
          <p class="eyebrow mb-4">{{ col.title }}</p>
          <ul class="space-y-2.5 text-sm">
            <li v-for="link in col.links" :key="link.label">
              <NuxtLink :to="link.to" class="hover:opacity-60 transition-opacity">{{ link.label }}</NuxtLink>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Oversized wordmark -->
    <div class="container overflow-hidden">
      <p class="display text-[17vw] lg:text-[14rem] leading-[0.8] text-ink/90 select-none -mb-[0.08em]" aria-hidden="true">Nuxtwear</p>
    </div>

    <div class="border-t border-line">
      <div class="container py-6 flex flex-col sm:flex-row gap-4 items-center justify-between text-xs text-muted">
        <p>&copy; {{ new Date().getFullYear() }} Nuxtwear. All rights reserved.</p>
        <div class="flex items-center gap-5">
          <a href="https://instagram.com" target="_blank" rel="noopener" aria-label="Instagram" class="hover:text-ink"><Icon name="lucide:instagram" size="18" /></a>
          <a href="https://x.com" target="_blank" rel="noopener" aria-label="X" class="hover:text-ink"><Icon name="lucide:twitter" size="18" /></a>
          <a href="https://facebook.com" target="_blank" rel="noopener" aria-label="Facebook" class="hover:text-ink"><Icon name="lucide:facebook" size="18" /></a>
        </div>
      </div>
    </div>
  </footer>
</template>
