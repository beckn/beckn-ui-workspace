import React from 'react'
import { Form, FormField } from '@beckn-ui/molecules'
import { ShippingFormInitialValuesType, ShippingFormProps } from './checkout.types'

const fieldConfig: FormField[] = [
  {
    name: 'name',
    label: 'Name',
    type: 'text',
    validate: (value: string) => {
      if (!value.trim()) return 'Name is required'
      return undefined
    }
  },
  {
    name: 'mobileNumber',
    label: 'Mobile Number',
    type: 'number',
    validate: (value: string) => {
      if (!value.trim()) return 'Mobile number is required'
      if (!/^\d{10}$/.test(value)) return 'Invalid mobile number'
      return undefined
    }
  },
  {
    name: 'email',
    label: 'Email ID',
    type: 'email',
    validate: (value: string) => {
      if (!value.trim()) return 'Email ID is required'
      if (!/\S+@\S+\.\S+/.test(value)) return 'Invalid email format'
      return undefined
    }
  },
  {
    name: 'address',
    label: 'Complete Address',
    type: 'text',
    validate: (value: string) => {
      if (!value.trim()) return 'Address is required'
      return undefined
    }
  },
  {
    name: 'pinCode',
    label: 'Zip Code',
    type: 'text',
    validate: (value: string) => {
      if (!value.trim()) return 'Zip Code is required'
      if (!/^\d{6}$/.test(value)) return 'Invalid Zip Code'
      return undefined
    }
  }
]

const ShippingForm: React.FC<ShippingFormProps<FormField[]>> = ({ onSubmit, submitButton, values, onChange }) => {
  return (
    <div style={{ marginTop: '10px' }}>
      <Form
        fields={fieldConfig}
        onSubmit={onSubmit}
        submitButton={submitButton}
        values={values}
        onChange={data => {
          if (onChange) onChange(data as ShippingFormInitialValuesType)
        }}
      />
    </div>
  )
}

export default ShippingForm
