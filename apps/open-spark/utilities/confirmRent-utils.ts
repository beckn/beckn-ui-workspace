import type { DateInfo, TimeSlot, CartItem, ApiPayload } from '../lib/types/rentalTypes'

export const generateDates = (): DateInfo[] => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const today = new Date()

  return Array.from({ length: 3 }, (_, index) => {
    const date = new Date()
    date.setDate(today.getDate() + index)
    return {
      day: days[date.getDay()],
      date: date.getDate().toString(),
      fullDate: date.toISOString().split('T')[0]
    }
  })
}

export const generateTimeSlots = (selectedDate: string, dates: DateInfo[]): TimeSlot[] => {
  const baseSlots = [
    '10:00 AM',
    '11:00 AM',
    '12:00 PM',
    '1:00 PM',
    '2:00 PM',
    '3:00 PM',
    '4:00 PM',
    '5:00 PM',
    '6:00 PM',
    '7:00 PM',
    '8:00 PM',
    '9:00 PM',
    '10:00 PM'
  ]

  const now = new Date()
  const currentHour = now.getHours()
  const currentDate = now.toISOString().split('T')[0]
  const selectedFullDate = dates.find(date => `${date.day} ${date.date}` === selectedDate)?.fullDate

  return baseSlots.map(slot => {
    let slotHour = Number.parseInt(slot.split(':')[0])
    if (slot.includes('PM') && slotHour !== 12) slotHour += 12
    if (slot.includes('AM') && slotHour === 12) slotHour = 0

    return { time: slot, disabled: selectedFullDate === currentDate && slotHour <= currentHour }
  })
}

export const getTimeValue = (timeStr: string): number => {
  let hours = Number.parseInt(timeStr.split(':')[0])
  const isPM = timeStr.includes('PM')

  if (isPM && hours !== 12) hours += 12
  if (!isPM && hours === 12) hours = 0

  return hours
}

export const convertToTimestamp = (selectedDate: string, selectedTime: string): number | null => {
  if (!selectedDate || !selectedTime) return null // Ensure valid inputs

  try {
    // Extract day and date, e.g., "Wed 14 Feb"
    const [, day, month, date] = selectedDate.split(' ')
    const fullDate = `${date} ${month} ${new Date().getFullYear()} ${selectedTime}`

    // Convert to a valid Date object
    const dateObject = new Date(fullDate)
    if (isNaN(dateObject.getTime())) {
      console.error('Invalid Date Conversion:', fullDate)
      return null
    }

    // Convert to UNIX timestamp (seconds)
    return Math.floor(dateObject.getTime() / 1000)
  } catch (error) {
    console.error('Timestamp Conversion Error:', error)
    return null
  }
}

export const prepareApiPayload = (
  cartItems: CartItem[],
  fromTimestamp: number,
  toTimestamp: number,
  domain: string
): ApiPayload => {
  return {
    data: cartItems.map(item => ({
      context: {
        transaction_id: crypto.randomUUID(),
        bpp_id: item.bpp_id,
        bpp_uri: item.bpp_uri,
        domain: domain
      },
      message: {
        orders: [
          {
            items: [{ id: item.id, fulfillment_ids: item.fulfillments.map(f => f.id) }],
            provider: { id: item.providerId },
            fulfillments: [
              {
                id: item.fulfillments[0].id,
                type: 'RENTAL_START',
                state: { code: 'timestamp', name: fromTimestamp.toString() }
              },
              {
                id: item.fulfillments[1].id,
                type: 'RENTAL_END',
                state: { code: 'timestamp', name: toTimestamp.toString() }
              }
            ]
          }
        ]
      }
    }))
  }
}
