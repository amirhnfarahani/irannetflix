<!-- iranflix/pages/admin/users.vue — مدیریت کاربران -->
<template>
  <div class="space-y-5">
    <div>
      <h1 class="text-2xl font-bold">مدیریت کاربران</h1>
      <p class="text-sm text-text-muted mt-1">{{ formatNum(filtered.length) }} از {{ formatNum(userStore.users.length) }} کاربر</p>
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
        placeholder="جستجوی نام یا ایمیل..."
        class="flex-1 min-w-[200px] bg-bg-card border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-accent"
      />
      <select v-model="planFilter" class="bg-bg-card border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-accent">
        <option value="all">همه‌ی اشتراک‌ها</option>
        <option value="free">رایگان</option>
        <option value="premium">ویژه</option>
      </select>
      <select v-model="statusFilter" class="bg-bg-card border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-accent">
        <option value="all">همه‌ی وضعیت‌ها</option>
        <option value="active">فعال</option>
        <option value="banned">مسدود</option>
      </select>
    </div>

    <div class="bg-bg-card rounded-xl border border-white/5 overflow-x-auto">
      <table class="w-full text-sm min-w-[860px]">
        <thead class="text-text-muted text-xs border-b border-white/10">
          <tr>
            <th class="text-start font-medium p-3">کاربر</th>
            <th class="text-start font-medium p-3">نقش</th>
            <th class="text-start font-medium p-3">اشتراک</th>
            <th class="text-start font-medium p-3">وضعیت</th>
            <th class="text-start font-medium p-3">فعالیت</th>
            <th class="text-start font-medium p-3">عضویت</th>
            <th class="p-3" />
          </tr>
        </thead>
        <tbody>
          <tr v-for="u in filtered" :key="u.id" class="border-b border-white/5 last:border-0 hover:bg-white/[0.03]">
            <td class="p-3">
              <div class="flex items-center gap-3">
                <img :src="u.avatar" alt="" class="w-9 h-9 rounded-full object-cover shrink-0" />
                <div class="min-w-0">
                  <p class="font-semibold truncate">
                    {{ u.name }}
                    <span v-if="u.id === userStore.currentUserId" class="text-[10px] text-gold ms-1">(شما)</span>
                  </p>
                  <p class="text-xs text-text-muted truncate" dir="ltr" style="text-align: right">{{ u.email }}</p>
                </div>
              </div>
            </td>
            <td class="p-3">
              <select
                :value="u.role"
                class="bg-bg-elevated border border-white/10 rounded-lg px-2 py-1.5 text-xs"
                :aria-label="`نقش ${u.name}`"
                @change="update(u.id, { role: $event.target.value })"
              >
                <option value="user">کاربر</option>
                <option value="admin">مدیر</option>
              </select>
            </td>
            <td class="p-3">
              <select
                :value="u.plan"
                class="bg-bg-elevated border border-white/10 rounded-lg px-2 py-1.5 text-xs"
                :aria-label="`اشتراک ${u.name}`"
                @change="update(u.id, { plan: $event.target.value })"
              >
                <option value="free">رایگان</option>
                <option value="premium">ویژه</option>
              </select>
            </td>
            <td class="p-3">
              <span
                class="text-xs rounded px-2 py-0.5"
                :class="u.status === 'active' ? 'bg-green-500/15 text-green-400' : 'bg-red-500/15 text-red-400'"
              >
                {{ u.status === 'active' ? 'فعال' : 'مسدود' }}
              </span>
            </td>
            <td class="p-3 text-xs text-text-secondary whitespace-nowrap">
              {{ formatNum(u.watchHistory.length) }} تماشا · {{ formatNum(u.downloads.length) }} دانلود
            </td>
            <td class="p-3 text-xs text-text-secondary whitespace-nowrap">{{ formatDate(u.createdAt) }}</td>
            <td class="p-3">
              <div class="flex gap-2 justify-end">
                <button
                  type="button"
                  class="text-xs px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors whitespace-nowrap"
                  @click="update(u.id, { status: u.status === 'active' ? 'banned' : 'active' })"
                >
                  {{ u.status === 'active' ? 'مسدود کردن' : 'رفع مسدودی' }}
                </button>
                <button
                  type="button"
                  class="text-xs px-3 py-1.5 rounded-lg bg-red-500/15 text-red-400 hover:bg-red-500/25 transition-colors"
                  @click="toDelete = u"
                >
                  حذف
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="!filtered.length">
            <td colspan="7" class="p-8 text-center text-text-muted">کاربری پیدا نشد.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <ConfirmDialog
      :open="!!toDelete"
      title="حذف کاربر"
      :message="`حساب «${toDelete?.name ?? ''}» برای همیشه حذف شود؟`"
      confirm-text="حذف"
      danger
      @confirm="doDelete"
      @cancel="toDelete = null"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useHead } from 'nuxt/app'
import { useUserStore, type UserRecord } from '../../stores/user'
import { formatNum, formatDate } from '../../utils/format'

definePageMeta({ layout: 'panel', middleware: 'admin' })
useHead({ title: 'مدیریت کاربران - ایران‌فلیکس' })

const userStore = useUserStore()

const query = ref('')
const planFilter = ref<'all' | 'free' | 'premium'>('all')
const statusFilter = ref<'all' | 'active' | 'banned'>('all')
const toDelete = ref<UserRecord | null>(null)
const notice = reactive({ ok: true, text: '' })

function flash(ok: boolean, text: string) {
  notice.ok = ok
  notice.text = text
  setTimeout(() => (notice.text = ''), 3500)
}

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  return userStore.users.filter((u) => {
    if (planFilter.value !== 'all' && u.plan !== planFilter.value) return false
    if (statusFilter.value !== 'all' && u.status !== statusFilter.value) return false
    if (!q) return true
    return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
  })
})

function update(id: number, patch: Partial<Pick<UserRecord, 'role' | 'plan' | 'status' | 'name'>>) {
  const r = userStore.adminUpdateUser(id, patch)
  flash(r.ok, r.ok ? 'تغییر اعمال شد.' : (r.error ?? 'خطا'))
}

function doDelete() {
  if (!toDelete.value) return
  const r = userStore.adminDeleteUser(toDelete.value.id)
  flash(r.ok, r.ok ? 'کاربر حذف شد.' : (r.error ?? 'خطا'))
  toDelete.value = null
}
</script>
