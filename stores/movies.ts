// iranflix/stores/movies.ts
import { defineStore } from 'pinia'

export interface Movie {
  id: number
  title_fa: string
  title_en: string
  year: number
  duration: number
  imdb: number
  poster: string
  backdrop: string
  genre: string[]
  director: string
  cast: string[]
  synopsis_fa: string
  category: string[]
  trailer_url: string
  type: 'movie' | 'series'
  seasons?: number
  episodes?: number
  country: string
  language: string
}

export interface MovieOverrides {
  added: Movie[]
  edited: Record<number, Movie>
  deleted: number[]
}

const OVERRIDES_KEY = 'iranflix_movies_overrides_v1'
let baseCache: Movie[] = []

async function getBase(): Promise<Movie[]> {
  if (baseCache.length === 0) {
    const { default: data } = await import('../data/movies.json')
    baseCache = data as Movie[]
  }
  return baseCache
}

interface MoviesState {
  overrides: MovieOverrides
  clientReady: boolean
  all: Movie[]
  featured: Movie | null
  rows: Record<string, Movie[]>
  currentMovie: Movie | null
  searchResults: Movie[]
  loading: boolean
  searchQuery: string
}

export const useMoviesStore = defineStore('movies', {
  state: (): MoviesState => ({
    overrides: { added: [], edited: {}, deleted: [] },
    clientReady: false,
    all: [],
    featured: null,
    rows: {},
    currentMovie: null,
    searchResults: [],
    loading: false,
    searchQuery: '',
  }),

  getters: {
    getMovieById: (state) => (id: number) => state.all.find(m => m.id === id),
    moviesByCategory: (state) => (category: string) =>
      state.all.filter(m => m.category.includes(category)),
    onlyMovies: (state) => state.all.filter(m => m.type === 'movie'),
    onlySeries: (state) => state.all.filter(m => m.type === 'series'),
    hasOverrides: (state) =>
      state.overrides.added.length > 0 ||
      state.overrides.deleted.length > 0 ||
      Object.keys(state.overrides.edited).length > 0,
  },

  actions: {
    async loadAll() {
      if (this.all.length > 0) return

      this.loading = true
      try {
        // دیتا مستقیم import می‌شود (هم روی سرور هم کلاینت کار می‌کند، بدون درخواست شبکه)
        await getBase()
        this._readOverrides()
        this._compose()
        if (import.meta.client) this.clientReady = true
      } catch (e) {
        console.error('Failed to load movies:', e)
      } finally {
        this.loading = false
      }
    },

    // بعد از hydrate شدن روی کلاینت، تغییرات پنل ادمین (localStorage) را اعمال می‌کند
    async initClient() {
      if (!import.meta.client || this.clientReady) return
      await getBase()
      this._readOverrides()
      this._compose()
      this.clientReady = true
    },

    async ensureReady() {
      await this.loadAll()
      await this.initClient()
    },

    _readOverrides() {
      if (!import.meta.client) return
      try {
        const raw = localStorage.getItem(OVERRIDES_KEY)
        if (raw) {
          const parsed = JSON.parse(raw)
          this.overrides = {
            added: parsed.added ?? [],
            edited: parsed.edited ?? {},
            deleted: parsed.deleted ?? [],
          }
        }
      } catch {
        /* ignore */
      }
    },

    _saveOverrides() {
      if (!import.meta.client) return
      localStorage.setItem(OVERRIDES_KEY, JSON.stringify(this.overrides))
    },

    _compose() {
      const { added, edited, deleted } = this.overrides
      this.all = baseCache
        .filter((m) => !deleted.includes(m.id))
        .map((m) => edited[m.id] ?? m)
        .concat(added)
      this._buildState()
    },

    // ───────── مدیریت (پنل ادمین) ─────────
    addMovie(data: Omit<Movie, 'id'>): Movie {
      const id = Math.max(0, ...baseCache.map((m) => m.id), ...this.overrides.added.map((m) => m.id)) + 1
      const movie: Movie = { ...data, id }
      this.overrides.added.push(movie)
      this._saveOverrides()
      this._compose()
      return movie
    },

    updateMovie(movie: Movie) {
      const i = this.overrides.added.findIndex((m) => m.id === movie.id)
      if (i !== -1) this.overrides.added[i] = movie
      else this.overrides.edited[movie.id] = movie
      this._saveOverrides()
      this._compose()
    },

    deleteMovie(id: number) {
      const i = this.overrides.added.findIndex((m) => m.id === id)
      if (i !== -1) this.overrides.added.splice(i, 1)
      else {
        delete this.overrides.edited[id]
        if (!this.overrides.deleted.includes(id)) this.overrides.deleted.push(id)
      }
      this._saveOverrides()
      this._compose()
    },

    resetOverrides() {
      this.overrides = { added: [], edited: {}, deleted: [] }
      this._saveOverrides()
      this._compose()
    },

    _buildState() {
      const featuredCandidates = this.all.filter(m => m.category.includes('featured'))
      this.featured = featuredCandidates[0] ?? this.all[0] ?? null

      const categories: Record<string, string> = {
        cinema_now: 'در حال پخش در سینماها',
        popular_series: 'سریال‌های پرطرفدار',
        iranian_top: 'فیلم‌های ایرانی برتر',
        suggested: 'پیشنهاد ما برای شما',
        new: 'جدیدترین‌ها',
      }

      for (const [key] of Object.entries(categories)) {
        this.rows[key] = this.all.filter(m => m.category.includes(key))
      }
    },

    fetchById(id: number) {
      this.currentMovie = this.all.find(m => m.id === id) ?? null
    },

    search(query: string) {
      this.searchQuery = query
      if (!query.trim()) {
        this.searchResults = []
        return
      }
      const q = query.toLowerCase()
      this.searchResults = this.all.filter(m =>
        m.title_fa.includes(q) ||
        m.title_en.toLowerCase().includes(q) ||
        m.director.includes(q) ||
        m.genre.some(g => g.includes(q)) ||
        m.cast.some(c => c.includes(q))
      )
    },
  },
})
