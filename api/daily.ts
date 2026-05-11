import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getActiveCharacterIds, getDailyOverride, type Mode } from './lib/catalog.js'

// Mantener igual que tu versión: 2026-01-06 UTC => Día #1
const LAUNCH_DATE_UTC = { y: 2026, m: 0, d: 6 }

// ENV en Vercel (Production): OTAKLE_DAILY_SALT (recomendado)
const DAILY_SALT = process.env.OTAKLE_DAILY_SALT || 'dev-salt-change-me'

const getLaunchBaseUTC = () => new Date(Date.UTC(LAUNCH_DATE_UTC.y, LAUNCH_DATE_UTC.m, LAUNCH_DATE_UTC.d))

function getDayIndex(date = new Date()) {
  const utcToday = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()))
  const base = getLaunchBaseUTC()
  const diffMs = utcToday.getTime() - base.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  return Math.max(0, diffDays)
}

function formatDateUTCFromDayIndex(dayIndex: number) {
  const base = getLaunchBaseUTC()
  const date = new Date(Date.UTC(base.getUTCFullYear(), base.getUTCMonth(), base.getUTCDate() + dayIndex))
  return date.toISOString().slice(0, 10)
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
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const modeRaw = String(req.query.mode || 'normal').toLowerCase()
  const mode: Mode = modeRaw === 'easy' ? 'easy' : 'normal'

  const dayIndex = getDayIndex()
  const dayNumber = dayIndex + 1
  const dateUTC = formatDateUTCFromDayIndex(dayIndex)

  const overrideId = await getDailyOverride({ dateUTC, mode })

  let pickId = overrideId

  if (!pickId) {
    const pool = await getActiveCharacterIds(mode)

    if (!Array.isArray(pool) || pool.length === 0) {
      res.setHeader('Cache-Control', 'no-store, max-age=0')
      return res.status(500).json({
        error: 'No hay personajes activos disponibles. Revisa el catálogo o la conexión con Supabase.',
      })
    }

    const seedStr = `otakle|${mode}|${dayIndex}|${DAILY_SALT}`
    const shuffled = seededShuffle(pool, seedStr)
    pickId = shuffled[0]
  }

  res.setHeader('Cache-Control', 'no-store, max-age=0')
  res.status(200).json({
    dayIndex,
    dayNumber,
    id: pickId,
    maxTries: 8,
    changesAtUTC: '00:00 UTC',
  })
}
