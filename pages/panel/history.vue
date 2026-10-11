<!-- iranflix/pages/panel/history.vue -->
<template>
  <div class="space-y-5">
    <div class="flex items-center justify-between gap-3">
      <div>
        <h1 class="text-2xl font-bold">تاریخچه تماشا</h1>
        <p class="text-sm text-text-muted mt-1">{{ formatNum(items.length) }} مورد</p>
      </div>
      <button
        v-if="items.length"
        type="button"
        class="text-sm text-red-400 hover:text-red-300 transition-colors"
        @click="confirmClear = true"
      >
        پاک کردن همه
      </button>
    </div>

    <div v-if="items.length" class="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
      <PanelMovieCard v-for="i in items" :key="i.movie.id" :movie="i.movie" :progress="i.progress">
        <div class="flex items-center justify-between text-xs text-text-muted">
          <span>{{ i.progress >= 100 ? 'تمام شده' : `${formatNum(i.progress)}٪` }}</span>
          <span>{{ timeAgo(i.watchedAt) }}</span>
        </div>
        <button
          type="button"
          class="text-xs text-red-400 hover:text-red-300 text-start transition-colors"
          @click="userStore.removeFromHistory(i.movie.id)"
        >
          حذف از تاریخچه
        </button>
      </PanelMovieCard>
    </div>

    <div v-else class="bg-bg-card rounded-xl p-10 text-center border border-white/5">
      <p class="text-4xl mb-3">🕘</p>
      <p class="text-text-secondary">تاریخچه‌ی تماشای شما خالی است.</p>
    </div>

    <ConfirmDialog
      :open="confirmClear"
      title="پاک کردن تاریخچه"
      message="همه‌ی تاریخچه‌ی تماشای شما پاک می‌شود. ادامه می‌دهید؟"
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
import { formatNum, timeAgo } from '../../utils/format'

definePageMeta({ layout: 'panel', middleware: 'auth' })
useHead({ title: 'تاریخچه تماشا - ایران‌فلیکس' })

const userStore = useUserStore()
const moviesStore = useMoviesStore()
await moviesStore.ensureReady()

const confirmClear = ref(false)

const items = computed(() =>
  userStore.watchHistory
    .map((h) => ({ movie: moviesStore.getMovieById(h.id), progress: h.progress, watchedAt: h.watchedAt }))
    .filter((x): x is { movie: NonNullable<typeof x.movie>; progress: number; watchedAt: string } => !!x.movie),
)

function clearAll() {
  userStore.clearHistory()
  confirmClear.value = false
}
</script>
