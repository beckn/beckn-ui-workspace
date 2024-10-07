import ShippingForm from '@beckn-ui/becknified-components/src/components/checkout/shipping-form'
import { Box } from '@chakra-ui/react'
import { testIds } from '@shared/dataTestIds'
import React, { FC, useState } from 'react'

interface UpdateAddressDetailFormPropsModel {
  handleFormSubmit: (formData: any) => void
}

const UpdateAddressDetailForm: FC<UpdateAddressDetailFormPropsModel> = props => {
  const { handleFormSubmit } = props
  const [shippingDetails, setShippingDetails] = useState({
    name: '',
    mobileNumber: '',
    email: '',
    address: '',
    pinCode: ''
  })

  const handleFormChange = (changedData: any) => {
    setShippingDetails(prevDetails => ({ ...prevDetails, ...changedData }))
  }

  return (
    <Box data-test={testIds.orderDetailspage_updateShippingDetails}>
      <ShippingForm
        onSubmit={handleFormSubmit}
        values={shippingDetails}
        onChange={handleFormChange}
        //   TODO :- I have to add loader in this button when address is updating
        submitButton={{ text: 'Update' }}
      />
    </Box>
  )
}

export default UpdateAddressDetailForm
