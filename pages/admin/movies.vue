<!-- iranflix/pages/admin/movies.vue — مدیریت فیلم‌ها و سریال‌ها -->
<template>
  <div class="space-y-5">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 class="text-2xl font-bold">مدیریت فیلم‌ها</h1>
        <p class="text-sm text-text-muted mt-1">{{ formatNum(filtered.length) }} از {{ formatNum(moviesStore.all.length) }} مورد</p>
      </div>
      <div class="flex gap-2">
        <button
          v-if="moviesStore.hasOverrides"
          type="button"
          class="text-sm text-text-secondary hover:text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors"
          @click="confirmReset = true"
        >
          بازنشانی تغییرات
        </button>
        <button
          type="button"
          class="text-sm font-bold bg-accent hover:bg-accent-hover text-white px-5 py-2 rounded-lg transition-colors"
          @click="openAdd"
        >
          + افزودن
        </button>
      </div>
    </div>

    <div
      v-if="notice.text"
      class="rounded-lg px-4 py-3 text-sm border"
      :class="notice.ok ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400'"
      role="status"
    >
      {{ notice.text }}
    </div>

    <div class="flex flex-wrap gap-3">
      <input
        v-model="query"
        type="search"
        placeholder="جستجو در عنوان یا کارگردان..."
        class="flex-1 min-w-[200px] bg-bg-card border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-accent"
        @input="page = 1"
      />
      <select
        v-model="typeFilter"
        class="bg-bg-card border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-accent"
        @change="page = 1"
      >
        <option value="all">همه</option>
        <option value="movie">فیلم</option>
        <option value="series">سریال</option>
      </select>
    </div>

    <div class="bg-bg-card rounded-xl border border-white/5 overflow-x-auto">
      <table class="w-full text-sm min-w-[720px]">
        <thead class="text-text-muted text-xs border-b border-white/10">
          <tr>
            <th class="text-start font-medium p-3">فیلم</th>
            <th class="text-start font-medium p-3">نوع</th>
            <th class="text-start font-medium p-3">سال</th>
            <th class="text-start font-medium p-3">IMDb</th>
            <th class="text-start font-medium p-3">ژانر</th>
            <th class="p-3" />
          </tr>
        </thead>
        <tbody>
          <tr v-for="m in paged" :key="m.id" class="border-b border-white/5 last:border-0 hover:bg-white/[0.03]">
            <td class="p-3">
              <div class="flex items-center gap-3">
                <img :src="m.poster" :alt="m.title_fa" loading="lazy" class="w-10 h-14 rounded object-cover bg-bg-elevated shrink-0" />
                <div class="min-w-0">
                  <NuxtLink :to="`/movie/${m.id}`" class="font-semibold truncate block hover:text-accent transition-colors">
                    {{ m.title_fa }}
                  </NuxtLink>
                  <p class="text-xs text-text-muted truncate font-inter" dir="ltr" style="text-align: right">{{ m.title_en }}</p>
                </div>
              </div>
            </td>
            <td class="p-3 whitespace-nowrap">
              <span class="text-xs rounded px-2 py-0.5" :class="m.type === 'series' ? 'bg-blue-500/20 text-blue-300' : 'bg-white/10'">
                {{ m.type === 'series' ? 'سریال' : 'فیلم' }}
              </span>
            </td>
            <td class="p-3 text-text-secondary whitespace-nowrap">{{ m.year.toLocaleString('fa-IR', { useGrouping: false }) }}</td>
            <td class="p-3 text-gold font-inter">{{ m.imdb }}</td>
            <td class="p-3 text-text-secondary text-xs">{{ m.genre.slice(0, 3).join('، ') }}</td>
            <td class="p-3">
              <div class="flex gap-2 justify-end">
                <button type="button" class="text-xs px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors" @click="openEdit(m)">
                  ویرایش
                </button>
                <button type="button" class="text-xs px-3 py-1.5 rounded-lg bg-red-500/15 text-red-400 hover:bg-red-500/25 transition-colors" @click="toDelete = m">
                  حذف
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="!paged.length">
            <td colspan="6" class="p-8 text-center text-text-muted">موردی پیدا نشد.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="pageCount > 1" class="flex items-center justify-center gap-3 text-sm">
      <button type="button" class="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-40" :disabled="page <= 1" @click="page--">
        قبلی
      </button>
      <span class="text-text-secondary">{{ formatNum(page) }} / {{ formatNum(pageCount) }}</span>
      <button type="button" class="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-40" :disabled="page >= pageCount" @click="page++">
        بعدی
      </button>
    </div>

    <p class="text-xs text-text-muted">
      تغییرات این بخش در مرورگر شما ذخیره می‌شود (دمو بدون بک‌اند) و روی کل سایت اعمال می‌شود.
    </p>

    <AdminMovieForm v-if="showForm" :movie="editing" :genres="allGenres" @save="onSave" @cancel="showForm = false" />

    <ConfirmDialog
      :open="!!toDelete"
      title="حذف فیلم"
      :message="`«${toDelete?.title_fa ?? ''}» حذف شود؟`"
      confirm-text="حذف"
      danger
      @confirm="doDelete"
      @cancel="toDelete = null"
    />

    <ConfirmDialog
      :open="confirmReset"
      title="بازنشانی تغییرات"
      message="همه‌ی فیلم‌های افزوده‌شده، ویرایش‌ها و حذف‌ها به حالت اولیه برمی‌گردد."
      confirm-text="بازنشانی"
      danger
      @confirm="doReset"
      @cancel="confirmReset = false"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useHead } from 'nuxt/app'
