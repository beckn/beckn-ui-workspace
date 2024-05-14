import { isEmpty } from '@utils/common-utils'
import React, { useEffect, useState } from 'react'
import { FormDetails } from './DyForm.types'
import { Input, Button, InputTypeEnum, Loader } from '@beckn-ui/molecules'
import { Checkbox, Box } from '@chakra-ui/react'

interface DyFormProps {
  htmlForm: string
  onSubmit: (isFormSubmitted: boolean) => void
  onError: (isError: boolean, error: any) => void
  formId: string
}

function capitalizeFirstLetter(name: string) {
  return name.charAt(0).toUpperCase() + name.slice(1)
}

const extractFormDetails = (htmlString: string) => {
  const parser = new DOMParser()
  const doc = parser.parseFromString(htmlString, 'text/html')
  const form = doc.querySelector('form')
  const inputs = form.querySelectorAll('input')
  const buttons = form.querySelectorAll('button')

  const inputDetails = Array.from(inputs).map(input => ({
    type: input.type,
    id: input.id,
    name: input.name,
    required: input.hasAttribute('required'),
    value: input.value,
    label: capitalizeFirstLetter(input.name)
  }))

  const buttonDetails = Array.from(buttons).map(button => ({
    type: button.type,
    text: button.textContent
  }))

  const formDetails = {
    action: form.querySelector('input[name="action"]').value,
    method: form.querySelector('input[name="method"]').value,
    inputs: inputDetails,
    buttons: buttonDetails
  }

  return formDetails
}

const DyForm: React.FC<DyFormProps> = ({ htmlForm, onSubmit, onError, formId, setLoading }) => {
  const [formDetails, setFormDetails] = useState<FormDetails>({})

  const [formData, setFormData] = useState({})

  const [isLoading, setIsLoading] = useState(false)

  const handleChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const response = await fetch(formDetails.action, {
        method: formDetails.method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: { ...formData, form_id: formId }
        })
      })
      const result = await response.json()
      onSubmit(true)
      setIsLoading(false)
      console.log('Response:', result)
    } catch (error) {
      console.error('Error:', error)
      onError(true, error)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    setFormDetails(extractFormDetails(htmlForm) as FormDetails)
  }, [])

  if (isEmpty(formDetails)) return

  const renderFormFields = (input: any) => {
    let content
    const type = input.type as InputTypeEnum
    switch (type) {
      case InputTypeEnum.Text:
      case InputTypeEnum.Email:
      case InputTypeEnum.Number:
        content = (
          <Input
            name={input.name}
            value={formData[input.name] || ''}
            type={input.type}
            handleChange={handleChange}
            label={input.label}
          />
        )
        break
      case InputTypeEnum.Checkbox:
        content = (
          <Checkbox
            name="input.name"
            value={formData[input.name]}
            onChange={handleChange}
          >
            {input.label}
          </Checkbox>
        )
        break
      default:
        content = null
    }
    return content
  }

  if (isLoading) {
    return (
      <Box
        display="flex"
        // height="100vh"
        justifyContent="center"
        transform="translateY(-20%)"
      >
        <Loader text={'Submitting form'} />
      </Box>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      {formDetails.inputs
        .filter(input => input.type !== 'hidden')
        .map(input => (
          <Box
            pb="0.7rem"
            key={input.id}
          >
            {renderFormFields(input)}
          </Box>
        ))}
      {formDetails.buttons.map(button => (
        <Button
          key={button.text}
          type={button.type}
          text={button.text}
        />
      ))}
    </form>
  )
}

export default DyForm
