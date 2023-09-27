import { Box, Text, Flex } from '@chakra-ui/react'
import axios from 'axios'
import Cookies from 'js-cookie'
import Router, { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import Button from '../components/button/Button'
import JobApply from '../components/jobApply/JobApply'
import { JobApplyFormData, JobCredential } from '../components/jobApply/JobApply.types'
import { JobInfo } from '../components/jobSearch/JobsSearch.types'
import Loader from '../components/loader/Loader'
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
  const [isLoading, setIsLoading] = useState(false)
  const [isDeclarationChecked, setIsDeclarationChecked] = useState(false)

  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL
  const dsepUrl = process.env.NEXT_PUBLIC_DSEP_URL
  const coreStrapiUrl = process.env.NEXT_PUBLIC_CORE_STRAPI_URL

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
    setIsLoading(true)
    const { name, mobileNumber } = formData

    const bearerToken = Cookies.get('authToken')
    const axiosConfig = {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
        'Content-Type': 'application/json' // You can set the content type as needed
      }
    }

    try {
      let arrayOfDocumentIds: number[] = []
      const fetchDocuments = await axios.get(`${strapiUrl}/documents?populate[0]=attachment`, axiosConfig)
      if (fetchDocuments.data) {
        fetchDocuments.data.data.forEach((ele: any) => arrayOfDocumentIds.push(ele.id))
      }

      const formDataForPayload = new FormData()

      const profileCreatePayload = {
        name: name,
        phone: mobileNumber,
        documents: arrayOfDocumentIds
      }
      formDataForPayload.append('data', JSON.stringify(profileCreatePayload))

      const formSubmissionResponse = await axios.post(`${strapiUrl}/profiles`, formDataForPayload, axiosConfig)
      if (formSubmissionResponse.data) {
        const fetchProfilesResponse = await axios.get(
          `${strapiUrl}/profiles?populate[0]=documents.attachment`,
          axiosConfig
        )

        if (fetchProfilesResponse.data) {
          let docCredArray: JobCredential[] = []

          fetchProfilesResponse.data.data.attributes.documents.data.map((doc: any) => {
            if (doc.attributes.attachment.data && doc.attributes.type) {
              const docUrl = coreStrapiUrl + doc.attributes.attachment.data.attributes.url
              const docType = doc.attributes.attachment.data.attributes.mime

              docCredArray.push({
                url: docUrl,
                type: docType
              })
            }
          })

          const mockPayload = {
            jobId: jobForApply.jobId,
            context: {
              bppId: jobForApply.bppId,
              bppUri: jobForApply.bppUri,
              transactionId: jobForApply.transactionId
            },
            confirmation: {
              JobFulfillmentCategoryId: '1',
              jobApplicantProfile: {
                name: formData.name,
                languages: ['ENG', 'HIN'],
                profileUrl: 'https://linkedin.com/john-doe',
                creds: docCredArray,
                skills: ['NodeJS', 'React', 'Project Management', 'Enterprise Architecture']
              }
            }
          }
          setIsLoading(true)

          const jobConfirmResponse = await axios.post(`${dsepUrl}/job/confirm`, mockPayload)
          if (jobConfirmResponse.data) {
            setIsLoading(false)
            Router.push('/applicationSent')
          }
        }
      }
    } catch (error) {
      console.error(error)
    }
  }

  if (isLoading) {
    return <Loader loadingText="Confirming application" />
  }

  const areAllFieldsFilled = () => {
    for (const key in formData) {
      if (formData.hasOwnProperty(key)) {
        const value = formData[key]

        if (!value && value !== 0) {
          return false
        }
      }
    }
    return true
  }

  const areFilesSelected = selectedFiles.length !== 0

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
        <input
          onChange={() => setIsDeclarationChecked(prevValue => !prevValue)}
          type="checkbox"
          style={{ position: 'relative', top: '2px' }}
        />
        <Text fontSize={'12px'} pl="10px">
          {t.declarationText}
        </Text>
      </Flex>
      <Button
        buttonText={t.applyBtnText}
        background={'rgba(var(--color-primary))'}
        color={'rgba(var(--text-color))'}
        handleOnClick={handleButtonClick}
        isDisabled={!(areAllFieldsFilled() && areFilesSelected && isDeclarationChecked)}
      />
    </Box>
  )
}

export default jobApply
