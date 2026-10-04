<script setup lang="ts">
defineProps<{ items: { label: string; to?: string }[] }>()
</script>

<template>
  <nav aria-label="Breadcrumb" class="text-xs text-muted">
    <ol class="flex flex-wrap items-center gap-1.5">
      <li><NuxtLink to="/" class="hover:text-ink transition-colors">Home</NuxtLink></li>
      <li v-for="item in items" :key="item.label" class="flex items-center gap-1.5">
        <span aria-hidden="true">/</span>
        <NuxtLink v-if="item.to" :to="item.to" class="hover:text-ink transition-colors">{{ item.label }}</NuxtLink>
        <span v-else class="text-ink truncate max-w-[16rem]" aria-current="page">{{ item.label }}</span>
      </li>
    </ol>
  </nav>
</template>
