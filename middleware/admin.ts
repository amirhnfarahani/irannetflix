// iranflix/middleware/admin.ts — فقط مدیران به /admin دسترسی دارند
import { useUserStore } from '../stores/user'

export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.server) return
  const user = useUserStore()
  user.restoreSession()
  if (!user.isLoggedIn) {
    return navigateTo({ path: '/login', query: { redirect: to.fullPath } })
  }
  if (!user.isAdmin) {
    return navigateTo('/panel')
  }
})
