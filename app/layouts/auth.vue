<script setup lang="ts">
// Editorial image panel for login/register, pulled from the live catalog
const { data } = await useFetch('/api/products', {
  query: { category: 'mens-shirts,womens-dresses', limit: 2 },
  key: 'auth-hero',
  transform: (r) => r.products.map((p) => p.images[0] ?? p.thumbnail),
})
</script>

<template>
  <div class="min-h-screen grid lg:grid-cols-2">
    <div class="flex flex-col px-6 sm:px-12 lg:px-16">
      <header class="flex items-center justify-between h-20">
        <NuxtLink to="/" aria-label="Nuxtwear home" class="flex items-center gap-3 hover:opacity-80">
          <AppLogo :size="32" />
          <span class="display text-lg">Nuxtwear</span>
        </NuxtLink>
        <NuxtLink to="/products" class="text-sm hover:opacity-70 flex items-center gap-2">
          Continue shopping <Icon name="lucide:arrow-right" size="16" />
        </NuxtLink>
      </header>
      <main class="flex-1 flex items-center py-12">
        <div class="w-full max-w-md mx-auto">
          <slot />
        </div>
      </main>
    </div>

    <aside class="hidden lg:flex relative bg-ink text-white overflow-hidden">
      <div class="grid grid-cols-2 gap-px w-full">
        <div v-for="(src, i) in data" :key="src" class="relative bg-tile" :class="i === 1 ? 'mt-32' : 'mb-32'">
          <NuxtImg :src="src" alt="" sizes="25vw" class="absolute inset-0 w-full h-full object-contain p-10" />
        </div>
      </div>
      <div class="absolute left-10 bottom-10 right-10">
        <p class="display text-6xl xl:text-7xl text-white mix-blend-difference">New<br />Collection</p>
        <p class="mt-3 text-sm text-white/80 mix-blend-difference">Fall / Winter {{ new Date().getFullYear() }}</p>
      </div>
    </aside>
    <CartDrawer />
  </div>
</template>
