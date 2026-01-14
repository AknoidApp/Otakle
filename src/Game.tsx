import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import './App.css'
import { CHARACTERS } from './characters'
import type { Character } from './characters'
import { DAILY_SCHEDULE } from './dailySchedule'

type Guess = {
  character: Character
  isCorrect: boolean
}

type Stats = {
  currentStreak: number
  maxStreak: number
  lastWinDayIndex: number | null
}

type SavedGame = {
  dayIndex: number
  guesses: string[]
  tries: number
  isFinished: boolean
}

/**
 * ✅ IMPORTANTE:
 * - Cuando estés listo para publicar y partir en “Día 1”, cambia esta fecha.
 * - Debe ser en UTC (año, mes 0-11, día).
 *
 * Ejemplo: 2026-01-15 UTC => (2026, 0, 15)
 */
const LAUNCH_DATE_UTC = { y: 2026, m: 0, d: 6 }

// ✅ NUEVO: límite de intentos
const MAX_TRIES = 8

// ---------- Helpers fechas UTC ----------
const getLaunchBaseUTC = () => new Date(Date.UTC(LAUNCH_DATE_UTC.y, LAUNCH_DATE_UTC.m, LAUNCH_DATE_UTC.d))
const addDaysUTC = (base: Date, days: number) =>
  new Date(Date.UTC(base.getUTCFullYear(), base.getUTCMonth(), base.getUTCDate() + days))
const formatUTCDate = (d: Date) => d.toISOString().slice(0, 10)

// ---------- Día (UTC) ----------
const getDayIndex = (date = new Date()): number => {
  const utcToday = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()))
  const base = getLaunchBaseUTC()
  const diffMs = utcToday.getTime() - base.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  return Math.max(0, diffDays)
}

// ---------- Pick diario “random pero fijo” (determinístico) ----------
const xmur3 = (str: string) => {
  let h = 1779033703 ^ str.length
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353)
    h = (h << 13) | (h >>> 19)
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507)
    h = Math.imul(h ^ (h >>> 13), 3266489909)
    h ^= h >>> 16
    return h >>> 0
  }
}

