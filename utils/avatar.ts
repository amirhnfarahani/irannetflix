// iranflix/utils/avatar.ts — ساخت آواتار SVG با حرف اول نام (بدون نیاز به اینترنت)
export const AVATAR_COLORS = [
  '#E50914',
  '#F5C518',
  '#2563EB',
  '#059669',
  '#7C3AED',
  '#DB2777',
  '#EA580C',
  '#0891B2',
]

function esc(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

export function makeAvatar(name: string, color: string = AVATAR_COLORS[0]): string {
  const ch = esc(Array.from((name || '?').trim())[0] ?? '?')
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96">` +
    `<rect width="96" height="96" fill="${color}"/>` +
    `<text x="50%" y="50%" dy=".35em" text-anchor="middle" font-family="Vazirmatn,Arial,sans-serif" ` +
    `font-size="44" font-weight="700" fill="#fff">${ch}</text></svg>`
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg)
}
