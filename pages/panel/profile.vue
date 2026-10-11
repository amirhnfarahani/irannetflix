<!-- iranflix/pages/panel/profile.vue -->
<template>
  <div class="space-y-6 max-w-2xl">
    <h1 class="text-2xl font-bold">پروفایل</h1>

    <div
      v-if="notice.text"
      class="rounded-lg px-4 py-3 text-sm border"
      :class="notice.ok ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400'"
      role="status"
    >
      {{ notice.text }}
    </div>

    <!-- Profile -->
    <form class="bg-bg-card rounded-xl p-6 border border-white/5 space-y-5" @submit.prevent="saveProfile">
      <h2 class="font-bold">اطلاعات حساب</h2>

      <div class="flex items-center gap-4">
        <img :src="avatar" alt="آواتار" class="w-16 h-16 rounded-full object-cover" />
        <div>
          <p class="text-xs text-text-muted mb-2">رنگ آواتار</p>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="c in AVATAR_COLORS"
              :key="c"
              type="button"
              class="w-7 h-7 rounded-full ring-offset-2 ring-offset-bg-card transition-all"
              :class="selectedColor === c ? 'ring-2 ring-white' : 'hover:scale-110'"
              :style="{ background: c }"
              :aria-label="`رنگ ${c}`"
              @click="pickColor(c)"
            />
          </div>
        </div>
      </div>

      <div>
        <label for="p-name" class="block text-sm text-text-secondary mb-1.5">نام</label>
        <input id="p-name" v-model="form.name" type="text" :class="inputCls" />
      </div>
      <div>
        <label for="p-email" class="block text-sm text-text-secondary mb-1.5">ایمیل</label>
        <input id="p-email" v-model="form.email" type="email" dir="ltr" :class="inputCls" />
      </div>

      <button type="submit" class="bg-accent hover:bg-accent-hover text-white text-sm font-bold px-6 py-2.5 rounded-lg transition-colors">
        ذخیره تغییرات
      </button>
    </form>

    <!-- Password -->
    <form class="bg-bg-card rounded-xl p-6 border border-white/5 space-y-4" @submit.prevent="savePassword">
      <h2 class="font-bold">تغییر رمز عبور</h2>
      <div>
        <label for="pw-old" class="block text-sm text-text-secondary mb-1.5">رمز فعلی</label>
        <input id="pw-old" v-model="pw.old" type="password" autocomplete="current-password" :class="inputCls" />
      </div>
      <div>
        <label for="pw-new" class="block text-sm text-text-secondary mb-1.5">رمز جدید (حداقل ۸ کاراکتر)</label>
        <input id="pw-new" v-model="pw.next" type="password" autocomplete="new-password" :class="inputCls" />
      </div>
      <button type="submit" class="bg-white/10 hover:bg-white/20 text-white text-sm font-bold px-6 py-2.5 rounded-lg transition-colors">
        تغییر رمز
      </button>
    </form>

    <button type="button" class="text-sm text-red-400 hover:text-red-300 transition-colors" @click="logout">
      خروج از حساب
    </button>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useHead } from 'nuxt/app'
import { useRouter } from 'vue-router'
import { useUserStore } from '../../stores/user'
import { AVATAR_COLORS, makeAvatar } from '../../utils/avatar'

definePageMeta({ layout: 'panel', middleware: 'auth' })
useHead({ title: 'پروفایل - ایران‌فلیکس' })

const userStore = useUserStore()
const router = useRouter()

const inputCls =
  'w-full bg-bg-elevated border border-white/10 rounded-lg px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors'

const form = reactive({
  name: userStore.profile?.name ?? '',
  email: userStore.profile?.email ?? '',
})
const pw = reactive({ old: '', next: '' })
const avatar = ref(userStore.profile?.avatar ?? makeAvatar(form.name))
const selectedColor = ref(
  AVATAR_COLORS.find((c) => makeAvatar(form.name, c) === avatar.value) ?? '',
)
const notice = reactive({ ok: true, text: '' })

function flash(ok: boolean, text: string) {
  notice.ok = ok
  notice.text = text
  setTimeout(() => (notice.text = ''), 4000)
}

function pickColor(c: string) {
  selectedColor.value = c
  avatar.value = makeAvatar(form.name, c)
}

function saveProfile() {
  // اگر آواتار رنگی است، با تغییر نام حرف اول هم به‌روز شود
  if (selectedColor.value) avatar.value = makeAvatar(form.name, selectedColor.value)
  const r = userStore.updateProfile({ name: form.name, email: form.email, avatar: avatar.value })
  flash(r.ok, r.ok ? 'اطلاعات با موفقیت ذخیره شد.' : (r.error ?? 'خطا در ذخیره‌سازی.'))
}

function savePassword() {
  const r = userStore.changePassword(pw.old, pw.next)
  if (r.ok) {
    pw.old = ''
    pw.next = ''
  }
  flash(r.ok, r.ok ? 'رمز عبور تغییر کرد.' : (r.error ?? 'خطا در تغییر رمز.'))
}

function logout() {
  userStore.logout()
  router.push('/')
}
</script>
