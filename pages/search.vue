<!-- iranflix/pages/search.vue -->
<template>
  <div class="pt-24 px-4 md:px-8 max-w-screen-xl mx-auto min-h-screen">
    <!-- Search header -->
    <div class="max-w-2xl mx-auto mb-10">
      <h1 class="text-2xl font-vazir font-bold text-text-primary mb-6 text-center">جستجو در ایران‌فلیکس</h1>
      <SearchBar
        v-model="query"
        placeholder="نام فیلم، سریال، کارگردان یا بازیگر..."
        :autofocus="true"
        @search="doSearch"
      />
    </div>

    <!-- Trending (empty state) -->
    <div v-if="!query" class="text-center">
      <h2 class="text-lg font-vazir font-semibold text-text-secondary mb-6">جستجوهای محبوب</h2>
      <div class="flex flex-wrap justify-center gap-3">
        <button
          v-for="tag in trending"
          :key="tag"
          class="bg-bg-card hover:bg-bg-elevated border border-white/10 rounded-full px-5 py-2 text-sm font-vazir text-text-secondary hover:text-white transition-colors"
          @click="query = tag; doSearch(tag)"
        >
          {{ tag }}
        </button>
      </div>

      <!-- Suggested row -->
      <div class="mt-12 text-start">
        <MovieRow label="پیشنهاد ما" :movies="store.rows['suggested'] ?? []" more-link="/movies" />
      </div>
    </div>

    <!-- Results -->
    <div v-else>
      <!-- Loading -->
      <div v-if="store.loading" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div v-for="n in 6" :key="n" class="space-y-2">
          <div class="skeleton aspect-[2/3] rounded-lg"></div>
          <div class="skeleton h-3 rounded w-3/4"></div>
        </div>
      </div>

      <!-- No results -->
      <div v-else-if="store.searchResults.length === 0" class="py-20 text-center animate-fadeIn">
        <div class="text-8xl mb-6 opacity-50">🔍</div>
        <h2 class="text-2xl font-vazir font-bold text-text-primary mb-3">چیزی پیدا نشد</h2>
        <p class="text-text-muted font-vazir">
          برای «<span class="text-text-secondary">{{ query }}</span>» نتیجه‌ای یافت نشد.
        </p>
        <p class="text-text-muted font-vazir text-sm mt-2">کلمات دیگری را امتحان کنید.</p>
      </div>

      <!-- Results grid -->
      <div v-else class="animate-fadeIn">
        <p class="text-text-muted text-sm font-vazir mb-5">
          {{ store.searchResults.length }} نتیجه برای «<span class="text-text-primary">{{ query }}</span>»
        </p>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <MovieCard
            v-for="movie in store.searchResults"
            :key="movie.id"
            :movie="movie"
            class="!w-full"
            @click="navigate"
            @play="navigate"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import { useMoviesStore, type Movie } from '../stores/movies'
import { useRouter, useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'

// ← این دو تابع باید اول از همه باشن


const store = useMoviesStore()
const router = useRouter()
const route = useRoute()

const query = ref((route.query.q as string) ?? '')

const trending = ['اصغر فرهادی', 'شهرزاد', 'اوپنهایمر', 'جدایی', 'سریال ایرانی', 'درام', 'اکشن']

function doSearch(q: string) {
  store.search(q)
  router.replace({ query: q ? { q } : {} })
}

function navigate(movie: Movie) {
  router.push(`/movie/${movie.id}`)
}

onMounted(async () => {
  await store.loadAll()
  if (query.value) doSearch(query.value)
})
</script>
