import { BecknAuth } from '@beckn-ui/becknified-components'
import { Box } from '@chakra-ui/react'
import { profilePageProp } from '@components/signIn/SignIn.types'
import { useLanguage } from '@hooks/useLanguage'
import React, { useState } from 'react'

const ProfilePage = () => {
  const { t } = useLanguage()
  const [formData, setFormData] = useState<profilePageProp>({
    name: '',
    mobileNumber: '',
    email: '',
    flatNumber: '',
    street: '',
    city: '',
    pincode: '',
    state: '',
    country: ''
  })
  const [formErrors, setFormErrors] = useState<profilePageProp>({
    name: '',
    mobileNumber: '',
    email: '',
    flatNumber: '',
    street: '',
    city: '',
    pincode: '',
    state: '',
    country: ''
  })
  return (
    <Box mt="-20px">
      <BecknAuth
        schema={{
          buttons: [
            {
              text: t.saveContinue,
              handleClick: () => {},
              disabled: false,
              variant: 'solid',
              colorScheme: 'primary'
            }
          ],
          inputs: [
            {
              type: 'text',
              name: 'name',
              value: formData.name,
              handleChange: () => {},
              label: t.fullName,
              error: formErrors.name
            },
            {
              type: 'number',
              name: 'mobileNumber',
              value: formData.mobileNumber,
              handleChange: () => {},
              label: t.enterMobileNumber,
              error: formErrors.mobileNumber
            },
            {
              type: 'text',
              name: 'email',
              value: formData.email,
              handleChange: () => {},
              label: t.enterEmailID,
              error: formErrors.email
            },
            {
              type: 'text',
              name: 'enterFlatDetails',
              value: formData.flatNumber,
              handleChange: () => {},
              label: t.enterFlatDetails,
              error: formErrors.flatNumber
            },
            {
              type: 'text',
              name: 'enterStreetDetails',
              value: formData.street,
              handleChange: () => {},
              label: t.enterStreetDetails,
              error: formErrors.street
            },
            {
              type: 'text',
              name: 'city',
              value: formData.city,
              handleChange: () => {},
              label: t.enterCity,
              error: formErrors.city
            },
            {
              type: 'text',
              name: 'pincode',
              value: formData.pincode,
              handleChange: () => {},
              label: t.enterPincode,
              error: formErrors.pincode
            },
            {
              type: 'text',
              name: 'state',
              value: formData.state,
              handleChange: () => {},
              label: t.enterState,
              error: formErrors.state
            },
            {
              type: 'text',
              name: 'country',
              value: formData.country,
              handleChange: () => {},
              label: t.enterCountry,
              error: formErrors.country
            }
          ]
        }}
      />
    </Box>
  )
}

export default ProfilePage
