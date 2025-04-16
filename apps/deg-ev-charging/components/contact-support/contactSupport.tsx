import React, { useEffect, useState } from 'react'
import { Box } from '@chakra-ui/react'
import { Button, LoaderWithMessage, Typography } from '@beckn-ui/molecules'
import { useLanguage } from '@hooks/useLanguage'
import { SupportModel } from '@components/cancel-flow/CancelFlow'
import BottomDrawer from '@components/bottomDrawer/BottomDrawer'
import HeaderContent from '@components/cancel-flow/HeaderContent'
import axios from '@services/axios'
import { useSelector } from 'react-redux'
import { v4 as uuidv4 } from 'uuid'
import { SelectRideRootState } from '@store/selectCharger-slice'
import { isEmpty } from '@beckn-ui/common'
import { testIds } from '@shared/dataTestIds'

const apiUrl = process.env.NEXT_PUBLIC_API_URL

interface ContactSupportProps {
  handleOnClose: () => void
}

const contactSupport = ({ handleOnClose }: ContactSupportProps) => {
  const [contactDetails, setContactDetails] = useState<SupportModel | null>()
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const { t } = useLanguage()
  const confirmResponse = useSelector((state: SelectRideRootState) => state.selectRide.confirmResponse)

  const getSupportDetails = async () => {
    if (confirmResponse.length > 0 && confirmResponse[0].context && confirmResponse[0].message) {
      setIsLoading(true)
      const { domain, bpp_id, bpp_uri, transaction_id } = confirmResponse[0].context
      const orderId = confirmResponse[0].message.orderId

      const supportPayload = {
        data: [
          {
            context: {
              domain,
              bpp_id,
              bpp_uri,
              transaction_id: uuidv4()
            },
            message: {
              order_id: orderId,
              support: {
                callback_phone: '+91-8858150053',
                ref_id: '894789-43954',
                phone: '+91 9988776543',
                email: 'supportperson@gmail.com'
              }
            }
          }
        ]
      }

      const [supportResponse] = await Promise.all([
        // axios.post(`${apiUrl}/track`, trackPayload),
        axios.post(`${apiUrl}/support`, supportPayload)
      ])

      if (!isEmpty(supportResponse.data)) {
        setContactDetails({
          email: supportResponse.data.data[0].message && supportResponse.data.data[0].message.support.email,
          phone: supportResponse.data.data[0].message && supportResponse.data.data[0].message.support.phone
        })

        setIsLoading(false)
      }
    }
  }

  useEffect(() => {
    getSupportDetails()
  }, [])

  const handleEmailCustomer = (email: string) => {
    const subject = 'Regarding Your Order'
    const body = 'Dear Customer,\n\n'
    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.open(mailtoLink, '_blank')
  }
  const handleCallCustomer = (phoneNumber: string) => {
    const telLink = `tel:${phoneNumber}`
    window.open(telLink, '_blank')
  }
  const callMenuItem = (supportInfo: SupportModel) => [
    {
      text: 'Call Us',
      onClick: () => handleCallCustomer(supportInfo.phone),
      dataTest: 'call_us'
    },
    {
      text: 'Email Us',
      onClick: () => handleEmailCustomer(supportInfo.email),
      dataTest: 'email_us'
    }
  ]
  return (
    <BottomDrawer>
      <HeaderContent
        text="Contact Support"
        onClose={handleOnClose}
        dataTest={'Contact_Support'}
      />
      {!contactDetails && isLoading ? (
        <Box
          display={'flex'}
          alignItems="center"
          justifyContent={'center'}
          height={'300px'}
          data-test={testIds.loadingIndicator}
        >
          <LoaderWithMessage
            loadingText={t.pleaseWait}
            loadingSubText={t.fetchingTrackLoaderSubtext}
          />
        </Box>
      ) : (
        <Box mt={'20px'}>
          <Typography
            text={t.contactSupprtText}
            fontWeight="400"
            fontSize="12px"
            dataTest={'contactSupprtText'}
          />
          <Box mt={'20px'}>
            {callMenuItem(contactDetails!).map((menuItem, index) => (
              <Button
                key={index}
                text={menuItem.text}
                handleClick={menuItem.onClick}
                dataTest={menuItem.dataTest}
              />
            ))}
          </Box>
        </Box>
      )}
    </BottomDrawer>
  )
}
export default contactSupport
