<script setup lang="ts">
import { type Recipe } from "~/types/types";

const { id } = useRoute().params;
const { data, error } = await useFetch<Recipe>(`https://dummyjson.com/recipes/${id}`);

if (error.value) {
  throw createError({
    status: error.value?.statusCode || 404,
    statusMessage: error.value?.statusMessage || 'Recipe not found',
  });
}

//SEO Data
useSeoMeta({
  title: data.value?.name,
  description: "Recipes for you to cook!",
  ogTitle: data.value?.name,
  ogDescription: "Recipes for you to cook!",
  ogImage: data.value?.image,
  ogUrl: `http:localhost:3001/recipes/${data.value?.id}`,
  twitterTitle: data.value?.name,
  twitterDescription: "Recipes for you to cook!",
  twitterImage: data.value?.image,
  twitterCard: "summary",
});
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-screen-lg container py-8">
      <!-- Breadcrumb -->
      <Breadcrumb :recipe-name="data?.name" />

      <!-- Main Content -->
      <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
        <!-- Header -->
        <div class="p-8 border-b border-gray-200">
          <div class="flex flex-col lg:flex-row gap-8">
            <!-- Recipe Info -->
            <div class="flex-1">
              <h1 class="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">{{ data?.name }}</h1>
              
              <!-- Tags -->
              <div class="flex flex-wrap gap-2 mb-6">
                <span class="px-3 py-1 bg-dodgeroll-gold/10 text-dodgeroll-gold rounded-full text-sm font-medium">
                  {{ data?.cuisine }}
                </span>
                <span class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                  {{ data?.difficulty }}
                </span>
                <span 
                  v-for="mealType in data?.mealType" 
                  :key="mealType"
                  class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                >
                  {{ mealType }}
                </span>
              </div>

              <!-- Stats -->
              <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div class="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <Icon name="mdi:clock-time-eight-outline" class="text-dodgeroll-gold" size="20" />
                  <div>
                    <div class="text-sm text-gray-600">Cook Time</div>
                    <div class="font-semibold">{{ data?.cookTimeMinutes }} min</div>
                  </div>
                </div>
                <div class="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <Icon name="mdi:fire" class="text-dodgeroll-gold" size="20" />
                  <div>
                    <div class="text-sm text-gray-600">Calories</div>
                    <div class="font-semibold">{{ data?.caloriesPerServing }}</div>
                  </div>
                </div>
                <div class="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <Icon name="mdi:star" class="text-yellow-400" size="20" />
                  <div>
                    <div class="text-sm text-gray-600">Rating</div>
                    <div class="font-semibold">{{ data?.rating }} ({{ data?.reviewCount }})</div>
                  </div>
                </div>
                <div class="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <Icon name="mdi:account-group" class="text-dodgeroll-gold" size="20" />
                  <div>
                    <div class="text-sm text-gray-600">Servings</div>
                    <div class="font-semibold">{{ data?.servings }}</div>
                  </div>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex flex-wrap gap-3">
                <button class="px-6 py-3 bg-dodgeroll-gold text-white rounded-lg font-semibold hover:bg-dodgeroll-gold-600 transition-colors flex items-center gap-2">
                  <Icon name="mdi:heart-outline" size="20" />
                  Save Recipe
                </button>
                <button class="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center gap-2">
                  <Icon name="mdi:share" size="20" />
                  Share
                </button>
                <button class="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center gap-2">
                  <Icon name="mdi:printer" size="20" />
                  Print
                </button>
              </div>
            </div>

            <!-- Recipe Image -->
            <div class="lg:w-96">
              <NuxtImg
                :src="data?.image"
                densities="x1"
                sizes="xs:100vw sm:100vw md:100vw lg:400px"
                class="w-full h-64 lg:h-80 object-cover rounded-xl shadow-lg"
                alt=""
              />
            </div>
          </div>
        </div>

        <!-- Content Sections -->
        <div class="p-8">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <!-- Ingredients -->
            <div>
              <h2 class="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Icon name="mdi:food" class="text-dodgeroll-gold" size="28" />
                Ingredients
              </h2>
              <div class="space-y-3">
                <div 
                  v-for="(ingredient, index) in data?.ingredients" 
                  :key="index"
                  class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <input 
                    :id="`ingredient-${index}`"
                    type="checkbox" 
                    class="w-5 h-5 text-dodgeroll-gold border-gray-300 rounded focus:ring-dodgeroll-gold focus:ring-2"
                  />
                  <label 
                    :for="`ingredient-${index}`"
                    class="flex-1 text-lg cursor-pointer select-none"
                  >
                    {{ ingredient }}
                  </label>
                </div>
              </div>
            </div>

            <!-- Instructions -->
            <div>
              <h2 class="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Icon name="mdi:chef-hat" class="text-dodgeroll-gold" size="28" />
                Instructions
              </h2>
              <div class="space-y-6">
                <div 
                  v-for="(instruction, index) in data?.instructions" 
                  :key="index"
                  class="flex gap-4"
                >
                  <div class="flex-shrink-0">
                    <span class="flex items-center justify-center w-8 h-8 bg-dodgeroll-gold text-white rounded-full font-bold text-sm">
                      {{ index + 1 }}
                    </span>
                  </div>
                  <div class="flex-1">
                    <p class="text-lg text-gray-700 leading-relaxed">{{ instruction }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Tags Section -->
          <div v-if="data?.tags && data.tags.length > 0" class="mt-12 pt-8 border-t border-gray-200">
            <h3 class="text-2xl font-bold text-gray-900 mb-4">Tags</h3>
            <div class="flex flex-wrap gap-2">
              <span 
                v-for="tag in data.tags" 
                :key="tag"
                class="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-dodgeroll-gold hover:text-white transition-colors cursor-pointer"
              >
                #{{ tag }}
              </span>
            </div>
          </div>

          <!-- Related Recipes Section -->
          <div class="mt-12 pt-8 border-t border-gray-200">
            <h3 class="text-2xl font-bold text-gray-900 mb-6">You might also like</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <!-- This would typically fetch related recipes -->
              <div class="text-center py-8 text-gray-500">
                <Icon name="mdi:chef-hat" size="48" class="mx-auto mb-2" />
                <p>Related recipes coming soon!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>