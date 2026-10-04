<script setup lang="ts">
useHead({
  titleTemplate: (title) => (title ? `${title} — NUXTWEAR` : 'NUXTWEAR — Fashion Store'),
})
</script>

<template>
  <NuxtLoadingIndicator color="#000" :height="2" />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
