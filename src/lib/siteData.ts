import { CHARACTERS, type Character } from '../characters.ts'

export const SITE_EMAIL = 'oscarfernandezcepeda@gmail.com'
export const SITE_X_URL = 'https://twitter.com/aknoid'
export const SITE_X_LABEL = '@aknoid'

export const EASY_POOL_IDS = [
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
] as const

export const ACTIVE_CHARACTERS = CHARACTERS.filter((character) => character.active !== false).sort((a, b) =>
  a.name.localeCompare(b.name),
)

export const TOTAL_CHARACTERS = ACTIVE_CHARACTERS.length
export const EASY_MODE_COUNT = EASY_POOL_IDS.length

export type AnimeGroup = {
  anime: string
  count: number
  characters: Character[]
  sampleNames: string[]
}

const animeMap = new Map<string, Character[]>()
for (const character of ACTIVE_CHARACTERS) {
  const key = character.anime.trim()
  animeMap.set(key, [...(animeMap.get(key) ?? []), character])
}

export const ANIME_GROUPS: AnimeGroup[] = [...animeMap.entries()]
  .map(([anime, characters]) => ({
    anime,
    count: characters.length,
    characters: characters.slice().sort((a, b) => a.name.localeCompare(b.name)),
    sampleNames: characters
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name))
      .slice(0, 8)
      .map((character) => character.name),
  }))
  .sort((a, b) => b.count - a.count || a.anime.localeCompare(b.anime))

export const TOTAL_ANIMES = ANIME_GROUPS.length
export const TOP_ANIME_GROUPS = ANIME_GROUPS.slice(0, 12)

export const FEATURED_CHARACTERS = EASY_POOL_IDS.map((id) => ACTIVE_CHARACTERS.find((character) => character.id === id)).filter(
  (character): character is Character => Boolean(character),
)

export const FAQ_ITEMS = [
  {
    question: '¿Qué es Otakle?',
    answer:
      'Otakle es un juego diario para adivinar personajes de anime usando pistas comparativas como serie, rol, año de debut, estudio, raza y rangos de edad.',
  },
  {
    question: '¿Cuántos intentos tengo por día?',
    answer: 'Tienes 8 intentos máximos por día para resolver el personaje del reto diario.',
  },
  {
    question: '¿A qué hora cambia el personaje diario?',
    answer: 'Otakle reinicia a las 00:00 UTC para que el desafío sea el mismo para todos los jugadores.',
  },
  {
    question: '¿El filtro por anime cambia la solución?',
    answer:
      'No. El filtro por anime solo sirve para acotar las sugerencias mientras escribes nombres. El personaje diario no cambia.',
  },
  {
    question: '¿Qué significa la flecha en año de debut?',
    answer:
      'Si aparece ↑, el personaje del día es más nuevo que tu intento. Si aparece ↓, es más antiguo.',
  },
  {
    question: '¿Cómo funciona el modo easy?',
    answer:
      'El modo easy usa una selección más conocida de personajes para que el juego sea más accesible, pero mantiene el mismo sistema de pistas.',
  },
  {
    question: '¿Las estadísticas y el historial son públicos?',
    answer:
      'No. Tus estadísticas e historial se guardan localmente en tu navegador y no forman una tabla pública del sitio.',
  },
  {
    question: '¿Puedo sugerir personajes o reportar errores?',
    answer:
      'Sí. Puedes escribir a Aknoid por correo o por X para proponer personajes, reportar bugs o comentar mejoras.',
  },
] as const

export const PRIMARY_LINKS = [
  { to: '/', label: 'Inicio' },
  { to: '/play', label: 'Jugar' },
  { to: '/how-to-play', label: 'Cómo se juega' },
  { to: '/strategy', label: 'Estrategia' },
  { to: '/faq', label: 'FAQ' },
  { to: '/animes', label: 'Animes' },
  { to: '/personajes', label: 'Personajes' },
  { to: '/about', label: 'Sobre Otakle' },
  { to: '/contact', label: 'Contacto' },
] as const

export function getCharacterExcerpt(character: Character) {
  const text = character.debutInfo.trim()
  if (!text) return `Personaje de ${character.anime}.`
  const compact = text.replace(/\s+/g, ' ')
  return compact.length > 160 ? `${compact.slice(0, 157)}…` : compact
}
