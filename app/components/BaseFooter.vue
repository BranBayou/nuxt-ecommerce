<template>
  <footer class="bg-dire-wolf text-white py-16">
    <div class="container">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
        <!-- Brand Section -->
        <div class="lg:col-span-2">
          <div class="flex items-center gap-2 mb-4">
            <NuxtImg width="40" densities="x1" format="webp" src="/icon-green.png" alt="Nuxtcipes Logo" />
            <span class="text-2xl font-bold">Nuxtcipes</span>
          </div>
          <p class="text-gray-300 mb-6 max-w-md">
            Discover amazing recipes, share your culinary creations, and connect with a community of food lovers. 
            Master the kitchen with ease and unleash your inner chef today!
          </p>
          <div class="flex gap-4">
            <a href="#" class="text-gray-300 hover:text-dodgeroll-gold transition-colors duration-200">
              <Icon name="mdi:facebook" size="24" />
            </a>
            <a href="#" class="text-gray-300 hover:text-dodgeroll-gold transition-colors duration-200">
              <Icon name="mdi:twitter" size="24" />
            </a>
            <a href="#" class="text-gray-300 hover:text-dodgeroll-gold transition-colors duration-200">
              <Icon name="mdi:instagram" size="24" />
            </a>
            <a href="#" class="text-gray-300 hover:text-dodgeroll-gold transition-colors duration-200">
              <Icon name="mdi:youtube" size="24" />
            </a>
          </div>
        </div>

        <!-- Quick Links -->
        <div>
          <h3 class="text-lg font-semibold mb-4">Quick Links</h3>
          <ul class="space-y-2">
            <li><NuxtLink to="/" class="text-gray-300 hover:text-dodgeroll-gold transition-colors duration-200">Home</NuxtLink></li>
            <li><NuxtLink to="/recipes" class="text-gray-300 hover:text-dodgeroll-gold transition-colors duration-200">All Recipes</NuxtLink></li>
            <li><NuxtLink to="/community" class="text-gray-300 hover:text-dodgeroll-gold transition-colors duration-200">Community</NuxtLink></li>
            <li><NuxtLink to="/about" class="text-gray-300 hover:text-dodgeroll-gold transition-colors duration-200">About Us</NuxtLink></li>
          </ul>
        </div>

        <!-- Categories -->
        <div>
          <h3 class="text-lg font-semibold mb-4">Categories</h3>
          <ul class="space-y-2">
            <li><a href="#" class="text-gray-300 hover:text-dodgeroll-gold transition-colors duration-200">Breakfast</a></li>
            <li><a href="#" class="text-gray-300 hover:text-dodgeroll-gold transition-colors duration-200">Lunch</a></li>
            <li><a href="#" class="text-gray-300 hover:text-dodgeroll-gold transition-colors duration-200">Dinner</a></li>
            <li><a href="#" class="text-gray-300 hover:text-dodgeroll-gold transition-colors duration-200">Desserts</a></li>
            <li><a href="#" class="text-gray-300 hover:text-dodgeroll-gold transition-colors duration-200">Snacks</a></li>
          </ul>
        </div>
      </div>

      <!-- Newsletter Signup -->
      <div class="border-t border-gray-700 pt-8">
        <div class="max-w-md">
          <h3 class="text-lg font-semibold mb-4">Stay Updated</h3>
          <p class="text-gray-300 mb-4">Get the latest recipes and cooking tips delivered to your inbox.</p>
          <div class="flex gap-2">
            <input 
              type="email" 
              placeholder="Enter your email" 
              class="flex-1 px-4 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-dodgeroll-gold focus:border-transparent"
            />
            <button class="px-6 py-2 bg-dodgeroll-gold text-white rounded-md hover:bg-dodgeroll-gold-600 transition-colors duration-200 font-medium">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      <!-- Copyright -->
      <div class="border-t border-gray-700 pt-8 mt-8 text-center text-gray-400">
        <p>&copy; 2024 Nuxtcipes. All rights reserved. Built with Nuxt 3 and Vue 3.</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
// Footer component for the application
</script>
