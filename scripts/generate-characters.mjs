import fs from 'node:fs'
import path from 'node:path'

const PROJECT_ROOT = process.cwd()

// ✅ Ajusta si tu CSV está en otro lado
const INPUT_CSV = path.join(PROJECT_ROOT, 'data', 'otakle_characters.csv')

// Salidas
const OUT_CHARACTERS_TS = path.join(PROJECT_ROOT, 'src', 'characters.ts')
const OUT_LITE_TS = path.join(PROJECT_ROOT, 'api', 'characters-lite.ts')

function ensureDir(p) {
  fs.mkdirSync(path.dirname(p), { recursive: true })
}

function parseCSV(text) {
  const lines = text.split(/\r?\n/).filter(Boolean)
  const headers = lines[0].split(',').map((h) => h.trim())

  return lines.slice(1).map((line) => {
    const cols = line.split(',')
    const row = {}
    headers.forEach((h, i) => (row[h] = (cols[i] ?? '').trim()))
    return row
  })
}

function toBool(v, fallback = true) {
  const s = String(v ?? '').trim().toLowerCase()
  if (s === 'false' || s === '0' || s === 'no') return false
  if (s === 'true' || s === '1' || s === 'yes') return true
  return fallback
}

function toNum(v) {
  const n = Number(v)
  return Number.isFinite(n) ? n : null
}

function esc(str) {
  return String(str ?? '').replace(/\\/g, '\\\\').replace(/`/g, '\\`')
}

// ✅ aquí te aseguras de usar los mismos nombres de columna que tienes en tu CSV
function mapRow(row) {
  // Campos base
  const id = row.id
  const name = row.name
  const anime = row.anime
  const genre = row.genre || row.type || ''              // por si tu CSV usa "type"
  const debutYear = toNum(row.debutYear ?? row.yearDebut ?? row.debut_year ?? row.year_debut)
  const studio = row.studio || ''
  const role = row.role || ''
  const gender = row.gender || ''
  const race = row.race || ''
  const debutInfo = row.debutInfo || row.debut_info || ''
  const imageFileName = row.imageFileName || row.image_file_name || `${id}.png`

  // ✅ edades por GRUPO (texto) (lo que tú querías: Niño/Adolescente/Adulto)
  const ageDebutGroup = row.ageDebutGroup || row.edadDebutGroup || row.age_debut_group || row.edad_debut_group || ''
  const ageMainGroup = row.ageMainGroup || row.edadMainGroup || row.age_main_group || row.edad_main_group || ''

  const active = toBool(row.active, true)

  return {
    id,
    name,
    anime,
    genre,
    debutYear: debutYear ?? 0,
    studio,
    role,
    gender,
    race,
    debutInfo,
    imageUrl: `/images/${imageFileName}`,
    ageDebutGroup: ageDebutGroup || 'Desconocido',
    ageMainGroup: ageMainGroup || 'Desconocido',
    active,
  }
}

function main() {
  if (!fs.existsSync(INPUT_CSV)) {
    console.error(`❌ No encuentro el CSV en: ${INPUT_CSV}`)
    process.exit(1)
  }

  const csvText = fs.readFileSync(INPUT_CSV, 'utf8')
  const rows = parseCSV(csvText)

  const characters = rows
    .map(mapRow)
    .filter((c) => c.id && c.name && c.anime)

  // src/characters.ts
  ensureDir(OUT_CHARACTERS_TS)
  const charactersTs =
`export type Character = {
  id: string
  name: string
  anime: string
  genre: string
  debutYear: number
  studio: string
  role: string
  gender: string
  race: string
  debutInfo: string
  imageUrl: string
  ageDebutGroup: string
  ageMainGroup: string
  active?: boolean
}

export const CHARACTERS: Character[] = [
${characters.map((c) => `  {
    id: \`${esc(c.id)}\`,
    name: \`${esc(c.name)}\`,
    anime: \`${esc(c.anime)}\`,
    genre: \`${esc(c.genre)}\`,
    debutYear: ${Number.isFinite(c.debutYear) ? c.debutYear : 0},
    studio: \`${esc(c.studio)}\`,
    role: \`${esc(c.role)}\`,
    gender: \`${esc(c.gender)}\`,
    race: \`${esc(c.race)}\`,
    debutInfo: \`${esc(c.debutInfo)}\`,
    imageUrl: \`${esc(c.imageUrl)}\`,
    ageDebutGroup: \`${esc(c.ageDebutGroup)}\`,
    ageMainGroup: \`${esc(c.ageMainGroup)}\`,
    active: ${c.active ? 'true' : 'false'},
  },`).join('\n')}
]
`
  fs.writeFileSync(OUT_CHARACTERS_TS, charactersTs, 'utf8')

  // api/characters-lite.ts (solo ids activos, en el orden del CSV)
  ensureDir(OUT_LITE_TS)
  const activeIds = characters.filter((c) => c.active !== false).map((c) => c.id)

  const liteTs =
`// api/characters-lite.ts
// AUTO-GENERADO por scripts/generate-characters.mjs
// NO editar a mano: tus IDs vienen del CSV (solo active=true)

export const CHARACTER_IDS: string[] = [
${activeIds.map((id) => `  '${esc(id)}',`).join('\n')}
]
`
  fs.writeFileSync(OUT_LITE_TS, liteTs, 'utf8')

  console.log(`✅ Generado: ${path.relative(PROJECT_ROOT, OUT_CHARACTERS_TS)} (${characters.length} personajes)`)
  console.log(`✅ Generado: ${path.relative(PROJECT_ROOT, OUT_LITE_TS)} (${activeIds.length} ids activos)`)
}

main()
