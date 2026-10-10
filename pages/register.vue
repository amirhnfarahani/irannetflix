<!-- iranflix/pages/register.vue -->
<template>
  <div class="min-h-screen flex">
    <!-- Left: Form panel -->
    <div class="flex-1 flex items-center justify-center px-6 py-12 bg-bg-primary">
      <div class="w-full max-w-sm">
        <NuxtLink to="/" class="flex items-center gap-1 mb-10">
          <span class="text-accent font-inter font-extrabold text-2xl">IRAN</span>
          <span class="text-white font-inter font-extrabold text-2xl">FLIX</span>
        </NuxtLink>

        <h1 class="text-2xl font-vazir font-bold text-text-primary mb-2">ایجاد حساب کاربری</h1>
        <p class="text-text-muted text-sm font-vazir mb-8">
          قبلاً ثبت‌نام کرده‌اید؟
          <NuxtLink to="/login" class="text-accent hover:text-accent-hover transition-colors">وارد شوید</NuxtLink>
        </p>

        <!-- Plan selector -->
        <div class="grid grid-cols-2 gap-3 mb-6">
          <button
            v-for="plan in plans"
            :key="plan.id"
            :class="[
              'rounded-xl border p-4 text-start transition-all',
              selectedPlan === plan.id
                ? 'border-accent bg-accent/10'
                : 'border-white/10 hover:border-white/30'
            ]"
            @click="selectedPlan = plan.id"
          >
            <div class="flex items-center justify-between mb-1">
              <span class="text-xs font-vazir font-bold text-text-secondary">{{ plan.name }}</span>
              <div v-if="plan.badge" class="bg-gold text-black text-[10px] font-bold px-1.5 py-0.5 rounded font-inter">
                {{ plan.badge }}
              </div>
            </div>
            <p class="text-lg font-inter font-bold text-text-primary">{{ plan.price }}</p>
            <p class="text-xs text-text-muted font-vazir mt-1">{{ plan.desc }}</p>
          </button>
        </div>

        <div v-if="error" class="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 mb-5 text-red-400 text-sm font-vazir">
          {{ error }}
        </div>

        <div class="space-y-4">
          <div>
            <label for="name" class="block text-sm font-vazir text-text-secondary mb-1.5">نام و نام‌خانوادگی</label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              placeholder="نام خود را وارد کنید"
              class="w-full bg-bg-elevated border border-white/10 rounded-lg px-4 py-3 text-sm text-text-primary placeholder:text-text-muted font-vazir focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
              autocomplete="name"
            />
          </div>

          <div>
            <label for="email" class="block text-sm font-vazir text-text-secondary mb-1.5">ایمیل</label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              placeholder="example@email.com"
              class="w-full bg-bg-elevated border border-white/10 rounded-lg px-4 py-3 text-sm text-text-primary placeholder:text-text-muted font-inter focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
              autocomplete="email"
            />
          </div>

          <div>
            <label for="password" class="block text-sm font-vazir text-text-secondary mb-1.5">رمز عبور</label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              placeholder="حداقل ۸ کاراکتر"
              class="w-full bg-bg-elevated border border-white/10 rounded-lg px-4 py-3 text-sm text-text-primary placeholder:text-text-muted font-vazir focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
              autocomplete="new-password"
            />
            <!-- Strength indicator -->
            <div class="flex gap-1 mt-2">
              <div
                v-for="n in 4"
                :key="n"
                :class="[
                  'h-1 flex-1 rounded-full transition-colors duration-300',
                  strength >= n ? strengthColor : 'bg-white/10'
                ]"
              ></div>
            </div>
          </div>

          <label class="flex items-start gap-2 cursor-pointer text-text-muted text-sm font-vazir">
            <input type="checkbox" v-model="form.terms" class="accent-accent mt-0.5 shrink-0" />
            <span>
              با
              <a href="#" class="text-accent hover:underline">شرایط استفاده</a>
              و
              <a href="#" class="text-accent hover:underline">حریم خصوصی</a>
              موافقم
            </span>
          </label>

          <button
            class="w-full bg-accent hover:bg-accent-hover text-white font-vazir font-bold py-3 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            :disabled="loading || !form.terms"
            @click="submit"
          >
            <span v-if="loading">در حال ثبت‌نام...</span>
            <span v-else>ایجاد حساب رایگان</span>
          </button>
        </div>

        <div class="flex items-center gap-3 my-6">
          <div class="flex-1 h-px bg-white/10"></div>
          <span class="text-text-muted text-xs font-vazir">یا</span>
          <div class="flex-1 h-px bg-white/10"></div>
        </div>

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
          ادامه با گوگل
        </button>
      </div>
    </div>

    <!-- Right: Movie collage -->
    <div class="hidden lg:grid flex-1 grid-cols-3 gap-1 overflow-hidden max-h-screen" aria-hidden="true">
      <div v-for="n in 12" :key="n" class="overflow-hidden" :class="n % 4 === 0 ? 'col-span-2' : ''">
        <img
          :src="`https://picsum.photos/300/450?random=${n + 30}`"
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
import { reactive ,ref , computed} from 'vue'

const userStore = useUserStore()
const router = useRouter()

const form = reactive({ name: '', email: '', password: '', terms: false })
const loading = ref(false)
const error = ref('')
const selectedPlan = ref('free')

const plans = [
  { id: 'free', name: 'رایگان', price: '۰ تومان', desc: 'تماشا با آگهی', badge: null },
  { id: 'premium', name: 'ویژه', price: '۱۴۹,۰۰۰', desc: 'کیفیت ۴K، بدون آگهی', badge: 'VIP' },
]

const strength = computed(() => {
  const p = form.password
  let s = 0
  if (p.length >= 8) s++
  if (/[A-Z]/.test(p)) s++
  if (/[0-9]/.test(p)) s++
  if (/[^A-Za-z0-9]/.test(p)) s++
  return s
})

const strengthColor = computed(() => {
  if (strength.value <= 1) return 'bg-red-500'
  if (strength.value === 2) return 'bg-yellow-500'
  if (strength.value === 3) return 'bg-blue-500'
  return 'bg-green-500'
})

async function submit() {
  error.value = ''
  if (!form.name || !form.email || !form.password) {
    error.value = 'لطفاً تمام فیلدها را پر کنید.'
    return
  }
  if (form.password.length < 8) {
    error.value = 'رمز عبور باید حداقل ۸ کاراکتر باشد.'
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
