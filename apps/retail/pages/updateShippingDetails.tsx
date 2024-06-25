import React, { useEffect, useState } from 'react'
import ShippingForm from '@beckn-ui/becknified-components/src/components/checkout/shipping-form'
import { Box, Text, useToast } from '@chakra-ui/react'
import axios from '@services/axios'
import { Loader, Typography } from '@beckn-ui/molecules'
import { useLanguage } from '@hooks/useLanguage'
import { v4 as uuidv4 } from 'uuid'
import { useRouter } from 'next/router'
import { geocodeFromPincode } from '@utils/checkout-utils'
import { ShippingFormInitialValuesType } from '@beckn-ui/becknified-components'
import { useDispatch } from 'react-redux'
import { ConfirmResponseModel } from '@beckn-ui/common/lib/types'
import { feedbackActions } from '@beckn-ui/common/src/store/ui-feedback-slice'

const UpdateShippingDetails = () => {
  const [shippingDetails, setShippingDetails] = useState<ShippingFormInitialValuesType>({
    name: '',
    mobileNumber: '',
    email: '',
    address: '',
    pinCode: ''
  })
  const [confirmData, setConfirmData] = useState<ConfirmResponseModel[] | null>(null)
  const [isLoadingForUpdate, setIsLoadingForUpdate] = useState<boolean>(false)
  const { t } = useLanguage()
  const router = useRouter()
  const toast = useToast()
  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  const dispatch = useDispatch()

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage && localStorage.getItem('confirmResponse')) {
      const parsedConfirmData: ConfirmResponseModel[] = JSON.parse(localStorage.getItem('confirmResponse') as string)
      setConfirmData(parsedConfirmData)
    }
  }, [])

  const handleSubmit = async (formData: ShippingFormInitialValuesType, confirmData: ConfirmResponseModel[]) => {
    try {
      setIsLoadingForUpdate(true)
      if (confirmData && confirmData.length > 0) {
        const { domain, bpp_id, bpp_uri, transaction_id } = confirmData[0].context
        const orderId = confirmData[0].message.orderId
        const { name, address, email, mobileNumber, pinCode } = formData
        const { state, city, country } = await geocodeFromPincode(pinCode!)

        const updateRequestPayload = {
          data: [
            {
              context: {
                domain,
                bpp_id,
                bpp_uri,
                transaction_id: uuidv4()
              },
              orderId,
              updateDetails: {
                updateTarget: 'order.fulfillments[0].stops[0]',
                fulfillments: [
                  {
                    id: 1,
                    stops: [
                      {
                        location: {
                          address: shippingDetails.address,
                          city: {
                            name: city || 'Bengaluru'
                          },
                          state: {
                            name: state || 'Karnataka'
                          },
                          country: {
                            code: country || 'IND'
                          },
                          area_code: pinCode
                        },
                        contact: {
                          name: name,
                          phone: mobileNumber,
                          email: email
                        }
                      }
                    ]
                  }
                ]
              }
            }
          ]
        }
        const updateResponse = await axios.post(`${apiUrl}/update`, updateRequestPayload)
        if (updateResponse.data.data.length > 0) {
          dispatch(
            feedbackActions.setToastData({
              toastData: {
                message: 'Success',
                display: true,
                type: 'success',
                description: 'Order Updated Successfully!'
              }
            })
          )
          router.push('/orderDetails')
        }
      } else if (localStorage.getItem('selectedOrder') && localStorage.getItem('statusResponse')) {
        const statusResponseData = JSON.parse(localStorage.getItem('statusResponse') as string)
        const { domain, transaction_id, bpp_id, bpp_uri } = statusResponseData[0].context
        const selectedOrderData = JSON.parse(localStorage.getItem('selectedOrder') as string)
        const { orderId } = selectedOrderData
        const { name, address, email, mobileNumber, pinCode } = formData
        const { state, city, country } = await geocodeFromPincode(pinCode!)

        const updateRequestPayload = {
          data: [
            {
              context: {
                domain,
                bpp_id,
                bpp_uri,
                transaction_id: uuidv4()
              },
              orderId,
              updateDetails: {
                updateTarget: 'order.fulfillments[0].stops[0]',
                fulfillments: [
                  {
                    id: '1',
                    stops: [
                      {
                        location: {
                          address: shippingDetails.address,
                          city: {
                            name: city || 'Bengaluru'
                          },
                          state: {
                            name: state || 'Karnataka'
                          },
                          country: {
                            code: country || 'IND'
                          },
                          area_code: pinCode
                        },
                        contact: {
                          name: name,
                          phone: mobileNumber,
                          email: email
                        }
                      }
                    ]
                  }
                ]
              }
            }
          ]
        }
        const updateResponse = await axios.post(`${apiUrl}/update`, updateRequestPayload)
        if (updateResponse.data.data.length > 0) {
          dispatch(
            feedbackActions.setToastData({
              toastData: {
                message: 'Success',
                display: true,
                type: 'success',
                description: 'Order Updated Successfully!'
              }
            })
          )
          router.push('/orderDetails')
        }
      }
    } catch (error) {
      console.error('error in update', error)
      dispatch(
        feedbackActions.setToastData({
          toastData: {
            message: 'Error!',
            display: true,
            type: 'error',
            description: `${error}`
          }
        })
      )
      setIsLoadingForUpdate(false)
    }
  }

  const handleFormChange = (changedData: ShippingFormInitialValuesType) => {
    setShippingDetails(prevDetails => ({ ...prevDetails, ...changedData }))
  }

  if (typeof window === 'undefined' || (!confirmData?.length && !localStorage.getItem('selectedOrder'))) {
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
        onSubmit={() => handleSubmit(shippingDetails, confirmData as ConfirmResponseModel[])}
        values={shippingDetails}
        onChange={handleFormChange}
        submitButton={{ text: 'Submit' }}
      />
    </Box>
  )
}

export default UpdateShippingDetails
