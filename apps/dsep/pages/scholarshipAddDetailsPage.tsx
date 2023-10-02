import { Box } from '@chakra-ui/react'
import axios from 'axios'
import Cookies from 'js-cookie'
import Router from 'next/router'
import React, { useEffect, useState } from 'react'
import Button from '../components/button/Button'
import Loader from '../components/loader/Loader'
import ScholarshipAddDetails from '../components/scholarship/addDetails/ScholarshipAddDetails'
import {
  ParsedScholarshipData,
  ScholarshipApplyFormDataModel
} from '../components/scholarship/scholarshipCard/Scholarship.types'
import UploadFile from '../components/uploadFile/UploadFile'
import { useLanguage } from '../hooks/useLanguage'

const ScholarshipAddDetailsPage = () => {
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
  const [appliedScholarship, setAppliedScholarship] = useState<ParsedScholarshipData | null>(null)

  const dsepUrl = process.env.NEXT_PUBLIC_DSEP_URL
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL

  useEffect(() => {
    if (localStorage) {
      const storedSelectedScholarship = localStorage.getItem('selectedScholarship')
      if (storedSelectedScholarship) {
        setAppliedScholarship(JSON.parse(storedSelectedScholarship))
      }
    }
  }, [])

  const handleButtonClick = async () => {
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
          const payloadForConfirm = {
            context: {
              transactionId: appliedScholarship?.transactionId,
              bppId: appliedScholarship?.bppId,
              bppUri: appliedScholarship?.bppUri
            }
          }

          const scholarshipConfirmResponse = await axios.post(`${dsepUrl}/scholarship/confirm`, payloadForConfirm)
          if (scholarshipConfirmResponse.data) {
            setIsLoading(false)
            Router.push('/scholarshipConfirmationPage')
          }
        }
      }
      setIsLoading(false)
    } catch (error) {}
  }

  if (isLoading) {
    return <Loader />
  }

  if (!appliedScholarship) {
    return <></>
  }

  return (
    <Box className="hideScroll" maxH={'calc(100vh - 100px)'} overflowY="scroll">
      <Box pt={'15px'} pb={'20px'}>
        <ScholarshipAddDetails formData={formData} setFormData={setFormData} />
        <UploadFile selectedFiles={selectedFiles} setSelectedFiles={setSelectedFiles} />
      </Box>
      <Button
        buttonText={t.submit}
        background={'rgba(var(--color-primary))'}
        color={'rgba(var(--text-color))'}
        handleOnClick={handleButtonClick}
        isDisabled={false}
      />
    </Box>
  )
}

export default ScholarshipAddDetailsPage
