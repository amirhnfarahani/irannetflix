<!-- iranflix/app.vue -->
<template>
  <div class="min-h-screen bg-bg-primary text-text-primary font-vazir">
    <AppNavbar />
    <main>
      <NuxtPage />
    </main>
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useUserStore } from './stores/user'

const userStore = useUserStore()
onMounted(() => {
  userStore.restoreSession()
})
</script>
