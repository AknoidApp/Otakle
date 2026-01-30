console.log("✅ RUNNING scripts/generate-characters.mjs (csv-parse)")

import fs from 'node:fs'
import path from 'node:path'
import { parse } from 'csv-parse/sync'

const PROJECT_ROOT = process.cwd()

// Ajusta si tu CSV está en otro lado
const INPUT_CSV = path.join(PROJECT_ROOT, 'data', 'otakle_characters.csv')

// Salidas
const OUT_CHARACTERS_TS = path.join(PROJECT_ROOT, 'src', 'characters.ts')
const OUT_LITE_TS = path.join(PROJECT_ROOT, 'api', 'characters-lite.ts')

function ensureDir(p) {
  fs.mkdirSync(path.dirname(p), { recursive: true })
}

function detectDelimiter(text) {
  const firstLine =
    text
      .split(/\r?\n/)
      .map((l) => l.trim())
      .find((l) => l.length > 0) || ''
  const commas = (firstLine.match(/,/g) || []).length
  const semicolons = (firstLine.match(/;/g) || []).length
  const tabs = (firstLine.match(/\t/g) || []).length
  if (tabs > commas && tabs > semicolons) return '\t'
  if (semicolons > commas) return ';'
  return ','
}

const norm = (s) => String(s ?? '').replace(/^\uFEFF/, '').trim().toLowerCase()

function getField(row, ...candidates) {
  // 1) match directo
  for (const k of candidates) {
    const v = row?.[k]
    if (v !== undefined && v !== null && String(v).trim() !== '') return String(v).trim()
  }

  // 2) match por normalización (maneja BOM/espacios/case)
  const keys = Object.keys(row || {})
  for (const cand of candidates) {
    const target = norm(cand)
    const realKey = keys.find((kk) => norm(kk) === target)
    if (realKey) {
      const v = row?.[realKey]
      if (v !== undefined && v !== null && String(v).trim() !== '') return String(v).trim()
    }
  }

  return ''
}

function parseCSV(text) {
  const delimiter = detectDelimiter(text)

  return parse(text, {
    columns: (headers) => headers.map((h) => String(h).replace(/^\uFEFF/, '').trim()),
    skip_empty_lines: true,
    bom: true,
    trim: true,
    delimiter,
    relax_quotes: true,
    relax_column_count: true,
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

function mapRow(row) {
  const id = getField(row, 'id')
  const name = getField(row, 'name')
  const anime = getField(row, 'anime')

  const genre = getField(row, 'genre', 'type')
  const debutYear = toNum(
    getField(row, 'debutYear', 'yearDebut', 'debut_year', 'year_debut')
  )

  const studio = getField(row, 'studio')
  const role = getField(row, 'role')
  const gender = getField(row, 'gender')
  const race = getField(row, 'race')
  const debutInfo = getField(row, 'debutInfo', 'debut_info')
  const imageFileName = getField(row, 'imageFileName', 'image_file_name') || `${id}.png`

  // Edades (acepta variantes por si tu CSV no usa "...Group")
  const ageDebutGroup =
    getField(
      row,
      'ageDebutGroup',
      'ageDebut',
      'edadDebutGroup',
      'edadDebut',
      'age_debut_group',
      'edad_debut_group'
    ) || 'Desconocido'

  const ageMainGroup =
    getField(
      row,
      'ageMainGroup',
      'ageMain',
      'edadMainGroup',
      'edadMain',
      'age_main_group',
      'edad_main_group'
    ) || 'Desconocido'

  const active = toBool(getField(row, 'active'), true)

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
    ageDebutGroup,
    ageMainGroup,
    active,
  }
}

function writeCharactersTS(characters) {
  ensureDir(OUT_CHARACTERS_TS)

  const header = `export type Character = {
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
`

  const body = characters
    .map((c) => {
      return `  {
    id: \`${esc(c.id)}\`,
    name: \`${esc(c.name)}\`,
    anime: \`${esc(c.anime)}\`,
    genre: \`${esc(c.genre)}\`,
    debutYear: ${c.debutYear ?? 0},
    studio: \`${esc(c.studio)}\`,
    role: \`${esc(c.role)}\`,
    gender: \`${esc(c.gender)}\`,
    race: \`${esc(c.race)}\`,
    debutInfo: \`${esc(c.debutInfo)}\`,
    imageUrl: \`${esc(c.imageUrl)}\`,
    ageDebutGroup: \`${esc(c.ageDebutGroup)}\`,
    ageMainGroup: \`${esc(c.ageMainGroup)}\`,
    active: ${c.active ? 'true' : 'false'},
  },`
    })
    .join('\n')

  const footer = `\n]\n`

  fs.writeFileSync(OUT_CHARACTERS_TS, header + body + footer, 'utf8')
}

function writeLiteTS(characters) {
  ensureDir(OUT_LITE_TS)

  const lite = characters.map(({ id, name, anime, imageUrl, active }) => ({
    id,
    name,
    anime,
    imageUrl,
    active,
  }))

  const content = `export const CHARACTERS_LITE = ${JSON.stringify(lite, null, 2)} as const\n`
  fs.writeFileSync(OUT_LITE_TS, content, 'utf8')
}

function main() {
  console.log('✅ generate-characters: usando csv-parse (robusto)')

  if (!fs.existsSync(INPUT_CSV)) {
    console.error(`❌ No encuentro el CSV en: ${INPUT_CSV}`)
    process.exit(1)
  }

  const csvText = fs.readFileSync(INPUT_CSV, 'utf8')
  const rows = parseCSV(csvText)

  console.log('🔎 Headers detectados:', Object.keys(rows[0] || {}))
  console.log(
    '🔎 Ejemplo ages:',
    rows[0]?.ageDebutGroup,
    rows[0]?.ageMainGroup,
    rows[0]?.ageDebut,
    rows[0]?.ageMain
  )

  const characters = rows
    .map(mapRow)
    .filter((c) => c.id && c.name && c.anime)

  // sanity check: cuántos quedaron en Desconocido
  const unknownDebut = characters.filter((c) => c.ageDebutGroup === 'Desconocido').length
  const unknownMain = characters.filter((c) => c.ageMainGroup === 'Desconocido').length
  console.log(`📊 ageDebutGroup Desconocido: ${unknownDebut}/${characters.length}`)
  console.log(`📊 ageMainGroup  Desconocido: ${unknownMain}/${characters.length}`)

  writeCharactersTS(characters)
  writeLiteTS(characters)

  console.log(`✅ Generado: ${OUT_CHARACTERS_TS}`)
  console.log(`✅ Generado: ${OUT_LITE_TS}`)
}

main()
