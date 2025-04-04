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

  // Define slots that should always be disabled
  const disabledSlots = ['8:00 PM', '9:00 PM', '10:00 PM']

  const now = new Date()
  const currentHour = now.getHours()
  const currentDate = now.toISOString().split('T')[0]
  const selectedFullDate = dates.find(date => `${date.day} ${date.date}` === selectedDate)?.fullDate

  return baseSlots.map(slot => {
    let slotHour = Number.parseInt(slot.split(':')[0])
    if (slot.includes('PM') && slotHour !== 12) slotHour += 12
    if (slot.includes('AM') && slotHour === 12) slotHour = 0

    // Slot is disabled if:
    // 1. It's in the disabledSlots array OR
    // 2. It's before or equal to current hour on the current date
    const isDisabled = disabledSlots.includes(slot) || (selectedFullDate === currentDate && slotHour <= currentHour)

    return {
      time: slot,
      disabled: isDisabled
    }
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
  if (!selectedDate || !selectedTime) return null

  try {
    // Parse the date components from selectedDate (e.g., "Mon 17")
    const [, date] = selectedDate.split(' ')

    // Create a base date for the current month and year
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth()

    // Parse time components
    const [time, period] = selectedTime.split(' ')
    const [hours, minutes] = time.split(':')

    // Convert to 24-hour format
    let hour = parseInt(hours)
    if (period === 'PM' && hour !== 12) {
      hour += 12
    } else if (period === 'AM' && hour === 12) {
      hour = 0
    }

    // Create the date object with the components
    const dateObject = new Date(year, month, parseInt(date), hour, parseInt(minutes), 0)

    // Convert to epoch timestamp
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
  domain: string,
  location?: any
): ApiPayload => {
  console.log(cartItems)
  console.log(location)
  return {
    data: cartItems.map(item => ({
      context: {
        transaction_id: crypto.randomUUID(),
        bpp_id: item.bpp_id,
        bpp_uri: item.bpp_uri,
        domain: domain,
        ...(location && location)
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
