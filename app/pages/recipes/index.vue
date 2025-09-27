<script setup lang="ts">
import { type RecipeResponse, type Recipe } from "~/types/types"

// SEO Data
useSeoMeta({
  title: "All Recipes - Nuxtcipes",
  description: "Browse our complete collection of delicious recipes. Find recipes by cuisine, difficulty, and meal type.",
  ogTitle: "All Recipes - Nuxtcipes",
  ogDescription: "Browse our complete collection of delicious recipes. Find recipes by cuisine, difficulty, and meal type.",
  ogImage: "/nuxt-course-hero.png",
  ogUrl: "http://localhost:3000/recipes",
  twitterTitle: "All Recipes - Nuxtcipes",
  twitterDescription: "Browse our complete collection of delicious recipes. Find recipes by cuisine, difficulty, and meal type.",
  twitterImage: "nuxt-course-hero.png",
  twitterCard: "summary",
})

// Fetch all recipes
const { data: allRecipes, error, pending } = await useFetch<RecipeResponse>('https://dummyjson.com/recipes?limit=50')

// Filtering state
const searchQuery = ref('')
const selectedCuisine = ref('')
const selectedDifficulty = ref('')
const selectedMealType = ref('')
const sortBy = ref('name')

// Get unique values for filters
const cuisines = computed(() => {
  if (!allRecipes.value?.recipes) return []
  return [...new Set(allRecipes.value.recipes.map(recipe => recipe.cuisine))].sort()
})

const difficulties = computed(() => {
  if (!allRecipes.value?.recipes) return []
  return [...new Set(allRecipes.value.recipes.map(recipe => recipe.difficulty))].sort()
})

const mealTypes = computed(() => {
  if (!allRecipes.value?.recipes) return []
  const types = allRecipes.value.recipes.flatMap(recipe => recipe.mealType)
  return [...new Set(types)].sort()
})

// Filtered and sorted recipes
const filteredRecipes = computed(() => {
  if (!allRecipes.value?.recipes) return []
  
  let recipes = allRecipes.value.recipes

  // Apply search filter
  if (searchQuery.value) {
    recipes = recipes.filter(recipe => 
      recipe.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      recipe.ingredients.some(ingredient => 
        ingredient.toLowerCase().includes(searchQuery.value.toLowerCase())
      )
    )
  }

  // Apply cuisine filter
  if (selectedCuisine.value) {
    recipes = recipes.filter(recipe => recipe.cuisine === selectedCuisine.value)
  }

  // Apply difficulty filter
  if (selectedDifficulty.value) {
    recipes = recipes.filter(recipe => recipe.difficulty === selectedDifficulty.value)
  }

  // Apply meal type filter
  if (selectedMealType.value) {
    recipes = recipes.filter(recipe => recipe.mealType.includes(selectedMealType.value))
  }

  // Apply sorting
  switch (sortBy.value) {
    case 'name':
      recipes = recipes.sort((a, b) => a.name.localeCompare(b.name))
      break
    case 'rating':
      recipes = recipes.sort((a, b) => b.rating - a.rating)
      break
    case 'cookTime':
      recipes = recipes.sort((a, b) => a.cookTimeMinutes - b.cookTimeMinutes)
      break
    case 'calories':
      recipes = recipes.sort((a, b) => a.caloriesPerServing - b.caloriesPerServing)
      break
  }

  return recipes
})

// Pagination
const currentPage = ref(1)
const itemsPerPage = 12
const totalPages = computed(() => Math.ceil(filteredRecipes.value.length / itemsPerPage))
const paginatedRecipes = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredRecipes.value.slice(start, end)
})

// Reset pagination when filters change
watch([searchQuery, selectedCuisine, selectedDifficulty, selectedMealType, sortBy], () => {
  currentPage.value = 1
})

// Clear all filters
const clearFilters = () => {
  searchQuery.value = ''
  selectedCuisine.value = ''
  selectedDifficulty.value = ''
  selectedMealType.value = ''
  sortBy.value = 'name'
}
</script>

