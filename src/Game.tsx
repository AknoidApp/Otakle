import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import './App.css'
import { CHARACTERS } from './characters'
import type { Character } from './characters'

type Mode = 'normal' | 'easy'

type GuessRow = {
  character: Character
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
  isWin: boolean
}

type DailyResponse = {
  dayIndex: number
  dayNumber: number
  id: string
  maxTries: number
  changesAtUTC: string
}

const MAX_TRIES = 8
const DEFAULT_MODE: Mode = 'normal'

// Pool “Easy” (client-side) solo para limitar sugerencias.
// El “daily real” lo decide el server, así que esto NO revela el futuro.
const EASY_GUESS_IDS = new Set<string>([
  'goku',
  'vegeta',
  'gohan',
  'naruto',
  'sasuke_uchiha',
  'luffy',
  'roronoa_zoro',
  'shanks',
  'tanjiro',
  'deku',
  'ichigo',
  'edward_elric',
  'light_yagami',
  'lelouch',
  'kageyama',
  'kaguya',
  'zero_two',
  'saitama',
  'spike_spiegel',
])

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

function norm(s: string) {
  return (s ?? '').trim().toLowerCase()
}

function loadJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function saveJSON(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value))
}

function getModeKey(mode: Mode, suffix: string) {
  return `otakle_v2_${suffix}_${mode}`
}

function buildShareText(args: { dayNumber: number; mode: Mode; tries: number; isWin: boolean }) {
  const header = `Otakle #${args.dayNumber} • ${args.mode === 'easy' ? 'Easy' : 'Normal'}`
  const result = args.isWin ? `✅ ${args.tries}/${MAX_TRIES}` : `❌ X/${MAX_TRIES}`
  return `${header}\n${result}\n${location.origin}`
}

function yearClass(secret: number, guess: number) {
  if (secret === guess) return 'correct'
  return secret > guess ? 'higher' : 'lower'
}

/**
 * ✅ Normaliza anime para evitar “Boku no Hero” vs “My Hero Academia”
 * Agrega más alias aquí cuando detectes duplicados.
 */
function canonicalAnime(input: string) {
  const s = norm(input)

  if (s.includes('boku no hero') || s.includes('my hero academia') || s === 'bnha' || s === 'mha') {
    return 'My Hero Academia'
  }

  return (input ?? '').trim()
}

function displayText(s: string) {
  return (s ?? '').trim()
}

function getDebutYear(c: any): number | null {
  const v = c?.yearDebut ?? c?.debutYear ?? null
  const n = Number(v)
  return Number.isFinite(n) ? n : null
}

function getAgeDebutGroup(c: any): string {
  const v = c?.ageDebutGroup ?? c?.edadDebutGroup ?? c?.age_debut_group
  return (v ?? 'Desconocido').toString().trim() || 'Desconocido'
}

function getAgeMainGroup(c: any): string {
  const v = c?.ageMainGroup ?? c?.edadMainGroup ?? c?.age_main_group
  return (v ?? 'Desconocido').toString().trim() || 'Desconocido'
}

