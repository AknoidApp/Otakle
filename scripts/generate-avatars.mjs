import 'dotenv/config'
import { parse } from "csv-parse/sync";
import fs from "node:fs";
import path from "node:path";
import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const PROJECT_ROOT = process.cwd();

// Tu CSV actual (déjalo así si ese es el archivo real)
const INPUT_CSV = path.join(PROJECT_ROOT, "data", "otakle_characters.csv");
const OUTPUT_DIR = path.join(PROJECT_ROOT, "public", "images");

// ✅ Control de tandas (20 por defecto)
// Ej: BATCH=1 genera filas 1-20, BATCH=2 genera filas 21-40, etc.
const COUNT = Number(process.env.COUNT ?? 20);
const BATCH = Number(process.env.BATCH ?? 1);
const START = (BATCH - 1) * COUNT;

// ✅ Calidad (recomendación: "high" para que no sea baja)
// Puedes correr: $env:QUALITY="medium" si quieres bajar costo.
const QUALITY = (process.env.QUALITY ?? "high"); // "medium" o "high"

function ensureEnv() {
  if (!process.env.OPENAI_API_KEY) {
    console.error("Falta OPENAI_API_KEY. Crea un .env en la raíz con OPENAI_API_KEY=...");
    process.exit(1);
  }
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function parseCSV(text) {
  return parse(text, {
    columns: true,
    skip_empty_lines: true,
    trim: true
  });
}


function buildPrompt(row) {
  const name = row.name;
  const anime = row.anime;

  return [
    `Minimalist flat vector avatar icon of ${name} from ${anime}.`,
    `Only head and a small part of shoulders.`,
    `White face, clean black outline, simple eyes, no mouth or extremely minimal mouth.`,
    `Hair silhouette must be recognizable for ${name} and use canonical hair color.`,
    `If clothing is visible, use canonical outfit color(s) simplified.`,
    `Transparent background.`,
    `Centered, 1:1, single character only, no text, no watermark, no collage, no grid.`
  ].join(" ");
}

async function generateOne(row) {
  const id = row.id;
  const fileName = (row.imageFileName && row.imageFileName.trim())
    ? row.imageFileName.trim()
    : `${id}.png`;

  const outPath = path.join(OUTPUT_DIR, fileName);

  if (fs.existsSync(outPath)) {
    console.log(`⏭️  Existe, salto: ${fileName}`);
    return { status: "skipped", fileName };
  }

  const prompt = buildPrompt(row);

  try {
    const img = await client.images.generate({
      model: "gpt-image-1.5",
      prompt,
      size: "1024x1024",
      background: "transparent",
      output_format: "png",
      quality: QUALITY, // ✅ AQUÍ VA quality
      n: 1
    });

    const b64 = img.data[0].b64_json;
    const buffer = Buffer.from(b64, "base64");
    fs.writeFileSync(outPath, buffer);

    console.log(`✅ ${fileName}`);
    return { status: "generated", fileName };
  } catch (err) {
    const msg = err?.message || String(err);
    console.error(`❌ Error generando ${fileName}: ${msg}`);

    // Si es billing o verificación, cortamos limpio
    if (
      msg.toLowerCase().includes("billing") ||
      msg.toLowerCase().includes("hard limit") ||
      msg.toLowerCase().includes("verify") ||
      msg.toLowerCase().includes("verified")
    ) {
      console.error("🧾 Bloqueo de cuenta/billing/verificación. Detengo la ejecución para no seguir fallando.");
      process.exit(1);
    }

    return { status: "error", fileName, error: msg };
  }
}

async function main() {
  ensureEnv();
  ensureDir(OUTPUT_DIR);

  if (!fs.existsSync(INPUT_CSV)) {
    console.error(`No encuentro el CSV: ${INPUT_CSV}`);
    process.exit(1);
  }

  const csvText = fs.readFileSync(INPUT_CSV, "utf8");
  const rowsAll = parseCSV(csvText).filter((r) => String(r.active ?? "True").toLowerCase() !== "false");

  const end = Math.min(START + COUNT, rowsAll.length);
  const rows = rowsAll.slice(START, end);

  console.log(`Total en CSV: ${rowsAll.length}`);
  console.log(`Tanda #${BATCH} -> filas ${START + 1} a ${end} (COUNT=${COUNT})`);
  console.log(`QUALITY=${QUALITY}`);
  console.log(`Personajes a procesar en esta tanda: ${rows.length}`);

  let generated = 0;
  let skipped = 0;
  let errored = 0;

  for (const row of rows) {
    if (!row.id || !row.name || !row.anime) {
      console.log("⚠️  Fila incompleta, salto:", row);
      skipped++;
      continue;
    }

    const res = await generateOne(row);
    if (res.status === "generated") generated++;
    else if (res.status === "skipped") skipped++;
    else errored++;
  }

  console.log(`\n📦 Resumen tanda #${BATCH}:`);
  console.log(`✅ Generadas: ${generated}`);
  console.log(`⏭️  Saltadas (ya existían): ${skipped}`);
  console.log(`❌ Con error: ${errored}`);
  console.log(`\nRevisa: ${OUTPUT_DIR}`);
}

main().catch((err) => {
  console.error("❌ Error fatal:", err?.message || err);
  process.exit(1);
});

