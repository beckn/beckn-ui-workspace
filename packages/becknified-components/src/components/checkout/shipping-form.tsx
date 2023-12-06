import React from 'react'
import { Form, FormField } from '@beckn-ui/molecules'
import { ShippingFormProps } from './checkout.types'

const fieldConfig: FormField[] = [
  {
    name: 'name',
    type: 'text',
    label: 'Name'
  },
  {
    name: 'mobileNumber',
    type: 'number',
    label: 'Mobile Number'
  },
  {
    name: 'email',
    type: 'email',
    label: 'Email ID'
  },
  {
    name: 'address',
    type: 'text',
    label: 'Complete Address'
  },
  {
    name: 'pinCode',
    type: 'text',
    label: 'Zip Code'
  }
]

const ShippingForm: React.FC<ShippingFormProps<FormField[]>> = ({ onSubmit, submitButton }) => {
  return (
    <div style={{ marginTop: '10px' }}>
      <Form
        fields={fieldConfig}
        onSubmit={onSubmit}
        submitButton={submitButton}
      />
    </div>
  )
}

export default ShippingForm
