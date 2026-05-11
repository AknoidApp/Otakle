import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getAnimeOptions } from './lib/catalog.js'

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  const animes = await getAnimeOptions()

  res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=3600')
  res.status(200).json({ animes })
}
