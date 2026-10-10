<!-- iranflix/components/GenreTag.vue -->
<template>
  <span class="inline-block bg-white/10 text-text-secondary text-xs rounded-full px-3 py-1 font-vazir">
    {{ genre }}
  </span>
</template>

<script setup lang="ts">
defineProps<{ genre: string }>()
</script>