export default function Game() {
  const [mode, setMode] = useState<Mode>(() => loadJSON<Mode>('otakle_mode', DEFAULT_MODE))

  // ✅ selector anime (SOLO FILTRA SUGERENCIAS)
  const [animeFilter, setAnimeFilter] = useState<string>(() => loadJSON<string>('otakle_anime_filter', 'ALL'))

  const [daily, setDaily] = useState<DailyResponse | null>(null)
  const [dailyError, setDailyError] = useState<string | null>(null)
  const [secret, setSecret] = useState<Character | null>(null)

  const [guessInput, setGuessInput] = useState('')
  const [guesses, setGuesses] = useState<GuessRow[]>([])
  const [tries, setTries] = useState(0)
  const [isFinished, setIsFinished] = useState(false)
  const [isWin, setIsWin] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const [stats, setStats] = useState<Stats>(() =>
    loadJSON<Stats>(getModeKey(mode, 'stats'), {
      currentStreak: 0,
      maxStreak: 0,
      lastWinDayIndex: null,
    }),
  )

  const [shareMessage, setShareMessage] = useState<string | null>(null)
  const [isHowToOpen, setIsHowToOpen] = useState(false)
  const [isResultOpen, setIsResultOpen] = useState(false)

  const activeCharacters = useMemo(() => CHARACTERS.filter((c) => (c as any).active !== false), [])

  // ✅ opciones de anime (únicas)
  const animeOptions = useMemo(() => {
    const set = new Set<string>()
    for (const c of activeCharacters) {
      const a = canonicalAnime((c as any).anime)
      if (a) set.add(a)
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b))
  }, [activeCharacters])

  // persist filtro
  useEffect(() => {
    saveJSON('otakle_anime_filter', animeFilter)
  }, [animeFilter])

  const guessPool = useMemo(() => {
    let base = activeCharacters

    if (mode === 'easy') {
      const filtered = activeCharacters.filter((c) => EASY_GUESS_IDS.has((c as any).id))
      base = filtered.length ? filtered : activeCharacters
    }

    // ✅ aplica filtro anime SOLO a sugerencias
    if (animeFilter && animeFilter !== 'ALL') {
      base = base.filter((c) => canonicalAnime((c as any).anime) === animeFilter)
    }

    return base
  }, [activeCharacters, mode, animeFilter])

  // --- Fetch daily from server ---
  useEffect(() => {
    saveJSON('otakle_mode', mode)

    // ✅ IMPORTANTÍSIMO: limpiar UI para evitar crash mientras `secret` queda null
    setDaily(null)
    setDailyError(null)
    setSecret(null)
    setGuesses([])
    setTries(0)
    setIsFinished(false)
    setIsWin(false)
    setGuessInput('')
    setMessage(null)
    setShareMessage(null)
    setIsHowToOpen(false)
    setIsResultOpen(false)

    const ctrl = new AbortController()

    ;(async () => {
      try {
        const res = await fetch(`/api/daily?mode=${mode}`, { signal: ctrl.signal, cache: 'no-store' })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = (await res.json()) as DailyResponse
        setDaily(data)

        const found = activeCharacters.find((c) => (c as any).id === data.id) ?? null
        setSecret(found)
        if (!found) setDailyError('No encuentro el personaje del día en CHARACTERS (revisa ids / CSV).')
      } catch (e: any) {
        if (e?.name === 'AbortError') return
        setDailyError('No pude cargar el personaje del día. Revisa que Vercel tenga /api/daily funcionando.')
      }
    })()

    return () => ctrl.abort()
  }, [mode, activeCharacters])

  // --- Load saved game for this day+mode ---
  useEffect(() => {
    if (!daily || !secret) return

    const gameKey = getModeKey(mode, 'game')
    const saved = loadJSON<SavedGame | null>(gameKey, null)

    if (saved && saved.dayIndex === daily.dayIndex) {
      const loadedGuesses = saved.guesses
        .map((id) => activeCharacters.find((c) => (c as any).id === id))
        .filter(Boolean)
        .map((character) => ({ character: character! }))

      setGuesses(loadedGuesses)
      setTries(saved.tries)
      setIsFinished(saved.isFinished)
      setIsWin(saved.isWin)
      if (saved.isFinished) setIsResultOpen(true)
    } else {
      setGuesses([])
      setTries(0)
      setIsFinished(false)
      setIsWin(false)
      saveJSON(gameKey, {
        dayIndex: daily.dayIndex,
        guesses: [],
        tries: 0,
        isFinished: false,
        isWin: false,
      } satisfies SavedGame)
    }

    setStats(
      loadJSON<Stats>(getModeKey(mode, 'stats'), {
        currentStreak: 0,
        maxStreak: 0,
        lastWinDayIndex: null,
      }),
    )
  }, [daily, secret, mode, activeCharacters])

  // --- Suggestions (startsWith, max 10) ---
  const suggestions = useMemo(() => {
    const q = norm(guessInput)
    if (q.length < 1) return []
    return guessPool.filter((c) => norm((c as any).name).startsWith(q)).slice(0, 10)
  }, [guessInput, guessPool])

  function persistGame(next: Partial<SavedGame>) {
    if (!daily) return
    const key = getModeKey(mode, 'game')
    const current = loadJSON<SavedGame>(key, {
      dayIndex: daily.dayIndex,
      guesses: [],
      tries: 0,
      isFinished: false,
      isWin: false,
    })
    saveJSON(key, { ...current, ...next })
  }

  function updateStatsOnFinish(win: boolean) {
    if (!daily) return
    const key = getModeKey(mode, 'stats')
    const prev = loadJSON<Stats>(key, { currentStreak: 0, maxStreak: 0, lastWinDayIndex: null })

    const next = { ...prev }

    if (win) {
      const yesterday = daily.dayIndex - 1
      const isChain = prev.lastWinDayIndex === yesterday
      next.currentStreak = isChain ? prev.currentStreak + 1 : 1
      next.maxStreak = Math.max(next.maxStreak, next.currentStreak)
      next.lastWinDayIndex = daily.dayIndex
    } else {
      next.currentStreak = 0
    }

    saveJSON(key, next)
    setStats(next)
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (!secret || !daily) return
    if (isFinished) return
    if (tries >= MAX_TRIES) return

    const q = norm(guessInput)
    const picked = guessPool.find((c) => norm((c as any).name) === q) ?? suggestions[0] ?? null

    if (!picked) {
      setMessage('Elige un personaje válido de la lista.')
      return
    }

    const nextTry = tries + 1
    const nextGuesses = [...guesses, { character: picked }]

    setGuesses(nextGuesses)
    setTries(nextTry)
    setGuessInput('')
    setMessage(null)

    persistGame({
      guesses: nextGuesses.map((g) => (g.character as any).id),
      tries: nextTry,
    })

    const win = (picked as any).id === (secret as any).id
    const outOfTries = nextTry >= MAX_TRIES

    if (win || outOfTries) {
      setIsFinished(true)
      setIsWin(win)
      persistGame({ isFinished: true, isWin: win })
      updateStatsOnFinish(win)

      setIsResultOpen(true)
      setShareMessage(
        buildShareText({
          dayNumber: daily.dayNumber,
          mode,
          tries: win ? nextTry : MAX_TRIES,
          isWin: win,
        }),
      )
    }
  }

  async function copyShare() {
    if (!shareMessage) return
    try {
      await navigator.clipboard.writeText(shareMessage)
      setMessage('Copiado al portapapeles ✅')
      setTimeout(() => setMessage(null), 1200)
    } catch {
      setMessage('No pude copiar. Selecciona y copia manualmente.')
    }
  }

  function shareX() {
    if (!shareMessage) return
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareMessage)}`
    const w = window.open(url, '_blank', 'noopener,noreferrer')
    if (!w) window.location.href = url
  }

  function shareWhatsApp() {
    if (!shareMessage) return
    const url = `https://wa.me/?text=${encodeURIComponent(shareMessage)}`
    const w = window.open(url, '_blank', 'noopener,noreferrer')
    if (!w) window.location.href = url
  }

  const headerSubtitle = useMemo(() => {
    if (!daily) return 'Cargando personaje del día...'
    return `Día #${daily.dayNumber} • Cambia a las ${daily.changesAtUTC}`
  }, [daily])

  const remaining = clamp(MAX_TRIES - tries, 0, MAX_TRIES)

  const hasSecret = !!secret
  const secretAny: any = secret ?? {}

  return (
    <div className="otakudle-container">
      <div className="brand">
        <div className="brand-left">
          <img className="brand-logo" src="/otakle-logo.png" alt="Otakle logo" />
          <div className="brand-text">
            <div className="title-row">
              <h1 className="brand-title">Otakle</h1>
              <span className="daily-badge">DAILY</span>
            </div>
            <p className="brand-subtitle">{headerSubtitle}</p>
          </div>
        </div>

        <div className="topbar-actions">
          <button className="howto-button" type="button" onClick={() => setIsHowToOpen(true)}>
            ¿Cómo se juega?
          </button>
        </div>
      </div>

      <div className="filters-row">
        <div className="mode-toggle" role="group" aria-label="Modo">
          <button
            type="button"
            className={mode === 'normal' ? 'mode-btn active' : 'mode-btn'}
            onClick={() => setMode('normal')}
            disabled={mode === 'normal'}
          >
            Normal
          </button>
          <button
            type="button"
            className={mode === 'easy' ? 'mode-btn active' : 'mode-btn'}
            onClick={() => setMode('easy')}
            disabled={mode === 'easy'}
          >
            Easy
          </button>
        </div>

        {/* ✅ Selector anime (solo sugerencias) */}
        <div className="anime-select">
          <label className="anime-label" htmlFor="animeFilter">
            Anime
          </label>
          <select
            id="animeFilter"
            className="anime-dropdown"
            value={animeFilter}
            onChange={(e) => setAnimeFilter(e.target.value)}
          >
            <option value="ALL">Todos</option>
            {animeOptions.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>

        <div className="tries-chip" aria-label="Intentos restantes">
          {remaining}/{MAX_TRIES}
        </div>
      </div>

      <div className="stats-panel" aria-label="Rachas">
        <div className="stat-card">
          <div className="stat-label">Racha actual</div>
          <div className="stat-value">{stats.currentStreak}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Mejor racha</div>
          <div className="stat-value">{stats.maxStreak}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Modo</div>
          <div className="stat-value">{mode === 'easy' ? 'Easy' : 'Normal'}</div>
        </div>
      </div>

      {dailyError && <p className="message">{dailyError}</p>}

      <form className="guess-form" onSubmit={onSubmit}>
        <label className="sr-only" htmlFor="guess">
          Adivina un personaje
        </label>
        <input
          id="guess"
          type="text"
          value={guessInput}
          onChange={(e) => setGuessInput(e.target.value)}
          placeholder={isFinished ? 'Juego terminado' : 'Escribe un personaje...'}
          disabled={isFinished || !hasSecret}
          autoComplete="off"
        />
        <button type="submit" disabled={isFinished || !hasSecret || tries >= MAX_TRIES}>
          Probar
        </button>
      </form>

      {suggestions.length > 0 && !isFinished && (
        <div className="suggestions" role="listbox" aria-label="Sugerencias">
          {suggestions.map((c) => (
            <button key={(c as any).id} type="button" className="suggestion-item" onClick={() => setGuessInput((c as any).name)}>
              <img className="suggestion-avatar" src={(c as any).imageUrl} alt="" />
              <span className="suggestion-name">{(c as any).name}</span>
              <span className="suggestion-anime">{canonicalAnime((c as any).anime)}</span>
            </button>
          ))}
        </div>
      )}

      <div className="status-row">
        <p className="message">{message ?? (isFinished ? (isWin ? '¡Correcto!' : 'Sin intentos 😅') : '')}</p>
        <p className="tries">
          Intentos usados: {tries}/{MAX_TRIES}
        </p>
      </div>

      <div className="hints-grid">
        <h2>Pistas</h2>

        <div className="grid-row grid-header">
          <span>Nombre</span>
          <span>Anime</span>
          <span>Tipo</span>
          <span>Año debut</span>
          <span>Estudio</span>
          <span>Rol</span>
          <span>Género</span>
          <span>Raza</span>
          <span>Edad debut</span>
          <span>Edad main</span>
        </div>

        {guesses.map((g, idx) => {
          const c: any = g.character

          const rowCorrect = hasSecret && c.id === secretAny.id

          const animeOk = hasSecret && canonicalAnime(c.anime) === canonicalAnime(secretAny.anime)
          const typeOk = hasSecret && c.genre === secretAny.genre

          const cYear = getDebutYear(c)
          const sYear = getDebutYear(secretAny)
          const yearCls =
            hasSecret && sYear != null && cYear != null ? yearClass(sYear, cYear) : 'unknown'

          const studioOk = hasSecret && c.studio === secretAny.studio
          const roleOk = hasSecret && c.role === secretAny.role
          const genderOk = hasSecret && c.gender === secretAny.gender
          const raceOk = hasSecret && c.race === secretAny.race

          const cAgeDebut = getAgeDebutGroup(c)
          const cAgeMain = getAgeMainGroup(c)
          const sAgeDebut = getAgeDebutGroup(secretAny)
          const sAgeMain = getAgeMainGroup(secretAny)

          const ageDebutOk = hasSecret && cAgeDebut === sAgeDebut
          const ageMainOk = hasSecret && cAgeMain === sAgeMain

          return (
            <div key={idx} className={rowCorrect ? 'grid-row row-correct' : 'grid-row'}>
              <div className={'hint-box name-box left' + (rowCorrect ? ' correct' : '')} data-label="Nombre" title={displayText(c.name)}>
                {displayText(c.name)}
              </div>

              <div className={'hint-box left ' + (animeOk ? 'correct' : 'incorrect')} data-label="Anime" title={canonicalAnime(c.anime)}>
                {canonicalAnime(c.anime)}
              </div>

              <div className={'hint-box ' + (typeOk ? 'correct' : 'incorrect')} data-label="Tipo" title={displayText(c.genre)}>
                {displayText(c.genre)}
              </div>

              <div className={'hint-box year-box ' + yearCls} data-label="Año debut" title={String(cYear ?? '?')}>
                <span className="year-inline">
                  <span>{cYear ?? '?'}</span>
                  {hasSecret && sYear != null && cYear != null && sYear !== cYear && (
                    <span className="year-arrow">{sYear > cYear ? '↑' : '↓'}</span>
                  )}
                </span>
              </div>

              <div className={'hint-box center ' + (studioOk ? 'correct' : 'incorrect')} data-label="Estudio" title={displayText(c.studio)}>
                {displayText(c.studio)}
              </div>

              <div className={'hint-box ' + (roleOk ? 'correct' : 'incorrect')} data-label="Rol" title={displayText(c.role)}>
                {displayText(c.role)}
              </div>

              <div className={'hint-box ' + (genderOk ? 'correct' : 'incorrect')} data-label="Género" title={displayText(c.gender)}>
                {displayText(c.gender)}
              </div>

              <div className={'hint-box ' + (raceOk ? 'correct' : 'incorrect')} data-label="Raza" title={displayText(c.race)}>
                {displayText(c.race)}
              </div>

              <div className={'hint-box ' + (ageDebutOk ? 'correct' : 'incorrect')} data-label="Edad debut" title={cAgeDebut}>
                {cAgeDebut}
              </div>

              <div className={'hint-box ' + (ageMainOk ? 'correct' : 'incorrect')} data-label="Edad main" title={cAgeMain}>
                {cAgeMain}
              </div>
            </div>
          )
        })}
      </div>

      <div className="page-footer">
        <Link to="/about">About</Link>
        <Link to="/how-to-play">How to play</Link>
        <Link to="/strategy">Strategy</Link>
        <Link to="/stats">Stats</Link>
        <Link to="/archive">Archive</Link>
        <Link to="/privacy">Privacy</Link>
        <Link to="/terms">Terms</Link>
        <Link to="/contact">Contact</Link>
      </div>

      {isHowToOpen && (
        <div className="modal-overlay" role="dialog" aria-modal="true" onClick={() => setIsHowToOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Cómo se juega</h3>
              <button className="modal-close" onClick={() => setIsHowToOpen(false)}>
                ✕
              </button>
            </div>
            <div className="modal-body">
              <p>Intenta adivinar el personaje del día. Cada intento te da pistas por categoría.</p>
              <ul>
                <li>
                  <b>Verde</b>: coincide.
                </li>
                <li>
                  <b>Rojo</b>: no coincide.
                </li>
                <li>
                  <b>Azul/Naranja</b>: el personaje del día debutó después/antes (Año debut).
                </li>
              </ul>
              <p>
                El día cambia a las <b>00:00 UTC</b>.
              </p>
              <p>
                El selector <b>Anime</b> solo filtra sugerencias (no cambia el personaje del día).
              </p>
            </div>
          </div>
        </div>
      )}

      {isResultOpen && hasSecret && daily && (
        <div className="modal-overlay" role="dialog" aria-modal="true" onClick={() => setIsResultOpen(false)}>
          <div className="modal modal-wide" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{isWin ? '¡Lo lograste!' : 'Se acabaron los intentos'}</h3>
              <button className="modal-close" onClick={() => setIsResultOpen(false)}>
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div className="result-top">
                <img className="secret-image" src={(secretAny as any).imageUrl} alt={(secretAny as any).name} />
                <div className="result-info">
                  <div className="result-title">
                    <span className="result-name">{(secretAny as any).name}</span>
                    <span className="result-meta">• {canonicalAnime((secretAny as any).anime)}</span>
                  </div>

                  <div className="result-tags">
                    <span className="tag">{(secretAny as any).genre}</span>
                    <span className="tag">{(secretAny as any).studio}</span>
                    <span className="tag">{(secretAny as any).race}</span>
                    <span className="tag">{getDebutYear(secretAny) ?? '?'}</span>
                    <span className="tag">Debut: {getAgeDebutGroup(secretAny)}</span>
                    <span className="tag">Main: {getAgeMainGroup(secretAny)}</span>
                  </div>

                  <p className="result-desc">{(secretAny as any).debutInfo}</p>
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={copyShare} disabled={!shareMessage}>
                  Copiar resultado
                </button>
                <button type="button" className="btn-secondary" onClick={shareWhatsApp} disabled={!shareMessage}>
                  Compartir WhatsApp
                </button>
                <button type="button" className="btn-primary" onClick={shareX} disabled={!shareMessage}>
                  Compartir en X
                </button>
              </div>

              {shareMessage && <textarea className="share-box" readOnly value={shareMessage} />}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
