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

interface MoviesState {
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
  },

  actions: {
    async loadAll() {
      if (this.all.length > 0) return

      this.loading = true
      try {
        // دیتا مستقیم import می‌شود (هم روی سرور هم کلاینت کار می‌کند، بدون درخواست شبکه)
        const { default: data } = await import('../data/movies.json')
        this.all = data as Movie[]
        this._buildState()
      } catch (e) {
        console.error('Failed to load movies:', e)
      } finally {
        this.loading = false
      }
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
