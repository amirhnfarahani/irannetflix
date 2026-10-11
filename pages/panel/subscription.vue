<!-- iranflix/pages/panel/subscription.vue -->
<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold">اشتراک</h1>
      <p class="text-sm text-text-muted mt-1">
        پلن فعلی شما:
        <span class="text-text-primary font-semibold">{{ current === 'premium' ? 'ویژه' : 'رایگان' }}</span>
      </p>
    </div>

    <div
      v-if="done"
      class="rounded-lg px-4 py-3 text-sm border bg-green-500/10 border-green-500/30 text-green-400"
      role="status"
    >
      {{ done }}
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div
        v-for="p in plans"
        :key="p.id"
        class="relative bg-bg-card rounded-2xl p-6 border transition-colors"
        :class="current === p.id ? 'border-accent' : 'border-white/5'"
      >
        <span
          v-if="p.badge"
          class="absolute top-4 start-4 text-[10px] font-inter font-bold bg-gold/20 text-gold rounded px-2 py-0.5"
        >
          {{ p.badge }}
        </span>

        <h2 class="text-xl font-bold mb-1">{{ p.name }}</h2>
        <p class="text-2xl font-bold mb-4">
          {{ p.price }}
          <span v-if="p.id === 'premium'" class="text-sm font-normal text-text-muted">تومان / ماه</span>
        </p>

        <ul class="space-y-2 mb-6">
          <li v-for="f in p.features" :key="f" class="flex items-center gap-2 text-sm text-text-secondary">
            <span class="text-green-400" aria-hidden="true">✓</span>
            {{ f }}
          </li>
        </ul>

        <button
          v-if="current === p.id"
          type="button"
          disabled
          class="w-full py-2.5 rounded-lg text-sm font-bold bg-white/10 text-text-muted cursor-default"
        >
          پلن فعلی
        </button>
        <button
          v-else
          type="button"
          class="w-full py-2.5 rounded-lg text-sm font-bold text-white transition-colors"
          :class="p.id === 'premium' ? 'bg-accent hover:bg-accent-hover' : 'bg-white/10 hover:bg-white/20'"
          @click="target = p.id"
        >
          {{ p.id === 'premium' ? 'ارتقا به ویژه' : 'بازگشت به رایگان' }}
        </button>
      </div>
    </div>

    <p class="text-xs text-text-muted">پرداخت در این نسخه آزمایشی است و هزینه‌ای از شما کسر نمی‌شود.</p>

    <ConfirmDialog
      :open="!!target"
      :title="target === 'premium' ? 'ارتقا به اشتراک ویژه' : 'بازگشت به اشتراک رایگان'"
      :message="
        target === 'premium'
          ? 'اشتراک ویژه فعال می‌شود و به کیفیت 1080p و 4K دسترسی پیدا می‌کنید (پرداخت آزمایشی).'
          : 'با بازگشت به پلن رایگان، دانلود 1080p و 4K برای شما غیرفعال می‌شود.'
      "
      confirm-text="تأیید"
      @confirm="applyPlan"
      @cancel="target = null"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useHead } from 'nuxt/app'
import { useUserStore, type Plan } from '../../stores/user'

definePageMeta({ layout: 'panel', middleware: 'auth' })
useHead({ title: 'اشتراک - ایران‌فلیکس' })

const userStore = useUserStore()
const current = computed<Plan>(() => userStore.profile?.plan ?? 'free')
const target = ref<Plan | null>(null)
const done = ref('')

const plans: { id: Plan; name: string; price: string; badge?: string; features: string[] }[] = [
  {
    id: 'free',
    name: 'رایگان',
    price: '۰',
    features: ['تماشای آنلاین با آگهی', 'دانلود با کیفیت تا 720p', 'لیست من و تاریخچه تماشا'],
  },
  {
    id: 'premium',
    name: 'ویژه',
    price: '۱۴۹,۰۰۰',
    badge: 'VIP',
    features: ['بدون آگهی', 'دانلود با کیفیت 1080p و 4K', 'زیرنویس‌های کامل', 'اولویت در پشتیبانی'],
  },
]

function applyPlan() {
  if (!target.value) return
  userStore.setPlan(target.value)
  done.value = target.value === 'premium' ? 'اشتراک ویژه شما فعال شد 🎉' : 'به پلن رایگان بازگشتید.'
  target.value = null
  setTimeout(() => (done.value = ''), 4000)
}
</script>
