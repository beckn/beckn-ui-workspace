import React from 'react'
import AppointmentDateList from '../components/bookAppointment/AppointmentDateList'
import { Box, Flex, Text } from '@chakra-ui/react'
import TimeSlotList from '../components/bookAppointment/TimeSlotList'
import Button from '../components/button/Button'
import { useLanguage } from '../hooks/useLanguage'
import Router from 'next/router'

const bookDoctorAppointment = () => {
  const { t } = useLanguage()
  return (
    <Box m={'20px 0 20px 0'} fontFamily={'Poppins'}>
      <Flex flexDirection={'column'} justify={'start'}>
        <Text fontSize={'17px'}>Select Date:</Text>
        <AppointmentDateList />
        <Box mt={'20px'}>
          <Text fontSize={'17px'} mb={'10px'}>
            Select Time Slot:
          </Text>
          <TimeSlotList />
        </Box>
      </Flex>
      <Box mt={'170px'}>
        <Button
          buttonText={t.confirmAppointmentText}
          background="rgba(var(--color-primary))"
          color="white"
          handleOnClick={() => {
            Router.push('/checkoutPage')
          }}
          isDisabled={false}
        />
      </Box>
    </Box>
  )
}

export default bookDoctorAppointment
