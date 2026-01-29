export type HistoryEntry = {
  dayIndex: number
  dateUTC: string // YYYY-MM-DD (UTC)
  won: boolean
  tries: number
}

const KEY = 'otakle_history_v1'

function formatUTCDateFromDayIndex(dayIndex: number, launchDateUTC: { y: number; m: number; d: number }) {
  const base = new Date(Date.UTC(launchDateUTC.y, launchDateUTC.m, launchDateUTC.d))
  const d = new Date(Date.UTC(base.getUTCFullYear(), base.getUTCMonth(), base.getUTCDate() + dayIndex))
  return d.toISOString().slice(0, 10)
}

export function loadHistory(): HistoryEntry[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed
      .filter((x) => x && typeof x.dayIndex === 'number')
      .sort((a, b) => a.dayIndex - b.dayIndex)
  } catch {
    return []
  }
}

export function saveHistory(entries: HistoryEntry[]) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(KEY, JSON.stringify(entries))
}

export function upsertHistoryEntry(args: {
  dayIndex: number
  won: boolean
  tries: number
  launchDateUTC: { y: number; m: number; d: number }
}) {
  const entries = loadHistory()
  const dateUTC = formatUTCDateFromDayIndex(args.dayIndex, args.launchDateUTC)

  const next: HistoryEntry = {
    dayIndex: args.dayIndex,
    dateUTC,
    won: args.won,
    tries: args.tries
  }

  const i = entries.findIndex((e) => e.dayIndex === args.dayIndex)
  if (i >= 0) entries[i] = next
  else entries.push(next)

  entries.sort((a, b) => a.dayIndex - b.dayIndex)
  saveHistory(entries)
}

export function computeStatsFromHistory(entries: HistoryEntry[]) {
  const played = entries.length
  const wins = entries.filter((e) => e.won).length
  const losses = played - wins

  const winTries = entries.filter((e) => e.won).map((e) => e.tries)
  const avgWinTries = winTries.length ? winTries.reduce((a, b) => a + b, 0) / winTries.length : null

  const dist: Record<number, number> = {}
  for (let t = 1; t <= 8; t++) dist[t] = 0
  for (const e of entries) {
    if (e.won && e.tries >= 1 && e.tries <= 8) dist[e.tries]++
  }

  return { played, wins, losses, avgWinTries, dist }
}
