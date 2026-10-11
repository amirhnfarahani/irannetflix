// iranflix/stores/user.ts
// نکته: این نسخه بدون بک‌اند و فقط برای دمو/توسعه است. کاربران در localStorage مرورگر ذخیره می‌شوند
// و رمزها هش نمی‌شوند. برای نسخه‌ی واقعی باید احراز هویت و دیتابیس سمت سرور اضافه شود.
import { defineStore } from 'pinia'
import { navigateTo } from '#app'
import { makeAvatar, AVATAR_COLORS } from '~/utils/avatar'

export type Plan = 'free' | 'premium'
export type Role = 'user' | 'admin'

export interface HistoryItem {
  id: number
  watchedAt: string
  progress: number // درصد 0 تا 100
}

export interface DownloadItem {
  id: number
  quality: string
  at: string
}

export interface UserRecord {
  id: number
  name: string
  email: string
  password: string
  avatar: string
  plan: Plan
  role: Role
  status: 'active' | 'banned'
  createdAt: string
  lastLogin?: string
  watchlist: number[]
  watchHistory: HistoryItem[]
  downloads: DownloadItem[]
}

export interface Result {
  ok: boolean
  error?: string
}

const USERS_KEY = 'iranflix_users_v1'
const SESSION_KEY = 'iranflix_session_v1'

const ago = (days: number, hours = 0) => new Date(Date.now() - days * 86400000 - hours * 3600000).toISOString()
const emailOk = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)

function seedUsers(): UserRecord[] {
  const mk = (
    id: number,
    name: string,
    email: string,
    password: string,
    role: Role,
    plan: Plan,
    createdDays: number,
    extra: Partial<UserRecord> = {},
  ): UserRecord => ({
    id,
    name,
    email,
    password,
    avatar: makeAvatar(name, AVATAR_COLORS[id % AVATAR_COLORS.length]),
    plan,
    role,
    status: 'active',
    createdAt: ago(createdDays),
    lastLogin: ago(Math.max(0, createdDays - 2)),
    watchlist: [],
    watchHistory: [],
    downloads: [],
    ...extra,
  })

  return [
    mk(1, 'مدیر سایت', 'admin@iranflix.ir', 'admin1234', 'admin', 'premium', 60),
    mk(2, 'علی رضایی', 'user@iranflix.ir', 'user1234', 'user', 'free', 20, {
      watchlist: [1, 3, 5],
      watchHistory: [
        { id: 2, watchedAt: ago(0, 3), progress: 45 },
        { id: 4, watchedAt: ago(1), progress: 80 },
        { id: 1, watchedAt: ago(3), progress: 100 },
      ],
      downloads: [{ id: 2, quality: '720p', at: ago(2) }],
    }),
    mk(3, 'سارا احمدی', 'sara@example.com', 'sara12345', 'user', 'premium', 12, {
      watchHistory: [
        { id: 2, watchedAt: ago(1), progress: 100 },
        { id: 6, watchedAt: ago(2), progress: 30 },
      ],
      downloads: [{ id: 6, quality: '1080p', at: ago(2) }],
    }),
    mk(4, 'محمد کریمی', 'mohammad@example.com', 'mohammad123', 'user', 'free', 6, {
      watchHistory: [{ id: 3, watchedAt: ago(1), progress: 60 }],
    }),
    mk(5, 'نگار حسینی', 'negar@example.com', 'negar12345', 'user', 'premium', 4, {
      watchHistory: [
        { id: 2, watchedAt: ago(0, 8), progress: 90 },
        { id: 5, watchedAt: ago(1), progress: 20 },
      ],
    }),
    mk(6, 'رضا موسوی', 'reza@example.com', 'reza123456', 'user', 'free', 2),
    mk(7, 'مریم صادقی', 'maryam@example.com', 'maryam1234', 'user', 'free', 1, {
      watchHistory: [{ id: 1, watchedAt: ago(0, 2), progress: 15 }],
    }),
  ]
}

