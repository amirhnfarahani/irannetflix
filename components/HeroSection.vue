<!-- iranflix/components/HeroSection.vue -->
<template>
  <section class="relative w-full h-[85vh] min-h-[520px] overflow-hidden" aria-label="فیلم ویژه">
    <!-- Blurred background -->
    <div
      class="absolute inset-0 scale-110"
      :style="`background: url('${movie.backdrop}') center/cover no-repeat;`"
    >
      <div class="absolute inset-0 backdrop-blur-sm bg-bg-primary/30"></div>
    </div>

    <!-- Gradient overlay bottom -->
    <div class="absolute inset-0 bg-gradient-hero"></div>
    <!-- Gradient overlay right (RTL) -->
    <div class="absolute inset-0 bg-gradient-to-l from-bg-primary/80 via-transparent to-transparent"></div>

    <!-- Content -->
    <div class="relative z-10 flex flex-col justify-end h-full px-6 md:px-12 pb-12 max-w-3xl">
      <!-- Type badge -->
      <span class="text-xs font-inter uppercase tracking-widest text-accent font-semibold mb-3">
        {{ movie.type === 'series' ? 'سریال' : 'فیلم' }}
      </span>

      <!-- Title -->
      <h1 class="text-4xl md:text-6xl font-vazir font-extrabold text-white text-shadow leading-tight mb-4">
        {{ movie.title_fa }}
      </h1>

      <!-- Meta row -->
      <div class="flex flex-wrap items-center gap-3 mb-4">
        <RatingBadge :score="movie.imdb.toFixed(1)" />
        <span class="text-text-secondary font-inter text-sm">{{ movie.year }}</span>
        <span class="text-text-secondary font-vazir text-sm">{{ formatDuration(movie.duration) }}</span>
        <span class="text-text-secondary font-vazir text-sm">{{ movie.country }}</span>
      </div>

      <!-- Genre tags -->
      <div class="flex flex-wrap gap-2 mb-6">
        <GenreTag v-for="g in movie.genre" :key="g" :genre="g" />
      </div>

      <!-- Synopsis -->
      <p class="text-text-secondary font-vazir text-sm md:text-base leading-relaxed line-clamp-3 mb-8 max-w-xl">
        {{ movie.synopsis_fa }}
      </p>

      <!-- CTAs -->
      <div class="flex flex-wrap gap-3">
        <NuxtLink
          :to="`/movie/${movie.id}`"
          class="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-white font-vazir font-bold px-7 py-3 rounded-lg transition-colors text-sm md:text-base focus-visible:ring-2 focus-visible:ring-white"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M8 5v14l11-7z"/>
          </svg>
          پخش
        </NuxtLink>

        <NuxtLink
          :to="`/movie/${movie.id}`"
          class="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-vazir font-semibold px-7 py-3 rounded-lg border border-white/20 transition-colors text-sm md:text-base"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
          </svg>
          اطلاعات بیشتر
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">

import type { Movie } from '../stores/movies'

defineProps<{ movie: Movie }>()

function formatDuration(min: number): string {
  const h = Math.floor(min / 60)
  const m = min % 60
  if (h === 0) return `${m} دقیقه`
  return `${h} ساعت${m > 0 ? ` و ${m} دقیقه` : ''}`
}
</script>
