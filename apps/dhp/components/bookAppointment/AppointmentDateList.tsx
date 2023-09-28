import React, { useState } from 'react'
import AppointmentDate from './AppointmentDate'
import style from './Appointment.module.css'
import { Box } from '@chakra-ui/react'

interface AppointmentDateListProps {}

const AppointmentDateList: React.FC<AppointmentDateListProps> = () => {
  const dayNames: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const formatDate = (offset: number): string => {
    const currentDate = new Date()
    currentDate.setDate(currentDate.getDate() + offset)
    const dayName = dayNames[currentDate.getDay()]
    const date = currentDate.getDate()
    return `${dayName} ${date}`
  }

  const getDate = (): string[] => {
    const today = formatDate(0)
    const tomorrow = formatDate(1)
    const dayAfterTomorrow = formatDate(2)
    return [today, tomorrow, dayAfterTomorrow]
  }

  const days: string[] = getDate()

  const [selectedDate, setSelectedDate] = useState<string>(days[0])
  const [isActive, setIsActive] = useState<string>(selectedDate)

  const handleSelect = (date: string): void => {
    setSelectedDate(date)
    setIsActive(date)
  }

  const renderedDays = days.map((day, index) => (
    <AppointmentDate dateStr={day} isActive={isActive} onSelect={handleSelect} key={index} />
  ))

  return <Box className={style.date_container}>{renderedDays}</Box>
}

export default AppointmentDateList
