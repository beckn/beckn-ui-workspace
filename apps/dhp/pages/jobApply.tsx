import { Box, Text, Flex } from '@chakra-ui/react'
import axios from 'axios'
import Cookies from 'js-cookie'
import Router, { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import Button from '../components/button/Button'
import JobApply from '../components/jobApply/JobApply'
import { JobApplyFormData, JobCredential } from '../components/jobApply/JobApply.types'
import { JobInfo } from '../components/jobSearch/JobsSearch.types'
import UploadFile from '../components/uploadFile/UploadFile'
import { useLanguage } from '../hooks/useLanguage'
import { fromBinary } from '../utilities/common-utils'

const jobApply = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [formData, setFormData] = useState<JobApplyFormData>({
    name: '',
    mobileNumber: '',
    email: ''
  })
  const { t } = useLanguage()
  const router = useRouter()
  const [jobForApply, setJobForApply] = useState<JobInfo | null>(null)
  const [creds, setCreds] = useState<JobCredential[]>([])

  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL
  const dsepUrl = process.env.NEXT_PUBLIC_DSEP_URL

  useEffect(() => {
    const { jobDetails } = router.query
    if (jobDetails) {
      setJobForApply(JSON.parse(fromBinary(window.atob(jobDetails as string))))
    }
  }, [router.isReady])

  if (!jobForApply) {
    return <></>
  }

  const handleButtonClick = async () => {
    const { name, mobileNumber } = formData
    const formDataForPayload = new FormData()

    formDataForPayload.append('name', name)
    formDataForPayload.append('phone', mobileNumber)

    for (let i = 0; i < selectedFiles.length; i++) {
      formDataForPayload.append('documents', selectedFiles[i])
    }

    const bearerToken = Cookies.get('authToken')
    const axiosConfig = {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
        'Content-Type': 'application/json' // You can set the content type as needed
      }
    }

    // const formSubmissionResponse = await axios.post(`${strapiUrl}/profiles`, formDataForPayload, axiosConfig)
    // if (formSubmissionResponse.data === 'OK') {
    //   const fetchProfilesResponse = await axios.get(`${strapiUrl}/profiles`, axiosConfig)
    //   let docCredArray: JobCredential[] = []
    //   fetchProfilesResponse.data.documents.map((doc: any) => {
    //     docCredArray.push({ url: doc.url, type: doc.mime })
    //   })
    //   setCreds(docCredArray)
    //   const mockPayload = {
    //     context: {
    //       transactionId: jobForApply.transactionId,
    //       bppId: jobForApply.bppId,
    //       bppUri: jobForApply.bppUri
    //     },
    //     companyId: '1',
    //     jobs: {
    //       jobId: jobForApply.jobId
    //     },
    //     jobFulfillments: [
    //       {
    //         JobFulfillmentCategoryId: '1',
    //         jobApplicantProfile: {
    //           name: formData.name,
    //           languages: ['ENG', 'HIN'],
    //           profileUrl: 'https://linkedin.com/john-doe',
    //           creds: docCredArray,
    //           skills: ['NodeJS', 'React', 'Project Management', 'Enterprise Architecture']
    //         }
    //       }
    //     ]
    //   }
    //   axios
    //     .post(`${dsepUrl}/job/init`, mockPayload)
    //     .then(res => console.log(res))
    //     .catch(err => console.error(err))
    //   console.log('jobSforApply', jobForApply)
    // }

    Router.push('/applicationSent')
  }

  return (
    <Box className="hideScroll" maxH={'calc(100vh - 100px)'} overflowY="scroll">
      <Box pb={'20px'}>
        <JobApply formData={formData} setFormData={setFormData} />
        <Text pb={'10px'} fontSize={'15px'}>
          {t.docText}
        </Text>
        <UploadFile selectedFiles={selectedFiles} setSelectedFiles={setSelectedFiles} />
      </Box>
      <Flex alignItems={'baseline'} pb="30px">
        <input type="checkbox" style={{ position: 'relative', top: '2px' }} />
        <Text fontSize={'12px'} pl="10px">
          {t.declarationText}
        </Text>
      </Flex>
      <Button
        buttonText={t.applyBtnText}
        background={'rgba(var(--color-primary))'}
        color={'rgba(var(--text-color))'}
        handleOnClick={handleButtonClick}
        isDisabled={false}
      />
    </Box>
  )
}

export default jobApply
