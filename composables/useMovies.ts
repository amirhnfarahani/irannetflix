// iranflix/composables/useMovies.ts
import { useMoviesStore } from '../stores/movies'

export const useMovies = () => {
  const store = useMoviesStore()

  const rowLabels: Record<string, string> = {
    cinema_now: 'در حال پخش در سینماها',
    popular_series: 'سریال‌های پرطرفدار',
    iranian_top: 'فیلم‌های ایرانی برتر',
    suggested: 'پیشنهاد ما برای شما',
    new: 'جدیدترین‌ها',
  }

  const formatDuration = (minutes: number): string => {
    const h = Math.floor(minutes / 60)
    const m = minutes % 60
    if (h === 0) return `${m} دقیقه`
    return `${h} ساعت ${m > 0 ? `و ${m} دقیقه` : ''}`
  }

  const formatImdb = (score: number): string => score.toFixed(1)

  return {
    store,
    rowLabels,
    formatDuration,
    formatImdb,
  }
}
