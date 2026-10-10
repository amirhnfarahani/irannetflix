<!-- iranflix/components/SearchBar.vue -->
<template>
  <div class="relative w-full">
    <label :for="inputId" class="sr-only">جستجو در ایران‌فلیکس</label>
    <div class="relative">
      <span class="absolute inset-y-0 end-4 flex items-center pointer-events-none text-text-muted">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
        </svg>
      </span>
      <input
        :id="inputId"
        ref="inputRef"
        v-model="localQuery"
        type="search"
        :placeholder="placeholder"
        class="w-full bg-bg-elevated border border-white/10 rounded-xl py-3 pe-12 ps-4 text-text-primary placeholder:text-text-muted font-vazir text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
        :autofocus="autofocus"
        @input="onInput"
        @keydown.escape="localQuery = ''; emit('update:modelValue', '')"
      />
    </div>
  </div>
  
</template>

<script setup lang="ts">
import { ref,watch, onMounted} from 'vue';
const props = defineProps<{
  modelValue?: string
  placeholder?: string
  autofocus?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  search: [value: string]
}>()

const inputId = `search-${Math.random().toString(36).slice(2, 8)}`
const inputRef = ref<HTMLInputElement | null>(null)
const localQuery = ref(props.modelValue ?? '')

let debounceTimer: ReturnType<typeof setTimeout>

function onInput() {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    emit('update:modelValue', localQuery.value)
    emit('search', localQuery.value)
  }, 300)
}

watch(() => props.modelValue, (v) => {
  if (v !== localQuery.value) localQuery.value = v ?? ''
})

onMounted(() => {
  if (props.autofocus) inputRef.value?.focus()
})
</script>
