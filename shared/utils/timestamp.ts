export const getOrderPlacementTimeline = (timeStamp: string) => {
  const localDateAndTime = new Date(timeStamp)
  const localTime = localDateAndTime.toLocaleTimeString()
  const localDate = localDateAndTime.toDateString()
  const localDateWithoutDay = localDate.split(' ').slice(1).join(' ')

  return `${localDateWithoutDay}, ${localTime}`
}

export function convertTimestampToDdMmYyyyHhMmPM(timestamp: string) {
  const date = new Date(timestamp)

  const day = date.getDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear()

  let hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  const ampm = hour >= 12 ? 'pm' : 'am'
  hour = hour % 12
  if (hour === 0) {
    hour = 12
  }

  const formattedTimestamp = `${day}/${month}/${year}, ${hour}:${minute} ${ampm}`

  return formattedTimestamp
}

function getOrdinalSuffix(day: number) {
  if (day >= 11 && day <= 13) {
    return 'th'
  }
  switch (day % 10) {
    case 1:
      return 'st'
    case 2:
      return 'nd'
    case 3:
      return 'rd'
    default:
      return 'th'
  }
}

export function formatTimestamp(timestamp: string) {
  const date = new Date(timestamp)

  const day = date.getDate()
  const month = date.toLocaleString('default', { month: 'short' })
  const year = date.getFullYear()
  const hours = date.getHours() % 12 || 12
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const period = date.getHours() < 12 ? 'am' : 'pm'

  const ordinalSuffix = getOrdinalSuffix(day)

  const formattedDate = `${day}${ordinalSuffix} ${month} ${year}, ${hours}:${minutes}${period}`

  return formattedDate
}
