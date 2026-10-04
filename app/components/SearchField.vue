<script setup lang="ts">
const props = withDefaults(defineProps<{ modelValue?: string; live?: boolean; placeholder?: string }>(), {
  modelValue: '',
  live: false,
  placeholder: 'Search',
})
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const term = ref(props.modelValue)
watch(() => props.modelValue, (v) => (term.value = v))

// "live" fields filter in place (products page); others navigate to the results page
let timer: ReturnType<typeof setTimeout> | undefined
watch(term, (v) => {
  if (!props.live) return
  clearTimeout(timer)
  timer = setTimeout(() => emit('update:modelValue', v.trim()), 300)
})

function submit() {
  const q = term.value.trim()
  if (props.live) emit('update:modelValue', q)
  else navigateTo({ path: '/products', query: q ? { q } : {} })
}
</script>

<template>
  <form role="search" class="flex items-center h-11 bg-field/90 focus-within:bg-field transition-colors" @submit.prevent="submit">
    <Icon name="lucide:search" size="18" class="ml-4 shrink-0" />
    <input
      v-model="term"
      type="search"
      :aria-label="placeholder"
      class="flex-1 min-w-0 h-full bg-transparent px-3 text-sm placeholder:text-transparent focus:outline-none"
      :placeholder="placeholder"
    />
    <button type="submit" class="px-4 h-full text-sm text-muted hover:text-ink transition-colors">Search</button>
  </form>
</template>
