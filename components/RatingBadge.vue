<!-- iranflix/components/RatingBadge.vue -->
<template>
  <span class="inline-flex items-center gap-1 bg-gold/20 text-gold rounded px-2 py-0.5 text-xs font-inter font-semibold">
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>
    <span>{{ score }}</span>
  </span>
</template>

<script setup lang="ts">
defineProps<{ score: string | number }>()
</script>
