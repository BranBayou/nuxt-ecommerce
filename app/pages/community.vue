<script setup lang="ts">
// SEO Data
useSeoMeta({
  title: "Community - Nuxtcipes",
  description: "Join our community of food lovers! Share recipes, get cooking tips, and connect with fellow chefs.",
  ogTitle: "Community - Nuxtcipes",
  ogDescription: "Join our community of food lovers! Share recipes, get cooking tips, and connect with fellow chefs.",
  ogImage: "/nuxt-course-hero.png",
  ogUrl: "http://localhost:3000/community",
  twitterTitle: "Community - Nuxtcipes",
  twitterDescription: "Join our community of food lovers! Share recipes, get cooking tips, and connect with fellow chefs.",
  twitterImage: "nuxt-course-hero.png",
  twitterCard: "summary",
})

// Mock community data
const featuredRecipes = ref([
  {
    id: 1,
    name: "Grandma's Apple Pie",
    author: "Sarah Johnson",
    rating: 4.9,
    reviewCount: 127,
    image: "https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=400",
    cookTime: 45,
    difficulty: "Medium"
  },
  {
    id: 2,
    name: "Spicy Thai Basil Chicken",
    author: "Mike Chen",
    rating: 4.8,
    reviewCount: 89,
    image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400",
    cookTime: 25,
    difficulty: "Easy"
  },
  {
    id: 3,
    name: "Chocolate Lava Cake",
    author: "Emma Wilson",
    rating: 4.9,
    reviewCount: 156,
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400",
    cookTime: 20,
    difficulty: "Hard"
  }
])

const recentReviews = ref([
  {
    id: 1,
    recipeName: "Classic Margherita Pizza",
    author: "Alex Rodriguez",
    rating: 5,
    comment: "Absolutely perfect! The crust was crispy and the flavors were amazing. Will definitely make this again!",
    date: "2 days ago"
  },
  {
    id: 2,
    recipeName: "Beef Stir Fry",
    author: "Lisa Park",
    rating: 4,
    comment: "Great recipe! I added some extra vegetables and it turned out delicious. The sauce was perfect.",
    date: "3 days ago"
  },
  {
    id: 3,
    recipeName: "Chocolate Chip Cookies",
    author: "David Kim",
    rating: 5,
    comment: "These cookies are incredible! My family loved them. The recipe is easy to follow and the results are perfect.",
    date: "5 days ago"
  }
])

const cookingTips = ref([
  {
    id: 1,
    title: "Perfect Pasta Water",
    tip: "Always salt your pasta water generously - it should taste like seawater. This is the only chance to season the pasta itself.",
    author: "Chef Maria"
  },
  {
    id: 2,
    title: "Room Temperature Ingredients",
    tip: "For baking, always use room temperature eggs and butter. This ensures better mixing and a more uniform texture.",
    author: "Baker Tom"
  },
  {
    id: 3,
    title: "Knife Sharpening",
    tip: "A sharp knife is safer than a dull one. Keep your knives sharp and they'll cut through ingredients cleanly without slipping.",
    author: "Chef Sarah"
  }
])
</script>

