import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import './App.css'
import type { Character } from './characters'

type Mode = 'normal' | 'easy'

type GuessRow = {
  character: Character
}

type CharacterLite = Pick<Character, 'id' | 'name' | 'anime' | 'imageUrl' | 'active'>

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

type CharactersResponse = {
  characters: Character[]
}

type CharacterSearchResponse = {
  characters: CharacterLite[]
}

type AnimeOptionsResponse = {
  animes: string[]
}

const MAX_TRIES = 8
const DEFAULT_MODE: Mode = 'normal'
const DEFAULT_SECRET_IMAGE = '/otakle-logo.png'

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
  return `${header}\n${result}\n${location.origin}/play`
}

function yearClass(secret: number, guess: number) {
  if (secret === guess) return 'correct'
  return secret > guess ? 'higher' : 'lower'
}

function canonicalAnime(input?: string) {
  const s = norm(input ?? '')

  if (s.includes('boku no hero') || s.includes('my hero academia') || s === 'bnha' || s === 'mha') {
    return 'My Hero Academia'
  }

  return (input ?? '').trim()
}

function displayText(s?: string) {
  return (s ?? '').trim()
}

function getDebutYear(c?: Partial<Character> | null): number | null {
  const v = c?.debutYear ?? null
  const n = Number(v)
  return Number.isFinite(n) ? n : null
}

function getAgeDebutGroup(c?: Partial<Character> | null): string {
  const v = c?.ageDebutGroup
  return (v ?? 'Desconocido').toString().trim() || 'Desconocido'
}

function getAgeMainGroup(c?: Partial<Character> | null): string {
  const v = c?.ageMainGroup
  return (v ?? 'Desconocido').toString().trim() || 'Desconocido'
}

function isAbortError(error: unknown) {
  return error instanceof DOMException && error.name === 'AbortError'
}

async function fetchJson<T>(url: string, signal?: AbortSignal) {
  const res = await fetch(url, { signal, cache: 'no-store' })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return (await res.json()) as T
}

async function fetchCharactersByIds(ids: string[], signal?: AbortSignal) {
  if (!ids.length) return [] as Character[]

  const params = new URLSearchParams({ ids: ids.join(',') })
  const data = await fetchJson<CharactersResponse>(`/api/characters?${params.toString()}`, signal)
  return data.characters
}

async function fetchCharacterSearch(
  args: { q: string; mode: Mode; anime: string; limit?: number },
  signal?: AbortSignal,
) {
  const params = new URLSearchParams({
    q: args.q,
    mode: args.mode,
    anime: args.anime,
    limit: String(args.limit ?? 10),
  })

  const data = await fetchJson<CharacterSearchResponse>(`/api/characters-search?${params.toString()}`, signal)
  return data.characters
}

async function fetchAnimeOptions(signal?: AbortSignal) {
  const data = await fetchJson<AnimeOptionsResponse>('/api/animes', signal)
  return data.animes
}

