<!-- iranflix/pages/panel/downloads.vue -->
<template>
  <div class="space-y-5">
    <div class="flex items-center justify-between gap-3">
      <div>
        <h1 class="text-2xl font-bold">دانلودها</h1>
        <p class="text-sm text-text-muted mt-1">{{ formatNum(rows.length) }} دانلود</p>
      </div>
      <button v-if="rows.length" type="button" class="text-sm text-red-400 hover:text-red-300 transition-colors" @click="confirmClear = true">
        پاک کردن همه
      </button>
    </div>

    <ul v-if="rows.length" class="space-y-3">
      <li
        v-for="(r, i) in rows"
        :key="i"
        class="flex items-center gap-4 bg-bg-card rounded-xl p-3 border border-white/5"
      >
        <img
          v-if="r.movie"
          :src="r.movie.poster"
          :alt="r.movie.title_fa"
          loading="lazy"
          class="w-12 h-16 rounded-lg object-cover shrink-0 bg-bg-elevated"
        />
        <div v-else class="w-12 h-16 rounded-lg bg-bg-elevated shrink-0" />

        <div class="flex-1 min-w-0">
          <p class="font-semibold text-sm truncate">{{ r.movie?.title_fa ?? 'فیلم حذف شده است' }}</p>
          <p class="text-xs text-text-muted mt-1">{{ formatDateTime(r.at) }}</p>
        </div>

        <span class="text-xs font-inter font-bold bg-white/10 rounded px-2 py-1">{{ r.quality }}</span>

        <NuxtLink
          v-if="r.movie"
          :to="`/movie/${r.movie.id}`"
          class="text-xs bg-accent hover:bg-accent-hover text-white font-bold px-3 py-2 rounded-lg whitespace-nowrap transition-colors"
        >
          دانلود مجدد
        </NuxtLink>
      </li>
    </ul>

    <div v-else class="bg-bg-card rounded-xl p-10 text-center border border-white/5">
      <p class="text-4xl mb-3">⬇️</p>
      <p class="text-text-secondary">هنوز چیزی دانلود نکرده‌اید.</p>
    </div>

    <ConfirmDialog
      :open="confirmClear"
      title="پاک کردن سابقه‌ی دانلود"
      message="سابقه‌ی دانلودهای شما پاک می‌شود. ادامه می‌دهید؟"
      confirm-text="پاک کن"
      danger
      @confirm="clearAll"
      @cancel="confirmClear = false"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useHead } from 'nuxt/app'
import { useUserStore } from '../../stores/user'
import { useMoviesStore } from '../../stores/movies'
import { formatNum, formatDateTime } from '../../utils/format'

definePageMeta({ layout: 'panel', middleware: 'auth' })
useHead({ title: 'دانلودها - ایران‌فلیکس' })

const userStore = useUserStore()
const moviesStore = useMoviesStore()
await moviesStore.ensureReady()

const confirmClear = ref(false)

const rows = computed(() =>
  userStore.downloads.map((d) => ({ ...d, movie: moviesStore.getMovieById(d.id) })),
)

function clearAll() {
  userStore.clearDownloads()
  confirmClear.value = false
}
</script>
