/**
 * App config. Used by services for base URL etc.
 */
function getBecknApiUrl(): string {
  if (typeof window !== 'undefined') {
    return (process.env.NEXT_PUBLIC_BECKN_API_URL ?? '').trim() || '/api'
  }
  return (process.env.NEXT_PUBLIC_BECKN_API_URL ?? '').trim() || 'http://localhost:8080'
}

export const config = {
  getBecknApiUrl
}
