import { isEmpty } from '@utils/common-utils'
import React, { useEffect, useState } from 'react'
import { FormDetails } from './DyForm.types'
import { Input, Button, InputTypeEnum, Loader } from '@beckn-ui/molecules'
import parse from 'html-react-parser'
import { Checkbox, Box, useToast } from '@chakra-ui/react'
import { CustomToast } from '@components/signIn/SignIn'

function replaceDynamicText(template, variables) {
  // Ensure template starts as a string
  let result = template

  // Replace each placeholder with the corresponding variable
  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`\\$\\$${key}\\$\\$`, 'g')
    result = result.replace(regex, value)
  })

  return result
}

interface DyFormProps {
  htmlForm: string
  onSubmit: (isFormSubmitted: boolean) => void
  onError: (isError: boolean, error: any) => void
  formId: string
  handleCancel: () => void
}

function capitalizeFirstLetter(name: string) {
  return name.charAt(0).toUpperCase() + name.slice(1)
}

const extractFormDetails = (htmlString: string) => {
  const parser = new DOMParser()
  const doc = parser.parseFromString(htmlString, 'text/html')
  const form = doc.querySelector('form')
  const labels = form.querySelectorAll('label')
  const inputs = form.querySelectorAll('input')
  const buttons = form.querySelectorAll('button')
  const staticTexts = doc.querySelectorAll('h2, p')

  const labelMap: any = {}
  labels.forEach((label: any) => {
    const inputId = label.htmlFor
    if (inputId) {
      labelMap[inputId] = label.textContent.trim()
    }
  })

  const inputDetails = Array.from(inputs).map(input => ({
    type: input.type,
    id: input.id,
    name: input.name,
    required: input.hasAttribute('required'),
    value: input.value,
    label: labelMap[input.id] || capitalizeFirstLetter(input.name)
  }))

  const buttonDetails = Array.from(buttons).map(button => ({
    id: `btn${button.textContent}`,
    type: button.type,
    text: button.textContent,
    variant: button.textContent?.toLocaleLowerCase() === 'cancel' ? 'outline' : 'solid'
  }))

  const textBlocks = Array.from(staticTexts).map(text => ({
    tag: text.tagName.toLowerCase(),
    content: text.innerHTML
  }))

  const formDetails = {
    action: form.querySelector('input[name="action"]').value,
    method: form.querySelector('input[name="method"]').value,
    inputs: inputDetails,
    buttons: buttonDetails,
    texts: textBlocks
  }

  return formDetails
}

const DyForm: React.FC<DyFormProps> = ({ htmlForm, onSubmit, onError, formId, setLoading, handleCancel }) => {
  const toast = useToast()
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

      if (!response.ok) {
        let { error } = await response.json()

        throw new Error(error)
      }

      const result = await response.json()
      onSubmit(true)
      setIsLoading(false)
    } catch (error) {
      console.error('Error:', error)
      onError(true, error)

      toast({
        render: () => (
          <CustomToast
            title="Error!"
            message={`${error}`}
          />
        ),
        position: 'top',
        duration: 2000,
        isClosable: true
      })

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
            // value={formData[input.name]}
            // onChange={handleChange}
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
    <div>
      {formDetails.texts.map((text, index) => {
        const CustomTag = text.tag
        // return <CustomTag key={index}>{replaceDynamicText(parse(text.content),{name:formData.name || '',companyName:"Eminds"})}</CustomTag>
        return (
          <CustomTag key={index}>
            {parse(text.content, {
              transform(reactNode, domNode, index) {
                let updatedNode = reactNode
                if (typeof reactNode === 'string') {
                  updatedNode = replaceDynamicText(reactNode, { name: formData.name || '', companyName: '' })
                }
                return updatedNode
              }
            })}
          </CustomTag>
        )
      })}
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
            id={button.id}
            key={button.text}
            type={button.type}
            text={button.text}
            variant={button.variant}
            handleClick={button.text.toLowerCase() === 'cancel' ? handleCancel : undefined}
          />
        ))}
      </form>
    </div>
  )
}

export default DyForm
