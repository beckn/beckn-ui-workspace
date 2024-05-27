import { Box } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import React, { FC, useEffect, useState } from 'react'
import { ApplyScholarshipPropsModel } from './apply-scholarship.types'
import styles from './apply-scholarship.module.css'
import axios from 'axios'

const ApplyScholarshipForm: FC<ApplyScholarshipPropsModel> = ({ xInputHtml = '' }) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const router = useRouter()

  const handleSubmit = (event: any) => {
    event.preventDefault()
    const formData = new FormData(event.target)

    const name = formData.get('name')
    const mobile = formData.get('mobile')
    const reason = formData.get('reason')
    const email = formData.get('email')
    const address = formData.get('address')
    const zipcode = formData.get('zipcode')

    const formUrl = formData.get('action')

    const fileDocuments = formData.getAll('document')
    console.log('fileDocuments--> ', fileDocuments)

    axios
      .post(`${apiUrl}/x-input/submit`, {
        message: {
          form_id: 'dsepScholarshipDetailsForm',
          name,
          mobile,
          reason,
          email,
          address,
          zipcode
        },
        action: formUrl,
        method: 'post'
      })
      .then(res => {
        if (res.status === 200 && res.data) {
          router.push(`/scholarshipConfirmationPage?id=${res.data.id}`)
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
      {/* <button className={styles.jjj}>My button</button> */}
    </>
  )
}

export default ApplyScholarshipForm