import { useMoviesStore, type Movie } from '../../stores/movies'
import { formatNum } from '../../utils/format'

definePageMeta({ layout: 'panel', middleware: 'admin' })
useHead({ title: 'مدیریت فیلم‌ها - ایران‌فلیکس' })

const PAGE_SIZE = 10

const moviesStore = useMoviesStore()
await moviesStore.ensureReady()

const query = ref('')
const typeFilter = ref<'all' | 'movie' | 'series'>('all')
const page = ref(1)

const showForm = ref(false)
const editing = ref<Movie | null>(null)
const toDelete = ref<Movie | null>(null)
const confirmReset = ref(false)
const notice = reactive({ ok: true, text: '' })

function flash(ok: boolean, text: string) {
  notice.ok = ok
  notice.text = text
  setTimeout(() => (notice.text = ''), 3500)
}

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  return moviesStore.all.filter((m) => {
    if (typeFilter.value !== 'all' && m.type !== typeFilter.value) return false
    if (!q) return true
    return (
      m.title_fa.includes(q) ||
      m.title_en.toLowerCase().includes(q) ||
      m.director.includes(q)
    )
  })
})

const pageCount = computed(() => Math.max(1, Math.ceil(filtered.value.length / PAGE_SIZE)))
const paged = computed(() => {
  const p = Math.min(page.value, pageCount.value)
  return filtered.value.slice((p - 1) * PAGE_SIZE, p * PAGE_SIZE)
})

const allGenres = computed(() => [...new Set(moviesStore.all.flatMap((m) => m.genre))].sort())

function openAdd() {
  editing.value = null
  showForm.value = true
}

function openEdit(m: Movie) {
  editing.value = m
  showForm.value = true
}

function onSave(data: Omit<Movie, 'id'> & { id?: number }) {
  if (data.id !== undefined) {
    moviesStore.updateMovie(data as Movie)
    flash(true, 'تغییرات ذخیره شد.')
  } else {
    const { id: _id, ...rest } = data
    moviesStore.addMovie(rest)
    flash(true, 'مورد جدید اضافه شد.')
  }
  showForm.value = false
}

function doDelete() {
  if (!toDelete.value) return
  moviesStore.deleteMovie(toDelete.value.id)
  flash(true, `«${toDelete.value.title_fa}» حذف شد.`)
  toDelete.value = null
}

function doReset() {
  moviesStore.resetOverrides()
  confirmReset.value = false
  flash(true, 'همه‌ی تغییرات بازنشانی شد.')
}
</script>
