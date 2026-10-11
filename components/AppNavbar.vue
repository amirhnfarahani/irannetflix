<!-- iranflix/components/AppNavbar.vue -->
<template>
  <header
    :class="[
      'fixed top-0 inset-x-0 z-50 transition-all duration-300',
      scrolled ? 'bg-bg-primary/95 backdrop-cinema shadow-lg' : 'bg-transparent'
    ]"
  >
    <nav class="max-w-screen-2xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between" role="navigation" aria-label="ناوبری اصلی">
      <!-- Logo -->
      <NuxtLink to="/" class="flex items-center gap-1 shrink-0" aria-label="ایران‌فلیکس - صفحه اصلی">
        <span class="text-accent font-inter font-extrabold text-2xl tracking-tight">IRAN</span>
        <span class="text-white font-inter font-extrabold text-2xl tracking-tight">FLIX</span>
      </NuxtLink>

      <!-- Main nav links (desktop) -->
      <ul class="hidden md:flex items-center gap-6 font-vazir text-sm" role="list">
        <li>
          <NuxtLink to="/" class="text-text-secondary hover:text-white transition-colors" active-class="text-white font-semibold">
            خانه
          </NuxtLink>
        </li>
        <li>
          <NuxtLink to="/movies" class="text-text-secondary hover:text-white transition-colors" active-class="text-white font-semibold">
            فیلم‌ها
          </NuxtLink>
        </li>
        <li>
          <NuxtLink to="/series" class="text-text-secondary hover:text-white transition-colors" active-class="text-white font-semibold">
            سریال‌ها
          </NuxtLink>
        </li>
      </ul>

      <!-- Right actions -->
      <div class="flex items-center gap-3">
        <!-- Search icon -->
        <NuxtLink to="/search" aria-label="جستجو" class="w-9 h-9 flex items-center justify-center text-text-secondary hover:text-white transition-colors rounded-full hover:bg-white/10">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
        </NuxtLink>

        <!-- Notification bell -->
        <button aria-label="اعلان‌ها" class="relative w-9 h-9 flex items-center justify-center text-text-secondary hover:text-white transition-colors rounded-full hover:bg-white/10">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
          </svg>
          <span class="absolute top-1.5 end-1.5 w-2 h-2 bg-accent rounded-full" aria-hidden="true"></span>
        </button>

        <!-- VIP CTA -->
        <NuxtLink
          to="/register"
          class="hidden sm:inline-flex items-center gap-1.5 bg-accent hover:bg-accent-hover text-white text-xs font-vazir font-bold px-4 py-2 rounded-lg transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          عضویت ویژه
        </NuxtLink>

        <!-- User avatar / login -->
        <div class="relative" ref="userMenuRef" v-if="userStore.isLoggedIn">
          <button
            class="w-9 h-9 rounded-full overflow-hidden ring-2 ring-accent/50 hover:ring-accent transition-all"
            aria-label="منوی کاربر"
            :aria-expanded="showUserMenu"
            @click="showUserMenu = !showUserMenu"
          >
            <img :src="userStore.profile?.avatar" alt="آواتار کاربر" class="w-full h-full object-cover" />
          </button>

          <!-- Dropdown -->
          <div
            v-if="showUserMenu"
            class="absolute start-0 top-12 w-48 bg-bg-elevated rounded-xl shadow-xl border border-white/10 overflow-hidden z-50 animate-fadeIn font-vazir"
          >
            <div class="px-4 py-3 border-b border-white/10">
              <p class="text-sm font-semibold text-text-primary truncate">{{ userStore.profile?.name }}</p>
              <p class="text-xs text-text-muted truncate">{{ userStore.profile?.email }}</p>
            </div>
            <ul class="py-1">
              <li>
                <NuxtLink
                  to="/panel"
                  class="block w-full text-start px-4 py-2 text-sm text-text-secondary hover:bg-white/5 hover:text-white transition-colors"
                  @click="showUserMenu = false"
                >
                  پنل کاربری
                </NuxtLink>
              </li>
              <li>
                <NuxtLink
                  to="/panel/watchlist"
                  class="block w-full text-start px-4 py-2 text-sm text-text-secondary hover:bg-white/5 hover:text-white transition-colors"
                  @click="showUserMenu = false"
                >
                  لیست من
                </NuxtLink>
              </li>
              <li>
                <NuxtLink
                  to="/panel/history"
                  class="block w-full text-start px-4 py-2 text-sm text-text-secondary hover:bg-white/5 hover:text-white transition-colors"
                  @click="showUserMenu = false"
                >
                  تاریخچه تماشا
                </NuxtLink>
              </li>
              <li>
                <NuxtLink
                  to="/panel/downloads"
                  class="block w-full text-start px-4 py-2 text-sm text-text-secondary hover:bg-white/5 hover:text-white transition-colors"
                  @click="showUserMenu = false"
                >
                  دانلودها
                </NuxtLink>
              </li>
              <li v-if="userStore.isAdmin">
                <NuxtLink
                  to="/admin"
                  class="block w-full text-start px-4 py-2 text-sm text-gold hover:bg-white/5 transition-colors"
                  @click="showUserMenu = false"
                >
                  پنل مدیریت
                </NuxtLink>
              </li>
              <li>
                <button
                  class="w-full text-start px-4 py-2 text-sm text-accent hover:bg-white/5 transition-colors"
                  @click="logout"
                >
                  خروج
                </button>
              </li>
            </ul>
          </div>
        </div>

        <NuxtLink
          v-else
          to="/login"
          class="text-sm font-vazir text-text-secondary hover:text-white transition-colors"
        >
          ورود
        </NuxtLink>

        <!-- Mobile menu toggle -->
        <button
          class="md:hidden w-9 h-9 flex items-center justify-center text-text-secondary hover:text-white"
          aria-label="منوی موبایل"
          :aria-expanded="mobileMenu"
          @click="mobileMenu = !mobileMenu"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path v-if="!mobileMenu" d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
            <path v-else d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>
      </div>
    </nav>

    <!-- Mobile nav -->
    <div v-if="mobileMenu" class="md:hidden bg-bg-elevated border-t border-white/10 px-4 py-3 font-vazir">
      <ul class="space-y-3">
        <li><NuxtLink to="/" class="block text-text-secondary hover:text-white" @click="mobileMenu = false">خانه</NuxtLink></li>
        <li><NuxtLink to="/movies" class="block text-text-secondary hover:text-white" @click="mobileMenu = false">فیلم‌ها</NuxtLink></li>
        <li><NuxtLink to="/series" class="block text-text-secondary hover:text-white" @click="mobileMenu = false">سریال‌ها</NuxtLink></li>
        <li><NuxtLink to="/register" class="block text-accent font-semibold" @click="mobileMenu = false">عضویت ویژه</NuxtLink></li>
      </ul>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted,onBeforeUnmount} from 'vue'
import { useUserStore } from '../stores/user'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const scrolled = ref(false)
const showUserMenu = ref(false)
const mobileMenu = ref(false)
const router = useRouter()
const userMenuRef = ref<HTMLElement | null>(null)

function handleClickOutside(event: MouseEvent) {
  if (userMenuRef.value && !userMenuRef.value.contains(event.target as Node)) {
    showUserMenu.value = false
  }
}

function onScroll() {
  scrolled.value = window.scrollY > 20
}

function logout() {
  userStore.logout()
  showUserMenu.value = false
  router.push('/')
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  document.removeEventListener('click', handleClickOutside)
})
</script>