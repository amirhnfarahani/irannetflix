<!-- iranflix/layouts/panel.vue — چیدمان مشترک پنل کاربری و پنل مدیریت -->
<template>
  <div>
    <AppNavbar />

    <div class="pt-20 min-h-screen">
      <div class="max-w-7xl mx-auto px-4 lg:px-8 py-6 flex flex-col lg:flex-row gap-6">
        <!-- Sidebar -->
        <aside class="lg:w-64 shrink-0">
          <div class="bg-bg-card rounded-xl p-4 border border-white/5 lg:sticky lg:top-24">
            <div v-if="userStore.profile" class="flex items-center gap-3 pb-4 mb-3 border-b border-white/10">
              <img :src="userStore.profile.avatar" alt="" class="w-11 h-11 rounded-full object-cover" />
              <div class="min-w-0">
                <p class="text-sm font-bold truncate">{{ userStore.profile.name }}</p>
                <p class="text-xs text-text-muted">
                  {{ isAdminArea ? 'پنل مدیریت' : userStore.profile.plan === 'premium' ? 'اشتراک ویژه' : 'اشتراک رایگان' }}
                </p>
              </div>
            </div>

            <nav class="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-1 lg:pb-0" aria-label="منوی پنل">
              <NuxtLink
                v-for="item in items"
                :key="item.to"
                :to="item.to"
                class="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm whitespace-nowrap text-text-secondary hover:bg-white/5 hover:text-white transition-colors"
                exact-active-class="!bg-accent/15 !text-white font-semibold"
              >
                <span aria-hidden="true">{{ item.icon }}</span>
                {{ item.label }}
              </NuxtLink>
            </nav>

            <div class="hidden lg:block mt-3 pt-3 border-t border-white/10 space-y-1">
              <NuxtLink
                v-if="userStore.isAdmin"
                :to="isAdminArea ? '/panel' : '/admin'"
                class="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-gold hover:bg-white/5 transition-colors"
              >
                <span aria-hidden="true">{{ isAdminArea ? '👤' : '🛠️' }}</span>
                {{ isAdminArea ? 'رفتن به پنل کاربری' : 'رفتن به پنل مدیریت' }}
              </NuxtLink>
              <NuxtLink
                to="/"
                class="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-text-secondary hover:bg-white/5 hover:text-white transition-colors"
              >
                <span aria-hidden="true">🏠</span>
                بازگشت به سایت
              </NuxtLink>
            </div>
          </div>
        </aside>

        <!-- Content -->
        <section class="flex-1 min-w-0">
          <slot />
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '../stores/user'

const route = useRoute()
const userStore = useUserStore()

const isAdminArea = computed(() => route.path.startsWith('/admin'))

const userItems = [
  { to: '/panel', label: 'داشبورد', icon: '📊' },
  { to: '/panel/watchlist', label: 'لیست من', icon: '📋' },
  { to: '/panel/history', label: 'تاریخچه تماشا', icon: '🕘' },
  { to: '/panel/downloads', label: 'دانلودها', icon: '⬇️' },
  { to: '/panel/subscription', label: 'اشتراک', icon: '💎' },
  { to: '/panel/profile', label: 'پروفایل', icon: '👤' },
]

const adminItems = [
  { to: '/admin', label: 'داشبورد', icon: '📊' },
  { to: '/admin/movies', label: 'مدیریت فیلم‌ها', icon: '🎬' },
  { to: '/admin/users', label: 'مدیریت کاربران', icon: '👥' },
]

const items = computed(() => (isAdminArea.value ? adminItems : userItems))
</script>
