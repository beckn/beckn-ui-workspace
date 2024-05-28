import { Box } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import React, { FC, useEffect } from 'react'
import styles from './apply-job.module.css'
import axios from 'axios'

export interface ApplyJobPropsModel {
  xInputHtml: string
  onFormSubmit: () => void
}

const ApplyJobForm: FC<ApplyJobPropsModel> = ({ xInputHtml = '', onFormSubmit }) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const router = useRouter()

  const handleSubmit = (event: any) => {
    event.preventDefault()
    const formData = new FormData(event.target)

    const name = formData.get('name')
    const mobile = formData.get('mobile')
    const email = formData.get('email')

    const formUrl = formData.get('action')

    const fileDocuments = formData.getAll('document')
    console.log('fileDocuments--> ', fileDocuments)

    axios
      .post(`${apiUrl}/x-input/submit`, {
        message: {
          form_id: 'dsepJobsApplyForm',
          name,
          mobile,
          email
        },
        action: formUrl,
        method: 'post'
      })
      .then(res => {
        if (res.status === 200 && res.data) {
          onFormSubmit()
          // router.push('/applicationSent')
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
        className={`${styles.form_container}`}
      ></Box>
    </>
  )
}

export default ApplyJobForm