<template>
  <main class="min-h-screen bg-gray-50">
    <!-- Hero Section -->
    <section class="bg-gradient-to-r from-dodgeroll-gold to-dodgeroll-gold-600 py-16">
      <div class="container">
        <div class="text-center text-white">
          <h1 class="text-4xl lg:text-6xl font-bold mb-4">All Recipes</h1>
          <p class="text-xl lg:text-2xl mb-8">Discover amazing recipes from around the world</p>
          <div class="max-w-2xl mx-auto">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search recipes by name or ingredients..."
              class="w-full px-6 py-4 text-lg rounded-lg border-0 focus:outline-none focus:ring-4 focus:ring-white/30 text-gray-900 placeholder-gray-500"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Filters and Sorting -->
    <section class="py-8 bg-white border-b">
      <div class="container">
        <div class="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
          <!-- Filters -->
          <div class="flex flex-wrap gap-4">
            <!-- Cuisine Filter -->
            <select 
              v-model="selectedCuisine" 
              class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dodgeroll-gold"
            >
              <option value="">All Cuisines</option>
              <option v-for="cuisine in cuisines" :key="cuisine" :value="cuisine">
                {{ cuisine }}
              </option>
            </select>

            <!-- Difficulty Filter -->
            <select 
              v-model="selectedDifficulty" 
              class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dodgeroll-gold"
            >
              <option value="">All Difficulties</option>
              <option v-for="difficulty in difficulties" :key="difficulty" :value="difficulty">
                {{ difficulty }}
              </option>
            </select>

            <!-- Meal Type Filter -->
            <select 
              v-model="selectedMealType" 
              class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dodgeroll-gold"
            >
              <option value="">All Meal Types</option>
              <option v-for="mealType in mealTypes" :key="mealType" :value="mealType">
                {{ mealType }}
              </option>
            </select>

            <!-- Clear Filters Button -->
            <button 
              @click="clearFilters"
              class="px-4 py-2 text-gray-600 hover:text-gray-800 underline"
            >
              Clear Filters
            </button>
          </div>

          <!-- Sorting -->
          <div class="flex items-center gap-2">
            <label class="text-sm font-medium text-gray-700">Sort by:</label>
            <select 
              v-model="sortBy" 
              class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dodgeroll-gold"
            >
              <option value="name">Name</option>
              <option value="rating">Rating</option>
              <option value="cookTime">Cook Time</option>
              <option value="calories">Calories</option>
            </select>
          </div>
        </div>
      </div>
    </section>

    <!-- Results Section -->
    <section class="py-12">
      <div class="container">
        <!-- Results Count -->
        <div class="mb-8">
          <p class="text-lg text-gray-600">
            Showing {{ paginatedRecipes.length }} of {{ filteredRecipes.length }} recipes
            <span v-if="searchQuery || selectedCuisine || selectedDifficulty || selectedMealType">
              (filtered)
            </span>
          </p>
        </div>

        <!-- Loading State -->
        <div v-if="pending" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <RecipeCardSkeleton v-for="n in 12" :key="n" />
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-20">
          <Icon name="mdi:alert-circle" size="64" class="text-red-500 mx-auto mb-4" />
          <h2 class="text-2xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h2>
          <p class="text-gray-600">Please try again later.</p>
        </div>

        <!-- Recipes Grid -->
        <div v-else-if="paginatedRecipes.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <RecipeCard 
            v-for="recipe in paginatedRecipes" 
            :key="recipe.id" 
            :recipe="recipe"
            class="transform hover:scale-105 transition-transform duration-200"
          />
        </div>

        <!-- No Results -->
        <div v-else class="text-center py-20">
          <Icon name="mdi:chef-hat" size="64" class="text-gray-400 mx-auto mb-4" />
          <h2 class="text-2xl font-bold text-gray-900 mb-2">No recipes found</h2>
          <p class="text-gray-600 mb-6">Try adjusting your search or filters.</p>
          <button 
            @click="clearFilters"
            class="px-6 py-3 bg-dodgeroll-gold text-white rounded-lg hover:bg-dodgeroll-gold-600 transition-colors"
          >
            Clear All Filters
          </button>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="flex justify-center items-center gap-2 mt-12">
          <button 
            @click="currentPage = Math.max(1, currentPage - 1)"
            :disabled="currentPage === 1"
            class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <div class="flex gap-1">
            <button 
              v-for="page in totalPages" 
              :key="page"
              @click="currentPage = page"
              :class="[
                'px-4 py-2 rounded-lg transition-colors',
                currentPage === page 
                  ? 'bg-dodgeroll-gold text-white' 
                  : 'border border-gray-300 hover:bg-gray-50'
              ]"
            >
              {{ page }}
            </button>
          </div>
          
          <button 
            @click="currentPage = Math.min(totalPages, currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  </main>
</template>
