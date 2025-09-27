<script setup>

</script>

<template>
  <header class="py-4 border-b bg-white shadow-sm sticky top-0 z-40">
    <nav class="container flex items-center justify-between">
      <!-- Logo -->
      <NuxtLink to="/" class="flex gap-2 items-center hover:opacity-80 transition-opacity">
        <NuxtImg width="48" densities="x1" format="webp" src="/icon-green.png" alt="Nuxtcipes Logo" />
        <span class="text-2xl lg:text-3xl font-bold text-dire-wolf">Nuxtcipes</span>
      </NuxtLink>

      <!-- Desktop Navigation -->
      <div class="hidden lg:flex items-center gap-8">
        <!-- Search Bar -->
        <div class="w-80">
          <RecipeSearch />
        </div>
        
        <!-- Navigation Links -->
        <ul class="flex gap-6 text-lg font-medium">
          <li>
            <NuxtLink 
              to="/" 
              class="text-gray-700 hover:text-dodgeroll-gold transition-colors duration-200"
              :class="{ 'text-dodgeroll-gold': $route.path === '/' }"
            >
              Home
            </NuxtLink>
          </li>
          <li>
            <NuxtLink 
              to="/recipes" 
              class="text-gray-700 hover:text-dodgeroll-gold transition-colors duration-200"
              :class="{ 'text-dodgeroll-gold': $route.path.startsWith('/recipes') }"
            >
              Recipes
            </NuxtLink>
          </li>
          <li>
            <NuxtLink 
              to="/community" 
              class="text-gray-700 hover:text-dodgeroll-gold transition-colors duration-200"
              :class="{ 'text-dodgeroll-gold': $route.path === '/community' }"
            >
              Community
            </NuxtLink>
          </li>
          <li>
            <NuxtLink 
              to="/about" 
              class="text-gray-700 hover:text-dodgeroll-gold transition-colors duration-200"
              :class="{ 'text-dodgeroll-gold': $route.path === '/about' }"
            >
              About
            </NuxtLink>
          </li>
        </ul>
      </div>

      <!-- Mobile Menu Button -->
      <button 
        @click="toggleMobileMenu"
        class="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
        :class="{ 'bg-gray-100': isMobileMenuOpen }"
      >
        <Icon 
          :name="isMobileMenuOpen ? 'mdi:close' : 'mdi:menu'" 
          size="24" 
          class="text-gray-700"
        />
      </button>
    </nav>

    <!-- Mobile Menu -->
    <div 
      v-if="isMobileMenuOpen" 
      class="lg:hidden border-t bg-white shadow-lg"
    >
      <div class="container py-4">
        <!-- Mobile Search -->
        <div class="mb-6">
          <RecipeSearch />
        </div>
        
        <!-- Mobile Navigation Links -->
        <ul class="space-y-4">
          <li>
            <NuxtLink 
              to="/" 
              @click="closeMobileMenu"
              class="block text-lg font-medium text-gray-700 hover:text-dodgeroll-gold transition-colors duration-200"
              :class="{ 'text-dodgeroll-gold': $route.path === '/' }"
            >
              Home
            </NuxtLink>
          </li>
          <li>
            <NuxtLink 
              to="/recipes" 
              @click="closeMobileMenu"
              class="block text-lg font-medium text-gray-700 hover:text-dodgeroll-gold transition-colors duration-200"
              :class="{ 'text-dodgeroll-gold': $route.path.startsWith('/recipes') }"
            >
              Recipes
            </NuxtLink>
          </li>
          <li>
            <NuxtLink 
              to="/community" 
              @click="closeMobileMenu"
              class="block text-lg font-medium text-gray-700 hover:text-dodgeroll-gold transition-colors duration-200"
              :class="{ 'text-dodgeroll-gold': $route.path === '/community' }"
            >
              Community
            </NuxtLink>
          </li>
          <li>
            <NuxtLink 
              to="/about" 
              @click="closeMobileMenu"
              class="block text-lg font-medium text-gray-700 hover:text-dodgeroll-gold transition-colors duration-200"
              :class="{ 'text-dodgeroll-gold': $route.path === '/about' }"
            >
              About
            </NuxtLink>
          </li>
        </ul>
      </div>
    </div>
  </header>
</template>

<script setup>
const isMobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

// Close mobile menu when route changes
watch(() => useRoute().path, () => {
  closeMobileMenu()
})
</script>



<style  scoped>

</style>