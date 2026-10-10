<!-- iranflix/pages/login.vue -->
<template>
  <div class="min-h-screen flex">
    <!-- Left: Form panel -->
    <div class="flex-1 flex items-center justify-center px-6 py-12 bg-bg-primary">
      <div class="w-full max-w-sm">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center gap-1 mb-10">
          <span class="text-accent font-inter font-extrabold text-2xl">IRAN</span>
          <span class="text-white font-inter font-extrabold text-2xl">FLIX</span>
        </NuxtLink>

        <h1 class="text-2xl font-vazir font-bold text-text-primary mb-2">ورود به حساب</h1>
        <p class="text-text-muted text-sm font-vazir mb-8">
          هنوز حساب ندارید؟
          <NuxtLink to="/register" class="text-accent hover:text-accent-hover transition-colors">ثبت‌نام کنید</NuxtLink>
        </p>

        <!-- Error message -->
        <div v-if="error" class="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 mb-5 text-red-400 text-sm font-vazir">
          {{ error }}
        </div>

        <!-- Form -->
        <div class="space-y-4">
          <div>
            <label for="email" class="block text-sm font-vazir text-text-secondary mb-1.5">ایمیل</label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              placeholder="example@email.com"
              class="w-full bg-bg-elevated border border-white/10 rounded-lg px-4 py-3 text-sm text-text-primary placeholder:text-text-muted font-inter focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
              autocomplete="email"
              @keydown.enter="submit"
            />
          </div>

          <div>
            <label for="password" class="block text-sm font-vazir text-text-secondary mb-1.5">رمز عبور</label>
            <div class="relative">
              <input
                id="password"
                v-model="form.password"
                :type="showPass ? 'text' : 'password'"
                placeholder="رمز عبور خود را وارد کنید"
                class="w-full bg-bg-elevated border border-white/10 rounded-lg px-4 py-3 pe-11 text-sm text-text-primary placeholder:text-text-muted font-vazir focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                autocomplete="current-password"
                @keydown.enter="submit"
              />
              <button
                type="button"
                :aria-label="showPass ? 'مخفی کردن رمز' : 'نمایش رمز'"
                class="absolute inset-y-0 start-3 flex items-center text-text-muted hover:text-text-secondary transition-colors"
                @click="showPass = !showPass"
              >
                <svg v-if="!showPass" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                </svg>
                <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
                </svg>
              </button>
            </div>
          </div>

          <div class="flex items-center justify-between text-sm font-vazir">
            <label class="flex items-center gap-2 cursor-pointer text-text-secondary">
              <input type="checkbox" v-model="form.remember" class="accent-accent rounded" />
              مرا به خاطر بسپار
            </label>
            <a href="#" class="text-accent hover:text-accent-hover transition-colors">فراموشی رمز</a>
          </div>

          <button
            class="w-full bg-accent hover:bg-accent-hover text-white font-vazir font-bold py-3 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            :disabled="loading"
            @click="submit"
          >
            <span v-if="loading">در حال ورود...</span>
            <span v-else>ورود</span>
          </button>
        </div>

        <!-- Divider -->
        <div class="flex items-center gap-3 my-6">
          <div class="flex-1 h-px bg-white/10"></div>
          <span class="text-text-muted text-xs font-vazir">یا</span>
          <div class="flex-1 h-px bg-white/10"></div>
        </div>

        <!-- Google -->
        <button
          class="w-full flex items-center justify-center gap-3 bg-white text-gray-900 font-inter font-semibold py-3 rounded-lg hover:bg-gray-100 transition-colors text-sm"
          @click="loginWithGoogle"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          ورود با گوگل
        </button>
      </div>
    </div>

    <!-- Right: Movie collage -->
    <div class="hidden lg:grid flex-1 grid-cols-3 gap-1 overflow-hidden max-h-screen" aria-hidden="true">
      <div
        v-for="n in 12"
        :key="n"
        class="overflow-hidden"
        :class="n % 3 === 0 ? 'row-span-2' : ''"
      >
        <img
          :src="`https://picsum.photos/300/450?random=${n + 50}`"
          alt=""
          class="w-full h-full object-cover opacity-60 hover:opacity-80 transition-opacity"
          loading="lazy"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '../stores/user'
import { useRouter } from 'vue-router'
import { reactive, ref} from 'vue'
import { useHead } from 'nuxt/app'

useHead({ title: 'ورود - ایران‌فلیکس' })

const userStore = useUserStore()
const router = useRouter()

const form = reactive({ email: '', password: '', remember: false })
const loading = ref(false)
const error = ref('')
const showPass = ref(false)

async function submit() {
  error.value = ''
  if (!form.email || !form.password) {
    error.value = 'لطفاً تمام فیلدها را پر کنید.'
    return
  }
  loading.value = true
  await new Promise(r => setTimeout(r, 800))
  userStore.login(form.email, form.password)
  loading.value = false
  router.push('/')
}

function loginWithGoogle() {
  userStore.login('user@gmail.com', '')
  router.push('/')
}
</script>
