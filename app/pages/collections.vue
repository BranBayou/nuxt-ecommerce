<script setup lang="ts">
useSeoMeta({
  title: 'Collections',
  description: 'Shop by collection — men, women and unisex shirts, dresses, shoes, bags, watches and accessories.',
})

const api = useApi()
const { data: groups, status } = await useAsyncData('categories', () => api.categories())
</script>

<template>
  <div class="container pt-4">
    <Breadcrumb :items="[{ label: 'Collections' }]" />
    <h1 class="display text-4xl sm:text-6xl mt-6">Collections</h1>
    <p class="mt-4 max-w-xl text-sm text-muted">Every category in the store, grouped the way you shop.</p>

    <div v-if="status === 'pending' && !groups" class="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
      <div v-for="n in 8" :key="n" class="aspect-[4/5] shimmer" />
    </div>

    <section v-for="group in groups" v-else :key="group.gender" class="mt-16">
      <div class="flex items-end justify-between mb-6">
        <h2 class="display text-3xl sm:text-4xl">{{ group.label }}</h2>
        <NuxtLink v-if="group.gender !== 'unisex'" :to="`/products?gender=${group.gender}`" class="text-sm text-muted hover:text-ink">Shop all {{ group.label }}</NuxtLink>
      </div>
      <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        <NuxtLink
          v-for="c in group.categories"
          :key="c.slug"
          :to="`/products?category=${c.slug}`"
          class="group relative aspect-[4/5] bg-white border border-line overflow-hidden"
        >
          <NuxtImg :src="c.image" :alt="c.label" sizes="50vw md:33vw xl:25vw" loading="lazy" class="absolute inset-0 w-full h-full object-contain p-8 transition-transform duration-700 group-hover:scale-105" />
          <div class="absolute inset-x-0 bottom-0 p-4 flex items-end justify-between bg-gradient-to-t from-white via-white/80 to-transparent pt-12">
            <div>
              <p class="display text-xl">{{ c.label }}</p>
              <p class="text-xs text-muted">{{ c.count }} products</p>
            </div>
            <span class="grid place-items-center w-9 h-9 rounded-full bg-ink text-white transition-transform group-hover:rotate-45">
              <Icon name="lucide:arrow-up-right" size="16" />
            </span>
          </div>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>
