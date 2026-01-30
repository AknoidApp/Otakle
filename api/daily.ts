import type { VercelRequest, VercelResponse } from '@vercel/node'
// NOTE: omit extension so TypeScript can resolve the .ts module during Vercel builds
import { CHARACTER_IDS } from './characters-lite'

// Mantener igual que tu versión: 2026-01-06 UTC => Día #1
const LAUNCH_DATE_UTC = { y: 2026, m: 0, d: 6 }

// ENV en Vercel (Production): OTakle_DAILY_SALT (recomendado)
const DAILY_SALT = process.env.OTAKLE_DAILY_SALT || 'dev-salt-change-me'

const getLaunchBaseUTC = () => new Date(Date.UTC(LAUNCH_DATE_UTC.y, LAUNCH_DATE_UTC.m, LAUNCH_DATE_UTC.d))

function getDayIndex(date = new Date()) {
  const utcToday = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()))
  const base = getLaunchBaseUTC()
  const diffMs = utcToday.getTime() - base.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  return Math.max(0, diffDays)
}

// xmur3 + mulberry32: hash/PRNG determinístico
function xmur3(str: string) {
  let h = 1779033703 ^ str.length
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353)
    h = (h << 13) | (h >>> 19)
  }
  return function () {
    h = Math.imul(h ^ (h >>> 16), 2246822507)
    h = Math.imul(h ^ (h >>> 13), 3266489909)
    h ^= h >>> 16
    return h >>> 0
  }
}

function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function seededShuffle<T>(arr: T[], seedStr: string) {
  const seed = xmur3(seedStr)()
  const rand = mulberry32(seed)
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Pool “Easy” server-side
const EASY_POOL_IDS = [
  'goku','vegeta','gohan',
  'naruto','sasuke_uchiha',
  'luffy','roronoa_zoro','shanks',
  'tanjiro','deku',
  'ichigo','edward_elric',
  'light_yagami','lelouch',
  'kageyama','kaguya','zero_two',
  'saitama','spike_spiegel',
]

export default function handler(req: VercelRequest, res: VercelResponse) {
  const modeRaw = String(req.query.mode || 'normal').toLowerCase()
  const mode = modeRaw === 'easy' ? 'easy' : 'normal'

  const dayIndex = getDayIndex()
  const dayNumber = dayIndex + 1

  // ✅ Si el lite está vacío, devuelve error claro (no fallback a goku)
  if (!Array.isArray(CHARACTER_IDS) || CHARACTER_IDS.length === 0) {
    res.setHeader('Cache-Control', 'no-store, max-age=0')
    return res.status(500).json({
      error: 'CHARACTER_IDS está vacío. Ejecuta `npm run generate:characters` para regenerar api/characters-lite.ts desde el CSV.',
    })
  }

  let pool = CHARACTER_IDS

  if (mode === 'easy') {
    const easySet = new Set(EASY_POOL_IDS)
    const easy = CHARACTER_IDS.filter((id) => easySet.has(id))
    pool = easy.length >= 8 ? easy : CHARACTER_IDS.slice(0, Math.min(80, CHARACTER_IDS.length))
  }

  const seedStr = `otakle|${mode}|${dayIndex}|${DAILY_SALT}`
  const shuffled = seededShuffle(pool, seedStr)
  const pickId = shuffled[0]

  res.setHeader('Cache-Control', 'no-store, max-age=0')
  res.status(200).json({
    dayIndex,
    dayNumber,
    id: pickId,
    maxTries: 8,
    changesAtUTC: '00:00 UTC',
  })
}
