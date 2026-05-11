import fs from 'node:fs'
import path from 'node:path'
import { parse } from 'csv-parse/sync'

const PROJECT_ROOT = process.cwd()
const INPUT_CSV = path.join(PROJECT_ROOT, 'data', 'otakle_characters.csv')
const OUTPUT_SQL = path.join(PROJECT_ROOT, 'supabase', 'seed.sql')

function parseCSV(text) {
  return parse(text, {
    columns: true,
    skip_empty_lines: true,
    bom: true,
    trim: true,
  })
}

function sqlString(value) {
  return `'${String(value ?? '').replace(/'/g, "''")}'`
}

function sqlNumber(value) {
  const num = Number(value)
  return Number.isFinite(num) ? String(num) : '0'
}

function sqlBoolean(value) {
  const normalized = String(value ?? '').trim().toLowerCase()
  return normalized === 'false' || normalized === '0' || normalized === 'no' ? 'false' : 'true'
}

function mapRow(row) {
  return {
    id: row.id,
    name: row.name,
    anime: row.anime,
    genre: row.genre,
    debut_year: row.debutYear,
    studio: row.studio,
    role: row.role,
    gender: row.gender,
    race: row.race,
    debut_info: row.debutInfo,
    image_url: `/images/${row.imageFileName}`,
    age_debut_group: row.ageDebut,
    age_main_group: row.ageMain,
    active: row.active,
  }
}

function main() {
  const csvText = fs.readFileSync(INPUT_CSV, 'utf8')
  const rows = parseCSV(csvText).map(mapRow)

  const values = rows
    .map(
      (row) => `(
  ${sqlString(row.id)},
  ${sqlString(row.name)},
  ${sqlString(row.anime)},
  ${sqlString(row.genre)},
  ${sqlNumber(row.debut_year)},
  ${sqlString(row.studio)},
  ${sqlString(row.role)},
  ${sqlString(row.gender)},
  ${sqlString(row.race)},
  ${sqlString(row.debut_info)},
  ${sqlString(row.image_url)},
  ${sqlString(row.age_debut_group)},
  ${sqlString(row.age_main_group)},
  ${sqlBoolean(row.active)}
)`,
    )
    .join(',\n')

  const sql = `-- AUTOGENERADO por scripts/generate-supabase-seed.mjs\n\ninsert into public.characters (\n  id,\n  name,\n  anime,\n  genre,\n  debut_year,\n  studio,\n  role,\n  gender,\n  race,\n  debut_info,\n  image_url,\n  age_debut_group,\n  age_main_group,\n  active\n)\nvalues\n${values}\non conflict (id) do update set\n  name = excluded.name,\n  anime = excluded.anime,\n  genre = excluded.genre,\n  debut_year = excluded.debut_year,\n  studio = excluded.studio,\n  role = excluded.role,\n  gender = excluded.gender,\n  race = excluded.race,\n  debut_info = excluded.debut_info,\n  image_url = excluded.image_url,\n  age_debut_group = excluded.age_debut_group,\n  age_main_group = excluded.age_main_group,\n  active = excluded.active,\n  updated_at = timezone('utc', now());\n`

  fs.mkdirSync(path.dirname(OUTPUT_SQL), { recursive: true })
  fs.writeFileSync(OUTPUT_SQL, sql, 'utf8')
  console.log(`✅ Generado ${OUTPUT_SQL}`)
}

main()
