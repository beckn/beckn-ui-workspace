import React from 'react'
import style from './Appointment.module.css'
import { Box } from '@chakra-ui/react'

interface AppointmentDateProps {
  dateStr: string
  isActive: string
  onSelect: (date: string) => void
}

const AppointmentDate: React.FC<AppointmentDateProps> = ({ dateStr, isActive, onSelect }) => {
  const handleClick = () => {
    onSelect(dateStr)
  }
  const [day, date]: string[] = dateStr.split(' ')

  return (
    <Box
      className={`${style.select_date} ${isActive === dateStr ? `${style.isActive}` : ''}`}
      onClick={handleClick}
    >
      {day} <br />
      {date}
    </Box>
  )
}

export default AppointmentDate
