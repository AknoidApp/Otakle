import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getCharactersByIds } from './lib/catalog.js'

function parseIds(value: string | string[] | undefined) {
  const raw = Array.isArray(value) ? value.join(',') : value ?? ''

  return raw
    .split(',')
    .map((id) => id.trim())
    .filter(Boolean)
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const ids = parseIds(req.query.ids)
  const characters = await getCharactersByIds(ids)

  res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300')
  res.status(200).json({ characters })
}
