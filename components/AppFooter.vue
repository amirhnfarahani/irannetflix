<!-- iranflix/components/AppFooter.vue -->
<template>
  <footer class="bg-bg-card border-t border-white/5 pt-12 pb-6 mt-16 font-vazir">
    <div class="max-w-screen-xl mx-auto px-6 md:px-12">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
        <!-- Brand -->
        <div class="col-span-2 md:col-span-1">
          <div class="flex items-center gap-1 mb-4">
            <span class="text-accent font-inter font-extrabold text-xl">IRAN</span>
            <span class="text-white font-inter font-extrabold text-xl">FLIX</span>
          </div>
          <p class="text-text-muted text-sm leading-relaxed">
            بهترین فیلم‌ها و سریال‌های ایرانی و خارجی را در کیفیت HD و ۴K تماشا کنید.
          </p>
          <!-- Social icons -->
          <div class="flex gap-3 mt-4">
            <a href="#" aria-label="اینستاگرام" class="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-text-secondary hover:text-white hover:bg-accent transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a href="#" aria-label="تلگرام" class="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-text-secondary hover:text-white hover:bg-accent transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248l-1.97 9.289c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.844 14.08l-2.98-.924c-.647-.203-.66-.647.136-.956l11.647-4.492c.537-.194 1.006.131.915.54z"/>
              </svg>
            </a>
            <a href="#" aria-label="توییتر" class="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-text-secondary hover:text-white hover:bg-accent transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
          </div>
        </div>

        <!-- Links -->
        <div>
          <h3 class="text-sm font-bold text-text-primary mb-4">دسترسی سریع</h3>
          <ul class="space-y-2 text-sm text-text-muted">
            <li><NuxtLink to="/" class="hover:text-text-secondary transition-colors">صفحه اصلی</NuxtLink></li>
            <li><NuxtLink to="/movies" class="hover:text-text-secondary transition-colors">فیلم‌ها</NuxtLink></li>
            <li><NuxtLink to="/series" class="hover:text-text-secondary transition-colors">سریال‌ها</NuxtLink></li>
            <li><NuxtLink to="/search" class="hover:text-text-secondary transition-colors">جستجو</NuxtLink></li>
          </ul>
        </div>

        <div>
          <h3 class="text-sm font-bold text-text-primary mb-4">عضویت</h3>
          <ul class="space-y-2 text-sm text-text-muted">
            <li><NuxtLink to="/register" class="hover:text-text-secondary transition-colors">ثبت‌نام</NuxtLink></li>
            <li><NuxtLink to="/login" class="hover:text-text-secondary transition-colors">ورود</NuxtLink></li>
            <li><a href="#" class="hover:text-text-secondary transition-colors">عضویت ویژه</a></li>
            <li><a href="#" class="hover:text-text-secondary transition-colors">هدیه اشتراک</a></li>
          </ul>
        </div>

        <div>
          <h3 class="text-sm font-bold text-text-primary mb-4">پشتیبانی</h3>
          <ul class="space-y-2 text-sm text-text-muted">
            <li><a href="#" class="hover:text-text-secondary transition-colors">مرکز راهنما</a></li>
            <li><a href="#" class="hover:text-text-secondary transition-colors">تماس با ما</a></li>
            <li><a href="#" class="hover:text-text-secondary transition-colors">حریم خصوصی</a></li>
            <li><a href="#" class="hover:text-text-secondary transition-colors">شرایط استفاده</a></li>
          </ul>
        </div>
      </div>

      <div class="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-text-muted">
        <p>© ۱۴۰۳ ایران‌فلیکس. تمامی حقوق محفوظ است.</p>
        <p>ساخته شده با ❤️ برای سینمادوستان ایرانی</p>
      </div>
    </div>
  </footer>
</template>
