import React, { useState } from 'react'
import ShippingForm from '@beckn-ui/becknified-components/src/components/checkout/shipping-form'
import { Box } from '@chakra-ui/react'

const UpdateShippingDetails = () => {
  const [shippingDetails, setShippingDetails] = useState({
    name: '',
    mobileNumber: '',
    email: '',
    address: '',
    pinCode: ''
  })

  const handleSubmit = (formData: any) => {
    console.log('Submitted data:', formData)
  }

  const handleFormChange = (changedData: any) => {
    setShippingDetails(prevDetails => ({ ...prevDetails, ...changedData }))
  }

  return (
    <Box
      className="hideScroll"
      maxH={'calc(100vh - 100px)'}
      overflowY="scroll"
    >
      <ShippingForm
        onSubmit={handleSubmit}
        values={shippingDetails}
        onChange={handleFormChange}
        submitButton={{ text: 'Submit' }}
      />
    </Box>
  )
}

export default UpdateShippingDetails
