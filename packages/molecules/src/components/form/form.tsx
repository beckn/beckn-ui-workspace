import React, { useEffect, useState } from 'react'
import { FormControl, Box } from '@chakra-ui/react'

//Custom
import { Input, Button } from '../index'
import { InputTypeEnum } from '../types'
import { FormErrors, FormField, FormProps, FormData } from './form.types'

const Form = <T extends FormField[]>({
  onSubmit,
  onFieldChange,
  fields,
  submitButton,
  values,
  onChange
}: FormProps<T>) => {
  const [formData, setFormData] = useState<FormData<T>>(values || ({} as FormData<T>))
  const [formErrors, setFormErrors] = useState<FormErrors>({})
  const { type, disabled, ...restButtonProps } = submitButton

  useEffect(() => {
    if (values) setFormData(values)
  }, [values])

  useEffect(() => {
    if (onChange) onChange(formData)
  }, [])

  const validateField = (name: string, value: any): string | undefined => {
    const field = fields.find(f => f.name === name)
    if (field && field.validate) {
      return field.validate(value)
    }
  }

  const handleChange = (name: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target.value
    const error = validateField(name, value)

    const newFormData = {
      ...formData,
      [name]: value
    }

    setFormData(newFormData)

    if (onChange) onChange(newFormData)

    if (error) {
      setFormErrors({
        ...formErrors,
        [name]: error
      })
    } else {
      delete formErrors[name]
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    let valid = true
    const newErrors: FormErrors = {}

    fields.forEach(field => {
      const error = validateField(field.name, formData[field.name as keyof FormData<T>])
      if (error) {
        valid = false
        newErrors[field.name] = error
      }
    })

    setFormErrors(newErrors)

    if (valid) {
      onSubmit(formData)
    }
  }

  const renderFormFields = (field: FormField) => {
    let content
    const type = field.type as InputTypeEnum
    switch (type) {
      case InputTypeEnum.Text:
      case InputTypeEnum.Email:
      case InputTypeEnum.Number:
        content = (
          <Input
            name={field.name}
            value={formData[field.name as keyof FormData<T>]}
            type={field.type}
            handleChange={handleChange(field.name)}
            className={field.className}
            label={field.label}
            error={formErrors[field.name]}
          />
        )
        break
      default:
        content = null
    }
    return content
  }

  return (
    <Box>
      <form onSubmit={handleSubmit}>
        {fields.map(field => (
          <FormControl
            key={field.name}
            isRequired
            mt={4}
            isInvalid={!!formErrors[field.name]}
          >
            {renderFormFields(field)}
          </FormControl>
        ))}
        <Button
          {...restButtonProps}
          type="submit"
          disabled={Object.keys(formErrors).length !== 0}
        />
      </form>
    </Box>
  )
}

export default Form
