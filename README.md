# ایران‌نتفلیکس (IranFlix)

پلتفرم نمایش فیلم و سریال ساخته‌شده با Nuxt 3، Pinia و Tailwind CSS.

## اجرا

```bash
npm install
npm run dev
```

سپس `http://localhost:3000` را باز کنید.

## ساختار

- `components/` کامپوننت‌ها (VideoPlayer بر پایه‌ی Plyr، DownloadSection، MovieCard، ...)
- `pages/` صفحات
- `stores/` استورهای Pinia
- `data/movies.json` دیتای نمونه
- `public/subtitles/` زیرنویس‌های `.vtt`

## پنل کاربری و پنل مدیریت (نسخه‌ی دمو، بدون بک‌اند)

- پنل کاربری: `/panel` (داشبورد، لیست من، تاریخچه، دانلودها، اشتراک، پروفایل)
- پنل مدیریت: `/admin` (داشبورد، مدیریت فیلم‌ها، مدیریت کاربران)
- حساب‌های آزمایشی:
  - مدیر: `admin@iranflix.ir` / `admin1234`
  - کاربر: `user@iranflix.ir` / `user1234`
- کاربران و تغییرات فیلم‌ها در `localStorage` مرورگر ذخیره می‌شوند و رمزها هش نمی‌شوند.
  برای نسخه‌ی واقعی باید احراز هویت و دیتابیس سمت سرور اضافه شود.
