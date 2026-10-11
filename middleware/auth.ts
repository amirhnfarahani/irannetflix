// iranflix/middleware/auth.ts — فقط کاربران واردشده به /panel دسترسی دارند
import { useUserStore } from '../stores/user'

export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.server) return // این مسیرها فقط سمت کلاینت رندر می‌شوند (routeRules)
  const user = useUserStore()
  user.restoreSession()
  if (!user.isLoggedIn) {
    return navigateTo({ path: '/login', query: { redirect: to.fullPath } })
  }
})
