import jwt from 'jsonwebtoken'

export function formatDate(dateTime: string): string {
  const date = new Date(dateTime)
  //   const dayName = date.toLocaleDateString('en-US', { weekday: 'long' })
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()

  return `${day}/${month}/${year}`
}

export const checkTokenExpiry = (token: any) => {
  const decoded: any = jwt.decode(token) // Just decodes, no verification

  if (decoded && decoded.exp) {
    const currentTime = Math.floor(Date.now() / 1000)
    if (currentTime > decoded.exp) {
      console.log('Token has expired')
      return true
    }
  }
  return false
}
