import { Box } from '@chakra-ui/react'
import axios from 'axios'
import Cookies from 'js-cookie'
import Router from 'next/router'
import React, { useEffect, useState } from 'react'
import Button from '../components/button/Button'
import { JobCredential } from '../components/jobApply/JobApply.types'
import Loader from '../components/loader/Loader'
import ScholarshipAddDetails from '../components/scholarship/addDetails/ScholarshipAddDetails'
import {
  ParsedScholarshipData,
  ScholarshipApplyFormDataModel,
  ScholarshipConfirmResponseModel,
  ScholarShipSelectResponseModel
} from '../components/scholarship/scholarshipCard/Scholarship.types'
import UploadFile from '../components/uploadFile/UploadFile'
import { useLanguage } from '../hooks/useLanguage'
import { FormErrors, validateForm } from '../utilities/detailsForm-utils'

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
  const [appliedScholarship, setAppliedScholarship] = useState<ParsedScholarshipData | null>(null)
  const [scholarShipSelectResponse, setScholarShipSelectResponse] = useState<ScholarShipSelectResponseModel | null>(
    null
  )
  const [isLoadingInSelect, setIsLoadingInSelect] = useState(true)
  const [formErrors, setFormErrors] = useState<FormErrors>({})

  const dsepUrl = process.env.NEXT_PUBLIC_DSEP_URL
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
      const { providerId, id, bppId, bppUri, transactionId } = appliedScholarship
      const payloadForjobSelect = {
        scholarshipProviderId: providerId,
        scholarshipId: id,
        context: {
          transactionId: transactionId,
          bppId: bppId,
          bppUri: bppUri
        }
      }

      axios
        .post(`${dsepUrl}/scholarship/select`, payloadForjobSelect)
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
            const { context, scholarshipProviders } = scholarShipSelectResponse
            const { description, id, name, scholarships } = scholarshipProviders[0]
            const { transactionId, bppId, bppUri } = context
            const {
              id: scholarshipId,
              name: scholarshipName,
              description: scholarshipDesc,
              amount,
              categories
            } = scholarships[0]

            const scholarShipInitPayload = {
              context: {
                transactionId,
                bppId,
                bppUri
              },
              scholarshipProvider: {
                id,
                name,
                scholarships: [
                  {
                    id: scholarshipId,
                    name: scholarshipName,
                    description: scholarshipDesc,
                    amount: amount,
                    categoryId: 'DSEP_CAT_1',
                    scholarshipDetails: {
                      id: appliedScholarship?.scholarshipDetails[0].id,
                      type: appliedScholarship?.scholarshipDetails[0].type,
                      applicationStartDate: appliedScholarship?.scholarshipDetails[0].applicationStartDate,
                      applicationEndDate: appliedScholarship?.scholarshipDetails[0].applicationEndDate,
                      supportContact: appliedScholarship?.scholarshipDetails[0].supportContact,
                      scholarshipRequestor: {
                        name: formData.name,
                        phone: formData.mobileNumber,
                        address: formData.address,
                        needOfScholarship: 'higher education',
                        docUrl: docCredArray[0].url
                      }
                    },

                    academicQualificationsCriteria: [
                      {
                        code: 'gr',
                        name: 'Grade',
                        value: 'Grade 12'
                      },
                      {
                        code: 'percentage_grade',
                        name: 'Percentage/Grade',
                        value: '>= 50'
                      },
                      {
                        code: 'passing_year',
                        name: 'Passing Year',
                        value: 2021
                      }
                    ],
                    finStatusCriteria: [
                      {
                        code: 'family_income',
                        name: 'Family Income',
                        value: '<= 2000000'
                      }
                    ],
                    benefits: [
                      {
                        code: 'scholarship-amount',
                        name: 'Scholarship Amount',
                        value: 'Upto Rs.30000 per year'
                      }
                    ]
                  }
                ]
              }
            }
            const scholarshipInitResponse = await axios.post(`${dsepUrl}/scholarship/init`, scholarShipInitPayload)
            if (scholarshipInitResponse.data) {
              const payloadForConfirm = {
                context: {
                  transactionId,
                  bppId,
                  bppUri
                },
                scholarshipProvider: {
                  id,
                  name,
                  description,
                  scholarships: [
                    {
                      id: scholarshipId,
                      name: scholarshipName,
                      description: scholarshipDesc,
                      amount: amount,
                      categoryId: 'DSEP_CAT_1',
                      scholarshipDetails: {
                        id: appliedScholarship?.scholarshipDetails[0].id,
                        type: appliedScholarship?.scholarshipDetails[0].type,
                        applicationStartDate: appliedScholarship?.scholarshipDetails[0].applicationStartDate,
                        applicationEndDate: appliedScholarship?.scholarshipDetails[0].applicationEndDate,
                        supportContact: appliedScholarship?.scholarshipDetails[0].supportContact,
                        scholarshipRequestor: {
                          name: formData.name,
                          phone: formData.mobileNumber,
                          address: formData.address,
                          needOfScholarship: 'higher education',
                          docUrl: docCredArray[0].url
                        }
                      },

                      academicQualificationsCriteria: [
                        {
                          code: 'gr',
                          name: 'Grade',
                          value: 'Grade 12'
                        },
                        {
                          code: 'percentage_grade',
                          name: 'Percentage/Grade',
                          value: '>= 50'
                        },
                        {
                          code: 'passing_year',
                          name: 'Passing Year',
                          value: 2021
                        }
                      ],
                      finStatusCriteria: [
                        {
                          code: 'family_income',
                          name: 'Family Income',
                          value: '<= 2000000'
                        }
                      ],
                      benefits: [
                        {
                          code: 'scholarship-amount',
                          name: 'Scholarship Amount',
                          value: 'Upto Rs.30000 per year'
                        }
                      ]
                    }
                  ]
                }
              }

              const scholarshipConfirmResponse = await axios.post(`${dsepUrl}/scholarship/confirm`, payloadForConfirm)
              if (scholarshipConfirmResponse.data) {
                const originalScholarshipConfirmData: ScholarshipConfirmResponseModel =
                  scholarshipConfirmResponse.data.original

                const { context, message } = originalScholarshipConfirmData
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
                    set: [2]
                  }
                }
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
    } catch (error) {}
  }

  if (isLoadingInSelect) {
    return <Loader />
  }

  if (isLoading) {
    return <Loader loadingText="Confirming Application" />
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
        isDisabled={!(areAllFieldsFilled() && areFilesSelected)}
      />
    </Box>
  )
}

export default ApplyScholarship
