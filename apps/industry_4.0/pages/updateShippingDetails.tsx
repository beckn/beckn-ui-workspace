import React, { useEffect, useState } from 'react'
import ShippingForm from '@beckn-ui/becknified-components/src/components/checkout/shipping-form'
import { Box, Text } from '@chakra-ui/react'
import { ConfirmResponseModel } from '../types/confirm.types'
import axios from 'axios'
import { Loader, Typography } from '@beckn-ui/molecules'
import { useLanguage } from '@hooks/useLanguage'
import { useRouter } from 'next/router'

const UpdateShippingDetails = () => {
  const [shippingDetails, setShippingDetails] = useState({
    name: '',
    mobileNumber: '',
    email: '',
    address: '',
    pinCode: ''
  })
  const [confirmData, setConfirmData] = useState<ConfirmResponseModel[] | null>(null)
  const [isLoadingForUpdate, setIsLoadingForUpdate] = useState(false)
  const { t } = useLanguage()
  const router = useRouter()

  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  useEffect(() => {
    if (localStorage && localStorage.getItem('confirmResponse')) {
      const parsedConfirmData: ConfirmResponseModel[] = JSON.parse(localStorage.getItem('confirmResponse') as string)
      setConfirmData(parsedConfirmData)
    }
  }, [])

  const handleSubmit = async (formData: any, confirmData: ConfirmResponseModel[]) => {
    try {
      setIsLoadingForUpdate(true)
      const { domain, bpp_id, bpp_uri, transaction_id } = confirmData[0].context
      const orderId = confirmData[0].message.orderId
      const { name, address, email, mobileNumber } = formData
      const updateRequestPayload = {
        data: [
          {
            context: {
              domain,
              bpp_id,
              bpp_uri,
              transaction_id
            },
            orderId,
            updateDetails: {
              updateTarget: 'order.billing',

              billing: {
                name: name,
                address: address,
                email: email,
                phone: mobileNumber
              }
            }
          }
        ]
      }
      const updateResponse = await axios.post(`${apiUrl}/update`, updateRequestPayload)
      if (updateResponse.data.data.length > 0) {
        router.push('/orderDetails')
      }
    } catch (error) {
      console.error('error in update', error)
    }
  }

  const handleFormChange = (changedData: any) => {
    setShippingDetails(prevDetails => ({ ...prevDetails, ...changedData }))
  }

  if (!confirmData || confirmData.length === 0) {
    return <></>
  }

  if (isLoadingForUpdate) {
    return (
      <Box
        display={'grid'}
        height={'calc(100vh - 300px)'}
        alignContent={'center'}
      >
        <Loader>
          <Box
            mt={'13px'}
            display={'flex'}
            flexDir={'column'}
            alignItems={'center'}
          >
            <Text
              as={Typography}
              fontWeight={600}
              fontSize={'15px'}
              text={t.pleaseWait}
            />

            <Text
              as={Typography}
              text={t.updateOrderLoaderSubText}
              textAlign={'center'}
              alignSelf={'center'}
              fontWeight={400}
              fontSize={'15px'}
            />
          </Box>
        </Loader>
      </Box>
    )
  }

  return (
    <Box
      className="hideScroll"
      maxH={'calc(100vh - 100px)'}
      overflowY="scroll"
    >
      <ShippingForm
        onSubmit={() => handleSubmit(shippingDetails, confirmData)}
        values={shippingDetails}
        onChange={handleFormChange}
        submitButton={{ text: 'Submit' }}
      />
    </Box>
  )
}

export default UpdateShippingDetails
