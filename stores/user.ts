// iranflix/stores/user.ts
import { defineStore } from 'pinia'

interface UserProfile {
  name: string
  email: string
  avatar: string
  plan: 'free' | 'premium'
}

interface UserState {
  isLoggedIn: boolean
  profile: UserProfile | null
  watchlist: number[]
  watchHistory: { id: number; watchedAt: string; progress: number }[]
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    isLoggedIn: false,
    profile: null,
    watchlist: [],
    watchHistory: [],
  }),

  getters: {
    isInWatchlist: (state) => (id: number) => state.watchlist.includes(id),
  },

  actions: {
    login(email: string, _password: string) {
      // Mock login
      this.isLoggedIn = true
      this.profile = {
        name: 'کاربر ایران‌فلیکس',
        email,
        avatar: 'https://picsum.photos/40/40?random=99',
        plan: 'free',
      }
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('iranflix_user', JSON.stringify(this.$state))
      }
    },

    logout() {
      this.isLoggedIn = false
      this.profile = null
      this.watchlist = []
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('iranflix_user')
      }
    },

    toggleWatchlist(id: number) {
      const idx = this.watchlist.indexOf(id)
      if (idx === -1) {
        this.watchlist.push(id)
      } else {
        this.watchlist.splice(idx, 1)
      }
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('iranflix_user', JSON.stringify(this.$state))
      }
    },

    addToHistory(id: number, progress: number = 0) {
      const existing = this.watchHistory.find(h => h.id === id)
      if (existing) {
        existing.watchedAt = new Date().toISOString()
        existing.progress = progress
      } else {
        this.watchHistory.unshift({ id, watchedAt: new Date().toISOString(), progress })
      }
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('iranflix_user', JSON.stringify(this.$state))
      }
    },

    restoreSession() {
      if (typeof window === 'undefined') return
      const saved = sessionStorage.getItem('iranflix_user')
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          this.isLoggedIn = parsed.isLoggedIn
          this.profile = parsed.profile
          this.watchlist = parsed.watchlist ?? []
          this.watchHistory = parsed.watchHistory ?? []
        } catch (_) {
          sessionStorage.removeItem('iranflix_user')
        }
      }
    },
  },
})
