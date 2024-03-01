import { Box, Flex, Text } from '@chakra-ui/react'
import { JobApplyFormData, JobCredential, JobSelectResponseModel } from '../components/jobApply/JobApply.types'
import React, { useEffect, useState } from 'react'
import Router, { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import Button from '../components/button/Button'
import Cookies from 'js-cookie'
import JobApply from '../components/jobApply/JobApply'
import { JobInfo } from '../components/jobSearch/JobsSearch.types'
import Loader from '../components/loader/Loader'
import UploadFile from '../components/uploadFile/UploadFile'
import axios from 'axios'
import { fromBinary } from '../utilities/common-utils'
import { useLanguage } from '../hooks/useLanguage'

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
  const [isLoadingInSelect, setIsLoadingInSelect] = useState(true)
  const [isDeclarationChecked, setIsDeclarationChecked] = useState(false)
  const [jobSelectResponse, setJobSelectResponse] = useState<JobSelectResponseModel | null>(null)

  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL
  const dsepUrl = process.env.NEXT_PUBLIC_DSEP_URL
  const coreStrapiUrl = process.env.NEXT_PUBLIC_CORE_STRAPI_URL

  const bearerToken = Cookies.get('authToken')
  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${bearerToken}`,
      'Content-Type': 'application/json' // You can set the content type as needed
    }
  }

  useEffect(() => {
    const { jobDetails } = router.query

    if (jobDetails) {
      setJobForApply(JSON.parse(fromBinary(window.atob(jobDetails as string))))
    }
  }, [router.isReady])

  useEffect(() => {
    const email = Cookies.get('userEmail') as string
    axios
      .get(`${strapiUrl}/profiles?populate[0]=attachment`, axiosConfig)
      .then(res => {
        const profileData = res.data
        setFormData({
          email: email,
          mobileNumber: profileData.data.attributes.phone,
          name: profileData.data.attributes.name
        })
      })
      .catch(e => console.error(e))
  }, [])

  useEffect(() => {
    if (jobForApply) {
      const { companyId, jobId, bppId, bppUri, transactionId } = jobForApply
      const payloadForjobSelect = {
        companyId,
        jobs: {
          jobId
        },
        context: {
          transactionId,
          bppId,
          bppUri
        }
      }

      axios.post(`${dsepUrl}/job/select`, payloadForjobSelect).then(res => {
        setJobSelectResponse(res.data)
        setIsLoadingInSelect(false)
      })
    }
  }, [jobForApply])

  if (!jobForApply) {
    return <></>
  }

  const handleButtonClick = async () => {
    setIsLoading(true)
    const { name, mobileNumber } = formData

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

          if (jobSelectResponse) {
            const { context, selectedJobs } = jobSelectResponse
            const { fulfillmentCategory } = selectedJobs[0]
            const jobInitPayload = {
              context,
              companyId: jobForApply.companyId,
              jobs: {
                jobId: jobForApply.jobId
              },
              jobFulfillments: [
                {
                  JobFulfillmentCategoryId: '1',
                  jobApplicantProfile: {
                    name: formData.name,
                    languages: ['ENG', 'HIN'],
                    profileUrl: 'https://linkedin.com/john-doe',
                    creds: docCredArray,
                    skills: ['NodeJS', 'React', 'Project Management', 'Enterprise Architecture']
                  }
                }
              ]
            }

            const jobInitResponse = await axios.post(`${dsepUrl}/job/init`, jobInitPayload)
            if (jobInitResponse.data) {
              const { bppId, bppUri, transactionId, jobId, companyId, companyName, jobRole } = jobForApply
              const jobConfirmPayload = {
                jobId,
                companyId,
                jobName: jobRole,
                company: {
                  name: companyName
                },
                context: {
                  bppId,
                  bppUri,
                  transactionId
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
              const jobConfirmResponse = await axios.post(`${dsepUrl}/job/confirm`, jobConfirmPayload)

              if (jobConfirmResponse.data) {
                const originalJobConfirmData = jobConfirmResponse.data.original

                const { context, message } = originalJobConfirmData
                const { order } = message

                const ordersPayload = {
                  context: context,
                  message: {
                    order: {
                      id: order.id,
                      provider: {
                        id: order.provider.id,
                        descriptor: {
                          name: order.provider.descriptor.name,
                          short_desc: order.provider.descriptor.short_desc
                        }
                      },
                      items: order.items,
                      fulfillments: order.fulfillments
                    }
                  },
                  category: {
                    set: [3]
                  }
                }
                const fulfillOrderRequest = await axios.post(`${strapiUrl}/orders`, ordersPayload, axiosConfig)
                if (fulfillOrderRequest.data) {
                  setIsLoading(false)
                  Router.push('/applicationSent')
                }
              }
            }
          }
        }
      }
    } catch (error: any) {
      if (error.response && error.response.data) {
        const errorMessage = error.response.data.error.message
        console.log(error.response.config.url)
        if (error.response.config.url.includes(`${strapiUrl}/orders`)) {
          toast.error(errorMessage, { autoClose: 5000 })
          Router.push('/applicationSent')
        } else {
          toast.error(errorMessage, { autoClose: 5000 })
          console.log(errorMessage)
        }
      }
    }
  }

  if (isLoadingInSelect) {
    return <Loader />
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

  return (
    <Box
      className="hideScroll"
      maxH={'calc(100vh - 100px)'}
      overflowY="scroll"
    >
      <Box pb={'20px'}>
        <JobApply
          formData={formData}
          setFormData={setFormData}
        />
        <Text
          pb={'10px'}
          fontSize={'15px'}
        >
          {t.docText}
        </Text>
        <UploadFile
          selectedFiles={selectedFiles}
          setSelectedFiles={setSelectedFiles}
        />
      </Box>
      <Flex
        alignItems={'baseline'}
        pb="30px"
      >
        <input
          onChange={() => setIsDeclarationChecked(prevValue => !prevValue)}
          type="checkbox"
          style={{
            position: 'relative',
            top: '2px'
          }}
        />
        <Text
          fontSize={'12px'}
          pl="10px"
        >
          {t.declarationText}
        </Text>
      </Flex>
      <Button
        buttonText={t.applyBtnText}
        background={'rgba(var(--color-primary))'}
        color={'rgba(var(--text-color))'}
        handleOnClick={handleButtonClick}
        isDisabled={!(areAllFieldsFilled() && isDeclarationChecked)}
      />
    </Box>
  )
}

export default jobApply
