<script setup lang="ts">
import type { ProductSummary } from '~~/types/types'

const props = defineProps<{ product: ProductSummary }>()
const { has, toggle } = useWishlist()
const saved = computed(() => has(props.product.id))
const hoverImage = computed(() => props.product.images[1] ?? null)
</script>

<template>
  <article class="group">
    <div class="relative aspect-[4/5] bg-tile border border-line overflow-hidden">
      <NuxtLink :to="`/products/${product.id}`" class="block w-full h-full" :aria-label="product.title">
        <NuxtImg
          :src="product.thumbnail"
          :alt="product.title"
          sizes="50vw md:33vw xl:25vw"
          loading="lazy"
          class="absolute inset-0 w-full h-full object-contain p-4 transition-all duration-500 group-hover:scale-105"
          :class="hoverImage ? 'group-hover:opacity-0' : ''"
        />
        <NuxtImg
          v-if="hoverImage"
          :src="hoverImage"
          alt=""
          sizes="50vw md:33vw xl:25vw"
          loading="lazy"
          class="absolute inset-0 w-full h-full object-contain p-4 opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:scale-105"
        />
      </NuxtLink>

      <span v-if="!product.inStock" class="absolute left-3 top-3 px-2 py-1 bg-white text-[10px] uppercase tracking-label">Sold out</span>
      <span v-else-if="product.compareAtPrice" class="absolute left-3 top-3 px-2 py-1 bg-ink text-white text-[10px] uppercase tracking-label">
        -{{ Math.round((1 - product.price / product.compareAtPrice) * 100) }}%
      </span>

      <button
        type="button"
        class="absolute right-3 top-3 grid place-items-center w-9 h-9 rounded-full bg-white/90 hover:bg-white transition-all"
        :class="saved ? 'opacity-100' : 'opacity-100 md:opacity-0 md:group-hover:opacity-100'"
        :aria-pressed="saved"
        :aria-label="saved ? 'Remove from wishlist' : 'Add to wishlist'"
        @click="toggle(product)"
      >
        <Icon name="lucide:heart" mode="svg" size="16" :class="saved ? 'fill-ink' : ''" />
      </button>
    </div>

    <div class="pt-3">
      <div class="flex items-center justify-between text-xs text-muted">
        <span>{{ product.categoryLabel }}</span>
        <span v-if="product.isNew" class="text-accent font-medium">New</span>
        <span v-else-if="product.compareAtPrice" class="line-through">{{ formatPrice(product.compareAtPrice) }}</span>
      </div>
      <div class="mt-1 flex items-start justify-between gap-3">
        <NuxtLink :to="`/products/${product.id}`" class="text-sm font-medium leading-snug line-clamp-1 hover:underline">
          {{ product.title }}
        </NuxtLink>
        <span class="text-sm font-medium whitespace-nowrap">{{ formatPrice(product.price) }}</span>
      </div>
    </div>
  </article>
</template>
