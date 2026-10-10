<!-- iranflix/components/FilterSidebar.vue -->
<template>
  <aside class="bg-bg-card rounded-xl p-5 space-y-6 font-vazir min-w-[220px] w-full lg:w-64 shrink-0">
    <h2 class="text-base font-bold text-text-primary">فیلتر نتایج</h2>

    <!-- Genre -->
    <div>
      <h3 class="text-sm font-semibold text-text-secondary mb-3">ژانر</h3>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="g in genres"
          :key="g"
          :class="[
            'text-xs px-3 py-1.5 rounded-full border transition-colors',
            filters.genres.includes(g)
              ? 'bg-accent border-accent text-white'
              : 'border-white/10 text-text-secondary hover:border-accent hover:text-accent'
          ]"
          @click="toggleGenre(g)"
        >
          {{ g }}
        </button>
      </div>
    </div>

    <!-- Year range -->
    <div>
      <h3 class="text-sm font-semibold text-text-secondary mb-3">سال تولید</h3>
      <div class="space-y-2">
        <div class="flex items-center justify-between text-xs text-text-muted">
          <span>{{ filters.yearFrom }}</span>
          <span>{{ filters.yearTo }}</span>
        </div>
        <input
          v-model.number="filters.yearFrom"
          type="range" min="1960" :max="filters.yearTo"
          class="w-full accent-accent h-1"
          @input="emitChange"
        />
        <input
          v-model.number="filters.yearTo"
          type="range" :min="filters.yearFrom" max="2024"
          class="w-full accent-accent h-1"
          @input="emitChange"
        />
      </div>
    </div>

    <!-- IMDB score -->
    <div>
      <h3 class="text-sm font-semibold text-text-secondary mb-3">
        حداقل امتیاز IMDB:
        <span class="text-gold font-inter">{{ filters.minImdb }}</span>
      </h3>
      <input
        v-model.number="filters.minImdb"
        type="range" min="0" max="10" step="0.5"
        class="w-full accent-accent h-1"
        @input="emitChange"
      />
      <div class="flex justify-between text-xs text-text-muted mt-1">
        <span class="font-inter">0</span>
        <span class="font-inter">10</span>
      </div>
    </div>

    <!-- Type -->
    <div>
      <h3 class="text-sm font-semibold text-text-secondary mb-3">نوع</h3>
      <div class="flex gap-2">
        <button
          v-for="t in types"
          :key="t.value"
          :class="[
            'flex-1 text-xs py-2 rounded-lg border transition-colors',
            filters.type === t.value
              ? 'bg-accent border-accent text-white'
              : 'border-white/10 text-text-secondary hover:border-accent'
          ]"
          @click="filters.type = t.value as any; emitChange()"
        >
          {{ t.label }}
        </button>
      </div>
    </div>

    <!-- Language -->
    <div>
      <h3 class="text-sm font-semibold text-text-secondary mb-3">زبان</h3>
      <select
        v-model="filters.language"
        class="w-full bg-bg-elevated border border-white/10 rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent"
        @change="emitChange"
      >
        <option value="">همه زبان‌ها</option>
        <option value="فارسی">فارسی</option>
        <option value="انگلیسی">انگلیسی</option>
      </select>
    </div>

    <!-- Reset -->
    <button
      class="w-full py-2 rounded-lg border border-white/10 text-text-secondary hover:border-accent hover:text-accent text-sm transition-colors"
      @click="resetFilters"
    >
      پاک کردن فیلترها
    </button>
  </aside>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
interface Filters {
  genres: string[]
  yearFrom: number
  yearTo: number
  minImdb: number
  type: 'all' | 'movie' | 'series'
  language: string
}

const emit = defineEmits<{
  'filter-change': [filters: Filters]
}>()

const genres = ['درام', 'کمدی', 'اکشن', 'معمایی', 'عاشقانه', 'تاریخی', 'جنایی', 'علمی‌تخیلی', 'خانوادگی', 'ماجرایی', 'فانتزی', 'اجتماعی']
const types = [
  { value: 'all', label: 'همه' },
  { value: 'movie', label: 'فیلم' },
  { value: 'series', label: 'سریال' },
]

const filters = reactive<Filters>({
  genres: [],
  yearFrom: 1960,
  yearTo: 2024,
  minImdb: 0,
  type: 'all',
  language: '',
})

function toggleGenre(g: string) {
  const idx = filters.genres.indexOf(g)
  if (idx === -1) filters.genres.push(g)
  else filters.genres.splice(idx, 1)
  emitChange()
}

function emitChange() {
  emit('filter-change', { ...filters, genres: [...filters.genres] })
}

function resetFilters() {
  filters.genres = []
  filters.yearFrom = 1960
  filters.yearTo = 2024
  filters.minImdb = 0
  filters.type = 'all'
  filters.language = ''
  emitChange()
}
</script>
