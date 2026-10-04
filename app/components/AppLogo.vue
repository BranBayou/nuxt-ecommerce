<script setup lang="ts">
withDefaults(defineProps<{ size?: number }>(), { size: 32 })
</script>

<template>
  <!-- Split-diamond mark from the design: a pale left half and a solid right arrow -->
  <svg :width="size" :height="size" viewBox="0 0 32 32" fill="none" aria-hidden="true">
    <path d="M14 3 4 16l10 13V3Z" fill="#CFCFCF" />
    <path d="M14 3v26l14-13L14 3Z" fill="currentColor" />
  </svg>
</template>
