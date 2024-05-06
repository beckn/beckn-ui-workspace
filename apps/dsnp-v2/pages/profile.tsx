import { BecknAuth } from '@beckn-ui/becknified-components'
import Cookies from 'js-cookie'
import { Box } from '@chakra-ui/react'
import { profilePageProp } from '@components/signIn/SignIn.types'
import { useLanguage } from '@hooks/useLanguage'
import { FormErrors, profileValidateForm } from '@utils/form-utils'
import React, { useEffect, useState } from 'react'

const ProfilePage = () => {
  const { t } = useLanguage()
  const bearerToken = Cookies.get('authToken')
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL
  const [isLoading,setIsLoading] = useState(false);
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

  useEffect(()=>{
    const myHeaders = new Headers()
    myHeaders.append('Authorization', `Bearer ${bearerToken}`)

    const requestOptions: RequestInit = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    }
    setIsLoading(true)

    fetch(`${strapiUrl}/profiles?populate[0]=documents.attachment&populate[1]=skills`, requestOptions)
    .then(response => response.json())
    .then((result)=>{
      const {name,phone} = result.data.attributes
      setFormData({
        ...formData,
        name,
        mobileNumber:phone
      })
    }).finally(()=>{

    setIsLoading(false)
    })

  },[])


  const updateProfile = ()=>{
    const myHeaders = new Headers()
    myHeaders.append('Authorization', `Bearer ${bearerToken}`)
    
    setIsLoading(true)

    const currentFormData = new FormData();
const data = {
  name:formData.name,
  phone:formData.mobileNumber,
  address: "TX, DALLAS",
  documents: {
    set: [6]
  },
  skills: {
    set: [1]
  }
};

currentFormData.append('data', JSON.stringify(data));

    const requestOptions: RequestInit = {
      method: 'POST',
      headers: myHeaders,
      redirect: 'follow',
      body:currentFormData
     }

    fetch(`${strapiUrl}/profiles`, requestOptions)
    .then(response => response.json())
    .then((result)=>{
      // console.log('Dank 2',result)
      // const {name,phone} = result.data.attributes
      

    }).finally(()=>{
      setIsLoading(false)


    })
  }

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
          loader: { text: "Updating profile" },
          buttons: [
            {
              text: t.saveContinue,
              handleClick: () => {
                console.log("Dank",formData)
                updateProfile()

              },
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
        isLoading={isLoading}
      />
    </Box>
  )
}

export default ProfilePage
