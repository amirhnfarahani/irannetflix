// iranflix/utils/format.ts — توابع کمکی نمایش عدد و تاریخ فارسی
export function formatNum(n: number): string {
  return Number(n || 0).toLocaleString('fa-IR')
}

export function formatDate(iso?: string | null): string {
  if (!iso) return '—'
  const d = new Date(iso)
  if (isNaN(d.getTime())) return '—'
  return new Intl.DateTimeFormat('fa-IR', { year: 'numeric', month: 'long', day: 'numeric' }).format(d)
}

export function formatDateTime(iso?: string | null): string {
  if (!iso) return '—'
  const d = new Date(iso)
  if (isNaN(d.getTime())) return '—'
  return new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d)
}

export function timeAgo(iso?: string | null): string {
  if (!iso) return '—'
  const diff = Date.now() - new Date(iso).getTime()
  const min = Math.floor(diff / 60000)
  if (min < 1) return 'همین الان'
  if (min < 60) return `${formatNum(min)} دقیقه پیش`
  const h = Math.floor(min / 60)
  if (h < 24) return `${formatNum(h)} ساعت پیش`
  const d = Math.floor(h / 24)
  if (d < 30) return `${formatNum(d)} روز پیش`
  return formatDate(iso)
}
