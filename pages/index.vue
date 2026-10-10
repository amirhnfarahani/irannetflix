<!-- iranflix/pages/index.vue -->
<template>
  <div>
    <div v-if="store.loading" class="w-full h-[85vh] min-h-[520px] skeleton"></div>
    <HeroSection v-else-if="store.featured" :movie="store.featured" />

    <div class="mt-4 space-y-2">
      <MovieRow
        v-for="(label, key) in rowLabels"
        :key="key"
        :label="label"
        :movies="store.rows[key] ?? []"
        :loading="store.loading"
        :more-link="key === 'popular_series' ? '/series' : '/movies'"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useHead } from 'nuxt/app'
import { useMoviesStore } from '../stores/movies'
import { onMounted } from 'vue'

const store = useMoviesStore()
const rowLabels: Record<string, string> = {
  cinema_now: 'در حال پخش در سینماها',
  popular_series: 'سریال‌های پرطرفدار',
  iranian_top: 'فیلم‌های ایرانی برتر',
  suggested: 'پیشنهاد ما برای شما',
  new: 'جدیدترین‌ها',
  }
await store.loadAll()
useHead({ title: 'ایران‌فلیکس - تماشای آنلاین بهترین فیلم و سریال' })
</script>