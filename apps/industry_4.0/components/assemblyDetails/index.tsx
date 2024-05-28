import { Box } from '@chakra-ui/react'
import axios from 'axios'
import Router, { useRouter } from 'next/router'
import React, { FC, useEffect } from 'react'
import styles from './assembly-details.module.css'

export interface AssemblyDetailsPropsModel {
  xInputHtml: string
}

const AssemblyDetails: FC<AssemblyDetailsPropsModel> = ({ xInputHtml }) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const router = useRouter()

  const handleSubmit = (event: any) => {
    event.preventDefault()
    const formData = new FormData(event.target)

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
          router.push('/checkoutPage')
        }
      })
      .catch(e => console.error(e))
  }

  useEffect(() => {
    const range = document.createRange()
    const documentFragment = range.createContextualFragment(xInputHtml)
    const xInputContainer = document.getElementById('x-input-container')
    if (xInputContainer) {
      xInputContainer.appendChild(documentFragment)
    }

    const form = document.getElementById('xinputform')
    form!.addEventListener('submit', handleSubmit)
    return () => form!.removeEventListener('submit', handleSubmit)
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
