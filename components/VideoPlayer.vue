<!-- iranflix/components/VideoPlayer.vue — پخش‌کننده‌ی اختصاصی بر پایه‌ی Plyr (+ hls.js برای m3u8) -->
<template>
  <div
    ref="rootEl"
    class="iranflix-player w-full aspect-video bg-black rounded-xl overflow-hidden"
    dir="ltr"
    @mouseenter="hovering = true"
    @mouseleave="hovering = false"
  >
    <!-- ویدیو داخل onMounted ساخته می‌شود تا Vue و Plyr روی یک DOM دعوا نکنند -->
    <div ref="mountEl" class="w-full h-full"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, watch } from 'vue'

export interface SubtitleTrack {
  label: string // مثلا «فارسی»
  srclang: string // مثلا fa
  src: string // آدرس فایل .vtt
  default?: boolean
}

const props = withDefaults(
  defineProps<{
    src?: string
    title?: string
    backdrop?: string
    subtitles?: SubtitleTrack[]
    autoplay?: boolean
  }>(),
  { src: '', title: '', backdrop: '', subtitles: () => [], autoplay: false },
)

const rootEl = ref<HTMLDivElement | null>(null)
const mountEl = ref<HTMLDivElement | null>(null)
const hovering = ref(false)

let player: any = null
let hls: any = null
let videoEl: HTMLVideoElement | null = null

const SEEK_STEP = 10 // ثانیه
const VOLUME_STEP = 0.1

const i18n = {
  restart: 'شروع مجدد',
  rewind: 'عقب رفتن {seektime} ثانیه',
  play: 'پخش',
  pause: 'توقف',
  fastForward: 'جلو رفتن {seektime} ثانیه',
  seek: 'جستجو در ویدیو',
  seekLabel: '{currentTime} از {duration}',
  played: 'پخش‌شده',
  buffered: 'بافر شده',
  currentTime: 'زمان فعلی',
  duration: 'مدت',
  volume: 'صدا',
  mute: 'بی‌صدا',
  unmute: 'فعال‌کردن صدا',
  enableCaptions: 'روشن کردن زیرنویس',
  disableCaptions: 'خاموش کردن زیرنویس',
  enterFullscreen: 'تمام صفحه',
  exitFullscreen: 'خروج از تمام صفحه',
  captions: 'زیرنویس',
  settings: 'تنظیمات',
  pip: 'تصویر در تصویر',
  menuBack: 'بازگشت',
  speed: 'سرعت',
  normal: 'عادی',
  quality: 'کیفیت',
  disabled: 'خاموش',
  enabled: 'روشن',
  all: 'همه',
  reset: 'بازنشانی',
}

function isEditable(el: EventTarget | null) {
  const t = el as HTMLElement | null
  return !!t && (t.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(t.tagName))
}

function playerHasFocus() {
  const active = document.activeElement
  return !!(rootEl.value && active && rootEl.value.contains(active))
}

function keyboardActive() {
  return !!player && (hovering.value || playerHasFocus() || player.fullscreen?.active)
}

function onKeyDown(e: KeyboardEvent) {
  if (!keyboardActive() || isEditable(e.target) || e.ctrlKey || e.metaKey || e.altKey) return

  switch (e.code) {
    case 'Space':
      e.preventDefault()
      player.togglePlay()
      break
    case 'ArrowRight':
      e.preventDefault()
      player.forward(SEEK_STEP)
      break
    case 'ArrowLeft':
      e.preventDefault()
      player.rewind(SEEK_STEP)
      break
    case 'ArrowUp':
      e.preventDefault()
      player.muted = false
      player.volume = Math.min(1, +(player.volume + VOLUME_STEP).toFixed(2))
      break
    case 'ArrowDown':
      e.preventDefault()
      player.volume = Math.max(0, +(player.volume - VOLUME_STEP).toFixed(2))
      break
    case 'KeyM':
      e.preventDefault()
      player.muted = !player.muted
      break
    case 'KeyF':
      e.preventDefault()
      player.fullscreen.toggle()
      break
  }
}

