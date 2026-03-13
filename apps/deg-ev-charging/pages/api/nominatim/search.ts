import type { NextApiRequest, NextApiResponse } from 'next'

const NOMINATIM_BASE = 'https://nominatim.openstreetmap.org'

const NOMINATIM_HEADERS: HeadersInit = {
  Accept: 'application/json',
  'Accept-Language': 'en',
  'User-Agent': 'Mozilla/5.0 (compatible; EVChargingBAP/1.0; +https://beckn.io)',
  Referer: 'https://beckn.io/'
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).end()
  }
  const q = req.query.q
  if (typeof q !== 'string' || !q.trim()) {
    return res.status(400).json({ error: 'Missing or invalid query' })
  }
  const limit = Math.min(Number(req.query.limit) || 5, 10)
  const url = `${NOMINATIM_BASE}/search?format=json&q=${encodeURIComponent(q.trim())}&limit=${limit}`
  try {
    const response = await fetch(url, { headers: NOMINATIM_HEADERS })
    if (!response.ok) {
      const text = await response.text()
      console.error('Nominatim error', response.status, text)
      return res.status(502).json({ error: 'Location search unavailable. Try again shortly.' })
    }
    const data = await response.json()
    res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=120')
    return res.status(200).json(Array.isArray(data) ? data : [])
  } catch (err) {
    console.error('Nominatim proxy error:', err)
    return res.status(502).json({ error: 'Geocoding service unavailable' })
  }
}
