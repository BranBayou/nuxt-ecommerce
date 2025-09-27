<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center">
    <div class="max-w-md w-full text-center">
      <!-- Error Icon -->
      <div class="mb-8">
        <Icon name="mdi:chef-hat" size="120" class="text-dodgeroll-gold mx-auto mb-4" />
        <h1 class="text-6xl font-bold text-gray-900 mb-2">404</h1>
        <h2 class="text-2xl font-semibold text-gray-700 mb-4">Recipe Not Found</h2>
        <p class="text-gray-600 mb-8">
          Oops! It looks like this recipe has been moved or doesn't exist. 
          Don't worry, we have plenty of other delicious recipes waiting for you!
        </p>
      </div>

      <!-- Action Buttons -->
      <div class="space-y-4">
        <NuxtLink 
          to="/"
          class="inline-block w-full px-8 py-4 bg-dodgeroll-gold text-white rounded-lg font-semibold hover:bg-dodgeroll-gold-600 transition-colors duration-200"
        >
          Go Home
        </NuxtLink>
        <NuxtLink 
          to="/recipes"
          class="inline-block w-full px-8 py-4 border-2 border-dodgeroll-gold text-dodgeroll-gold rounded-lg font-semibold hover:bg-dodgeroll-gold hover:text-white transition-colors duration-200"
        >
          Browse Recipes
        </NuxtLink>
      </div>

      <!-- Search Suggestion -->
      <div class="mt-12 p-6 bg-white rounded-lg shadow-sm">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Looking for something specific?</h3>
        <div class="flex gap-2">
          <input 
            type="text" 
            placeholder="Search recipes..."
            class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dodgeroll-gold"
          />
          <button class="px-6 py-2 bg-dodgeroll-gold text-white rounded-lg hover:bg-dodgeroll-gold-600 transition-colors">
            Search
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Set the error status code
const props = defineProps({
  error: Object
})

// Set the page title
useHead({
  title: '404 - Recipe Not Found | Nuxtcipes'
})
</script>