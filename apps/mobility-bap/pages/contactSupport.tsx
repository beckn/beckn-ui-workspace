import React from 'react'
import { Box } from '@chakra-ui/react'
import { Button, Typography } from '@beckn-ui/molecules'
import { useLanguage } from 'hooks/useLanguage'
import { SupportModel } from '@/components/cancel-flow/CancelFlow'
import BottomDrawer from '@/components/bottomDrawer/BottomDrawer'
import HeaderContent from '@/components/cancel-flow/HeaderContent'
const contactSupportPage = () => {
  const { t } = useLanguage()
  const supportInfo: SupportModel = {
    phone: '98111111',
    email: 'example@gmail.com'
  }
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
      onClick: () => handleCallCustomer(supportInfo.phone)
    },
    {
      text: 'Email Us',
      onClick: () => handleEmailCustomer(supportInfo.email)
    }
  ]
  return (
    <BottomDrawer>
      <HeaderContent text="Contact Support" />
      <Box mt={'20px'}>
        <Typography
          text={t.contactSupprtText}
          fontWeight="400"
          fontSize="12px"
        />
        <Box mt={'20px'}>
          {callMenuItem(supportInfo).map((menuItem, index) => (
            <Button
              key={index}
              text={menuItem.text}
              handleClick={menuItem.onClick}
            />
          ))}
        </Box>
      </Box>
    </BottomDrawer>
  )
}
export default contactSupportPage
