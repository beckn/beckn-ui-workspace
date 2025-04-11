import React from 'react'
import { FormControl, FormLabel, Input, FormErrorMessage } from '@chakra-ui/react'

interface InputSchema {
  type?: string
  name: string
  value: string | number
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  label: string
  placeholder?: string
  error?: string
  dataTest?: string
}

interface FormFieldInputProps {
  schema: InputSchema[]
}

const FormFieldInput: React.FC<FormFieldInputProps> = ({ schema }) => {
  return (
    <>
      {schema.map((field, index) => (
        <FormControl
          key={index}
          mb="0.5rem"
          isInvalid={!!field.error}
        >
          <FormLabel>{field.label}</FormLabel>
          <Input
            type={field.type || 'text'}
            name={field.name}
            placeholder={field.placeholder || field.label}
            value={field.value}
            onChange={field.handleChange}
            data-test={field.dataTest}
            sx={{
              _focusVisible: {
                zIndex: 0,
                borderColor: '#3182ce',
                boxShadow: '0 0 0 1px #3182ce'
              }
            }}
          />
          {field.error && (
            <FormErrorMessage
              position="absolute"
              mt="0px"
            >
              {field.error}
            </FormErrorMessage>
          )}
        </FormControl>
      ))}
    </>
  )
}

export default FormFieldInput
