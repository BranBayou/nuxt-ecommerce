<template>
  <div class="relative">
    <div class="relative">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search recipes..."
        class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dodgeroll-gold focus:border-transparent"
        @input="handleSearch"
      />
      <Icon 
        name="mdi:magnify" 
        class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
        size="20"
      />
    </div>
    
    <!-- Search Results Dropdown -->
    <div 
      v-if="showResults && searchResults.length > 0" 
      class="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto"
    >
      <div 
        v-for="recipe in searchResults" 
        :key="recipe.id"
        class="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
        @click="selectRecipe(recipe)"
      >
        <div class="flex items-center gap-3">
          <NuxtImg 
            :src="recipe.image" 
            :alt="recipe.name"
            class="w-12 h-12 object-cover rounded-md"
            width="48"
            height="48"
          />
          <div class="flex-1 min-w-0">
            <h4 class="font-medium text-gray-900 truncate">{{ recipe.name }}</h4>
            <div class="flex items-center gap-3 text-sm text-gray-500">
              <span class="flex items-center gap-1">
                <Icon name="mdi:clock-time-eight-outline" size="16" />
                {{ recipe.cookTimeMinutes }}min
              </span>
              <span class="flex items-center gap-1">
                <Icon name="mdi:star" size="16" />
                {{ recipe.rating }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- No Results -->
    <div 
      v-if="showResults && searchResults.length === 0 && searchQuery.length > 2" 
      class="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4 text-center text-gray-500"
    >
      No recipes found for "{{ searchQuery }}"
    </div>
  </div>
</template>

<script setup lang="ts">
import { type Recipe } from '~/types/types'

const searchQuery = ref('')
const searchResults = ref<Recipe[]>([])
const showResults = ref(false)
const searchTimeout = ref<number | null>(null)

const handleSearch = () => {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }
  
  if (searchQuery.value.length < 2) {
    showResults.value = false
    searchResults.value = []
    return
  }
  
  searchTimeout.value = setTimeout(async () => {
    try {
      const data = await $fetch<{ recipes: Recipe[] }>(`https://dummyjson.com/recipes/search?q=${encodeURIComponent(searchQuery.value)}&limit=5`)
      searchResults.value = data?.recipes || []
      showResults.value = true
    } catch (error) {
      console.error('Search error:', error)
      searchResults.value = []
      showResults.value = true
    }
  }, 300)
}

const selectRecipe = (recipe: Recipe) => {
  navigateTo(`/recipes/${recipe.id}`)
  searchQuery.value = ''
  showResults.value = false
}

// Close results when clicking outside
onMounted(() => {
  document.addEventListener('click', (e) => {
    if (!(e.target as Element).closest('.relative')) {
      showResults.value = false
    }
  })
})
</script>
