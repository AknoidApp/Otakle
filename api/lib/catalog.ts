import { createClient } from '@supabase/supabase-js'
import { CHARACTERS_LITE } from '../characters-lite.js'
import { CHARACTERS, type Character } from '../../src/characters.js'

export type Mode = 'normal' | 'easy'
export type CharacterLite = Pick<Character, 'id' | 'name' | 'anime' | 'imageUrl' | 'active'>

type CharacterRow = {
  id: string
  name: string
  anime: string
  genre: string
  debut_year: number
  studio: string
  role: string
  gender: string
  race: string
  debut_info: string
  image_url: string
  age_debut_group: string
  age_main_group: string
  active: boolean
}

type CharacterLiteRow = {
  id: string
  name: string
  anime: string
  image_url: string
  active: boolean
}

const EASY_POOL_IDS = [
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
  'spike',
]

const EASY_POOL_SET = new Set(EASY_POOL_IDS)
const FALLBACK_CHARACTERS = CHARACTERS.filter((character) => character.active !== false)
const FALLBACK_BY_ID = new Map(FALLBACK_CHARACTERS.map((character) => [character.id, character]))
const FALLBACK_LITE: CharacterLite[] = CHARACTERS_LITE.map((character) => ({
  id: character.id,
  name: character.name,
  anime: character.anime,
  imageUrl: character.imageUrl,
  active: character.active,
}))

let cachedClient: ReturnType<typeof createClient> | null | undefined

function norm(value: string) {
  return value.trim().toLowerCase()
}

function canonicalAnime(input?: string) {
  const value = norm(input ?? '')

  if (value.includes('boku no hero') || value.includes('my hero academia') || value === 'bnha' || value === 'mha') {
    return 'My Hero Academia'
  }

  return (input ?? '').trim()
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value))
}

function toMode(mode?: string): Mode {
  return mode === 'easy' ? 'easy' : 'normal'
}

function isSupabaseEnabled() {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY)
}

function getSupabaseClient() {
  if (cachedClient !== undefined) return cachedClient

  if (!isSupabaseEnabled()) {
    cachedClient = null
    return cachedClient
  }

  cachedClient = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

  return cachedClient
}

function mapRowToCharacter(row: CharacterRow): Character {
  return {
    id: row.id,
    name: row.name,
    anime: row.anime,
    genre: row.genre,
    debutYear: row.debut_year,
    studio: row.studio,
    role: row.role,
    gender: row.gender,
    race: row.race,
    debutInfo: row.debut_info,
    imageUrl: row.image_url,
    ageDebutGroup: row.age_debut_group,
    ageMainGroup: row.age_main_group,
    active: row.active,
  }
}

function mapRowToLite(row: CharacterLiteRow): CharacterLite {
  return {
    id: row.id,
    name: row.name,
    anime: row.anime,
    imageUrl: row.image_url,
    active: row.active,
  }
}

function filterFallbackLite(args: { q?: string; mode?: Mode; anime?: string; limit?: number }) {
  const query = norm(args.q ?? '')
  const anime = canonicalAnime(args.anime)
  const mode = toMode(args.mode)
  const limit = clamp(args.limit ?? 10, 1, 5000)

  let list = [...FALLBACK_LITE]

  if (mode === 'easy') {
    list = list.filter((character) => EASY_POOL_SET.has(character.id))
  }

  if (anime && anime !== 'ALL') {
    list = list.filter((character) => canonicalAnime(character.anime) === anime)
  }

  if (query) {
    list = list.filter((character) => norm(character.name).startsWith(query))
  }

  return list.sort((a, b) => a.name.localeCompare(b.name)).slice(0, limit)
}

export async function getActiveCharacterIds(mode?: Mode) {
  const normalizedMode = toMode(mode)
  const supabase = getSupabaseClient()

  if (!supabase) {
    return filterFallbackLite({ mode: normalizedMode, limit: FALLBACK_LITE.length }).map((character) => character.id)
  }

  let query = supabase.from('characters').select('id').eq('active', true)

  if (normalizedMode === 'easy') {
    query = query.in('id', EASY_POOL_IDS)
  }

  const { data, error } = await query.order('name')

  if (error || !data?.length) {
    return filterFallbackLite({ mode: normalizedMode, limit: FALLBACK_LITE.length }).map((character) => character.id)
  }

  return (data as Array<{ id: string }>).map((character) => character.id)
}

export async function getDailyOverride(args: { dateUTC: string; mode: Mode }) {
  const supabase = getSupabaseClient()

  if (!supabase) return null

  const { data, error } = await supabase
    .from('daily_challenges')
    .select('character_id')
    .eq('challenge_date', args.dateUTC)
    .eq('mode', args.mode)
    .maybeSingle()

  if (error) return null

  const row = data as { character_id?: string } | null
  return row?.character_id ?? null
}

export async function getCharactersByIds(ids: string[]) {
  const uniqueIds = [...new Set(ids.filter(Boolean))]
  if (!uniqueIds.length) return [] as Character[]

  const supabase = getSupabaseClient()

  if (!supabase) {
    return uniqueIds
      .map((id) => FALLBACK_BY_ID.get(id))
      .filter((character): character is Character => Boolean(character))
  }

  const { data, error } = await supabase.from('characters').select('*').in('id', uniqueIds)

  if (error || !data?.length) {
    return uniqueIds
      .map((id) => FALLBACK_BY_ID.get(id))
      .filter((character): character is Character => Boolean(character))
  }

  const rows = data as CharacterRow[]
  const byId = new Map(rows.map((row) => [row.id, mapRowToCharacter(row)]))

  return uniqueIds
    .map((id) => byId.get(id) ?? FALLBACK_BY_ID.get(id))
    .filter((character): character is Character => Boolean(character))
}

export async function searchCharacters(args: { q?: string; mode?: Mode; anime?: string; limit?: number }) {
  const queryText = (args.q ?? '').trim()
  if (!queryText) return [] as CharacterLite[]

  const normalizedMode = toMode(args.mode)
  const anime = canonicalAnime(args.anime)
  const limit = clamp(args.limit ?? 10, 1, 25)
  const supabase = getSupabaseClient()

  if (!supabase) {
    return filterFallbackLite({ q: queryText, mode: normalizedMode, anime, limit })
  }

  let query = supabase.from('characters').select('id, name, anime, image_url, active').eq('active', true)

  if (normalizedMode === 'easy') {
    query = query.in('id', EASY_POOL_IDS)
  }

  if (anime && anime !== 'ALL') {
    query = query.eq('anime', anime)
  }

  query = query.ilike('name', `${queryText}%`).order('name').limit(limit)

  const { data, error } = await query

  if (error || !data) {
    return filterFallbackLite({ q: queryText, mode: normalizedMode, anime, limit })
  }

  return data.map((row) => mapRowToLite(row as CharacterLiteRow))
}

export async function getAnimeOptions() {
  const supabase = getSupabaseClient()

  if (!supabase) {
    return [...new Set(FALLBACK_LITE.map((character) => canonicalAnime(character.anime)).filter(Boolean))].sort((a, b) =>
      a.localeCompare(b),
    )
  }

  const { data, error } = await supabase.from('characters').select('anime').eq('active', true).order('anime')

  if (error || !data) {
    return [...new Set(FALLBACK_LITE.map((character) => canonicalAnime(character.anime)).filter(Boolean))].sort((a, b) =>
      a.localeCompare(b),
    )
  }

  const rows = data as Array<{ anime: string }>
  return [...new Set(rows.map((row) => canonicalAnime(row.anime)).filter(Boolean))].sort((a, b) => a.localeCompare(b))
}
