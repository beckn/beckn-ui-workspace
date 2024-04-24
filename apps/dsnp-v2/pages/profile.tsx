import { BecknAuth } from '@beckn-ui/becknified-components'
import { Box } from '@chakra-ui/react'
import { profilePageProp } from '@components/signIn/SignIn.types'
import { useLanguage } from '@hooks/useLanguage'
import { FormErrors, profileValidateForm } from '@utils/form-utils'
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
    zipCode: '',
    state: '',
    country: ''
  })
  const [formErrors, setFormErrors] = useState<FormErrors>({
    name: '',
    mobileNumber: '',
    email: '',
    zipCode: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setFormData((prevFormData: profilePageProp) => ({
      ...prevFormData,
      [name]: value
    }))

    const updatedFormData = {
      ...formData,
      [name]: value
    }

    const errors = profileValidateForm(updatedFormData) as any
    setFormErrors(prevErrors => ({
      ...prevErrors,
      [name]: t[`${errors[name]}`] || ''
    }))
  }
  return (
    <Box
      margin={'0 auto'}
      mt={['-20px', '-20px', '-70px', '-70px']}
      maxW={['100%', '100%', '40rem', '40rem']}
      className="hideScroll"
      maxH={'calc(100vh - 80px)'}
      overflowY="scroll"
    >
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
              handleChange: handleInputChange,
              label: t.fullName,
              error: formErrors.name
            },
            {
              type: 'number',
              name: 'mobileNumber',
              value: formData.mobileNumber,
              handleChange: handleInputChange,
              label: t.enterMobileNumber,
              error: formErrors.mobileNumber
            },
            {
              type: 'text',
              name: 'email',
              value: formData.email,
              handleChange: handleInputChange,
              label: t.enterEmailID,
              error: formErrors.email
            },
            {
              type: 'text',
              name: 'flatNumber',
              value: formData.flatNumber,
              handleChange: handleInputChange,
              label: t.enterFlatDetails
            },
            {
              type: 'text',
              name: 'street',
              value: formData.street,
              handleChange: handleInputChange,
              label: t.enterStreetDetails
            },
            {
              type: 'text',
              name: 'city',
              value: formData.city,
              handleChange: handleInputChange,
              label: t.enterCity
            },
            {
              type: 'text',
              name: 'zipCode',
              value: formData.zipCode,
              handleChange: handleInputChange,
              label: t.enterPincode,
              error: formErrors.zipCode
            },
            {
              type: 'text',
              name: 'state',
              value: formData.state,
              handleChange: handleInputChange,
              label: t.enterState
            },
            {
              type: 'text',
              name: 'country',
              value: formData.country,
              handleChange: handleInputChange,
              label: t.enterCountry
            }
          ]
        }}
      />
    </Box>
  )
}

export default ProfilePage
