import 'dotenv/config'
import fs from 'node:fs'
import path from 'node:path'
import { parse } from 'csv-parse/sync'
import { createClient } from '@supabase/supabase-js'

const PROJECT_ROOT = process.cwd()
const INPUT_CSV = path.join(PROJECT_ROOT, 'data', 'otakle_characters.csv')
const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Faltan SUPABASE_URL y/o SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

function parseCSV(text) {
  return parse(text, {
    columns: true,
    skip_empty_lines: true,
    bom: true,
    trim: true,
  })
}

function toBoolean(value) {
  const normalized = String(value ?? '').trim().toLowerCase()
  return !(normalized === 'false' || normalized === '0' || normalized === 'no')
}

function mapRow(row) {
  return {
    id: row.id,
    name: row.name,
    anime: row.anime,
    genre: row.genre,
    debut_year: Number(row.debutYear) || 0,
    studio: row.studio,
    role: row.role,
    gender: row.gender,
    race: row.race,
    debut_info: row.debutInfo,
    image_url: `/images/${row.imageFileName}`,
    age_debut_group: row.ageDebut || 'Desconocido',
    age_main_group: row.ageMain || 'Desconocido',
    active: toBoolean(row.active),
  }
}

async function main() {
  const rows = parseCSV(fs.readFileSync(INPUT_CSV, 'utf8')).map(mapRow)
  const chunkSize = 50

  for (let index = 0; index < rows.length; index += chunkSize) {
    const chunk = rows.slice(index, index + chunkSize)
    const { error } = await supabase.from('characters').upsert(chunk, { onConflict: 'id' })

    if (error) {
      console.error(`❌ Falló el upsert del bloque ${index / chunkSize + 1}:`, error.message)
      process.exit(1)
    }

    console.log(`✅ Subido bloque ${index / chunkSize + 1}/${Math.ceil(rows.length / chunkSize)}`)
  }

  console.log(`🎉 Catálogo sincronizado: ${rows.length} personajes`)
}

main()
