<script setup lang="ts">
import type { ProductSummary } from '~~/types/types'

defineProps<{ products: ProductSummary[]; loading?: boolean }>()

const track = ref<HTMLElement | null>(null)
const scroll = (dir: 1 | -1) => track.value?.scrollBy({ left: dir * track.value.clientWidth * 0.8, behavior: 'smooth' })
</script>

<template>
  <div>
    <div
      ref="track"
      class="grid grid-flow-col auto-cols-[70%] sm:auto-cols-[42%] md:auto-cols-[31%] lg:auto-cols-[calc((100%-4.5rem)/4)] gap-6 overflow-x-auto snap-x snap-mandatory pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      <template v-if="loading">
        <ProductCardSkeleton v-for="n in 4" :key="n" class="snap-start" />
      </template>
      <ProductCard v-for="p in products" v-else :key="p.id" :product="p" class="snap-start" />
    </div>
    <div class="flex justify-center gap-3 mt-8">
      <button class="grid place-items-center w-10 h-10 border border-line bg-white/60 hover:border-ink transition-colors" aria-label="Previous products" @click="scroll(-1)">
        <Icon name="lucide:chevron-left" size="18" />
      </button>
      <button class="grid place-items-center w-10 h-10 border border-line bg-white/60 hover:border-ink transition-colors" aria-label="Next products" @click="scroll(1)">
        <Icon name="lucide:chevron-right" size="18" />
      </button>
    </div>
  </div>
</template>
