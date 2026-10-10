<!-- iranflix/components/MovieRow.vue -->
<template>
  <section class="py-4 relative z-0">
    <!-- Row header -->
    <div class="flex items-center justify-between px-4 md:px-8 mb-2">
      <h2 class="text-lg md:text-xl font-vazir font-bold text-text-primary">{{ label }}</h2>
      <NuxtLink
        v-if="moreLink"
        :to="moreLink"
        class="text-sm text-text-secondary hover:text-accent transition-colors flex items-center gap-1 font-vazir"
      >
        مشاهده همه
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="rtl-flip" aria-hidden="true">
          <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
        </svg>
      </NuxtLink>
    </div>

    <!-- Scroll container -->
    <div class="relative">
      <!-- Left scroll button -->
      <button
        v-if="showScrollButtons"
        class="absolute start-0 top-1/2 -translate-y-1/2 z-20 w-10 h-16 bg-bg-primary/80 backdrop-cinema flex items-center justify-center hover:bg-bg-elevated transition-colors"
        aria-label="قبلی"
        @click="handleScrollLeft"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="white" aria-hidden="true">
          <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
        </svg>
      </button>

      <!-- Cinema strip row -->
      <div
        ref="rowRef"
        class="cinema-row pt-8 px-8 cursor-grab active:cursor-grabbing select-none"
        :class="{ 'cursor-grabbing': isDragging }"
        @mousedown="onMouseDown"
        @mousemove="onMouseMove"
        @mouseup="onMouseUp"
        @mouseleave="onMouseUp"
      >
        <template v-if="loading">
          <SkeletonCard v-for="n in 6" :key="n" />
        </template>
        <template v-else>
          <MovieCard
            v-for="movie in movies"
            :key="movie.id"
            :movie="movie"
            @click="navigateToMovie"
            @play="navigateToMovie"
          />
        </template>
      </div>

      <!-- Right scroll button -->
      <button
        v-if="showScrollButtons"
        class="absolute end-0 top-1/2 -translate-y-1/2 z-20 w-10 h-16 bg-bg-primary/80 backdrop-cinema flex items-center justify-center hover:bg-bg-elevated transition-colors"
        aria-label="بعدی"
        @click="handleScrollRight"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="white" class="rtl-flip" aria-hidden="true">
          <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
        </svg>
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import type { Movie } from '../stores/movies'
import {  onMounted, onUnmounted } from 'vue'
const props = defineProps<{
  label: string
  movies: Movie[]
  loading?: boolean
  moreLink?: string
}>()

const router = useRouter()
const rowRef = ref<HTMLDivElement | null>(null)

// drag state
const isDragging = ref(false)
const startX = ref(0)
const startScrollLeft = ref(0)
const dragDistance = ref(0)

// دکمه‌های اسکرول
function handleScrollLeft() {
  rowRef.value?.scrollBy({ left: 400, behavior: 'smooth' })
}

function handleScrollRight() {
  rowRef.value?.scrollBy({ left: -400, behavior: 'smooth' })
}

// drag handlers
function onMouseDown(e: MouseEvent) {
  if (!rowRef.value) return
  isDragging.value = true
  dragDistance.value = 0
  startX.value = e.pageX - rowRef.value.offsetLeft
  startScrollLeft.value = rowRef.value.scrollLeft
}

function onMouseMove(e: MouseEvent) {
  if (!isDragging.value || !rowRef.value) return
  e.preventDefault()
  const x = e.pageX - rowRef.value.offsetLeft
  const walk = (x - startX.value) * 1.5
  dragDistance.value = Math.abs(walk)
  rowRef.value.scrollLeft = startScrollLeft.value - walk
}

function onMouseUp() {
  isDragging.value = false
}

// اگه کاربر drag کرد، کلیک روی کارد رو کنسل کن
function navigateToMovie(movie: Movie) {
  if (dragDistance.value > 5) return
  router.push(`/movie/${movie.id}`)
}


// این بلوک رو قبل از showScrollButtons اضافه کن
const visibleCardCount = ref(8)

function updateVisibleCardCount() {
  const width = window.innerWidth
  if (width < 480) visibleCardCount.value = 2
  else if (width < 640) visibleCardCount.value = 3
  else if (width < 768) visibleCardCount.value = 4
  else if (width < 1024) visibleCardCount.value = 5
  else if (width < 1280) visibleCardCount.value = 6
  else visibleCardCount.value = 8
}

onMounted(() => {
  updateVisibleCardCount()
  window.addEventListener('resize', updateVisibleCardCount)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateVisibleCardCount)
})

const showScrollButtons = computed(() => props.movies.length > visibleCardCount.value)
</script>

<style scoped>
.cinema-row {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  overflow-y: visible;
  scroll-behavior: smooth;
  /* مخفی کردن اسکرول‌بار */
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.cinema-row::-webkit-scrollbar {
  display: none;
}
</style>