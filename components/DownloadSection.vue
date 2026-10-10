<!-- iranflix/components/DownloadSection.vue -->
<template>
  <section class="bg-bg-card rounded-xl p-5 font-vazir" aria-label="دانلود">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-base font-bold text-text-primary flex items-center gap-2">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
        </svg>
        دانلود {{ type === 'series' ? 'سریال' : 'فیلم' }}
      </h2>
      <span class="text-xs text-text-muted">{{ plan === 'premium' ? 'اشتراک ویژه' : 'اشتراک رایگان' }}</span>
    </div>

    <!-- Not logged in -->
    <div
      v-if="!userStore.isLoggedIn"
      class="flex flex-col sm:flex-row items-center justify-between gap-3 bg-bg-elevated rounded-lg p-4"
    >
      <p class="text-sm text-text-secondary">برای دانلود ابتدا وارد حساب کاربری خود شوید.</p>
      <NuxtLink
        to="/login"
        class="bg-accent hover:bg-accent-hover text-white text-sm font-bold px-5 py-2 rounded-lg transition-colors"
      >
        ورود
      </NuxtLink>
    </div>

    <template v-else>
      <ul class="space-y-2">
        <li
          v-for="item in items"
          :key="item.quality"
          class="flex items-center justify-between gap-3 bg-bg-elevated rounded-lg px-4 py-3 border border-white/5"
          :class="{ 'opacity-60': item.locked }"
        >
          <div class="flex items-center gap-3 min-w-0">
            <span class="font-inter font-bold text-sm text-text-primary w-12">{{ item.label }}</span>
            <span
              v-if="item.badge"
              class="text-[10px] font-inter font-bold bg-gold/20 text-gold rounded px-1.5 py-0.5"
            >
              {{ item.badge }}
            </span>
            <span class="text-xs text-text-muted truncate">{{ item.sizeText }}</span>
          </div>

          <NuxtLink
            v-if="item.locked"
            to="/register"
            class="text-xs font-semibold text-accent hover:text-accent-hover whitespace-nowrap"
          >
            ارتقا به اشتراک ویژه
          </NuxtLink>

          <a
            v-else
            :href="item.url"
            :download="item.filename"
            target="_blank"
            rel="noopener"
            class="inline-flex items-center gap-1.5 bg-accent hover:bg-accent-hover text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
            :aria-label="`دانلود ${title} با کیفیت ${item.label}`"
            @click="onDownload(item)"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
            </svg>
            دانلود
          </a>
        </li>
      </ul>

      <p v-if="lastDownloaded" class="mt-3 text-xs text-text-secondary" role="status">
        دانلود با کیفیت {{ lastDownloaded }} شروع شد.
      </p>
    </template>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useUserStore } from '../stores/user'

interface DownloadSource {
  quality: string // مثلا '720'
  url: string
  sizeMB?: number // اگر ندهی از روی مدت زمان تخمین زده می‌شود
}

const props = defineProps<{
  title: string
  duration: number // دقیقه
  type?: 'movie' | 'series'
  // آدرس واحد (تست) یا لیست کامل لینک‌ها برای هر کیفیت
  videoUrl?: string
  sources?: DownloadSource[]
}>()

const userStore = useUserStore()
const plan = computed(() => userStore.profile?.plan ?? 'free')
const lastDownloaded = ref('')

// کیفیت‌ها: bitrate تقریبی (kbps) برای تخمین حجم، و اینکه فقط اشتراک ویژه یا نه
const QUALITIES = [
  { quality: '360', label: '360p', kbps: 800, premium: false, badge: '' },
  { quality: '480', label: '480p', kbps: 1400, premium: false, badge: '' },
  { quality: '720', label: '720p', kbps: 2800, premium: false, badge: 'HD' },
  { quality: '1080', label: '1080p', kbps: 5000, premium: true, badge: 'FHD' },
  { quality: '2160', label: '4K', kbps: 15000, premium: true, badge: 'UHD' },
]

function formatSize(mb: number): string {
  const fmt = (n: number) => n.toLocaleString('fa-IR', { maximumFractionDigits: 1 })
  return mb >= 1024 ? `${fmt(mb / 1024)} گیگابایت` : `${fmt(Math.round(mb))} مگابایت`
}

const safeName = computed(() => props.title.replace(/[\\/:*?"<>|\s]+/g, '_'))

const items = computed(() =>
  QUALITIES.map((q) => {
    const src = props.sources?.find((s) => s.quality === q.quality)
    const mb = src?.sizeMB ?? (props.duration * 60 * q.kbps) / 8 / 1024
    return {
      ...q,
      url: src?.url ?? props.videoUrl ?? '',
      sizeText: formatSize(mb),
      filename: `${safeName.value}_${q.label}.mp4`,
      locked: q.premium && plan.value !== 'premium',
    }
  }).filter((i) => !props.sources?.length || i.url),
)

function onDownload(item: { label: string }) {
  lastDownloaded.value = item.label
}
</script>
