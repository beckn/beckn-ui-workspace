import { Box } from '@chakra-ui/react'
import axios from 'axios'
import Cookies from 'js-cookie'
import Router from 'next/router'
import React, { useEffect, useState } from 'react'
import { Button, LoaderWithMessage } from '@beckn-ui/molecules'
import { JobCredential } from '../components/jobApply/JobApply.types'
import ScholarshipAddDetails from '../components/scholarship/addDetails/ScholarshipAddDetails'
import { ScholarshipApplyFormDataModel } from '../components/scholarship/scholarshipCard/Scholarship.types'
import UploadFile from '../components/uploadFile/UploadFile'
import { useLanguage } from '../hooks/useLanguage'
import { FormErrors, validateForm } from '../utilities/detailsForm-utils'

import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { ParsedItemModel } from '../types/search.types'
import {
  getConfirmPayloadForScholarship,
  getInitPayloadForScholarship,
  getPostOrderPayload,
  getSelectPayloadForScholarship
} from '../components/scholarship/scholarship-apply-utils'
import { SelectResponseModel } from '../lib/types/select.types'
import { InitResponseModel } from '../lib/types/init.types'
import { ConfirmResponseModel } from '../lib/types/confirm.types'

const ApplyScholarship = () => {
  const [formData, setFormData] = useState<ScholarshipApplyFormDataModel>({
    name: '',
    mobileNumber: '',
    email: '',
    address: '',
    pinCode: '',
    scholarshipInfo: ''
  })
  const { t } = useLanguage()
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [appliedScholarship, setAppliedScholarship] = useState<ParsedItemModel | null>(null)
  const [scholarShipSelectResponse, setScholarShipSelectResponse] = useState<SelectResponseModel | null>(null)
  const [isLoadingInSelect, setIsLoadingInSelect] = useState(true)
  const [formErrors, setFormErrors] = useState<FormErrors>({})

  const dsepUrl = process.env.NEXT_PUBLIC_API_URL
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL
  const coreStrapiUrl = process.env.NEXT_PUBLIC_CORE_STRAPI_URL

  const bearerToken = Cookies.get('authToken')
  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${bearerToken}`,
      'Content-Type': 'application/json' // You can set the content type as needed
    }
  }

  useEffect(() => {
    if (localStorage) {
      const storedSelectedScholarship = localStorage.getItem('selectedScholarship')
      if (storedSelectedScholarship) {
        setAppliedScholarship(JSON.parse(storedSelectedScholarship))
      }
    }
  }, [])

  useEffect(() => {
    const email = Cookies.get('userEmail') as string
    axios
      .get(`${strapiUrl}/profiles?populate[0]=attachment`, axiosConfig)
      .then(res => {
        const profileData = res.data
        const { address, name, phone, zip_code } = profileData.data.attributes
        setFormData({
          email: email,
          mobileNumber: phone,
          name: name,
          pinCode: zip_code ? zip_code : '',
          address: address ? address : ''
        })
      })
      .catch(e => console.error(e))
  }, [])

  useEffect(() => {
    if (appliedScholarship) {
      const payloadForScholarshipSelect = getSelectPayloadForScholarship(appliedScholarship)

      axios
        .post(`${dsepUrl}/select`, payloadForScholarshipSelect)
        .then(res => {
          setScholarShipSelectResponse(res.data)
          setIsLoadingInSelect(false)
        })
        .catch(e => console.error(e))
    }
  }, [appliedScholarship])

  const handleButtonClick = async () => {
    const validationErrors = validateForm(formData as any)

    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors)
      return
    }
    setIsLoading(true)
    const { address, email, mobileNumber, name, pinCode, scholarshipInfo } = formData

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

          if (scholarShipSelectResponse) {
            const scholarShipInitPayload = getInitPayloadForScholarship(scholarShipSelectResponse)
            const scholarshipInitResponse = await axios.post(`${dsepUrl}/init`, scholarShipInitPayload)
            const scholarshipInitResponseData: InitResponseModel = scholarshipInitResponse.data
            if (scholarshipInitResponseData) {
              const payloadForConfirm = getConfirmPayloadForScholarship(scholarshipInitResponseData)

              const scholarshipConfirmResponse = await axios.post(`${dsepUrl}/confirm`, payloadForConfirm)
              const scholarshipConfirmResponseData: ConfirmResponseModel = scholarshipConfirmResponse.data
              if (scholarshipConfirmResponseData) {
                const ordersPayload = getPostOrderPayload(scholarshipConfirmResponseData)
                const fulfillOrderRequest = await axios.post(`${strapiUrl}/orders`, ordersPayload, axiosConfig)
                if (fulfillOrderRequest.data) {
                  setIsLoading(false)
                  Router.push('/scholarshipConfirmationPage')
                }
              }
            }
          }
        }
      }
      setIsLoading(false)
    } catch (error: any) {
      if (error.response && error.response.data) {
        const errorMessage = error.response.data.error.message

        if (error.response.config.url.includes(`${strapiUrl}/orders`)) {
          toast.error(errorMessage, { autoClose: 5000 })
          Router.push('/scholarshipConfirmationPage')
        } else {
          toast.error(errorMessage, { autoClose: 5000 })
        }
      }
      setIsLoading(false)
    }
  }

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

  if (!appliedScholarship) {
    return <></>
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
    <Box
      className="hideScroll"
      maxH={'calc(100vh - 100px)'}
      overflowY="scroll"
    >
      <Box
        pt={'15px'}
        pb={'20px'}
      >
        <ScholarshipAddDetails
          formData={formData}
          setFormData={setFormData}
        />
        <UploadFile
          selectedFiles={selectedFiles}
          setSelectedFiles={setSelectedFiles}
        />
      </Box>
      <Button
        text={t.submit}
        handleClick={handleButtonClick}
        disabled={!(areAllFieldsFilled() && areFilesSelected)}
        color={'rgba(var(--text-color))'}
      />
    </Box>
  )
}

export default ApplyScholarship
