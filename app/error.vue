<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()
const is404 = computed(() => props.error.statusCode === 404)

useHead({ title: is404.value ? 'Page not found' : 'Something went wrong' })

const goHome = () => clearError({ redirect: '/' })
const goShop = () => clearError({ redirect: '/products' })
</script>

<template>
  <NuxtLayout>
    <div class="container min-h-[70vh] flex flex-col items-center justify-center text-center py-20">
      <p class="display text-[28vw] sm:text-[12rem] leading-none text-ink/10 select-none">{{ error.statusCode }}</p>
      <h1 class="display text-4xl sm:text-5xl -mt-8 sm:-mt-16">{{ is404 ? 'Page not found' : 'Something went wrong' }}</h1>
      <p class="mt-4 max-w-md text-sm text-muted">
        {{ is404 ? "The page or product you're looking for has moved or no longer exists." : error.statusMessage || 'Please try again in a moment.' }}
      </p>
      <div class="mt-8 flex flex-col sm:flex-row gap-3">
        <button class="btn-primary" @click="goShop">Shop new arrivals</button>
        <button class="btn-outline" @click="goHome">Back to home</button>
      </div>
    </div>
  </NuxtLayout>
</template>
