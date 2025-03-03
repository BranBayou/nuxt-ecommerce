<script setup>

</script>

<template>
    <header class="py-4 border-b">
      <nav class="flex container items-center">
        <NuxtLink to="/" class="flex gap-1 items-center">
          <NuxtImg width="56" densities="x1" format="webp" src="/icon-green.png" alt="" />
          <span class="text-3xl font-bold">Nuxtcipes</span>
        </NuxtLink>
        <ul class="flex gap-6 ml-auto text-xl font-bold capitalize">
          <li>
            <NuxtLink to="/">Home</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/recipe">Recipe</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/community">Community</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/about">About</NuxtLink>
          </li>
        </ul>
        <!-- <ul>
            <li>
              <NuxtImg src="/search.svg" alt="" width="56" densities="x1" format="webp"></NuxtImg>
            </li>
            <li>
              <button class="border-2 border-white px-4 py-2 rounded-md text-white">Register</button>
            </li>
        </ul> -->
      </nav>
    </header>
  </template>



<style  scoped>

</style>