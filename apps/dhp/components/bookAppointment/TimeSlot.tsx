import React from 'react'
import style from './Appointment.module.css'
import { Box } from '@chakra-ui/react'

interface TimeSlotProps {
  time: string
  selected: string | null
  onSelect: (time: string) => void
}

const TimeSlot: React.FC<TimeSlotProps> = ({ time, selected, onSelect }) => {
  const handleClick = () => {
    onSelect(time)
  }

  return (
    <Box className={`${style.time_slot} ${selected === time ? `${style.isActive}` : ''}`} onClick={handleClick}>
      {time}
    </Box>
  )
}

export default TimeSlot
