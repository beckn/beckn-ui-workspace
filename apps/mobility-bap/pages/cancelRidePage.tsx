import BottomDrawer from '@/components/bottomDrawer/BottomDrawer'
import CheckBoxInput from '@/components/cancel-flow/CheckBoxInput'
import HeaderContent from '@/components/cancel-flow/HeaderContent'
import { Button, Typography } from '@beckn-ui/molecules'
import { Box } from '@chakra-ui/react'
import { useLanguage } from 'hooks/useLanguage'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
const cancelRidePage = () => {
  const cancellationReasons: { id: string | number; reason: string }[] = [
    { id: 1, reason: 'Plan Changed' },
    { id: 2, reason: 'Booked by mistake' },
    { id: 3, reason: 'Unable to contact Driver' },
    { id: 4, reason: 'Driver denied duty' }
  ]
  const router = useRouter()
  const { t } = useLanguage()
  const [checkedReasons, setCheckedReasons] = useState<{ [key: number | string]: boolean }>(
    cancellationReasons.reduce((acc, { id }) => {
      acc[id] = false
      return acc
    }, {})
  )
  const handleCheckboxChange = (id: string) => {
    setCheckedReasons(prev => {
      const newState = Object.fromEntries(Object.keys(prev).map(key => [key, false]))
      newState[id] = true
      return newState
    })
    const selectedValue = cancellationReasons.find(item => item.id === parseInt(id))?.reason ?? ''
    console.log(selectedValue)
  }
  return (
    <BottomDrawer>
      <HeaderContent text={t.cancelBookingText} />
      <Box mb={'10px'}>
        <Typography
          text={t.cancelReason}
          fontWeight="400"
          fontSize="12px"
        />
      </Box>
      {cancellationReasons.map(({ id, reason }) => (
        <CheckBoxInput
          key={id}
          cancellationReason={reason}
          checked={checkedReasons[id]}
          onChange={handleCheckboxChange}
          id={id}
        />
      ))}
      <Box mt={'10px'}>
        <Button
          text={t.cancelRide}
          handleClick={() => router.push('/cancelRide')}
        />
      </Box>
    </BottomDrawer>
  )
}
export default cancelRidePage
