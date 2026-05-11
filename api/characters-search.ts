import type { VercelRequest, VercelResponse } from '@vercel/node'
import { searchCharacters } from './lib/catalog.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const q = String(req.query.q ?? '')
  const mode = String(req.query.mode ?? 'normal')
  const anime = String(req.query.anime ?? 'ALL')
  const limit = Number(req.query.limit ?? 10)

  const characters = await searchCharacters({ q, mode: mode === 'easy' ? 'easy' : 'normal', anime, limit })

  res.setHeader('Cache-Control', 'public, s-maxage=30, stale-while-revalidate=120')
  res.status(200).json({ characters })
}