interface UserState {
  users: UserRecord[]
  currentUserId: number | null
  ready: boolean
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    users: [],
    currentUserId: null,
    ready: false,
  }),

  getters: {
    currentUser: (s): UserRecord | null => {
      const u = s.users.find((x) => x.id === s.currentUserId)
      return u && u.status === 'active' ? u : null
    },
    isLoggedIn(): boolean {
      return !!this.currentUser
    },
    isAdmin(): boolean {
      return this.currentUser?.role === 'admin'
    },
    profile(): { id: number; name: string; email: string; avatar: string; plan: Plan; role: Role } | null {
      const u = this.currentUser
      return u ? { id: u.id, name: u.name, email: u.email, avatar: u.avatar, plan: u.plan, role: u.role } : null
    },
    watchlist(): number[] {
      return this.currentUser?.watchlist ?? []
    },
    watchHistory(): HistoryItem[] {
      return this.currentUser?.watchHistory ?? []
    },
    downloads(): DownloadItem[] {
      return this.currentUser?.downloads ?? []
    },
    isInWatchlist(): (id: number) => boolean {
      return (id: number) => this.watchlist.includes(id)
    },
  },

  actions: {
    // ───────── ذخیره‌سازی ─────────
    _persist() {
      if (!import.meta.client) return
      localStorage.setItem(USERS_KEY, JSON.stringify(this.users))
    },

    restoreSession() {
      if (!import.meta.client || this.ready) return
      let users: UserRecord[] | null = null
      try {
        const raw = localStorage.getItem(USERS_KEY)
        if (raw) users = JSON.parse(raw)
      } catch {
        users = null
      }
      if (!Array.isArray(users) || users.length === 0) {
        users = seedUsers()
        localStorage.setItem(USERS_KEY, JSON.stringify(users))
      }
      this.users = users
      const sid = Number(localStorage.getItem(SESSION_KEY))
      this.currentUserId = sid && users.some((u) => u.id === sid) ? sid : null
      this.ready = true
    },

    _setSession(id: number | null) {
      this.currentUserId = id
      if (!import.meta.client) return
      if (id) localStorage.setItem(SESSION_KEY, String(id))
      else localStorage.removeItem(SESSION_KEY)
    },

    // ───────── احراز هویت ─────────
    login(email: string, password: string): Result {
      this.restoreSession()
      const u = this.users.find((x) => x.email.toLowerCase() === email.trim().toLowerCase())
      if (!u || u.password !== password) return { ok: false, error: 'ایمیل یا رمز عبور اشتباه است.' }
      if (u.status === 'banned') return { ok: false, error: 'حساب شما مسدود شده است.' }
      u.lastLogin = new Date().toISOString()
      this._persist()
      this._setSession(u.id)
      return { ok: true }
    },

    register(data: { name: string; email: string; password: string; plan?: Plan }): Result {
      this.restoreSession()
      const name = data.name.trim()
      const email = data.email.trim().toLowerCase()
      if (!name) return { ok: false, error: 'نام را وارد کنید.' }
      if (!emailOk(email)) return { ok: false, error: 'ایمیل معتبر نیست.' }
      if (data.password.length < 8) return { ok: false, error: 'رمز عبور باید حداقل ۸ کاراکتر باشد.' }
      if (this.users.some((u) => u.email.toLowerCase() === email))
        return { ok: false, error: 'این ایمیل قبلاً ثبت‌نام کرده است.' }

      const id = Math.max(0, ...this.users.map((u) => u.id)) + 1
      this.users.push({
        id,
        name,
        email,
        password: data.password,
        avatar: makeAvatar(name, AVATAR_COLORS[id % AVATAR_COLORS.length]),
        plan: data.plan ?? 'free',
        role: 'user',
        status: 'active',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        watchlist: [],
        watchHistory: [],
        downloads: [],
      })
      this._persist()
      this._setSession(id)
      return { ok: true }
    },

    loginWithGoogle(): Result {
      this.restoreSession()
      const email = 'user@gmail.com'
      let u = this.users.find((x) => x.email === email)
      if (!u) {
        const r = this.register({ name: 'کاربر گوگل', email, password: 'google-login-demo' })
        return r
      }
      if (u.status === 'banned') return { ok: false, error: 'حساب شما مسدود شده است.' }
      u.lastLogin = new Date().toISOString()
      this._persist()
      this._setSession(u.id)
      return { ok: true }
    },

    logout() {
      this._setSession(null)
    },

    // ───────── لیست من / تاریخچه / دانلود ─────────
    toggleWatchlist(id: number): boolean {
      const u = this.currentUser
      if (!u) {
        if (import.meta.client) navigateTo('/login')
        return false
      }
      const idx = u.watchlist.indexOf(id)
      if (idx === -1) u.watchlist.push(id)
      else u.watchlist.splice(idx, 1)
      this._persist()
      return true
    },

    addToHistory(id: number, progress: number = 0) {
      const u = this.currentUser
      if (!u) return
      const now = new Date().toISOString()
      const existing = u.watchHistory.find((h) => h.id === id)
      if (existing) {
        existing.watchedAt = now
        if (progress > 0) existing.progress = progress
      } else {
        u.watchHistory.unshift({ id, watchedAt: now, progress })
      }
      // آخرین تماشا اول لیست
      u.watchHistory.sort((a, b) => b.watchedAt.localeCompare(a.watchedAt))
      this._persist()
    },

    removeFromHistory(id: number) {
      const u = this.currentUser
      if (!u) return
      u.watchHistory = u.watchHistory.filter((h) => h.id !== id)
      this._persist()
    },

    clearHistory() {
      const u = this.currentUser
      if (!u) return
      u.watchHistory = []
      this._persist()
    },

    addDownload(id: number, quality: string) {
      const u = this.currentUser
      if (!u) return
      u.downloads.unshift({ id, quality, at: new Date().toISOString() })
      this._persist()
    },

    clearDownloads() {
      const u = this.currentUser
      if (!u) return
      u.downloads = []
      this._persist()
    },

    // ───────── پروفایل و اشتراک ─────────
    updateProfile(patch: { name?: string; email?: string; avatar?: string }): Result {
      const u = this.currentUser
      if (!u) return { ok: false, error: 'ابتدا وارد شوید.' }
      if (patch.name !== undefined) {
        if (!patch.name.trim()) return { ok: false, error: 'نام نمی‌تواند خالی باشد.' }
        u.name = patch.name.trim()
      }
      if (patch.email !== undefined) {
        const email = patch.email.trim().toLowerCase()
        if (!emailOk(email)) return { ok: false, error: 'ایمیل معتبر نیست.' }
        if (this.users.some((x) => x.id !== u.id && x.email.toLowerCase() === email))
          return { ok: false, error: 'این ایمیل قبلاً استفاده شده است.' }
        u.email = email
      }
      if (patch.avatar !== undefined) u.avatar = patch.avatar
      this._persist()
      return { ok: true }
    },

    changePassword(oldPass: string, newPass: string): Result {
      const u = this.currentUser
      if (!u) return { ok: false, error: 'ابتدا وارد شوید.' }
      if (u.password !== oldPass) return { ok: false, error: 'رمز فعلی اشتباه است.' }
      if (newPass.length < 8) return { ok: false, error: 'رمز جدید باید حداقل ۸ کاراکتر باشد.' }
      u.password = newPass
      this._persist()
      return { ok: true }
    },

    setPlan(plan: Plan) {
      const u = this.currentUser
      if (!u) return
      u.plan = plan
      this._persist()
    },

    // ───────── مدیریت (فقط ادمین) ─────────
    adminUpdateUser(id: number, patch: Partial<Pick<UserRecord, 'role' | 'plan' | 'status' | 'name'>>): Result {
      if (!this.isAdmin) return { ok: false, error: 'دسترسی ندارید.' }
      const u = this.users.find((x) => x.id === id)
      if (!u) return { ok: false, error: 'کاربر پیدا نشد.' }
      if (id === this.currentUserId && (patch.role === 'user' || patch.status === 'banned'))
        return { ok: false, error: 'نمی‌توانید دسترسی یا وضعیت حساب خودتان را کاهش دهید.' }
      if (patch.role === 'user' && u.role === 'admin' && this.users.filter((x) => x.role === 'admin').length <= 1)
        return { ok: false, error: 'حداقل یک مدیر باید باقی بماند.' }
      Object.assign(u, patch)
      this._persist()
      return { ok: true }
    },

    adminDeleteUser(id: number): Result {
      if (!this.isAdmin) return { ok: false, error: 'دسترسی ندارید.' }
      if (id === this.currentUserId) return { ok: false, error: 'نمی‌توانید حساب خودتان را حذف کنید.' }
      const u = this.users.find((x) => x.id === id)
      if (!u) return { ok: false, error: 'کاربر پیدا نشد.' }
      if (u.role === 'admin' && this.users.filter((x) => x.role === 'admin').length <= 1)
        return { ok: false, error: 'حداقل یک مدیر باید باقی بماند.' }
      this.users = this.users.filter((x) => x.id !== id)
      this._persist()
      return { ok: true }
    },
  },
})
