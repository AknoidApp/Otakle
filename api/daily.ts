import type { VercelRequest, VercelResponse } from '@vercel/node'
import { ACTIVE_CHARACTER_IDS } from './characters-lite.ts'

// Mantener igual que en el cliente antiguo: 2026-01-06 UTC => Día #1
const LAUNCH_DATE_UTC = { y: 2026, m: 0, d: 6 }

// ⚠️ En Vercel (Production) configura OTakle_DAILY_SALT / OTAKLE_DAILY_SALT (recomendado)
// Si no existe, igual funciona pero será más “predecible” para alguien que reverse-engineeree.
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

// Pool “Easy” (server-side). Puedes ajustar/expandir cuando quieras.
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

  let pool = ACTIVE_CHARACTER_IDS

  if (mode === 'easy') {
    const easySet = new Set(EASY_POOL_IDS)
    const easy = ACTIVE_CHARACTER_IDS.filter((id) => easySet.has(id))
    // Si easy queda chico, fallback a los primeros N
    pool = easy.length >= 8 ? easy : ACTIVE_CHARACTER_IDS.slice(0, Math.min(80, ACTIVE_CHARACTER_IDS.length))
  }

  const seedStr = `otakle|${mode}|${dayIndex}|${DAILY_SALT}`
  const shuffled = seededShuffle(pool, seedStr)
  const pick = shuffled[0] || 'goku'

  // Evita cache del daily
  res.setHeader('Cache-Control', 'no-store, max-age=0')
  res.status(200).json({
    dayIndex,
    dayNumber,
    id: pick,
    maxTries: 8,
    changesAtUTC: '00:00 UTC',
  })
}