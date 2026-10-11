<!-- iranflix/components/PanelMovieCard.vue — کارت ساده‌ی فیلم برای صفحات پنل -->
<template>
  <article class="group bg-bg-card rounded-xl overflow-hidden border border-white/5 flex flex-col">
    <NuxtLink :to="`/movie/${movie.id}`" class="relative block aspect-[2/3] bg-bg-elevated">
      <img :src="movie.poster" :alt="movie.title_fa" loading="lazy" class="w-full h-full object-cover" />
      <span
        v-if="movie.type === 'series'"
        class="absolute top-2 start-2 text-[10px] font-bold bg-accent text-white rounded px-1.5 py-0.5"
      >
        سریال
      </span>
      <div v-if="progress !== undefined" class="absolute bottom-0 inset-x-0 h-1 bg-black/60">
        <div class="h-full bg-accent" :style="{ width: Math.min(100, Math.max(0, progress)) + '%' }" />
      </div>
    </NuxtLink>

    <div class="p-3 flex-1 flex flex-col gap-2">
      <div class="min-w-0">
        <NuxtLink :to="`/movie/${movie.id}`" class="block text-sm font-semibold truncate hover:text-accent transition-colors">
          {{ movie.title_fa }}
        </NuxtLink>
        <p class="text-xs text-text-muted truncate">
          {{ movie.year.toLocaleString('fa-IR', { useGrouping: false }) }} · IMDb {{ movie.imdb }}
        </p>
      </div>
      <slot />
    </div>
  </article>
</template>

<script setup lang="ts">
import type { Movie } from '../stores/movies'

defineProps<{
  movie: Movie
  progress?: number
}>()
</script>
