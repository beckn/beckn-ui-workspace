import React, { useState } from 'react'
import TimeSlot from './TimeSlot'
import style from './Appointment.module.css'
import { Box, Flex } from '@chakra-ui/react'

const TimeSlotList: React.FC = () => {
  const timeSlots: string[] = [
    '10:00 AM',
    '11:00 AM',
    '12:00 PM',
    '1:00 PM',
    '2:00 PM',
    '3:00 PM',
    '4:00 PM',
    '5:00 PM'
  ]
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [isActive, setIsActive] = useState<string | null>(selectedTime)

  const handleSelect = (time: string) => {
    setSelectedTime(time)
    setIsActive(time)
  }
  const renderedTimeSlots = timeSlots.map((slot, index) => (
    <TimeSlot
      key={index}
      time={slot}
      selected={isActive}
      onSelect={handleSelect}
    />
  ))

  return (
    <Box className={style.appointment_booking}>
      <Flex
        wrap={'wrap'}
        gap={'8px'}
      >
        {renderedTimeSlots}
      </Flex>
    </Box>
  )
}

export default TimeSlotList
