<template>
  <nav class="flex items-center space-x-2 text-sm text-gray-600 mb-8">
    <NuxtLink 
      to="/" 
      class="hover:text-dodgeroll-gold transition-colors duration-200 flex items-center gap-1"
    >
      <Icon name="mdi:home" size="16" />
      Home
    </NuxtLink>
    
    <Icon name="mdi:chevron-right" size="16" class="text-gray-400" />
    
    <NuxtLink 
      to="/recipes" 
      class="hover:text-dodgeroll-gold transition-colors duration-200"
    >
      Recipes
    </NuxtLink>
    
    <template v-if="recipeName">
      <Icon name="mdi:chevron-right" size="16" class="text-gray-400" />
      <span class="text-gray-900 font-medium truncate">{{ recipeName }}</span>
    </template>
  </nav>
</template>

<script setup>
defineProps({
  recipeName: {
    type: String,
    default: ''
  }
})
</script>
