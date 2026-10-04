<script setup lang="ts">
const props = withDefaults(defineProps<{ modelValue: number; min?: number; max?: number; small?: boolean }>(), {
  min: 1,
  max: 10,
  small: false,
})
const emit = defineEmits<{ 'update:modelValue': [value: number] }>()
const set = (v: number) => emit('update:modelValue', Math.min(Math.max(v, props.min), props.max))
</script>

<template>
  <div class="inline-flex items-center border border-line bg-white/60" :class="small ? 'h-9' : 'h-12'">
    <button
      type="button"
      class="grid place-items-center h-full aspect-square hover:bg-field disabled:opacity-30 transition-colors"
      :disabled="modelValue <= min"
      aria-label="Decrease quantity"
      @click="set(modelValue - 1)"
    >
      <Icon name="lucide:minus" size="14" />
    </button>
    <span class="w-8 text-center text-sm tabular-nums" aria-live="polite">{{ modelValue }}</span>
    <button
      type="button"
      class="grid place-items-center h-full aspect-square hover:bg-field disabled:opacity-30 transition-colors"
      :disabled="modelValue >= max"
      aria-label="Increase quantity"
      @click="set(modelValue + 1)"
    >
      <Icon name="lucide:plus" size="14" />
    </button>
  </div>
</template>
