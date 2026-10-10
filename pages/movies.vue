<!-- iranflix/pages/movies.vue -->
<template>
  <div class="pt-20 px-4 md:px-8 max-w-screen-2xl mx-auto">
    <h1 class="text-2xl font-vazir font-bold text-text-primary mb-6">فیلم‌ها</h1>

    <div class="flex flex-col lg:flex-row gap-6">
      <!-- Sidebar -->
      <FilterSidebar @filter-change="applyFilters" />

      <!-- Grid -->
      <div class="flex-1">
        <!-- Results count -->
        <p class="text-text-muted text-sm font-vazir mb-4">
          {{ filtered.length }} فیلم یافت شد
        </p>

        <!-- Loading skeletons -->
        <div v-if="store.loading" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          <div v-for="n in 12" :key="n" class="space-y-2">
            <div class="skeleton aspect-[2/3] rounded-lg"></div>
            <div class="skeleton h-3 rounded w-3/4"></div>
          </div>
        </div>

        <!-- Movie grid -->
        <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          <MovieCard
            v-for="movie in filtered"
            :key="movie.id"
            :movie="movie"
            class="!w-full"
            @click="navigate"
            @play="navigate"
          />
        </div>

        <!-- Empty state -->
        <div v-if="!store.loading && filtered.length === 0" class="py-20 text-center">
          <div class="text-6xl mb-4">🎬</div>
          <h2 class="text-xl font-vazir font-bold text-text-primary mb-2">فیلمی یافت نشد</h2>
          <p class="text-text-muted font-vazir text-sm">فیلتر‌های خود را تغییر دهید</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMoviesStore, type Movie } from '../stores/movies'
import { useRouter} from 'vue-router'
import { ref , onMounted ,computed} from 'vue'

const store = useMoviesStore()
const router = useRouter()

interface Filters {
  genres: string[]
  yearFrom: number
  yearTo: number
  minImdb: number
  type: 'all' | 'movie' | 'series'
  language: string
}

const activeFilters = ref<Filters>({
  genres: [],
  yearFrom: 1960,
  yearTo: 2024,
  minImdb: 0,
  type: 'movie',
  language: '',
})

const filtered = computed(() => {
  return store.all.filter(m => {
    if (m.type !== 'movie') return false
    if (activeFilters.value.genres.length && !activeFilters.value.genres.some(g => m.genre.includes(g))) return false
    if (m.year < activeFilters.value.yearFrom || m.year > activeFilters.value.yearTo) return false
    if (m.imdb < activeFilters.value.minImdb) return false
    if (activeFilters.value.language && m.language !== activeFilters.value.language) return false
    return true
  })
})

function applyFilters(f: Filters) {
  activeFilters.value = f
}

function navigate(movie: Movie) {
  router.push(`/movie/${movie.id}`)
}

await store.loadAll()
</script>
