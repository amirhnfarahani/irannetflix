<!-- iranflix/app.vue -->
<template>
  <div class="min-h-screen bg-bg-primary text-text-primary font-vazir">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useUserStore } from './stores/user'
import { useMoviesStore } from './stores/movies'

const userStore = useUserStore()
const moviesStore = useMoviesStore()

onMounted(() => {
  userStore.restoreSession()
  // اعمال تغییرات پنل ادمین (افزودن/ویرایش/حذف فیلم) روی صفحات عمومی
  moviesStore.initClient()
})
</script>
