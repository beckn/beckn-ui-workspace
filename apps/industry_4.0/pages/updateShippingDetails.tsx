import React, { useState } from 'react'
import ShippingForm from '@beckn-ui/becknified-components/src/components/checkout/shipping-form'

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
    <>
      <ShippingForm
        onSubmit={handleSubmit}
        values={shippingDetails}
        onChange={handleFormChange}
        submitButton={{ text: 'Submit' }}
      />
    </>
  )
}

export default UpdateShippingDetails
