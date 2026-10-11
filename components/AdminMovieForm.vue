<!-- iranflix/components/AdminMovieForm.vue — فرم افزودن/ویرایش فیلم -->
<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 z-[100] flex items-start justify-center bg-black/70 px-4 py-8 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      dir="rtl"
      @click.self="$emit('cancel')"
    >
      <form
        class="w-full max-w-3xl bg-bg-card rounded-2xl border border-white/10 p-6 font-vazir shadow-2xl"
        @submit.prevent="submit"
      >
        <div class="flex items-center justify-between mb-5">
          <h2 class="text-lg font-bold">{{ movie ? 'ویرایش فیلم' : 'افزودن فیلم یا سریال' }}</h2>
          <button type="button" class="text-text-muted hover:text-white text-xl leading-none" aria-label="بستن" @click="$emit('cancel')">
            ✕
          </button>
        </div>

        <div v-if="error" class="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 mb-4 text-red-400 text-sm">
          {{ error }}
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="lbl" for="f-title-fa">عنوان فارسی *</label>
            <input id="f-title-fa" v-model="form.title_fa" type="text" :class="inputCls" />
          </div>
          <div>
            <label class="lbl" for="f-title-en">عنوان انگلیسی</label>
            <input id="f-title-en" v-model="form.title_en" type="text" dir="ltr" :class="inputCls" />
          </div>

          <div>
            <label class="lbl" for="f-type">نوع</label>
            <select id="f-type" v-model="form.type" :class="inputCls">
              <option value="movie">فیلم</option>
              <option value="series">سریال</option>
            </select>
          </div>
          <div class="grid grid-cols-3 gap-3">
            <div>
              <label class="lbl" for="f-year">سال</label>
              <input id="f-year" v-model.number="form.year" type="number" :class="inputCls" />
            </div>
            <div>
              <label class="lbl" for="f-dur">مدت (دقیقه)</label>
              <input id="f-dur" v-model.number="form.duration" type="number" min="1" :class="inputCls" />
            </div>
            <div>
              <label class="lbl" for="f-imdb">IMDb</label>
              <input id="f-imdb" v-model.number="form.imdb" type="number" min="0" max="10" step="0.1" :class="inputCls" />
            </div>
          </div>

          <template v-if="form.type === 'series'">
            <div>
              <label class="lbl" for="f-seasons">تعداد فصل</label>
              <input id="f-seasons" v-model.number="form.seasons" type="number" min="1" :class="inputCls" />
            </div>
            <div>
              <label class="lbl" for="f-eps">تعداد قسمت</label>
              <input id="f-eps" v-model.number="form.episodes" type="number" min="1" :class="inputCls" />
            </div>
          </template>

          <div>
            <label class="lbl" for="f-dir">کارگردان</label>
            <input id="f-dir" v-model="form.director" type="text" :class="inputCls" />
          </div>
          <div>
            <label class="lbl" for="f-cast">بازیگران (با کاما جدا کنید)</label>
            <input id="f-cast" v-model="castText" type="text" :class="inputCls" />
          </div>

          <div>
            <label class="lbl" for="f-genre">ژانرها (با کاما جدا کنید)</label>
            <input id="f-genre" v-model="genreText" type="text" list="genre-list" :class="inputCls" />
            <datalist id="genre-list">
              <option v-for="g in genres" :key="g" :value="g" />
            </datalist>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="lbl" for="f-country">کشور</label>
              <input id="f-country" v-model="form.country" type="text" :class="inputCls" />
            </div>
            <div>
              <label class="lbl" for="f-lang">زبان</label>
              <input id="f-lang" v-model="form.language" type="text" :class="inputCls" />
            </div>
          </div>

          <div class="sm:col-span-2">
            <label class="lbl" for="f-poster">آدرس پوستر</label>
            <input id="f-poster" v-model="form.poster" type="text" dir="ltr" placeholder="https://..." :class="inputCls" />
          </div>
          <div class="sm:col-span-2">
            <label class="lbl" for="f-backdrop">آدرس تصویر پس‌زمینه (بک‌دراپ)</label>
            <input id="f-backdrop" v-model="form.backdrop" type="text" dir="ltr" placeholder="https://..." :class="inputCls" />
          </div>
          <div class="sm:col-span-2">
            <label class="lbl" for="f-trailer">آدرس تریلر</label>
            <input id="f-trailer" v-model="form.trailer_url" type="text" dir="ltr" placeholder="https://..." :class="inputCls" />
          </div>

          <div class="sm:col-span-2">
            <label class="lbl" for="f-syn">خلاصه‌ی داستان</label>
            <textarea id="f-syn" v-model="form.synopsis_fa" rows="4" :class="inputCls" />
          </div>

          <fieldset class="sm:col-span-2">
            <legend class="lbl">نمایش در بخش‌ها</legend>
            <div class="flex flex-wrap gap-x-5 gap-y-2 mt-1">
              <label v-for="c in CATEGORY_OPTIONS" :key="c.key" class="flex items-center gap-2 text-sm text-text-secondary cursor-pointer">
                <input v-model="form.category" type="checkbox" :value="c.key" class="accent-accent" />
                {{ c.label }}
              </label>
            </div>
          </fieldset>
        </div>

        <div class="flex justify-end gap-3 mt-7">
          <button type="button" class="px-4 py-2 rounded-lg text-sm text-text-secondary hover:bg-white/10 transition-colors" @click="$emit('cancel')">
            انصراف
          </button>
          <button type="submit" class="px-6 py-2 rounded-lg text-sm font-bold bg-accent hover:bg-accent-hover text-white transition-colors">
            {{ movie ? 'ذخیره تغییرات' : 'افزودن' }}
          </button>
        </div>
      </form>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { Movie } from '../stores/movies'

