<!-- /components/movieCard.vue -->
<template>
  <article
    class="movie-card w-40 md:w-48 rounded-lg overflow-visible cursor-pointer group"
    :aria-label="movie.title_fa"
    @click="$emit('click', movie)"
    @keydown.enter="$emit('click', movie)"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    tabindex="0"
    role="button"
  >
    <div class="relative aspect-[2/3] rounded-lg overflow-hidden bg-bg-card">
      
      <img
        :src="movie.poster"
        :alt="`پوستر فیلم ${movie.title_fa}`"
        loading="lazy"
        class="w-full h-full object-cover transition-opacity duration-300"
        :class="{ 'opacity-0': isVideoPlaying }"
      />

      <video
        ref="videoRef"
        :src="activeVideoSrc"
        loop
        muted
        playsinline
        preload="none"
        class="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-300"
        :class="{ 'opacity-100': isVideoPlaying }"
      ></video>

      <div
        v-if="movie.type === 'series' && movie.seasons"
        class="absolute top-2 end-2 bg-accent text-white text-xs font-vazir font-bold px-2 py-0.5 rounded z-10"
      >
        {{ movie.seasons }} فصل
      </div>

      <div class="absolute inset-0 bg-bg-primary/60 opacity-0 group-hover:opacity-100 transition-opacity duration-250 flex flex-col items-center justify-center gap-3 z-10">
        <button
          class="w-12 h-12 rounded-full bg-accent hover:bg-accent-hover flex items-center justify-center transition-colors"
          :aria-label="`پخش ${movie.title_fa}`"
          @click.stop="$emit('play', movie)"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white" aria-hidden="true">
            <path d="M8 5v14l11-7z"/>
          </svg>
        </button>

        <button
          class="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
          :aria-label="isInWatchlist ? 'حذف از لیست' : 'افزودن به لیست'"
          @click.stop="toggleWL"
        >
          <svg v-if="isInWatchlist" width="14" height="14" viewBox="0 0 24 24" fill="white" aria-hidden="true">
            <path d="M19 11H7.83l4.88-4.88c.39-.39.39-1.03 0-1.42-.39-.39-1.02-.39-1.41 0l-6.59 6.59c-.39.39-.39 1.02 0 1.41l6.59 6.59c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L7.83 13H19c.55 0 1-.45 1-1s-.45-1-1-1z"/>
          </svg>
          <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="white" aria-hidden="true">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
          </svg>
        </button>

        <div class="text-center px-2">
          <RatingBadge :score="movie.imdb.toFixed(1)" />
        </div>
      </div>
    </div>

    <div class="mt-2 px-0.5">
      <h3 class="text-sm font-vazir font-semibold text-text-primary line-clamp-1 leading-snug">
        {{ movie.title_fa }}
      </h3>
      <p class="text-xs text-text-muted mt-0.5 font-inter">
        {{ movie.year }}
        <span v-if="movie.type === 'series'" class="text-text-muted"> · {{ movie.episodes }} قسمت</span>
      </p>
    </div>
  </article>
</template>


<script setup lang="ts">
import type { Movie } from '../stores/movies'
import { useUserStore } from '../stores/user'
import { computed, ref, nextTick } from 'vue'

const props = defineProps<{ movie: Movie }>()
defineEmits<{
  click: [movie: Movie]
  play: [movie: Movie]
}>()

const userStore = useUserStore()
const isInWatchlist = computed(() => userStore.isInWatchlist(props.movie.id))

function toggleWL() {
  userStore.toggleWatchlist(props.movie.id)
}

// --- Video Logic for Testing ---
const videoRef = ref<HTMLVideoElement | null>(null)
const isVideoPlaying = ref(false)
let playTimeout: ReturnType<typeof setTimeout> | null = null

// استفاده از لینک‌های مستقیم MP4 که در تمام مرورگرها پشتیبانی می‌شوند و حجم پایینی دارند
const sampleVideos = [
  'https://vjs.zencdn.net/v/oceans.mp4',
  'https://media.w3.org/2010/05/sintel/trailer_hd.mp4'
]

const fakeVideoUrl = computed(() => {
  const index = props.movie.id % sampleVideos.length
  return sampleVideos[index]
})

// ویدیو فقط وقتی hover می‌شه لود می‌شه (نه برای همه‌ی کارت‌ها)
const activeVideoSrc = ref<string | undefined>(undefined)

function handleMouseEnter() {
  playTimeout = setTimeout(() => {
    activeVideoSrc.value = fakeVideoUrl.value
    nextTick(() => {
      if (!videoRef.value) return
      videoRef.value.play()
        .then(() => {
          isVideoPlaying.value = true
        })
        .catch((err) => {
          console.warn("پخش ویدیو توسط مرورگر مسدود یا متوقف شد:", err)
        })
    })
  }, 400)
}

function handleMouseLeave() {
  if (playTimeout) clearTimeout(playTimeout)
  if (videoRef.value) {
    videoRef.value.pause()
    videoRef.value.currentTime = 0
  }
  isVideoPlaying.value = false
}
</script>