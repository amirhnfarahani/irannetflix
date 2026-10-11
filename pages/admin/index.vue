<!-- iranflix/pages/admin/index.vue — داشبورد مدیریت -->
<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold">داشبورد مدیریت</h1>
      <p class="text-sm text-text-muted mt-1">نمای کلی از وضعیت ایران‌فلیکس</p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <PanelStatCard label="فیلم‌ها" :value="formatNum(movieCount)" icon="🎬" />
      <PanelStatCard label="سریال‌ها" :value="formatNum(seriesCount)" icon="📺" tone="blue" />
      <PanelStatCard label="کاربران" :value="formatNum(users.length)" icon="👥" tone="green" :hint="`${formatNum(premiumCount)} اشتراک ویژه`" />
      <PanelStatCard label="درآمد ماهانه (تخمینی)" :value="formatNum(revenue)" icon="💰" tone="gold" hint="تومان" />
      <PanelStatCard label="کل تماشاها" :value="formatNum(totalViews)" icon="👁️" />
      <PanelStatCard label="کل دانلودها" :value="formatNum(totalDownloads)" icon="⬇️" tone="blue" />
      <PanelStatCard label="کاربران مسدود" :value="formatNum(bannedCount)" icon="🚫" tone="accent" />
      <PanelStatCard label="مدیران" :value="formatNum(adminCount)" icon="🛠️" tone="gold" />
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-2 gap-5">
      <!-- Registrations chart -->
      <section class="bg-bg-card rounded-xl p-5 border border-white/5">
        <h2 class="font-bold mb-4">ثبت‌نام‌های ۷ روز اخیر</h2>
        <div class="flex items-end gap-3 h-40" dir="ltr">
          <div v-for="d in last7" :key="d.key" class="flex-1 flex flex-col items-center justify-end h-full gap-1">
            <span class="text-[11px] text-text-secondary">{{ formatNum(d.count) }}</span>
            <div
              class="w-full rounded-t bg-accent/80 min-h-[3px] transition-all"
              :style="{ height: (d.count / maxDay) * 100 + '%' }"
            />
            <span class="text-[10px] text-text-muted">{{ d.label }}</span>
          </div>
        </div>
      </section>

      <!-- Top watched -->
      <section class="bg-bg-card rounded-xl p-5 border border-white/5">
        <h2 class="font-bold mb-4">پربازدیدترین‌ها</h2>
        <ul v-if="topWatched.length" class="space-y-3">
          <li v-for="t in topWatched" :key="t.id">
            <div class="flex items-center justify-between text-sm mb-1">
              <span class="truncate">{{ t.title }}</span>
              <span class="text-text-muted text-xs">{{ formatNum(t.count) }} تماشا</span>
            </div>
            <div class="h-2 bg-bg-elevated rounded-full overflow-hidden">
              <div class="h-full bg-accent rounded-full" :style="{ width: (t.count / topMax) * 100 + '%' }" />
            </div>
          </li>
        </ul>
        <p v-else class="text-sm text-text-muted">هنوز داده‌ای ثبت نشده است.</p>
      </section>

      <!-- Genres -->
      <section class="bg-bg-card rounded-xl p-5 border border-white/5">
        <h2 class="font-bold mb-4">توزیع ژانرها</h2>
        <ul class="space-y-3">
          <li v-for="g in genreStats" :key="g.name">
            <div class="flex items-center justify-between text-sm mb-1">
              <span>{{ g.name }}</span>
              <span class="text-text-muted text-xs">{{ formatNum(g.count) }}</span>
            </div>
            <div class="h-2 bg-bg-elevated rounded-full overflow-hidden">
              <div class="h-full bg-gold rounded-full" :style="{ width: (g.count / genreMax) * 100 + '%' }" />
            </div>
          </li>
        </ul>
      </section>

      <!-- Recent users -->
      <section class="bg-bg-card rounded-xl p-5 border border-white/5">
        <div class="flex items-center justify-between mb-4">
          <h2 class="font-bold">آخرین کاربران</h2>
          <NuxtLink to="/admin/users" class="text-sm text-accent hover:text-accent-hover">همه</NuxtLink>
        </div>
        <ul class="space-y-3">
          <li v-for="u in recentUsers" :key="u.id" class="flex items-center gap-3">
            <img :src="u.avatar" alt="" class="w-9 h-9 rounded-full object-cover" />
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold truncate">{{ u.name }}</p>
              <p class="text-xs text-text-muted truncate" dir="ltr" style="text-align: right">{{ u.email }}</p>
            </div>
            <span class="text-xs text-text-muted whitespace-nowrap">{{ timeAgo(u.createdAt) }}</span>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useHead } from 'nuxt/app'
import { useUserStore } from '../../stores/user'
import { useMoviesStore } from '../../stores/movies'
import { formatNum, timeAgo } from '../../utils/format'

definePageMeta({ layout: 'panel', middleware: 'admin' })
useHead({ title: 'داشبورد مدیریت - ایران‌فلیکس' })

const PREMIUM_PRICE = 149000

const userStore = useUserStore()
const moviesStore = useMoviesStore()
await moviesStore.ensureReady()

const users = computed(() => userStore.users)
const movieCount = computed(() => moviesStore.onlyMovies.length)
const seriesCount = computed(() => moviesStore.onlySeries.length)
const premiumCount = computed(() => users.value.filter((u) => u.plan === 'premium').length)
const bannedCount = computed(() => users.value.filter((u) => u.status === 'banned').length)
const adminCount = computed(() => users.value.filter((u) => u.role === 'admin').length)
const revenue = computed(() => premiumCount.value * PREMIUM_PRICE)
const totalViews = computed(() => users.value.reduce((n, u) => n + u.watchHistory.length, 0))
const totalDownloads = computed(() => users.value.reduce((n, u) => n + u.downloads.length, 0))

const recentUsers = computed(() =>
  [...users.value].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5),
)

// ثبت‌نام ۷ روز اخیر
const last7 = computed(() => {
  const fmt = new Intl.DateTimeFormat('fa-IR', { weekday: 'short' })
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    d.setDate(d.getDate() - (6 - i))
    return { key: d.toDateString(), label: fmt.format(d), count: 0 }
  })
  for (const u of users.value) {
    const k = new Date(u.createdAt).toDateString()
    const day = days.find((d) => d.key === k)
    if (day) day.count++
  }
  return days
})
const maxDay = computed(() => Math.max(1, ...last7.value.map((d) => d.count)))

// پربازدیدترین‌ها بر اساس تاریخچه‌ی کاربران
const topWatched = computed(() => {
  const counts = new Map<number, number>()
  for (const u of users.value) for (const h of u.watchHistory) counts.set(h.id, (counts.get(h.id) ?? 0) + 1)
  return [...counts.entries()]
    .map(([id, count]) => ({ id, count, title: moviesStore.getMovieById(id)?.title_fa ?? `#${id}` }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
})
const topMax = computed(() => Math.max(1, ...topWatched.value.map((t) => t.count)))

const genreStats = computed(() => {
  const counts = new Map<string, number>()
  for (const m of moviesStore.all) for (const g of m.genre) counts.set(g, (counts.get(g) ?? 0) + 1)
  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6)
})
const genreMax = computed(() => Math.max(1, ...genreStats.value.map((g) => g.count)))
</script>