const props = defineProps<{
  movie?: Movie | null
  genres: string[]
}>()

const emit = defineEmits<{
  save: [data: Omit<Movie, 'id'> & { id?: number }]
  cancel: []
}>()

const CATEGORY_OPTIONS = [
  { key: 'featured', label: 'ویژه (هیرو)' },
  { key: 'cinema_now', label: 'در حال پخش در سینما' },
  { key: 'popular_series', label: 'سریال پرطرفدار' },
  { key: 'iranian_top', label: 'ایرانی برتر' },
  { key: 'suggested', label: 'پیشنهادی' },
  { key: 'new', label: 'جدیدترین' },
]

const inputCls =
  'w-full bg-bg-elevated border border-white/10 rounded-lg px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors'

const m = props.movie
const form = reactive<Omit<Movie, 'id' | 'genre' | 'cast'>>({
  title_fa: m?.title_fa ?? '',
  title_en: m?.title_en ?? '',
  year: m?.year ?? new Date().getFullYear(),
  duration: m?.duration ?? 100,
  imdb: m?.imdb ?? 7,
  poster: m?.poster ?? '',
  backdrop: m?.backdrop ?? '',
  director: m?.director ?? '',
  synopsis_fa: m?.synopsis_fa ?? '',
  category: [...(m?.category ?? ['new'])],
  trailer_url: m?.trailer_url ?? '',
  type: m?.type ?? 'movie',
  seasons: m?.seasons ?? 1,
  episodes: m?.episodes ?? 1,
  country: m?.country ?? 'ایران',
  language: m?.language ?? 'فارسی',
})
const genreText = ref((m?.genre ?? []).join('، '))
const castText = ref((m?.cast ?? []).join('، '))
const error = ref('')

const splitList = (s: string) =>
  s
    .split(/[,،]/)
    .map((x) => x.trim())
    .filter(Boolean)

function submit() {
  error.value = ''
  if (!form.title_fa.trim()) return (error.value = 'عنوان فارسی الزامی است.')
  if (!form.year || form.year < 1888 || form.year > 2100) return (error.value = 'سال معتبر نیست.')
  if (!form.duration || form.duration < 1) return (error.value = 'مدت زمان معتبر نیست.')
  if (form.imdb < 0 || form.imdb > 10) return (error.value = 'امتیاز IMDb باید بین ۰ تا ۱۰ باشد.')

  const seed = encodeURIComponent(form.title_en || form.title_fa)
  const data: Omit<Movie, 'id'> & { id?: number } = {
    ...form,
    id: props.movie?.id,
    title_fa: form.title_fa.trim(),
    genre: splitList(genreText.value),
    cast: splitList(castText.value),
    poster: form.poster.trim() || `https://picsum.photos/seed/${seed}/300/450`,
    backdrop: form.backdrop.trim() || `https://picsum.photos/seed/${seed}-bg/1280/720`,
  }
  if (form.type === 'movie') {
    delete data.seasons
    delete data.episodes
  }
  emit('save', data)
}
</script>

<style scoped>
.lbl {
  display: block;
  font-size: 0.8rem;
  color: #b3b3b3;
  margin-bottom: 0.375rem;
}
</style>