export default function Game() {
  const [mode, setMode] = useState<Mode>(() => loadJSON<Mode>('otakle_mode', DEFAULT_MODE))
  const [animeFilter, setAnimeFilter] = useState<string>(() => loadJSON<string>('otakle_anime_filter', 'ALL'))

  const [daily, setDaily] = useState<DailyResponse | null>(null)
  const [dailyError, setDailyError] = useState<string | null>(null)
  const [secret, setSecret] = useState<Character | null>(null)
  const [animeOptions, setAnimeOptions] = useState<string[]>([])
  const [suggestions, setSuggestions] = useState<CharacterLite[]>([])
  const [isSubmittingGuess, setIsSubmittingGuess] = useState(false)

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

  useEffect(() => {
    saveJSON('otakle_anime_filter', animeFilter)
  }, [animeFilter])

  useEffect(() => {
    const ctrl = new AbortController()

    ;(async () => {
      try {
        const nextOptions = await fetchAnimeOptions(ctrl.signal)
        setAnimeOptions(nextOptions)
      } catch (error: unknown) {
        if (isAbortError(error)) return
        setAnimeOptions([])
      }
    })()

    return () => ctrl.abort()
  }, [])

  useEffect(() => {
    saveJSON('otakle_mode', mode)

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
    setSuggestions([])
    setIsSubmittingGuess(false)
    setIsHowToOpen(false)
    setIsResultOpen(false)

    const ctrl = new AbortController()

    ;(async () => {
      try {
        const data = await fetchJson<DailyResponse>(`/api/daily?mode=${mode}`, ctrl.signal)
        setDaily(data)

        const [found] = await fetchCharactersByIds([data.id], ctrl.signal)
        setSecret(found ?? null)

        if (!found) {
          setDailyError('No encuentro el personaje del día en el catálogo. Revisa la conexión de datos.')
        }
      } catch (error: unknown) {
        if (isAbortError(error)) return
        setDailyError('No pude cargar el personaje del día. Revisa que Vercel tenga /api/daily funcionando.')
      }
    })()

    return () => ctrl.abort()
  }, [mode])

  useEffect(() => {
    if (!daily || !secret) return

    const ctrl = new AbortController()
    const gameKey = getModeKey(mode, 'game')
    const saved = loadJSON<SavedGame | null>(gameKey, null)

    ;(async () => {
      if (saved && saved.dayIndex === daily.dayIndex) {
        try {
          const loadedCharacters = await fetchCharactersByIds(saved.guesses, ctrl.signal)
          const byId = new Map(loadedCharacters.map((character) => [character.id, character]))
          const loadedGuesses = saved.guesses
            .map((id) => byId.get(id))
            .filter((character): character is Character => Boolean(character))
            .map((character) => ({ character }))

          setGuesses(loadedGuesses)
          setTries(saved.tries)
          setIsFinished(saved.isFinished)
          setIsWin(saved.isWin)
          setShareMessage(
            saved.isFinished
              ? buildShareText({
                  dayNumber: daily.dayNumber,
                  mode,
                  tries: saved.isWin ? saved.tries : MAX_TRIES,
                  isWin: saved.isWin,
                })
              : null,
          )
          if (saved.isFinished) setIsResultOpen(true)
        } catch (error: unknown) {
          if (!isAbortError(error)) {
            setGuesses([])
            setTries(0)
            setIsFinished(false)
            setIsWin(false)
            setShareMessage(null)
          }
        }
      } else {
        setGuesses([])
        setTries(0)
        setIsFinished(false)
        setIsWin(false)
        setShareMessage(null)
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
    })()

    return () => ctrl.abort()
  }, [daily, secret, mode])

  useEffect(() => {
    if (isFinished) {
      setSuggestions([])
      return
    }

    const q = guessInput.trim()
    if (!q) {
      setSuggestions([])
      return
    }

    const ctrl = new AbortController()
    const timeout = window.setTimeout(() => {
      void (async () => {
        try {
          const nextSuggestions = await fetchCharacterSearch({ q, mode, anime: animeFilter, limit: 10 }, ctrl.signal)
          setSuggestions(nextSuggestions)
        } catch (error: unknown) {
          if (isAbortError(error)) return
          setSuggestions([])
        }
      })()
    }, 120)

    return () => {
      window.clearTimeout(timeout)
      ctrl.abort()
    }
  }, [guessInput, mode, animeFilter, isFinished])

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

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (!secret || !daily) return
    if (isFinished || tries >= MAX_TRIES || isSubmittingGuess) return

    const q = norm(guessInput)
    let pickedLite: CharacterLite | null =
      suggestions.find((character) => norm(character.name) === q) ?? suggestions[0] ?? null

    if (!pickedLite && q) {
      try {
        const fallbackMatches = await fetchCharacterSearch({ q: guessInput, mode, anime: animeFilter, limit: 1 })
        pickedLite = fallbackMatches[0] ?? null
      } catch {
        pickedLite = null
      }
    }

    if (!pickedLite) {
      setMessage('Elige un personaje válido de la lista.')
      return
    }

    setIsSubmittingGuess(true)

    try {
      const [picked] = await fetchCharactersByIds([pickedLite.id])

      if (!picked) {
        setMessage('No pude cargar ese personaje. Inténtalo otra vez.')
        return
      }

      const nextTry = tries + 1
      const nextGuesses = [...guesses, { character: picked }]

      setGuesses(nextGuesses)
      setTries(nextTry)
      setGuessInput('')
      setSuggestions([])
      setMessage(null)

      persistGame({
        guesses: nextGuesses.map((g) => g.character.id),
        tries: nextTry,
      })

      const win = picked.id === secret.id
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
    } catch {
      setMessage('No pude cargar ese personaje. Inténtalo otra vez.')
    } finally {
      setIsSubmittingGuess(false)
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
  const secretDetails: Partial<Character> = secret ?? {}

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
          <Link to="/" className="howto-button">
            Inicio
          </Link>
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

      <section className="home-info-grid" aria-label="Guía rápida de Otakle">
        <article className="home-info-card">
          <span className="home-kicker">Qué es Otakle</span>
          <h2>Un reto diario para fans del anime</h2>
          <p>
            Cada día hay un personaje nuevo para adivinar. Todos juegan el mismo reto y las pistas te ayudan a
            acercarte por anime, rol, año, raza y más.
          </p>
        </article>

        <article className="home-info-card">
          <span className="home-kicker">Lo esencial</span>
          <h2>Cómo se gana sin frustrarse</h2>
          <ul className="home-info-list">
            <li>Tienes 8 intentos por día.</li>
            <li>El personaje cambia a las 00:00 UTC.</li>
            <li>El filtro por anime solo afecta las sugerencias, no el resultado.</li>
          </ul>
        </article>

        <article className="home-info-card">
          <span className="home-kicker">Más ayuda</span>
          <h2>Guías, catálogo y páginas útiles</h2>
          <div className="home-link-list">
            <Link to="/how-to-play" className="home-link-pill">
              Cómo se juega
            </Link>
            <Link to="/strategy" className="home-link-pill">
              Estrategia
            </Link>
            <Link to="/faq" className="home-link-pill">
              FAQ
            </Link>
            <Link to="/animes" className="home-link-pill">
              Animes
            </Link>
            <Link to="/personajes" className="home-link-pill">
              Personajes
            </Link>
            <Link to="/about" className="home-link-pill">
              Sobre Otakle
            </Link>
          </div>
          <p className="helper-note">Proyecto fan-made por Aknoid. Si falta un personaje, puedes sugerirlo.</p>
        </article>
      </section>

      {dailyError && <p className="message" aria-live="polite">{dailyError}</p>}
      {!hasSecret && !dailyError && <p className="helper-note">Cargando el reto diario y el catálogo…</p>}

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
          disabled={isFinished || !hasSecret || isSubmittingGuess}
          autoComplete="off"
        />
        <button type="submit" disabled={isFinished || !hasSecret || tries >= MAX_TRIES || isSubmittingGuess}>
          {isSubmittingGuess ? 'Cargando...' : 'Probar'}
        </button>
      </form>

      {suggestions.length > 0 && !isFinished && (
        <div className="suggestions" role="listbox" aria-label="Sugerencias">
          {suggestions.map((c) => (
            <button
              key={c.id}
              type="button"
              className="suggestion-item"
              onClick={() => setGuessInput(c.name)}
              disabled={isSubmittingGuess}
            >
              <img className="suggestion-avatar" src={c.imageUrl} alt="" />
              <span className="suggestion-name">{c.name}</span>
              <span className="suggestion-anime">{canonicalAnime(c.anime)}</span>
            </button>
          ))}
        </div>
      )}

      <div className="status-row">
        <p className="message" aria-live="polite">{message ?? (isFinished ? (isWin ? '¡Correcto!' : 'Sin intentos 😅') : '')}</p>
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
          const c = g.character

          const rowCorrect = hasSecret && c.id === secretDetails.id

          const animeOk = hasSecret && canonicalAnime(c.anime) === canonicalAnime(secretDetails.anime)
          const typeOk = hasSecret && c.genre === secretDetails.genre

          const cYear = getDebutYear(c)
          const sYear = getDebutYear(secretDetails)
          const yearCls = hasSecret && sYear != null && cYear != null ? yearClass(sYear, cYear) : 'unknown'

          const studioOk = hasSecret && c.studio === secretDetails.studio
          const roleOk = hasSecret && c.role === secretDetails.role
          const genderOk = hasSecret && c.gender === secretDetails.gender
          const raceOk = hasSecret && c.race === secretDetails.race

          const cAgeDebut = getAgeDebutGroup(c)
          const cAgeMain = getAgeMainGroup(c)
          const sAgeDebut = getAgeDebutGroup(secretDetails)
          const sAgeMain = getAgeMainGroup(secretDetails)

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
        <Link to="/">Inicio</Link>
        <Link to="/how-to-play">Cómo se juega</Link>
        <Link to="/strategy">Estrategia</Link>
        <Link to="/faq">FAQ</Link>
        <Link to="/animes">Animes</Link>
        <Link to="/personajes">Personajes</Link>
        <Link to="/stats">Estadísticas</Link>
        <Link to="/archive">Historial</Link>
        <Link to="/privacy">Privacidad</Link>
        <Link to="/terms">Términos</Link>
        <Link to="/contact">Contacto</Link>
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
                <img
                  className="secret-image"
                  src={secretDetails.imageUrl ?? DEFAULT_SECRET_IMAGE}
                  alt={secretDetails.name ?? 'Personaje secreto'}
                />
                <div className="result-info">
                  <div className="result-title">
                    <span className="result-name">{secretDetails.name}</span>
                    <span className="result-meta">• {canonicalAnime(secretDetails.anime)}</span>
                  </div>

                  <div className="result-tags">
                    <span className="tag">{secretDetails.genre}</span>
                    <span className="tag">{secretDetails.studio}</span>
                    <span className="tag">{secretDetails.race}</span>
                    <span className="tag">{getDebutYear(secretDetails) ?? '?'}</span>
                    <span className="tag">Debut: {getAgeDebutGroup(secretDetails)}</span>
                    <span className="tag">Main: {getAgeMainGroup(secretDetails)}</span>
                  </div>

                  <p className="result-desc">{secretDetails.debutInfo}</p>
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