// جلوگیری از فعال شدن دوباره‌ی دکمه‌ی فوکوس‌شده با رها کردن Space
function onKeyUp(e: KeyboardEvent) {
  if (e.code === 'Space' && keyboardActive() && !isEditable(e.target)) e.preventDefault()
}

async function attachSource(src: string) {
  if (!videoEl || !src) return
  if (hls) {
    hls.destroy()
    hls = null
  }
  const isHls = /\.m3u8($|\?)/i.test(src)
  if (isHls && !videoEl.canPlayType('application/vnd.apple.mpegurl')) {
    const { default: Hls } = await import('hls.js')
    if (Hls.isSupported()) {
      hls = new Hls()
      hls.loadSource(src)
      hls.attachMedia(videoEl)
      return
    }
  }
  videoEl.src = src
}

function addTracks() {
  if (!videoEl) return
  videoEl.querySelectorAll('track').forEach((t) => t.remove())
  props.subtitles.forEach((s) => {
    const track = document.createElement('track')
    track.kind = 'captions'
    track.label = s.label
    track.srclang = s.srclang
    track.src = s.src
    if (s.default) track.default = true
    videoEl!.appendChild(track)
  })
}

onMounted(async () => {
  if (!mountEl.value) return
  const { default: Plyr } = await import('plyr')
  // ممکن است کامپوننت در حین import حذف شده باشد
  if (!mountEl.value) return

  videoEl = document.createElement('video')
  videoEl.setAttribute('playsinline', '')
  videoEl.preload = 'metadata'
  if (props.title) videoEl.title = props.title
  if (props.backdrop) videoEl.poster = props.backdrop
  mountEl.value.appendChild(videoEl)
  addTracks()
  await attachSource(props.src)

  player = new Plyr(videoEl, {
    i18n,
    controls: [
      'play-large',
      'rewind',
      'play',
      'fast-forward',
      'progress',
      'current-time',
      'duration',
      'mute',
      'volume',
      'captions',
      'settings',
      'pip',
      'fullscreen',
    ],
    settings: ['captions', 'speed'],
    seekTime: SEEK_STEP,
    speed: { selected: 1, options: [0.5, 0.75, 1, 1.25, 1.5, 2] },
    captions: { active: props.subtitles.some((s) => s.default), language: 'auto', update: true },
    keyboard: { focused: false, global: false }, // کلیدها را خودمان مدیریت می‌کنیم
    tooltips: { controls: true, seek: true },
    clickToPlay: true,
    fullscreen: { enabled: true, fallback: true, iosNative: true },
    storage: { enabled: true, key: 'iranflix_player' }, // حافظه‌ی صدا، سرعت و زیرنویس
    autoplay: props.autoplay,
  })

  window.addEventListener('keydown', onKeyDown)
  window.addEventListener('keyup', onKeyUp)
})

// اگر منبع یا زیرنویس عوض شد (بدون ساخت مجدد کامپوننت)
watch(
  () => props.src,
  async (src) => {
    if (!videoEl) return
    await attachSource(src)
    videoEl.load()
  },
)
watch(
  () => props.subtitles,
  () => addTracks(),
  { deep: true },
)

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeyDown)
  window.removeEventListener('keyup', onKeyUp)
  if (hls) hls.destroy()
  hls = null
  if (player) {
    try {
      player.destroy()
    } catch {
      /* ignore */
    }
  }
  player = null
  if (mountEl.value) mountEl.value.innerHTML = ''
})
</script>

<style>
.iranflix-player {
  --plyr-color-main: #e50914;
  --plyr-video-background: #000;
  --plyr-font-family: 'Vazirmatn', 'Inter', sans-serif;
  --plyr-control-radius: 8px;
  --plyr-menu-background: rgba(20, 20, 20, 0.96);
  --plyr-menu-color: #fff;
}
.iranflix-player .plyr {
  height: 100%;
  border-radius: 0.75rem;
}
.iranflix-player .plyr__video-wrapper,
.iranflix-player video {
  height: 100%;
}
.iranflix-player .plyr__captions {
  font-family: 'Vazirmatn', sans-serif;
  direction: rtl;
}
.iranflix-player .plyr__caption {
  background: rgba(0, 0, 0, 0.75);
  line-height: 1.8;
}
</style>
