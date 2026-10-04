<script setup lang="ts">
useSeoMeta({ title: 'Wishlist' })

const { items } = useWishlist()
</script>

<template>
  <div class="container pt-4">
    <Breadcrumb :items="[{ label: 'Wishlist' }]" />
    <h1 class="display text-4xl sm:text-5xl mt-6">Wishlist <sup class="text-accent text-lg font-medium tracking-normal">({{ items.length }})</sup></h1>

    <ClientOnly>
      <div v-if="!items.length" class="py-24 text-center">
        <Icon name="lucide:heart" size="44" class="text-muted" />
        <p class="display text-2xl mt-4">Nothing saved yet</p>
        <p class="mt-2 text-sm text-muted">Tap the heart on any product to save it here.</p>
        <NuxtLink to="/products" class="btn-primary mt-6">Browse products</NuxtLink>
      </div>
      <div v-else class="mt-10 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
        <ProductCard v-for="p in items" :key="p.id" :product="p" />
      </div>
      <template #fallback>
        <div class="mt-10 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          <ProductCardSkeleton v-for="n in 4" :key="n" />
        </div>
      </template>
    </ClientOnly>
  </div>
</template>