const mulberry32 = (a: number) => {
  return () => {
    let t = (a += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const seededPickDaily = (dayIndex: number): Character => {
  const seedFn = xmur3(`otakle-${dayIndex}`)
  const rand = mulberry32(seedFn())

  const ids = CHARACTERS.map((c) => c.id)

  for (let i = ids.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[ids[i], ids[j]] = [ids[j], ids[i]]
  }

  const pickedId = ids[0]
  return CHARACTERS.find((c) => c.id === pickedId) ?? CHARACTERS[0]
}

/**
 * ✅ Calendario fijo para los próximos 30 días
 * - Si DAILY_SCHEDULE tiene id para este día -> usamos ese personaje
 * - Si no -> fallback al random determinístico
 */
const getSecretForDay = (dayIndex: number): Character => {
  const scheduledId = DAILY_SCHEDULE[dayIndex]
  if (scheduledId) {
    return CHARACTERS.find((c) => c.id === scheduledId) ?? CHARACTERS[0]
  }
  return seededPickDaily(dayIndex)
}

// ---------- Stats (racha) ----------
const defaultStats: Stats = {
  currentStreak: 0,
  maxStreak: 0,
  lastWinDayIndex: null
}

const loadStats = (): Stats => {
  if (typeof window === 'undefined') return defaultStats
  try {
    const raw = window.localStorage.getItem('otakle_stats')
    if (!raw) return defaultStats
    const parsed = JSON.parse(raw) as Stats
    return {
      currentStreak: parsed.currentStreak ?? 0,
      maxStreak: parsed.maxStreak ?? 0,
      lastWinDayIndex: parsed.lastWinDayIndex ?? null
    }
  } catch {
    return defaultStats
  }
}

const saveStats = (stats: Stats) => {
  if (typeof window === 'undefined') return
  window.localStorage.setItem('otakle_stats', JSON.stringify(stats))
}

const updateStatsOnWin = (stats: Stats, dayIndex: number): Stats => {
  if (stats.lastWinDayIndex === dayIndex) return stats

  const isConsecutive = stats.lastWinDayIndex !== null && dayIndex === stats.lastWinDayIndex + 1
  const currentStreak = isConsecutive ? stats.currentStreak + 1 : 1
  const maxStreak = Math.max(stats.maxStreak, currentStreak)

  return { currentStreak, maxStreak, lastWinDayIndex: dayIndex }
}

// ---------- Partida diaria ----------
const defaultGameState = {
  guesses: [] as Guess[],
  tries: 0,
  isFinished: false
}

const loadGame = (
  dayIndex: number,
  secret: Character
): { guesses: Guess[]; tries: number; isFinished: boolean } => {
  if (typeof window === 'undefined') return defaultGameState

  try {
    const raw = window.localStorage.getItem('otakle_game')
    if (!raw) return defaultGameState
    const data = JSON.parse(raw) as SavedGame

    if (data.dayIndex !== dayIndex) return defaultGameState

    const guesses: Guess[] = (data.guesses || [])
      .map((name) => {
        const char = CHARACTERS.find((c) => c.name === name)
        if (!char) return null
        const isCorrect = char.name === secret.name
        return { character: char, isCorrect }
      })
      .filter((g): g is Guess => g !== null)

    const tries = data.tries ?? guesses.length
    // ✅ si llegó a MAX_TRIES, se considera terminado (aunque no haya acertado)
    const isFinished = Boolean(data.isFinished || guesses.some((g) => g.isCorrect) || tries >= MAX_TRIES)

    return { guesses, tries, isFinished }
  } catch {
    return defaultGameState
  }
}

const saveGame = (dayIndex: number, guesses: Guess[], tries: number, isFinished: boolean) => {
  if (typeof window === 'undefined') return

  const data: SavedGame = {
    dayIndex,
    guesses: guesses.map((g) => g.character.name),
    tries,
    isFinished
  }

  window.localStorage.setItem('otakle_game', JSON.stringify(data))
}

// ---------- Texto para compartir ----------
const buildShareText = (dayIndex: number, secret: Character, guesses: Guess[]): string => {
  const header = `Otakle #${dayIndex + 1} - ${
    guesses[guesses.length - 1]?.isCorrect ? `${guesses.length} intentos` : 'sin resolver'
  }`

  const rows = guesses.map((guess) => {
    const c = guess.character
    const animeCorrect = c.anime === secret.anime
    const genreCorrect = c.genre === secret.genre
    const yearCorrect = c.debutYear === secret.debutYear
    const yearRelation = yearCorrect ? 'equal' : c.debutYear < secret.debutYear ? 'less' : 'greater'
    const studioCorrect = c.studio === secret.studio
    const roleCorrect = c.role === secret.role
    const genderCorrect = c.gender === secret.gender
    const raceCorrect = c.race === secret.race

    const nameEmoji = guess.isCorrect ? '🟩' : '⬜'
    const animeEmoji = animeCorrect ? '🟩' : '🟥'
    const genreEmoji = genreCorrect ? '🟩' : '🟥'
    const yearEmoji = yearRelation === 'equal' ? '🟩' : yearRelation === 'less' ? '🟧' : '🟦'
    const studioEmoji = studioCorrect ? '🟩' : '🟥'
    const roleEmoji = roleCorrect ? '🟩' : '🟥'
    const genderEmoji = genderCorrect ? '🟩' : '🟥'
    const raceEmoji = raceCorrect ? '🟩' : '🟥'

    return `${nameEmoji}${animeEmoji}${genreEmoji}${yearEmoji}${studioEmoji}${roleEmoji}${genderEmoji}${raceEmoji}`
  })

  return [header, ...rows].join('\n')
}

// ---------- Preview (30 días) ----------
type PreviewRow = {
  dayNumber: number
  dateUTC: string
  id: string
  character: Character | null
}

function SchedulePreview() {
  const base = getLaunchBaseUTC()

  const rows: PreviewRow[] = useMemo(() => {
    const ids = DAILY_SCHEDULE.slice(0, 30)

    return ids.map((id, idx) => {
      const dateUTC = formatUTCDate(addDaysUTC(base, idx))
      const character = CHARACTERS.find((c) => c.id === id) ?? null
      return {
        dayNumber: idx + 1,
        dateUTC,
        id,
        character
      }
    })
  }, [base])

  const [imgStatus, setImgStatus] = useState<Record<string, 'ok' | 'broken'>>({})
  const [copied, setCopied] = useState<string | null>(null)

  const missingChars = rows.filter((r) => !r.character).length
  const duplicatesCount = (() => {
    const seen = new Set<string>()
    let dup = 0
    for (const r of rows) {
      if (seen.has(r.id)) dup++
      seen.add(r.id)
    }
    return dup
  })()

  const copyIds = async () => {
    const text = rows.map((r) => r.id).join('\n')
    try {
      await navigator.clipboard.writeText(text)
      setCopied('IDs copiados ✅')
    } catch {
      setCopied('No pude copiar automáticamente (cópialo manualmente).')
    }
    setTimeout(() => setCopied(null), 2500)
  }

  const exitPreview = () => {
    const url = new URL(window.location.href)
    url.searchParams.delete('preview')
    window.location.href = url.toString()
  }

  return (
    <div className="preview-page">
      <header className="topbar">
        <div className="brand">
          <div className="brand-left">
            <img className="brand-logo" src="/otakle-logo.png" alt="Otakle" />
            <div className="brand-text">
              <div className="title-row">
                <h1 className="brand-title">Otakle</h1>
                <span className="daily-badge">Preview</span>
              </div>
              <p className="brand-subtitle">Calendario de los próximos 30 días (solo para revisar)</p>
            </div>
          </div>

          <div className="topbar-actions">
            <button type="button" className="howto-button" onClick={exitPreview}>
              Volver al juego
            </button>
          </div>
        </div>
      </header>

      <div className="preview-card">
        <div className="preview-actions">
          <button type="button" className="preview-btn" onClick={copyIds}>
            Copiar IDs (30)
          </button>
          {copied && <span className="preview-copied">{copied}</span>}
        </div>

        <div className="preview-summary">
          <div className="preview-pill">
            <span className="preview-pill-label">Base UTC</span>
            <span className="preview-pill-value">{formatUTCDate(base)}</span>
          </div>
          <div className={`preview-pill ${duplicatesCount > 0 ? 'warn' : 'ok'}`}>
            <span className="preview-pill-label">Repetidos</span>
            <span className="preview-pill-value">{duplicatesCount}</span>
          </div>
          <div className={`preview-pill ${missingChars > 0 ? 'warn' : 'ok'}`}>
            <span className="preview-pill-label">IDs sin personaje</span>
            <span className="preview-pill-value">{missingChars}</span>
          </div>
        </div>

        {DAILY_SCHEDULE.length === 0 ? (
          <div className="preview-empty">
            <h2>No hay calendario aún</h2>
            <p>
              Genera el archivo <code>src/dailySchedule.ts</code> con el script:
            </p>
            <pre className="preview-code">node scripts/generate-schedule.mjs</pre>
            <p>
              Luego vuelve a abrir: <code>?preview=1</code>
            </p>
          </div>
        ) : (
          <div className="preview-table-wrap">
            <table className="preview-table">
              <thead>
                <tr>
                  <th>Día</th>
                  <th>Fecha (UTC)</th>
                  <th>ID</th>
                  <th>Avatar</th>
                  <th>Nombre</th>
                  <th>Anime</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => {
                  const c = r.character
                  const status = c ? 'OK' : 'Falta en CHARACTERS'
                  const imgKey = c?.imageUrl ?? ''
                  const imgOk = imgKey ? imgStatus[imgKey] !== 'broken' : false

                  return (
                    <tr key={`${r.dayNumber}-${r.id}`} className={!c ? 'row-warn' : ''}>
                      <td className="td-center">#{r.dayNumber}</td>
                      <td className="td-mono">{r.dateUTC}</td>
                      <td className="td-mono">{r.id}</td>
                      <td className="td-center">
                        {c ? (
                          <img
                            className="preview-avatar"
                            src={c.imageUrl}
                            alt={c.name}
                            onError={() => setImgStatus((prev) => ({ ...prev, [c.imageUrl]: 'broken' }))}
                            onLoad={() => setImgStatus((prev) => ({ ...prev, [c.imageUrl]: 'ok' }))}
                          />
                        ) : (
                          <span className="preview-na">—</span>
                        )}
                      </td>
                      <td>{c ? c.name : <span className="preview-na">No encontrado</span>}</td>
                      <td>{c ? c.anime : <span className="preview-na">—</span>}</td>
                      <td>
                        <div className="preview-status">
                          <span className={`badge ${c ? 'badge-ok' : 'badge-warn'}`}>{status}</span>
                          {c && (
                            <span className={`badge ${imgOk ? 'badge-ok' : 'badge-warn'}`}>
                              {imgOk ? 'Imagen OK' : 'Imagen NO carga'}
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

            <p className="preview-note">
              Tip: Si quieres que el Día #1 sea una fecha exacta al publicar, cambia <code>LAUNCH_DATE_UTC</code> en{' '}
              <code>Game.tsx</code>.
            </p>
          </div>
        )}
      </div>

      <footer className="footer">
        <div className="footer-links">
          <Link to="/" className="footer-link">
            Inicio
          </Link>
          <Link to="/privacy" className="footer-link">
            Privacy
          </Link>
          <Link to="/terms" className="footer-link">
            Terms
          </Link>
          <Link to="/contact" className="footer-link">
            Contact
          </Link>
          <a className="footer-link" href="https://twitter.com/aknoid" target="_blank" rel="noreferrer noopener">
            X @aknoid
          </a>
          <a className="footer-link" href="mailto:oscarfernandezcepeda@gmail.com">
            oscarfernandezcepeda@gmail.com
          </a>
        </div>
        <div className="footer-note">
          Otakle by <strong>Aknoid</strong>
        </div>
      </footer>
    </div>
  )
}

export default function Game() {
  const isPreviewMode = useMemo(() => {
    if (typeof window === 'undefined') return false
    const sp = new URLSearchParams(window.location.search)
    return sp.get('preview') === '1'
  }, [])

  if (isPreviewMode) return <SchedulePreview />

  const [dayIndex] = useState<number>(() => getDayIndex())
  const [secret] = useState<Character>(() => getSecretForDay(dayIndex))

  const initialGame = loadGame(dayIndex, secret)

  const [guessInput, setGuessInput] = useState('')
  const [guesses, setGuesses] = useState<Guess[]>(() => initialGame.guesses)
  const [tries, setTries] = useState<number>(() => initialGame.tries)
  const [isFinished, setIsFinished] = useState<boolean>(() => initialGame.isFinished)
  const [message, setMessage] = useState<string | null>(null)
  const [stats, setStats] = useState<Stats>(() => loadStats())
  const [shareMessage, setShareMessage] = useState<string | null>(null)
  const [isHowToOpen, setIsHowToOpen] = useState(false)

  // ✅ NUEVO: filtro por anime (dropdown)
  const [animeFilter, setAnimeFilter] = useState<string>('Todos')

  const animeOptions = useMemo(() => {
    const set = new Set<string>()
    for (const c of CHARACTERS) set.add(c.anime)
    return ['Todos', ...Array.from(set).sort((a, b) => a.localeCompare(b))]
  }, [])

  useEffect(() => {
    if (!isHowToOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsHowToOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isHowToOpen])

  const normalizedInput = guessInput.trim().toLowerCase()

  const candidates = useMemo(() => {
    const base = animeFilter === 'Todos' ? CHARACTERS : CHARACTERS.filter((c) => c.anime === animeFilter)
    return base.map((c) => ({ c, nameLower: c.name.toLowerCase() }))
  }, [animeFilter])

  // ✅ NUEVO: 10 sugerencias + startsWith (prefix) + fallback a includes si falta
  const suggestions = useMemo(() => {
    if (!normalizedInput || isFinished) return []

    const prefix = candidates
      .filter((x) => x.nameLower.startsWith(normalizedInput))
      .map((x) => x.c)

    if (prefix.length >= 10) return prefix.slice(0, 10)

    const prefixSet = new Set(prefix.map((p) => p.id))
    const contains = candidates
      .filter((x) => !prefixSet.has(x.c.id) && x.nameLower.includes(normalizedInput))
      .map((x) => x.c)

    return [...prefix, ...contains].slice(0, 10)
  }, [normalizedInput, isFinished, candidates])

  const isLocked = isFinished || tries >= MAX_TRIES

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (isLocked) return

    if (tries >= MAX_TRIES) {
      setMessage(`Se acabaron los intentos (${MAX_TRIES}). Vuelve mañana.`)
      setIsFinished(true)
      saveGame(dayIndex, guesses, tries, true)
      return
    }

    const normalized = guessInput.trim().toLowerCase()
    if (!normalized) return

    const found = CHARACTERS.find((c) => c.name.toLowerCase() === normalized)

    if (!found) {
      setMessage('Ese personaje no está en la base de datos (por ahora). Prueba con otro.')
      return
    }

    const isCorrect = found.name === secret.name
    const nextTries = tries + 1
    const newGuesses: Guess[] = [...guesses, { character: found, isCorrect }]

    setGuesses(newGuesses)
    setTries(nextTries)
    setGuessInput('')
    setShareMessage(null)

    if (isCorrect) {
      setMessage(`¡Correcto! Era ${secret.name}. Intentos: ${nextTries}/${MAX_TRIES}`)
      setIsFinished(true)

      const newStats = updateStatsOnWin(stats, dayIndex)
      setStats(newStats)
      saveStats(newStats)

      saveGame(dayIndex, newGuesses, nextTries, true)
      return
    }

    // ❌ fallo
    if (nextTries >= MAX_TRIES) {
      setMessage(`Se acabaron los intentos (${MAX_TRIES}). El personaje era ${secret.name}.`)
      setIsFinished(true)
      saveGame(dayIndex, newGuesses, nextTries, true)
      return
    }

    setMessage('No es ese personaje, revisa las pistas 👀')
    saveGame(dayIndex, newGuesses, nextTries, false)
  }

  const handleShare = async () => {
    if (guesses.length === 0) return
    const text = buildShareText(dayIndex, secret, guesses)
    try {
      if (navigator.clipboard && 'writeText' in navigator.clipboard) {
        await navigator.clipboard.writeText(text)
        setShareMessage('Resultado copiado al portapapeles ✨')
      } else {
        window.prompt('Copia tu resultado:', text)
        setShareMessage('Resultado listo para compartir ✨')
      }
    } catch {
      setShareMessage('No se pudo copiar automáticamente. Intenta copiarlo manualmente.')
    }
  }

  const handleShareX = () => {
    if (guesses.length === 0) return
    const text = buildShareText(dayIndex, secret, guesses) + '\n\n' + window.location.href
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const handleSuggestionClick = (name: string) => {
    setGuessInput(name)
  }

  return (
    <div className="otakudle-container">
      <header className="topbar">
        <div className="brand">
          <div className="brand-left">
            <img className="brand-logo" src="/otakle-logo.png" alt="Otakle" />
            <div className="brand-text">
              <div className="title-row">
                <h1 className="brand-title">Otakle</h1>
                <span className="daily-badge" aria-label="Juego diario">
                  Daily
                </span>
              </div>
              <p className="brand-subtitle">Adivina el personaje de anime del día</p>
            </div>
          </div>

          <div className="topbar-actions">
            <button type="button" className="howto-button" onClick={() => setIsHowToOpen(true)}>
              ¿Cómo se juega?
            </button>
          </div>
        </div>
      </header>

      <div className="home-howto">
  <h2>Cómo se juega</h2>
  <ul>
    <li>Escribe un personaje y presiona <strong>Probar</strong>.</li>
    <li>Tienes <strong>{MAX_TRIES} intentos</strong> máximos por día.</li>
    <li>Los cuadros comparan tu intento con el personaje del día (Anime, Tipo, Año, Estudio, Rol, Género y Raza).</li>
    <li>
      El año incluye una flecha: <strong>↑</strong> significa que el personaje del día es más nuevo; <strong>↓</strong> que es más antiguo.
    </li>
    <li>
      Todos reciben el mismo personaje y cambia a las <strong>00:00 UTC</strong> (aprox. <strong>21:00</strong> en Chile).
    </li>
  </ul>
  <p className="home-howto-link">
    ¿Quieres más detalles? <Link to="/about">Lee la guía completa aquí</Link>.
  </p>
</div>


      <div className="guess-form-wrapper">
        {/* ✅ NUEVO: filtro por anime */}
        <div className="filters-row">
          <label className="sr-only" htmlFor="anime-filter">
            Filtrar por anime
          </label>
          <select
            id="anime-filter"
            className="anime-select"
            value={animeFilter}
            onChange={(e) => setAnimeFilter(e.target.value)}
            disabled={isLocked}
            aria-label="Filtrar sugerencias por anime"
          >
            {animeOptions.map((a) => (
              <option key={a} value={a}>
                {a === 'Todos' ? 'Anime: Todos' : `Anime: ${a}`}
              </option>
            ))}
          </select>

          <div className="tries-chip" aria-label={`Intentos ${tries} de ${MAX_TRIES}`}>
            {tries}/{MAX_TRIES}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="guess-form">
          <label htmlFor="guess-input" className="sr-only">
            Nombre del personaje
          </label>
          <input
            id="guess-input"
            name="guess"
            aria-label="Nombre del personaje"
            type="text"
            placeholder="Escribe el nombre del personaje (ej: Goku, Luffy...)"
            value={guessInput}
            onChange={(e) => setGuessInput(e.target.value)}
            disabled={isLocked}
          />
          <button type="submit" disabled={isLocked}>
            Probar
          </button>
        </form>

        {!isLocked && suggestions.length > 0 && (
          <ul className="suggestions-list">
            {suggestions.map((c) => (
              <li key={c.id} className="suggestion-item" onClick={() => handleSuggestionClick(c.name)}>
                <img src={c.imageUrl} alt={c.name} className="suggestion-avatar" />
                <div className="suggestion-text">
                  <span className="suggestion-name">{c.name}</span>
                  <span className="suggestion-anime">{c.anime}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="status-row">
        {message && <p className="message">{message}</p>}
        <p className="tries">
          Intentos: {tries}/{MAX_TRIES}
        </p>
      </div>

      <div className="stats-panel">
        <div className="stat-card">
          <div className="stat-label">Racha actual</div>
          <div className="stat-value">{stats.currentStreak}</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Mejor racha</div>
          <div className="stat-value">{stats.maxStreak}</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Día</div>
          <div className="stat-value">#{dayIndex + 1}</div>
        </div>
      </div>

      <div className="hints-grid">
        <h2>Pistas por intento</h2>
        {guesses.length === 0 ? (
          <p>Aún no hay intentos. Escribe un nombre para ver los cuadros de pistas.</p>
        ) : (
          <>
            <div className="grid-row grid-header">
              <span>Nombre</span>
              <span>Anime</span>
              <span>Tipo</span>
              <span>Año debut</span>
              <span>Estudio</span>
              <span>Rol</span>
              <span>Género</span>
              <span>Raza</span>
            </div>

            {guesses.map((guess, index) => {
              const c = guess.character
              const animeCorrect = c.anime === secret.anime
              const genreCorrect = c.genre === secret.genre
              const yearCorrect = c.debutYear === secret.debutYear
              const yearRelation = yearCorrect ? 'equal' : c.debutYear < secret.debutYear ? 'less' : 'greater'
              const studioCorrect = c.studio === secret.studio
              const roleCorrect = c.role === secret.role
              const genderCorrect = c.gender === secret.gender
              const raceCorrect = c.race === secret.race

              const yearArrow = yearRelation === 'equal' ? '✓' : yearRelation === 'less' ? '↑' : '↓'
              const yearHintText =
                yearRelation === 'equal'
                  ? 'Mismo año'
                  : yearRelation === 'less'
                    ? 'El personaje del día es más nuevo'
                    : 'El personaje del día es más antiguo'

              return (
                <div key={index} className={`grid-row ${guess.isCorrect ? 'row-correct' : ''}`}>
                  <span className="hint-box name-box" data-label="Nombre">
                    {c.name}
                  </span>

                  <span
                    className={`hint-box ${animeCorrect ? 'correct' : 'incorrect'}`}
                    title={animeCorrect ? 'Mismo anime' : 'Anime distinto'}
                    data-label="Anime"
                  >
                    {c.anime}
                  </span>

                  <span
                    className={`hint-box ${genreCorrect ? 'correct' : 'incorrect'}`}
                    title={genreCorrect ? 'Mismo tipo de anime' : 'Tipo distinto'}
                    data-label="Tipo"
                  >
                    {c.genre}
                  </span>

                  <span
                    className={`hint-box year-box ${
                      yearRelation === 'equal' ? 'correct' : yearRelation === 'less' ? 'higher' : 'lower'
                    }`}
                    title={yearHintText}
                    data-label="Año debut"
                  >
                    <span className="year-inline">
                      <span className="year-value">{c.debutYear}</span>
                      <span className="year-arrow">{yearArrow}</span>
                    </span>
                  </span>

                  <span
                    className={`hint-box ${studioCorrect ? 'correct' : 'incorrect'}`}
                    title={studioCorrect ? 'Mismo estudio' : 'Estudio distinto'}
                    data-label="Estudio"
                  >
                    {c.studio}
                  </span>

                  <span
                    className={`hint-box ${roleCorrect ? 'correct' : 'incorrect'}`}
                    title={roleCorrect ? 'Mismo rol en la historia' : 'Rol distinto'}
                    data-label="Rol"
                  >
                    {c.role}
                  </span>

                  <span
                    className={`hint-box ${genderCorrect ? 'correct' : 'incorrect'}`}
                    title={genderCorrect ? 'Mismo género' : 'Género distinto'}
                    data-label="Género"
                  >
                    {c.gender}
                  </span>

                  <span
                    className={`hint-box ${raceCorrect ? 'correct' : 'incorrect'}`}
                    title={raceCorrect ? 'Misma raza/especie' : 'Raza distinta'}
                    data-label="Raza"
                  >
                    {c.race}
                  </span>
                </div>
              )
            })}
          </>
        )}
      </div>

      {isFinished && (
        <>
          <div className="share-row">
            <button type="button" onClick={handleShare}>
              Copiar resultado
            </button>

            <button type="button" className="share-x" onClick={handleShareX}>
              Compartir en X
            </button>

            {shareMessage && <span className="share-message">{shareMessage}</span>}
          </div>

          <div className="secret-info">
            <div className="secret-header">
              <img src={secret.imageUrl} alt={secret.name} className="secret-image" />
              <div className="secret-main">
                <h3>Detalles del personaje del día</h3>
                <p>
                  <strong>Nombre:</strong> {secret.name}
                </p>
                <p>
                  <strong>Anime:</strong> {secret.anime}
                </p>
                <p>
                  <strong>Tipo:</strong> {secret.genre}
                </p>
                <p>
                  <strong>Año debut:</strong> {secret.debutYear}
                </p>
                <p>
                  <strong>Estudio:</strong> {secret.studio}
                </p>
                <p>
                  <strong>Rol:</strong> {secret.role}
                </p>
                <p>
                  <strong>Género:</strong> {secret.gender}
                </p>
                <p>
                  <strong>Raza:</strong> {secret.race}
                </p>
              </div>
            </div>

            <p className="secret-debut">
              <strong>Debut:</strong> {secret.debutInfo}
            </p>
          </div>
        </>
      )}

      <footer className="footer">
        <div className="footer-links">
          <Link to="/" className="footer-link">
            Inicio
          </Link>
          <Link to="/privacy" className="footer-link">
            Privacy
          </Link>
          <Link to="/terms" className="footer-link">
            Terms
          </Link>
          <Link to="/contact" className="footer-link">
            Contact
          </Link>
          <Link to="/about" className="footer-link">
            About
          </Link>

          <a className="footer-link" href="https://twitter.com/aknoid" target="_blank" rel="noreferrer noopener">
            X @aknoid
          </a>
          <a className="footer-link" href="mailto:oscarfernandezcepeda@gmail.com">
            oscarfernandezcepeda@gmail.com
          </a>
        </div>
        <div className="footer-note">
          Otakle by <strong>Aknoid</strong>
        </div>
      </footer>

      {isHowToOpen && (
        <div
          className="modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Cómo se juega"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setIsHowToOpen(false)
          }}
        >
          <div className="modal-card">
            <div className="modal-header">
              <h2>¿Cómo se juega?</h2>
              <button type="button" className="modal-close" onClick={() => setIsHowToOpen(false)} aria-label="Cerrar">
                ✕
              </button>
            </div>

            <div className="modal-body">
              <ul className="howto-list">
                <li>
                  Escribe un personaje y presiona <strong>Probar</strong>.
                </li>
                <li>
                  Tienes <strong>{MAX_TRIES} intentos</strong> máximos por día.
                </li>
                <li>
                  Cada fila muestra pistas del personaje del día:{' '}
                  <strong>Anime, Tipo, Año, Estudio, Rol, Género y Raza</strong>.
                </li>
                <li>
                  Colores:
                  <div className="howto-badges">
                    <span className="howto-pill correct">Verde</span>
                    <span className="howto-text">= coincide</span>

                    <span className="howto-pill incorrect">Rojo</span>
                    <span className="howto-text">= no coincide</span>

                    <span className="howto-pill higher">🟧</span>
                    <span className="howto-text">= el personaje del día es más nuevo</span>

                    <span className="howto-pill lower">🟦</span>
                    <span className="howto-text">= el personaje del día es más antiguo</span>
                  </div>
                </li>
                <li>
                  Cuando terminas, puedes <strong>copiar tu resultado</strong> o <strong>compartirlo en X</strong>.
                </li>
              </ul>
            </div>

            <div className="modal-footer">
              <button type="button" className="modal-primary" onClick={() => setIsHowToOpen(false)}>
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
