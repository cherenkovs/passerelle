import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Deterministic shuffle when a seed is given, otherwise random. */
export function shuffle<T>(items: readonly T[], seed?: number): T[] {
  const out = [...items]
  let rand: () => number
  if (seed === undefined) {
    rand = Math.random
  } else {
    let s = seed >>> 0 || 1
    rand = () => {
      s ^= s << 13
      s ^= s >>> 17
      s ^= s << 5
      return ((s >>> 0) % 100000) / 100000
    }
  }
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

export function sample<T>(items: readonly T[], n: number): T[] {
  return shuffle(items).slice(0, n)
}

export function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n))
}

export function uid(prefix = 'id') {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`
}

/** Ukrainian plural forms: pluralUk(5, ['слово','слова','слів']) */
export function pluralUk(n: number, forms: [string, string, string]) {
  const abs = Math.abs(n) % 100
  const last = abs % 10
  if (abs > 10 && abs < 20) return forms[2]
  if (last > 1 && last < 5) return forms[1]
  if (last === 1) return forms[0]
  return forms[2]
}

export function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${String(s).padStart(2, '0')}`
}

/** Local YYYY-MM-DD — never use toISOString(), it shifts the day in UTC+N. */
export function todayKey(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate(),
  ).padStart(2, '0')}`
}

export function daysBetween(a: string, b: string) {
  const [ay, am, ad] = a.split('-').map(Number)
  const [by, bm, bd] = b.split('-').map(Number)
  const da = Date.UTC(ay, am - 1, ad)
  const db = Date.UTC(by, bm - 1, bd)
  return Math.round((db - da) / 86400000)
}
