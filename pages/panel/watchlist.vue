<!-- iranflix/pages/panel/watchlist.vue -->
<template>
  <div class="space-y-5">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold">لیست من</h1>
        <p class="text-sm text-text-muted mt-1">{{ formatNum(movies.length) }} مورد</p>
      </div>
    </div>

    <div v-if="movies.length" class="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
      <PanelMovieCard v-for="m in movies" :key="m.id" :movie="m">
        <button
          type="button"
          class="text-xs text-red-400 hover:text-red-300 text-start transition-colors"
          @click="userStore.toggleWatchlist(m.id)"
        >
          حذف از لیست
        </button>
      </PanelMovieCard>
    </div>

    <div v-else class="bg-bg-card rounded-xl p-10 text-center border border-white/5">
      <p class="text-4xl mb-3">📋</p>
      <p class="text-text-secondary mb-4">هنوز فیلمی به لیست خود اضافه نکرده‌اید.</p>
      <NuxtLink to="/movies" class="inline-block bg-accent hover:bg-accent-hover text-white text-sm font-bold px-5 py-2 rounded-lg transition-colors">
        مشاهده‌ی فیلم‌ها
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useHead } from 'nuxt/app'
import { useUserStore } from '../../stores/user'
import { useMoviesStore } from '../../stores/movies'
import { formatNum } from '../../utils/format'

definePageMeta({ layout: 'panel', middleware: 'auth' })
useHead({ title: 'لیست من - ایران‌فلیکس' })

const userStore = useUserStore()
const moviesStore = useMoviesStore()
await moviesStore.ensureReady()

const movies = computed(() =>
  userStore.watchlist.map((id) => moviesStore.getMovieById(id)).filter((m): m is NonNullable<typeof m> => !!m),
)
</script>
