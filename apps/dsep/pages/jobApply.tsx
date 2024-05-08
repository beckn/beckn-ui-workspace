import { Box, Flex, Text } from '@chakra-ui/react'
import { Button, Typography } from '@beckn-ui/molecules'
import LoaderWithMessage from '@beckn-ui/molecules/src/components/LoaderWithMessage/loader-with-message'
import { toast } from 'react-toastify'
import axios from 'axios'
import Cookies from 'js-cookie'
import { JobApplyFormData, JobCredential } from '../components/jobApply/JobApply.types'
import React, { useEffect, useState } from 'react'
import Router, { useRouter } from 'next/router'
import JobApply from '../components/jobApply/JobApply'
import UploadFile from '../components/uploadFile/UploadFile'
import ApplyJobForm from '../components/applyJob/apply-job'
import { fromBinary } from '../utilities/common-utils'
import { useLanguage } from '../hooks/useLanguage'
import { ParsedItemModel } from '../types/search.types'
import {
  getConfirmPayloadForJobs,
  getInitPayloadForJobs,
  getPostOrderPayload,
  getSelectPayloadForJobs
} from '../utilities/job-apply-utils'
import { SelectResponseModel } from '../lib/types/select.types'
import { ConfirmResponseModel } from '../lib/types/confirm.types'
import 'react-toastify/dist/ReactToastify.css'

const jobApply = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [formData, setFormData] = useState<JobApplyFormData>({
    name: '',
    mobileNumber: '',
    email: ''
  })
  const { t } = useLanguage()
  const router = useRouter()
  const [jobForApply, setJobForApply] = useState<ParsedItemModel | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingInSelect, setIsLoadingInSelect] = useState(true)
  const [isDeclarationChecked, setIsDeclarationChecked] = useState(false)
  const [jobSelectResponse, setJobSelectResponse] = useState<SelectResponseModel | null>(null)

  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL
  const dsepUrl = process.env.NEXT_PUBLIC_API_URL
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
      const payloadForjobSelect = getSelectPayloadForJobs(jobForApply)

      axios.post(`${dsepUrl}/select`, payloadForjobSelect).then(res => {
        setJobSelectResponse(res.data)
        setIsLoadingInSelect(false)
      })
    }
  }, [jobForApply])

  if (!jobForApply) {
    return <></>
  }

  // TODO :- check this handleButtonClick later

  // const handleButtonClick = async () => {
  //   setIsLoading(true)
  //   const { name, mobileNumber } = formData

  //   try {
  //     let arrayOfDocumentIds: number[] = []
  //     const fetchDocuments = await axios.get(`${strapiUrl}/documents?populate[0]=attachment`, axiosConfig)

  //     if (fetchDocuments.data) {
  //       fetchDocuments.data.data.forEach((ele: any) => arrayOfDocumentIds.push(ele.id))
  //     }

  //     const formDataForPayload = new FormData()

  //     const profileCreatePayload = {
  //       name: name,
  //       phone: mobileNumber,
  //       documents: arrayOfDocumentIds
  //     }
  //     formDataForPayload.append('data', JSON.stringify(profileCreatePayload))

  //     const formSubmissionResponse = await axios.post(`${strapiUrl}/profiles`, formDataForPayload, axiosConfig)
  //     if (formSubmissionResponse.data) {
  //       const fetchProfilesResponse = await axios.get(
  //         `${strapiUrl}/profiles?populate[0]=documents.attachment`,
  //         axiosConfig
  //       )

  //       if (fetchProfilesResponse.data) {
  //         let docCredArray: JobCredential[] = []

  //         fetchProfilesResponse.data.data.attributes.documents.data.map((doc: any) => {
  //           if (doc.attributes.attachment.data && doc.attributes.type) {
  //             const docUrl = coreStrapiUrl + doc.attributes.attachment.data.attributes.url
  //             const docType = doc.attributes.attachment.data.attributes.mime

  //             docCredArray.push({
  //               url: docUrl,
  //               type: docType
  //             })
  //           }
  //         })

  //         if (jobSelectResponse) {
  //           const initPayload = getInitPayloadForJobs(jobSelectResponse, docCredArray, formData.name)

  //           const jobInitResponse = await axios.post(`${dsepUrl}/init`, initPayload)
  //           if (jobInitResponse.data) {
  //             const confirmPayload = getConfirmPayloadForJobs(jobInitResponse.data)
  //             const jobConfirmResponse = await axios.post(`${dsepUrl}/confirm`, confirmPayload)
  //             const jobConfirmData: ConfirmResponseModel = jobConfirmResponse.data
  //             if (jobConfirmData) {
  //               const orderPayload = getPostOrderPayload(jobConfirmData)
  //               const fulfillOrderRequest = await axios.post(`${strapiUrl}/orders`, orderPayload, axiosConfig)
  //               if (fulfillOrderRequest.data) {
  //                 setIsLoading(false)
  //                 Router.push('/applicationSent')
  //               }
  //             }
  //           }
  //         }
  //       }
  //     }
  //   } catch (error: any) {
  //     if (error.response && error.response.data) {
  //       const errorMessage = error.response.data.error.message
  //       console.log(error.response.config.url)
  //       if (error.response.config.url.includes(`${strapiUrl}/orders`)) {
  //         toast.error(errorMessage, { autoClose: 5000 })
  //         Router.push('/applicationSent')
  //       } else {
  //         toast.error(errorMessage, { autoClose: 5000 })
  //         console.log(errorMessage)
  //       }
  //     }
  //   }
  // }

  if (isLoadingInSelect) {
    return (
      <Box
        display={'grid'}
        height={'calc(100vh - 300px)'}
        alignContent={'center'}
      >
        <LoaderWithMessage
          loadingSubText=""
          loadingText=""
        />
      </Box>
    )
  }

  if (isLoading) {
    return (
      <Box
        display={'grid'}
        height={'calc(100vh - 300px)'}
        alignContent={'center'}
      >
        <LoaderWithMessage
          loadingSubText={t.applicationLoaderText}
          loadingText={t.categoryLoadPrimary}
        />
      </Box>
    )
  }

  const xInputHtml = jobSelectResponse?.data[0].message.order.items[0].xinput.html as string

  return (
    <Box
      className="hideScroll"
      maxH={'calc(100vh - 100px)'}
      overflowY="scroll"
      mt={'15px'}
    >
      <ApplyJobForm xInputHtml={xInputHtml} />
    </Box>
  )
}

export default jobApply
