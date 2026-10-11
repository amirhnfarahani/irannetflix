import { defineNuxtConfig } from "nuxt/config";

// iranflix/nuxt.config.ts
export default defineNuxtConfig({
  compatibilityDate: '2026-06-17',
  devtools: { enabled: false },
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt', '@nuxt/image'],
  css: ['plyr/dist/plyr.css', '~/assets/css/main.css'],
  // پنل‌ها فقط سمت کلاینت رندر می‌شوند (اطلاعات کاربر در مرورگر ذخیره می‌شود)
  routeRules: {
    '/panel': { ssr: false },
    '/panel/**': { ssr: false },
    '/admin': { ssr: false },
    '/admin/**': { ssr: false },
  },
  app: {
    head: {
      htmlAttrs: { lang: 'fa', dir: 'rtl' },
      title: 'ایران‌فلیکس - بهترین فیلم و سریال ایرانی',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'بهترین فیلم‌ها و سریال‌های ایرانی را در ایران‌فلیکس ببینید' },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;500;700;800&family=Inter:wght@400;500;600&display=swap',
        },
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      ],
    },
    pageTransition: { name: 'fade', mode: 'out-in' },
  },
})
