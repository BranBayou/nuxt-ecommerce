<script setup lang="ts">
import { type Recipe } from '~/types/types';

defineProps<{
    recipe: Recipe;
}>();
</script>

<template>
  <NuxtLink 
    :to="`/recipes/${recipe.id}`" 
    class="group flex flex-col bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
  >
    <!-- Image Container -->
    <div class="relative overflow-hidden">
      <NuxtImg 
        :src="recipe.image" 
        sizes="xs:100vw sm:50vw lg:400px" 
        format="webp" 
        densities="x1" 
        alt="" 
        class="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500" 
      />
      <!-- Overlay on hover -->
      <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
        <div class="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Icon name="mdi:eye" size="32" class="text-white" />
        </div>
      </div>
      <!-- Difficulty Badge -->
      <div class="absolute top-3 right-3">
        <span class="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-sm font-medium text-gray-700">
          {{ recipe.difficulty }}
        </span>
      </div>
    </div>

    <!-- Content -->
    <div class="flex flex-col p-6 flex-1">
      <!-- Recipe Name -->
      <h3 class="text-xl font-bold text-gray-900 mb-3 group-hover:text-dodgeroll-gold transition-colors duration-200 line-clamp-2">
        {{ recipe.name }}
      </h3>

      <!-- Cuisine Tag -->
      <div class="mb-4">
        <span class="inline-block px-3 py-1 bg-dodgeroll-gold/10 text-dodgeroll-gold rounded-full text-sm font-medium">
          {{ recipe.cuisine }}
        </span>
      </div>

      <!-- Stats -->
      <div class="flex items-center justify-between text-sm text-gray-600 mb-4">
        <div class="flex items-center gap-1">
          <Icon name="mdi:clock-time-eight-outline" class="text-dodgeroll-gold" size="16" />
          <span>{{ recipe.cookTimeMinutes }}min</span>
        </div>
        <div class="flex items-center gap-1">
          <Icon name="mdi:fire" class="text-dodgeroll-gold" size="16" />
          <span>{{ recipe.caloriesPerServing }} cal</span>
        </div>
        <div class="flex items-center gap-1">
          <Icon name="mdi:star" class="text-yellow-400" size="16" />
          <span>{{ recipe.rating }}</span>
        </div>
      </div>

      <!-- Tags -->
      <div class="flex flex-wrap gap-1 mb-4">
        <span 
          v-for="tag in recipe.tags.slice(0, 2)" 
          :key="tag"
          class="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
        >
          {{ tag }}
        </span>
        <span v-if="recipe.tags.length > 2" class="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
          +{{ recipe.tags.length - 2 }} more
        </span>
      </div>

      <!-- View Recipe Button -->
      <div class="mt-auto">
        <div class="flex items-center justify-between">
          <span class="text-sm text-gray-500">{{ recipe.reviewCount }} reviews</span>
          <span class="text-dodgeroll-gold font-semibold group-hover:text-dodgeroll-gold-600 transition-colors duration-200">
            View Recipe →
          </span>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>

<style lang="scss" scoped>

</style>