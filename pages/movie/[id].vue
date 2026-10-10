<!-- /pages/movie/[id].vue -->
<template>
  <div>
    <div v-if="!movie" class="pt-20 text-center py-32">
      <div class="skeleton w-32 h-6 mx-auto rounded mb-4"></div>
      <div class="skeleton w-64 h-10 mx-auto rounded"></div>
    </div>

    <template v-else>
      <div class="relative w-full h-[50vh] min-h-[300px] overflow-hidden">
        <img
          :src="movie.backdrop"
          :alt="`تصویر پس‌زمینه ${movie.title_fa}`"
          class="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
        <div class="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-bg-primary"></div>
        <div class="absolute inset-0 bg-gradient-to-l from-bg-primary/60 to-transparent"></div>

        <div class="absolute bottom-8 end-8 md:end-12">
          <h1 class="text-3xl md:text-5xl font-vazir font-extrabold text-white text-shadow">
            {{ movie.title_fa }}
          </h1>
          <p class="text-text-secondary font-inter text-lg mt-1">{{ movie.title_en }}</p>
        </div>
      </div>

      <div class="max-w-screen-xl mx-auto px-4 md:px-8 py-8">
        <div class="flex flex-col lg:flex-row-reverse gap-8">
          <div class="flex-1">
            <!-- ✅ تغییر: اضافه کردن کلید unique برای رندر مجدد پلیر با هر فیلم -->
            <VideoPlayer 
              :key="movie.id"
              :src="movieVideoUrl" 
              :title="movie.title_fa" 
              :backdrop="movie.backdrop" 
              :subtitles="SUBTITLES"
            />

            <div class="flex flex-wrap gap-3 mt-4">
              <button
                class="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-white font-vazir font-bold px-6 py-2.5 rounded-lg transition-colors text-sm"
                @click="userStore.addToHistory(movie.id)"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M8 5v14l11-7z"/>
                </svg>
                پخش
              </button>

              <button
                :class="[
                  'inline-flex items-center gap-2 font-vazir font-semibold px-6 py-2.5 rounded-lg border transition-colors text-sm',
                  userStore.isInWatchlist(movie.id)
                    ? 'bg-white/10 border-accent text-accent'
                    : 'bg-white/5 border-white/20 text-white hover:border-accent hover:text-accent'
                ]"
                @click="userStore.toggleWatchlist(movie.id)"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M19 13H5v-2h14v2z" v-if="userStore.isInWatchlist(movie.id)"/>
                  <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" v-else/>
                </svg>
                {{ userStore.isInWatchlist(movie.id) ? 'در لیست من' : 'افزودن به لیست' }}
              </button>

              <button
                class="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/20 text-white font-vazir px-4 py-2.5 rounded-lg transition-colors text-sm"
                aria-label="اشتراک‌گذاری"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
                </svg>
                اشتراک
              </button>
            </div>

            <DownloadSection
              class="mt-6"
              :title="movie.title_fa"
              :duration="movie.duration"
              :type="movie.type"
              :video-url="movieVideoUrl"
            />
          </div>

          <div class="w-full lg:w-80 shrink-0 space-y-5 font-vazir">
            <div class="flex flex-wrap items-center gap-3">
              <RatingBadge :score="movie.imdb.toFixed(1)" />
              <span class="text-text-secondary text-sm font-inter">{{ movie.year }}</span>
              <span class="text-text-secondary text-sm">{{ formatDuration(movie.duration) }}</span>
              <span v-if="movie.type === 'series'" class="text-accent text-sm font-semibold">
                {{ movie.seasons }} فصل · {{ movie.episodes }} قسمت
              </span>
            </div>

            <div class="flex flex-wrap gap-2">
              <GenreTag v-for="g in movie.genre" :key="g" :genre="g" />
            </div>

            <div>
              <h2 class="text-sm font-bold text-text-secondary mb-2">خلاصه داستان</h2>
              <p class="text-text-primary text-sm leading-relaxed">{{ movie.synopsis_fa }}</p>
            </div>

            <div class="space-y-2 text-sm">
              <div class="flex gap-2">
                <span class="text-text-muted w-24 shrink-0">کارگردان:</span>
                <span class="text-text-primary">{{ movie.director }}</span>
              </div>
              <div class="flex gap-2">
                <span class="text-text-muted w-24 shrink-0">کشور:</span>
                <span class="text-text-primary">{{ movie.country }}</span>
              </div>
              <div class="flex gap-2">
                <span class="text-text-muted w-24 shrink-0">زبان:</span>
                <span class="text-text-primary">{{ movie.language }}</span>
              </div>
              <div class="flex gap-2">
                <span class="text-text-muted w-24 shrink-0">سال تولید:</span>
                <span class="text-text-primary font-inter">{{ movie.year }}</span>
              </div>
            </div>

            <div>
              <h2 class="text-sm font-bold text-text-secondary mb-3">بازیگران</h2>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="actor in movie.cast"
                  :key="actor"
                  class="bg-bg-elevated border border-white/10 rounded-full px-3 py-1 text-xs text-text-secondary hover:text-white hover:border-accent cursor-pointer transition-colors"
                >
                  {{ actor }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-12">
          <MovieRow
            label="فیلم‌های مشابه"
            :movies="similar"
            more-link="/movies"
          />
        </div>

        <div class="mt-12 font-vazir">
          <h2 class="text-xl font-bold text-text-primary mb-6">نظرات کاربران</h2>
          <div class="space-y-4">
            <div v-for="comment in mockComments" :key="comment.id" class="bg-bg-card rounded-xl p-5">
              <div class="flex items-start gap-3">
                <img
                  :src="`https://picsum.photos/40/40?random=${comment.id}`"
                  :alt="`آواتار ${comment.user}`"
                  class="w-10 h-10 rounded-full object-cover shrink-0"
                />
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-1">
                    <span class="font-semibold text-sm text-text-primary">{{ comment.user }}</span>
                    <RatingBadge :score="comment.rating" />
                    <span class="text-text-muted text-xs me-auto">{{ comment.date }}</span>
                  </div>
                  <p class="text-text-secondary text-sm leading-relaxed">{{ comment.text }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-6 bg-bg-card rounded-xl p-5">
            <h3 class="font-bold text-sm mb-3 text-text-primary">نظر خود را بنویسید</h3>
            <textarea
              class="w-full bg-bg-elevated border border-white/10 rounded-lg p-3 text-sm text-text-primary placeholder:text-text-muted resize-none focus:outline-none focus:border-accent h-24 font-vazir"
              placeholder="نظر شما..."
            ></textarea>
            <button class="mt-2 bg-accent hover:bg-accent-hover text-white font-bold text-sm px-5 py-2 rounded-lg transition-colors">
              ارسال نظر
            </button>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useMoviesStore } from '../../stores/movies'
import { useUserStore } from '../../stores/user'
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const store = useMoviesStore()
const userStore = useUserStore()

await store.loadAll()

const movie = computed(() => store.getMovieById(Number(route.params.id)))

// ✅ تغییر: لیست ویدیوهای تست معتبر
// زیرنویس‌های نمونه (برای هر فیلم می‌توانی فایل .vtt جداگانه بدهی)
const SUBTITLES = [
  { label: 'فارسی', srclang: 'fa', src: '/subtitles/sample-fa.vtt', default: true },
  { label: 'English', srclang: 'en', src: '/subtitles/sample-en.vtt' },
]

const TEST_VIDEOS = [
  'https://vjs.zencdn.net/v/oceans.mp4',
  'https://media.w3.org/2010/05/sintel/trailer_hd.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
]

// ✅ تغییر: لینک ویدیو بر اساس آیدی فیلم با فال‌بک مطمئن
const movieVideoUrl = computed(() => {
  if (!movie.value) return TEST_VIDEOS[0]
  
  // استفاده از id فیلم برای انتخاب ویدیو (همیشه یک ویدیوی معتبر)
  const index = movie.value.id % TEST_VIDEOS.length
  return TEST_VIDEOS[index]
})

// ✅ اضافه شده: لاگ برای دیباگ در کنسول
watch(movie, (newMovie) => {
  if (newMovie) {
    console.log(`🎬 فیلم: ${newMovie.title_fa} | ویدیو: ${movieVideoUrl.value}`)
  }
}, { immediate: true })

const similar = computed(() => {
  if (!movie.value) return []
  return store.all
    .filter(m => m.id !== movie.value!.id && m.genre.some(g => movie.value!.genre.includes(g)))
    .slice(0, 10)
})

function formatDuration(min: number): string {
  const h = Math.floor(min / 60)
  const m = min % 60
  if (h === 0) return `${m} دقیقه`
  return `${h} ساعت${m > 0 ? ` و ${m} دقیقه` : ''}`
}

const mockComments = [
  {
    id: 101,
    user: 'رضا محمدی',
    rating: 9,
    date: '۱۲ آذر ۱۴۰۳',
    text: 'یکی از بهترین فیلم‌هایی بود که دیدم. داستان عمیق و بازی‌های درخشان. واقعاً توصیه می‌کنم.',
  },
  {
    id: 102,
    user: 'مریم احمدی',
    rating: 8,
    date: '۵ آبان ۱۴۰۳',
    text: 'فیلم خوبی بود ولی انتظار داشتم کمی بیشتر به جزئیات پرداخته شود. در کل ارزش دیدن دارد.',
  },
  {
    id: 103,
    user: 'حسین کریمی',
    rating: 10,
    date: '۲ مهر ۱۴۰۳',
    text: 'شاهکار مطلق! این فیلم یکی از بهترین تجربیات سینمایی زندگیم بود. همه باید ببینند.',
  }
]
</script>