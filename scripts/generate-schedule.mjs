// scripts/generate-schedule.mjs
import fs from "node:fs";
import path from "node:path";

// Ajusta si tus rutas cambian
const PROJECT_ROOT = process.cwd();
const INPUT_CSV = path.join(PROJECT_ROOT, "data", "otakle_characters.csv");
const IMAGES_DIR = path.join(PROJECT_ROOT, "public", "images");
const OUTPUT_TS = path.join(PROJECT_ROOT, "src", "dailySchedule.ts");

// Config
const DAYS = 30;

// Cambia esta seed si quieres otro orden (pero fijo)
const SEED = "otakle-launch-v1";

// ---------- Utils: seed + random ----------
function xmur3(str) {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return h >>> 0;
  };
}

function mulberry32(a) {
  return () => {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ---------- CSV parser (simple) ----------
function parseCSV(text) {
  const lines = text.split(/\r?\n/).filter(Boolean);
  const headers = lines[0].split(",").map((h) => h.trim());
  const rows = [];

  for (const line of lines.slice(1)) {
    const cols = line.split(",");
    const row = {};
    headers.forEach((h, i) => (row[h] = (cols[i] ?? "").trim()));
    rows.push(row);
  }
  return rows;
}

function isActive(row) {
  const v = String(row.active ?? "true").toLowerCase();
  return v !== "false";
}

function getImageFileName(row) {
  const file = (row.imageFileName ?? "").trim();
  if (file) return file;
  return `${row.id}.png`;
}

function hasImage(row) {
  const fileName = getImageFileName(row);
  const p = path.join(IMAGES_DIR, fileName);
  return fs.existsSync(p);
}

function shuffleDeterministic(array, seedStr) {
  const seedFn = xmur3(seedStr);
  const rand = mulberry32(seedFn());
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function writeDailySchedule(ids) {
  const content =
`// src/dailySchedule.ts
// AUTOGENERADO por scripts/generate-schedule.mjs
// Día 1 = índice 0. Día 30 = índice 29.

export const DAILY_SCHEDULE: string[] = [
${ids.map((id) => `  "${id}",`).join("\n")}
]
`;

  fs.writeFileSync(OUTPUT_TS, content, "utf8");
}

function main() {
  if (!fs.existsSync(INPUT_CSV)) {
    console.error(`❌ No encuentro el CSV: ${INPUT_CSV}`);
    process.exit(1);
  }
  if (!fs.existsSync(IMAGES_DIR)) {
    console.error(`❌ No encuentro la carpeta de imágenes: ${IMAGES_DIR}`);
    process.exit(1);
  }

  const csvText = fs.readFileSync(INPUT_CSV, "utf8");
  const rows = parseCSV(csvText).filter(isActive);

  // Validación mínima
  const valid = rows.filter((r) => r.id && r.name && r.anime);

  // Filtra solo los que tienen imagen
  const withImage = valid.filter(hasImage);

  console.log(`Total CSV (activos): ${rows.length}`);
  console.log(`Filas válidas: ${valid.length}`);
  console.log(`Con imagen: ${withImage.length}`);

  if (withImage.length < DAYS) {
    console.error(`❌ No alcanzan personajes con imagen para ${DAYS} días. Tienes: ${withImage.length}`);
    process.exit(1);
  }

  // Mezcla determinística
  const shuffled = shuffleDeterministic(withImage, SEED);

  // Tomamos los primeros DAYS IDs
  const ids = shuffled.slice(0, DAYS).map((r) => r.id);

  writeDailySchedule(ids);

  console.log(`✅ Calendario generado: ${OUTPUT_TS}`);
  console.log(`📅 Días 1..${DAYS} listos (IDs únicos).`);
  console.log(`ℹ️ Seed usada: ${SEED}`);
}

main();
