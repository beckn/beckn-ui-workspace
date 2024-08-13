import BottomDrawer from '@components/bottomDrawer/BottomDrawer'
import CheckBoxInput from '@components/cancel-flow/CheckBoxInput'
import HeaderContent from '@components/cancel-flow/HeaderContent'
import { Button, Typography } from '@beckn-ui/molecules'
import { Box } from '@chakra-ui/react'
import { useLanguage } from '@hooks/useLanguage'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { SelectRideRootState } from '@store/selectRide-slice'
import axios from '@services/axios'
import { getCancelPayload } from '@utils/payload'

const cancellationReasons: { id: string | number; reason: string }[] = [
  { id: 1, reason: 'Plan Changed' },
  { id: 2, reason: 'Booked by mistake' },
  { id: 3, reason: 'Unable to contact Driver' },
  { id: 4, reason: 'Driver denied duty' }
]
const CancelRide = ({ handleOnClose }: { handleOnClose: () => void }) => {
  const router = useRouter()
  const { t } = useLanguage()
  const [selectedReason, setSelectedReason] = useState<{ id: string | number; reason: string } | null>(null)
  const [checkedReasons, setCheckedReasons] = useState<{ [key: number | string]: boolean }>(
    cancellationReasons.reduce((acc: any, { id }) => {
      acc[id] = false
      return acc
    }, {})
  )
  const confirmResponse = useSelector((state: SelectRideRootState) => state.selectRide?.confirmResponse)
  const handleCheckboxChange = (id: string) => {
    setCheckedReasons(prev => {
      const newState = Object.fromEntries(Object.keys(prev).map(key => [key, false]))
      newState[id] = true
      return newState
    })
    const reason = cancellationReasons.find(item => item.id === parseInt(id))!
    setSelectedReason(reason!)
  }

  const onCancel = async () => {
    if (confirmResponse.length && selectedReason) {
      const cancelPayload = getCancelPayload(confirmResponse[0], selectedReason)
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/cancel`, cancelPayload)
      router.push('/cancelRide')
    }
  }

  return (
    <BottomDrawer>
      <HeaderContent
        text={t.cancelBookingText}
        onClose={handleOnClose}
      />
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
          handleClick={onCancel}
        />
      </Box>
    </BottomDrawer>
  )
}
export default CancelRide
