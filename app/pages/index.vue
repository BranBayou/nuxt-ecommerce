<script setup lang="ts">
import  { type RecipeResponse } from "../../types/types";
    // definePageMeta({
    //     layout: 'login',
    // })

    // const {data, error} = await useAsyncData('recipes', () => $fetch('https://dummyjson.com/recipes?limit=24'));

    const {data, error} = await useFetch<RecipeResponse>('https://dummyjson.com/recipes?limit=24');

//SEO Data
useSeoMeta({
  title: "Nuxtcipes",
  description: "Recipes for you to cook!",
  ogTitle: "Nuxtcipes",
  ogDescription: "Recipes for you to cook!",
  ogImage: "/nuxt-course-hero.png",
  ogUrl: `http:localhost:3000`,
  twitterTitle: "Nuxtcipes",
  twitterDescription: "Recipes for you to cook!",
  twitterImage: "nuxt-course-hero.png",
  twitterCard: "summary",
});
</script>

<template>
  <main>
    <!-- Hero Section -->
    <section class="relative bg-gradient-to-br from-dodgeroll-gold via-dodgeroll-gold-500 to-dodgeroll-gold-600 overflow-hidden">
      <!-- Background Pattern -->
      <div class="absolute inset-0 opacity-10">
        <div class="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
      </div>
      
      <div class="container relative py-20 lg:py-32">
        <div class="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          <!-- Content -->
          <div class="flex-1 text-center lg:text-left text-white">
            <div class="mb-6">
              <span class="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold mb-4">
                🍳 New recipes added daily
              </span>
            </div>
            
            <h1 class="text-4xl lg:text-6xl xl:text-7xl font-bold mb-6 leading-tight">
              Master the Kitchen with 
              <span class="text-yellow-200">Ease</span>
            </h1>
            
            <p class="text-xl lg:text-2xl mb-8 text-white/90 leading-relaxed max-w-2xl">
              Discover amazing recipes, cooking tips, and culinary inspiration. 
              From beginner-friendly meals to gourmet masterpieces.
            </p>
            
            <div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <NuxtLink 
                to="/recipes"
                class="group px-8 py-4 bg-white text-dodgeroll-gold rounded-xl text-lg font-bold hover:bg-yellow-50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                <Icon name="mdi:chef-hat" size="24" />
                Browse Recipes
                <Icon name="mdi:arrow-right" size="20" class="group-hover:translate-x-1 transition-transform" />
              </NuxtLink>
              
              <button class="px-8 py-4 border-2 border-white text-white rounded-xl text-lg font-bold hover:bg-white hover:text-dodgeroll-gold transition-all duration-300 flex items-center justify-center gap-2">
                <Icon name="mdi:play-circle" size="24" />
                Watch Demo
              </button>
            </div>

            <!-- Stats -->
            <div class="grid grid-cols-3 gap-8 mt-12 pt-8 border-t border-white/20">
              <div class="text-center lg:text-left">
                <div class="text-3xl font-bold text-yellow-200">1000+</div>
                <div class="text-white/80">Recipes</div>
              </div>
              <div class="text-center lg:text-left">
                <div class="text-3xl font-bold text-yellow-200">50+</div>
                <div class="text-white/80">Cuisines</div>
              </div>
              <div class="text-center lg:text-left">
                <div class="text-3xl font-bold text-yellow-200">10K+</div>
                <div class="text-white/80">Happy Cooks</div>
              </div>
            </div>
          </div>

          <!-- Hero Image -->
          <div class="flex-1 relative">
            <div class="relative">
              <NuxtImg 
                sizes="xs:100vw sm:667px lg:600px" 
                src="/nuxt-course-hero.png" 
                format="webp" 
                densities="x1" 
                alt="Cooking ingredients and utensils" 
                class="w-full max-w-lg mx-auto lg:mx-0 rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-500"
              />
              
              <!-- Floating Elements -->
              <div class="absolute -top-4 -left-4 w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center animate-bounce">
                <Icon name="mdi:star" size="32" class="text-yellow-200" />
              </div>
              <div class="absolute -bottom-4 -right-4 w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center animate-pulse">
                <Icon name="mdi:heart" size="24" class="text-red-300" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Recipes Section -->
    <section class="py-20 bg-gray-50">
      <div class="container">
        <div class="text-center mb-16">
          <h2 class="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Featured Recipes
          </h2>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our most popular and highly-rated recipes from around the world
          </p>
        </div>

        <!-- Loading State -->
        <div v-if="pending" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <RecipeCardSkeleton v-for="n in 8" :key="n" />
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-20">
          <Icon name="mdi:alert-circle" size="64" class="text-red-500 mx-auto mb-4" />
          <h3 class="text-2xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h3>
          <p class="text-gray-600 mb-6">We couldn't load the recipes. Please try again later.</p>
          <button 
            @click="refresh()"
            class="px-6 py-3 bg-dodgeroll-gold text-white rounded-lg hover:bg-dodgeroll-gold-600 transition-colors"
          >
            Try Again
          </button>
        </div>

        <!-- Recipes Grid -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <div 
            v-for="(recipe, index) in data?.recipes?.slice(0, 8)" 
            :key="recipe.id"
            class="transform hover:scale-105 transition-all duration-300"
            :style="{ animationDelay: `${index * 100}ms` }"
          >
            <RecipeCard :recipe="recipe" />
          </div>
        </div>

        <!-- View All Button -->
        <div v-if="!pending && !error" class="text-center mt-12">
          <NuxtLink 
            to="/recipes"
            class="inline-flex items-center gap-2 px-8 py-4 bg-dodgeroll-gold text-white rounded-xl font-semibold hover:bg-dodgeroll-gold-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            View All Recipes
            <Icon name="mdi:arrow-right" size="20" />
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-20 bg-white">
      <div class="container">
        <div class="text-center mb-16">
          <h2 class="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Why Choose Nuxtcipes?
          </h2>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to become a better cook, all in one place
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div class="text-center p-8 rounded-2xl hover:shadow-lg transition-shadow duration-300">
            <div class="w-16 h-16 bg-dodgeroll-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Icon name="mdi:chef-hat" size="32" class="text-dodgeroll-gold" />
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-4">Expert Recipes</h3>
            <p class="text-gray-600 leading-relaxed">
              Curated recipes from professional chefs and home cooks, tested and perfected for the best results.
            </p>
          </div>

          <div class="text-center p-8 rounded-2xl hover:shadow-lg transition-shadow duration-300">
            <div class="w-16 h-16 bg-dodgeroll-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Icon name="mdi:clock-fast" size="32" class="text-dodgeroll-gold" />
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-4">Quick & Easy</h3>
            <p class="text-gray-600 leading-relaxed">
              Find recipes that fit your schedule, from 15-minute meals to weekend cooking projects.
            </p>
          </div>

          <div class="text-center p-8 rounded-2xl hover:shadow-lg transition-shadow duration-300">
            <div class="w-16 h-16 bg-dodgeroll-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Icon name="mdi:account-group" size="32" class="text-dodgeroll-gold" />
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-4">Community Driven</h3>
            <p class="text-gray-600 leading-relaxed">
              Join a community of food lovers, share your creations, and get inspired by others.
            </p>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>

</style>