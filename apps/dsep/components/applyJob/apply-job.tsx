import { Box } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import React, { FC, useEffect } from 'react'
import styles from './apply-job.module.css'
import axios from 'axios'

export interface ApplyJobPropsModel {
  xInputHtml: string
}

const ApplyJobForm: FC<ApplyJobPropsModel> = ({ xInputHtml = '' }) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const router = useRouter()

  const handleSubmit = (event: any) => {
    event.preventDefault()
    const formData = new FormData(event.target)

    const name = formData.get('name')
    const mobile = formData.get('mobile')
    const email = formData.get('email')

    const formUrl = formData.get('action')

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
          router.push('/applicationSent')
        }
      })
      .catch(e => console.error(e))
  }

  useEffect(() => {
    const form = document.getElementById('xinputform')
    form!.addEventListener('submit', handleSubmit)
    return () => form!.removeEventListener('submit', handleSubmit)
  }, [])

  return (
    <>
      <Box
        className={`${styles.form_container}`}
        dangerouslySetInnerHTML={{ __html: xInputHtml }}
      ></Box>
    </>
  )
}

export default ApplyJobForm
