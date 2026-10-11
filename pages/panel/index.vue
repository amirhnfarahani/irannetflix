<!-- iranflix/pages/panel/index.vue — داشبورد پنل کاربری -->
<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold">سلام، {{ userStore.profile?.name }} 👋</h1>
      <p class="text-sm text-text-muted mt-1">خلاصه‌ی فعالیت شما در ایران‌فلیکس</p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <PanelStatCard label="فیلم‌های دیده‌شده" :value="formatNum(userStore.watchHistory.length)" icon="🎞️" />
      <PanelStatCard label="لیست من" :value="formatNum(userStore.watchlist.length)" icon="📋" tone="gold" />
      <PanelStatCard label="دانلودها" :value="formatNum(userStore.downloads.length)" icon="⬇️" tone="blue" />
      <PanelStatCard
        label="اشتراک"
        :value="userStore.profile?.plan === 'premium' ? 'ویژه' : 'رایگان'"
        icon="💎"
        tone="green"
        :hint="userStore.profile?.plan === 'premium' ? 'کیفیت 4K و بدون آگهی' : 'کیفیت تا 720p'"
      />
    </div>

    <NuxtLink
      v-if="userStore.profile?.plan !== 'premium'"
      to="/panel/subscription"
      class="block bg-gradient-to-l from-accent/30 to-bg-card rounded-xl p-5 border border-accent/30 hover:border-accent transition-colors"
    >
      <p class="font-bold mb-1">ارتقا به اشتراک ویژه 💎</p>
      <p class="text-sm text-text-secondary">دانلود با کیفیت 1080p و 4K و تماشای بدون آگهی</p>
    </NuxtLink>

    <section>
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-lg font-bold">ادامه‌ی تماشا</h2>
        <NuxtLink to="/panel/history" class="text-sm text-accent hover:text-accent-hover">همه</NuxtLink>
      </div>
      <div v-if="continueItems.length" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        <PanelMovieCard v-for="i in continueItems" :key="i.movie.id" :movie="i.movie" :progress="i.progress">
          <p class="text-xs text-text-muted">{{ timeAgo(i.watchedAt) }}</p>
        </PanelMovieCard>
      </div>
      <p v-else class="text-sm text-text-muted bg-bg-card rounded-xl p-6 text-center border border-white/5">
        هنوز چیزی تماشا نکرده‌اید.
        <NuxtLink to="/movies" class="text-accent hover:text-accent-hover">فیلم‌ها را ببینید</NuxtLink>
      </p>
    </section>

    <section>
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-lg font-bold">لیست من</h2>
        <NuxtLink to="/panel/watchlist" class="text-sm text-accent hover:text-accent-hover">همه</NuxtLink>
      </div>
      <div v-if="watchlistMovies.length" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        <PanelMovieCard v-for="m in watchlistMovies.slice(0, 4)" :key="m.id" :movie="m" />
      </div>
      <p v-else class="text-sm text-text-muted bg-bg-card rounded-xl p-6 text-center border border-white/5">
        لیست شما خالی است.
      </p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useHead } from 'nuxt/app'
import { useUserStore } from '../../stores/user'
import { useMoviesStore } from '../../stores/movies'
import { formatNum, timeAgo } from '../../utils/format'

definePageMeta({ layout: 'panel', middleware: 'auth' })
useHead({ title: 'پنل کاربری - ایران‌فلیکس' })

const userStore = useUserStore()
const moviesStore = useMoviesStore()
await moviesStore.ensureReady()

const continueItems = computed(() =>
  userStore.watchHistory
    .map((h) => ({ movie: moviesStore.getMovieById(h.id), progress: h.progress, watchedAt: h.watchedAt }))
    .filter((x): x is { movie: NonNullable<typeof x.movie>; progress: number; watchedAt: string } => !!x.movie)
    .slice(0, 4),
)

const watchlistMovies = computed(() =>
  userStore.watchlist.map((id) => moviesStore.getMovieById(id)).filter((m): m is NonNullable<typeof m> => !!m),
)
</script>
