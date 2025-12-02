import { Box } from '@chakra-ui/react'
import axios from '../../services/axios'
import { useRouter } from 'next/router'
import React, { FC, useEffect } from 'react'
import styles from './assembly-details.module.css'

export interface AssemblyDetailsPropsModel {
  xInputHtml: string
  updateCatalogue?: (quantity: number, callback: () => void) => void
}

const AssemblyDetails: FC<AssemblyDetailsPropsModel> = ({ xInputHtml, updateCatalogue }) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const router = useRouter()

  const validateForm = (formData: FormData): boolean => {
    const errors: Record<string, string> = {}

    // Required fields
    const requiredFields = ['length', 'width', 'quantity', 'weight']

    requiredFields.forEach(field => {
      const value = formData.get(field)
      if (!value || value === '') {
        errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`
      } else if (isNaN(Number(value)) || Number(value) <= 0) {
        errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} must be a positive number`
      }
    })

    // Display validation errors in the UI
    if (Object.keys(errors).length > 0) {
      // Reset previous error messages
      document.querySelectorAll('.error-message').forEach(el => el.remove())

      // Add new error messages
      Object.entries(errors).forEach(([field, message]) => {
        const inputElement = document.getElementById(field)
        if (inputElement) {
          const errorElement = document.createElement('div')
          errorElement.className = 'error-message'
          errorElement.textContent = message
          errorElement.style.color = 'red'
          errorElement.style.fontSize = '12px'
          errorElement.style.marginTop = '-15px'
          errorElement.style.marginBottom = '15px'

          // Special handling for quantity field which is in a different container
          if (field === 'quantity') {
            // Find the parent with class 'quantity-controls'
            const quantityControlsDiv = inputElement.closest('.quantity-controls')
            if (quantityControlsDiv) {
              // Insert after the quantity-controls div
              quantityControlsDiv.parentNode?.insertBefore(errorElement, quantityControlsDiv.nextSibling)
            } else {
              // Fallback to default insertion
              inputElement.parentNode?.insertBefore(errorElement, inputElement.nextSibling)
            }
          } else {
            // Regular insertion for other fields
            inputElement.parentNode?.insertBefore(errorElement, inputElement.nextSibling)
          }
        }
      })

      return false
    }

    return true
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.target as HTMLFormElement)

    // Validate form
    if (!validateForm(formData)) {
      return
    }

    const type = formData.get('type')
    const colour = formData.get('colour')
    const shape = formData.get('shape')
    const length = formData.get('length')
    const width = formData.get('width')
    const quantity = formData.get('quantity')
    const weight = formData.get('weight')

    const formUrl = formData.get('action')

    axios
      .post(`${apiUrl}/x-input/submit`, {
        message: {
          form_id: 'industryAssemblyDetailsForm',
          type,
          colour,
          shape,
          length,
          width,
          quantity,
          weight
        },
        action: formUrl,
        method: 'post'
      })
      .then(res => {
        if (res.status === 200 && res.data) {
          const formDataToStore = res.data.form_data
          localStorage.setItem('assemblyDetails', JSON.stringify(formDataToStore))
          updateCatalogue?.(Number(quantity), () => {
            router.push('/checkoutPage')
          })
        }
      })
      .catch(e => {
        console.error(e)
        // Show a generic error message
        alert('An error occurred. Please make sure all fields are filled correctly.')
      })
  }

  useEffect(() => {
    const range = document.createRange()
    const documentFragment = range.createContextualFragment(xInputHtml)
    const xInputContainer = document.getElementById('x-input-container')
    if (xInputContainer) {
      xInputContainer.appendChild(documentFragment)
    }

    // Add validation styles to the page
    const styleElement = document.createElement('style')
    styleElement.textContent = `
      .error-message {
        color: red;
        font-size: 12px;
        margin-top: -15px;
        margin-bottom: 15px;
      }
      input.error, select.error {
        border-bottom: 1px solid red !important;
      }
    `
    document.head.appendChild(styleElement)

    const form = document.getElementById('xinputform')
    if (form) {
      form.addEventListener('submit', handleSubmit as unknown as EventListener)

      // Add input field validation on blur
      const requiredFields = ['length', 'width', 'quantity', 'weight']
      requiredFields.forEach(field => {
        const inputElement = document.getElementById(field)
        if (inputElement) {
          inputElement.addEventListener('blur', () => {
            const value = (inputElement as HTMLInputElement).value
            if (!value || value === '' || isNaN(Number(value)) || Number(value) <= 0) {
              inputElement.classList.add('error')

              // Check if there's already an error message
              let errorElement: Element | null = null

              if (field === 'quantity') {
                // For quantity, look for error message after quantity-controls div
                const quantityControlsDiv = inputElement.closest('.quantity-controls')
                if (quantityControlsDiv) {
                  let nextSibling = quantityControlsDiv.nextSibling
                  while (nextSibling) {
                    if (nextSibling instanceof Element && nextSibling.classList.contains('error-message')) {
                      errorElement = nextSibling
                      break
                    }
                    nextSibling = nextSibling.nextSibling
                  }
                }
              } else {
                // For other fields, check next sibling
                const nextSibling = inputElement.nextSibling
                if (nextSibling instanceof Element && nextSibling.classList.contains('error-message')) {
                  errorElement = nextSibling
                }
              }

              // If no error message exists, create one
              if (!errorElement) {
                errorElement = document.createElement('div')
                errorElement.className = 'error-message'
                const errorDiv = errorElement as HTMLDivElement
                errorDiv.style.color = 'red'
                errorDiv.style.fontSize = '12px'
                errorDiv.style.marginTop = '-15px'
                errorDiv.style.marginBottom = '15px'

                if (field === 'quantity') {
                  // For quantity field
                  const quantityControlsDiv = inputElement.closest('.quantity-controls')
                  if (quantityControlsDiv) {
                    quantityControlsDiv.parentNode?.insertBefore(errorElement, quantityControlsDiv.nextSibling)
                  } else {
                    inputElement.parentNode?.insertBefore(errorElement, inputElement.nextSibling)
                  }
                } else {
                  // For other fields
                  inputElement.parentNode?.insertBefore(errorElement, inputElement.nextSibling)
                }
              }

              errorElement.textContent = `${field.charAt(0).toUpperCase() + field.slice(1)} must be a positive number`
            } else {
              inputElement.classList.remove('error')

              // Remove existing error message if any
              if (field === 'quantity') {
                // For quantity, remove error after quantity-controls div
                const quantityControlsDiv = inputElement.closest('.quantity-controls')
                if (quantityControlsDiv) {
                  let nextSibling = quantityControlsDiv.nextSibling
                  while (nextSibling) {
                    if (nextSibling instanceof Element && nextSibling.classList.contains('error-message')) {
                      nextSibling.remove()
                      break
                    }
                    nextSibling = nextSibling.nextSibling
                  }
                }
              } else {
                // For other fields, remove next sibling if it's an error message
                const nextSibling = inputElement.nextSibling
                if (nextSibling instanceof Element && nextSibling.classList.contains('error-message')) {
                  nextSibling.remove()
                }
              }
            }
          })
        }
      })

      return () => {
        form.removeEventListener('submit', handleSubmit as unknown as EventListener)
        document.head.removeChild(styleElement)
      }
    }
  }, [])

  return (
    <>
      <Box
        id="x-input-container"
        className={`hideScroll ${styles.form_container}`}
      ></Box>
    </>
  )
}

export default AssemblyDetails
