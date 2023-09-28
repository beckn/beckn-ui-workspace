import React from 'react'
import AppointmentDateList from '../components/bookAppointment/AppointmentDateList'
import { Box, Flex, Text } from '@chakra-ui/react'
import TimeSlotList from '../components/bookAppointment/TimeSlotList'
import Button from '../components/button/Button'
import { useLanguage } from '../hooks/useLanguage'

import Router from 'next/router'

const bookLabAppointment = () => {
  const { t } = useLanguage()
  return (
    <Box mt={'20px'} fontFamily={'Poppins'}>
      <Box>
        <Text fontSize={'17px'} fontWeight={400} mb={'3px'}>
          {t.selectService}
        </Text>

        <Box w={'100%'} h={'48px'} borderRadius={'12px'} border={'1px solid #C9C9C9'} pl={'10px'} pt={'10px'}>
          <Text fontSize={'15px'} fontWeight={400}>
            {t.xray}
          </Text>
        </Box>
      </Box>
      <Flex flexDirection={'column'} justify={'start'} mt={'20px'}>
        <Text fontSize={'17px'}>{t.selectDate}</Text>
        <AppointmentDateList />
        <Box mt={'20px'}>
          <Text fontSize={'17px'} mb={'10px'}>
            {t.selectTimeSlot}
          </Text>
          <TimeSlotList />
        </Box>
      </Flex>
      <Box mt={'100px'}>
        <Button
          buttonText={t.confirmAppointmentText}
          background="rgba(var(--color-primary))"
          color="white"
          handleOnClick={() => {
            Router.push('/checkoutForLab')
          }}
          isDisabled={false}
        />
      </Box>
    </Box>
  )
}

export default bookLabAppointment