<template>
  <main class="min-h-screen bg-gray-50">
    <!-- Hero Section -->
    <section class="bg-gradient-to-r from-dodgeroll-gold to-dodgeroll-gold-600 py-20">
      <div class="container text-center text-white">
        <h1 class="text-4xl lg:text-6xl font-bold mb-6">Join Our Community</h1>
        <p class="text-xl lg:text-2xl mb-8 max-w-3xl mx-auto">
          Connect with fellow food lovers, share your culinary creations, and discover amazing recipes from our community.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button class="px-8 py-4 bg-white text-dodgeroll-gold rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Share Your Recipe
          </button>
          <button class="px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-dodgeroll-gold transition-colors">
            Join Discussion
          </button>
        </div>
      </div>
    </section>

    <!-- Featured Community Recipes -->
    <section class="py-16">
      <div class="container">
        <div class="text-center mb-12">
          <h2 class="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Featured Community Recipes</h2>
          <p class="text-lg text-gray-600">Discover the most loved recipes from our community members</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div 
            v-for="recipe in featuredRecipes" 
            :key="recipe.id"
            class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <NuxtImg 
              :src="recipe.image" 
              :alt="recipe.name"
              class="w-full h-48 object-cover"
            />
            <div class="p-6">
              <h3 class="text-xl font-bold text-gray-900 mb-2">{{ recipe.name }}</h3>
              <p class="text-gray-600 mb-4">by {{ recipe.author }}</p>
              
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-1">
                  <Icon name="mdi:star" class="text-yellow-400" size="20" />
                  <span class="font-semibold">{{ recipe.rating }}</span>
                  <span class="text-gray-500">({{ recipe.reviewCount }})</span>
                </div>
                <div class="flex items-center gap-1 text-gray-500">
                  <Icon name="mdi:clock-time-eight-outline" size="16" />
                  <span>{{ recipe.cookTime }}min</span>
                </div>
              </div>
              
              <div class="flex items-center justify-between">
                <span class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                  {{ recipe.difficulty }}
                </span>
                <button class="text-dodgeroll-gold hover:text-dodgeroll-gold-600 font-semibold">
                  View Recipe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Recent Reviews -->
    <section class="py-16 bg-white">
      <div class="container">
        <div class="text-center mb-12">
          <h2 class="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Recent Reviews</h2>
          <p class="text-lg text-gray-600">See what our community is saying about their favorite recipes</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="review in recentReviews" 
            :key="review.id"
            class="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow duration-300"
          >
            <div class="flex items-center gap-2 mb-3">
              <div class="flex">
                <Icon 
                  v-for="i in 5" 
                  :key="i"
                  name="mdi:star" 
                  :class="i <= review.rating ? 'text-yellow-400' : 'text-gray-300'"
                  size="16"
                />
              </div>
              <span class="text-sm text-gray-500">{{ review.date }}</span>
            </div>
            
            <h4 class="font-semibold text-gray-900 mb-2">{{ review.recipeName }}</h4>
            <p class="text-gray-600 mb-3">{{ review.comment }}</p>
            <p class="text-sm text-gray-500">- {{ review.author }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Cooking Tips -->
    <section class="py-16">
      <div class="container">
        <div class="text-center mb-12">
          <h2 class="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Cooking Tips</h2>
          <p class="text-lg text-gray-600">Expert advice from our community chefs</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div 
            v-for="tip in cookingTips" 
            :key="tip.id"
            class="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div class="mb-6">
              <Icon name="mdi:lightbulb" class="text-dodgeroll-gold mb-4" size="32" />
              <h3 class="text-xl font-bold text-gray-900 mb-3">{{ tip.title }}</h3>
              <p class="text-gray-600 leading-relaxed">{{ tip.tip }}</p>
            </div>
            <p class="text-sm text-gray-500">- {{ tip.author }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Community Stats -->
    <section class="py-16 bg-gradient-to-r from-dire-wolf to-gray-800 text-white">
      <div class="container">
        <div class="text-center mb-12">
          <h2 class="text-3xl lg:text-4xl font-bold mb-4">Our Community</h2>
          <p class="text-lg text-gray-300">Join thousands of food lovers worldwide</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          <div>
            <div class="text-4xl font-bold text-dodgeroll-gold mb-2">10K+</div>
            <div class="text-gray-300">Active Members</div>
          </div>
          <div>
            <div class="text-4xl font-bold text-dodgeroll-gold mb-2">5K+</div>
            <div class="text-gray-300">Recipes Shared</div>
          </div>
          <div>
            <div class="text-4xl font-bold text-dodgeroll-gold mb-2">25K+</div>
            <div class="text-gray-300">Reviews & Ratings</div>
          </div>
          <div>
            <div class="text-4xl font-bold text-dodgeroll-gold mb-2">50+</div>
            <div class="text-gray-300">Countries</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Call to Action -->
    <section class="py-16 bg-white">
      <div class="container text-center">
        <h2 class="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">Ready to Join Our Community?</h2>
        <p class="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Share your favorite recipes, get cooking tips, and connect with fellow food enthusiasts from around the world.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button class="px-8 py-4 bg-dodgeroll-gold text-white rounded-lg font-semibold hover:bg-dodgeroll-gold-600 transition-colors">
            Get Started Today
          </button>
          <button class="px-8 py-4 border-2 border-dodgeroll-gold text-dodgeroll-gold rounded-lg font-semibold hover:bg-dodgeroll-gold hover:text-white transition-colors">
            Learn More
          </button>
        </div>
      </div>
    </section>
  </main>
</template>
