import { Box } from '@chakra-ui/react'
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
import ApplyScholarshipForm from '../components/applyScholarship/apply-scholarship'
import axios from '../services/axios'

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
  const [scholarShipInitResponse, setScholarShipInitResponse] = useState<InitResponseModel | null>(null)
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
          const scholarShipInitPayload = getInitPayloadForScholarship(res.data)
          return axios.post(`${dsepUrl}/init`, scholarShipInitPayload)
        })
        .then(res => {
          const scholarshipInitResponseData: InitResponseModel = res.data
          setScholarShipInitResponse(scholarshipInitResponseData)
          setIsLoadingInSelect(false)
        })
        .catch(e => console.error(e))
    }
  }, [appliedScholarship])

  const handleButtonClick = async (id: string) => {
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
      if (scholarShipSelectResponse) {
        if (scholarShipInitResponse) {
          const payloadForConfirm = getConfirmPayloadForScholarship(scholarShipInitResponse)

          const scholarshipConfirmResponse = await axios.post(`${dsepUrl}/confirm`, payloadForConfirm)
          const scholarshipConfirmResponseData: ConfirmResponseModel = scholarshipConfirmResponse.data
          if (scholarshipConfirmResponseData) {
            const ordersPayload = getPostOrderPayload(scholarshipConfirmResponseData)
            const fulfillOrderRequest = await axios.post(`${strapiUrl}/orders`, ordersPayload, axiosConfig)
            if (fulfillOrderRequest.data) {
              setIsLoading(false)
              Router.push(`/scholarshipConfirmationPage?id=${id}`)
            }
          }
        }
      }
      setIsLoading(false)
    } catch (error: any) {
      console.error(error)
      if (error.response && error.response.data) {
        const errorMessage = error.response.data.error.message

        if (error.response.config.url.includes(`${strapiUrl}/orders`)) {
          // toast.error(errorMessage, { autoClose: 5000 })
          Router.push(`/scholarshipConfirmationPage?id=${id}`)
        } else {
          // toast.error(errorMessage, { autoClose: 5000 })
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
          loadingSubText="Please wait!"
          loadingText="Getting your scholarship form"
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

  if (!scholarShipSelectResponse || !scholarShipInitResponse) {
    return <></>
  }

  const areFilesSelected = selectedFiles.length !== 0
  const xInputHtml = scholarShipInitResponse?.data[0].message.order.items[0].xinput.html as string

  return (
    <Box
      className="hideScroll"
      maxH={'calc(100vh - 100px)'}
      overflowY="scroll"
    >
      <ApplyScholarshipForm
        xInputHtml={xInputHtml}
        onFormSubmit={handleButtonClick}
      />
    </Box>
  )
}

export default ApplyScholarship
