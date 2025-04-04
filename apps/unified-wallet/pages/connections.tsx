import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useLanguage } from '@hooks/useLanguage'
import { useDispatch, useSelector } from 'react-redux'
import CredLayoutRenderer, { CredFormErrors, FormProps } from '@components/credLayoutRenderer/LayoutRenderer'
import { validateCredForm } from '@utils/form-utils'
import AadharCard from '@public/images/aadharcard.svg'
import DocIcon from '@public/images/doc_icon.svg'
import { Loader, SelectOptionType, Typography } from '@beckn-ui/molecules'
import { countryWiseVerification } from '@utils/constants'
import {
  useAddDocumentMutation,
  useDeleteDocumentMutation,
  useGetDocumentsMutation,
  useGetVerificationMethodsMutation
} from '@services/walletService'
import { AuthRootState } from '@store/auth-slice'
import {
  extractAuthAndHeader,
  filterByKeyword,
  generateRandomCode,
  getCountryCode,
  toBase64,
  toSnakeCase
} from '@utils/general'
import { feedbackActions } from '@beckn-ui/common'
import { generateAuthHeader, generateAuthHeaderForDelete } from '@services/cryptoUtilService'
import { parseDIDData } from '@utils/did'
import BottomModalScan from '@beckn-ui/common/src/components/BottomModal/BottomModalScan'
import { Box, Divider, Flex } from '@chakra-ui/react'
import VerifyOTP from '@components/VerifyOTP/VerifyOTP'
import { ItemMetaData } from '@components/credLayoutRenderer/ItemRenderer'
import Cookies from 'js-cookie'
import axios from '@services/axios'
import { ROLE, ROUTE_TYPE } from '@lib/config'
import DeleteAlertModal from '@components/modal/DeleteAlertModal'

const documentPatterns: Record<string, { regex: RegExp; image: string }> = {
  aadhar: { regex: /\baadhar\s?(card)?\b/i, image: AadharCard },
  pan: { regex: /\bpan\s?(card)?\b/i, image: DocIcon },
  passport: { regex: /\bpass[-\s]?port\b/i, image: DocIcon },
  drivinglicense: { regex: /\bdriving\s?(license|licence)\b/i, image: DocIcon }
}

const utilities = [
  { value: 'JVVNL', label: 'Jaipur Vidyut Vitran Nigam Limited' },
  { value: 'PVVNL', label: 'Purvanchal Vidyut Vitran Nigam Limited' },
  { value: 'BESCOM', label: 'Bangalore Electricity Supply Limited' },
  { value: 'DPN', label: 'Department of Power, Nagaland' },
  { value: 'UPCL', label: 'Uttarakhand Power Corporation Limited' }
]

const verificationMethodsOptions = [
  {
    label: 'Registered Mobile Number',
    value: 'mobile_number'
  },
  {
    label: 'Registered Email Address',
    value: 'email_id'
  }
]

const Connections = () => {
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL

  const [items, setItems] = useState<ItemMetaData[]>([])
  const [filteredItems, setFilteredItems] = useState(items)
  const [searchKeyword, setSearchKeyword] = useState<string>('')
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isOTPModalOpen, setIsOTPModalOpen] = useState<boolean>(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false)
  const [deleteItemDetails, setDeleteItemDetails] = useState<ItemMetaData>()

  // const [countryDetails, setCountryDetails] = useState<Record<string, any>>()
  const [formData, setFormData] = useState<FormProps>({
    type: 'Electricity',
    credNumber: '5487774000',
    // country: '',
    verificationMethod: 'email_id',
    utilityCompany: 'Duke Energy'
  })
  const [formErrors, setFormErrors] = useState<CredFormErrors>({
    type: '',
    credNumber: '',
    // country: '',
    verificationMethod: '',
    utilityCompany: ''
  })
  const [showBpId, setShowBpId] = useState<boolean>(false)
  const [fetchBpId, setFetchBpId] = useState<boolean>(false)

  const { t } = useLanguage()
  const dispatch = useDispatch()
  const { user, privateKey, publicKey } = useSelector((state: AuthRootState) => state.auth)
  const [addDocument] = useAddDocumentMutation()
  const [getVerificationMethods] = useGetVerificationMethodsMutation()
  const [getDocuments] = useGetDocumentsMutation()
  const [deleteDocument] = useDeleteDocumentMutation()

  const [options, setOptions] = useState<{
    country: SelectOptionType[]
    utilities: SelectOptionType[]
    verificationMethods: SelectOptionType[]
  }>({
    country: [],
    utilities: utilities,
    verificationMethods: [
      {
        label: 'Registered Mobile Number',
        value: 'mobile_number'
      },
      {
        label: 'Registered Email Address',
        value: 'email_id'
      }
    ]
  })

  const getDocIcon = (docType: string) => {
    for (const key in documentPatterns) {
      if (documentPatterns[key].regex.test(docType)) {
        return { image: documentPatterns[key].image }
      }
    }

    return { image: DocIcon }
  }

  const fetchCredentials = async () => {
    try {
      setIsLoading(true)
      const result = await getDocuments(user?.did!).unwrap()
      const list: ItemMetaData[] = parseDIDData(result)
        ['identities'].map((item, index) => {
          const docType: any = item.type.toLowerCase().replace(/[^a-z]/g, '')
          const { image } = getDocIcon(docType)
          return {
            id: index,
            title: item.type,
            description: item.id,
            isVerified: true,
            image,
            datetime:
              item?.createdAt?.length > 5 && !isNaN(item?.createdAt as number)
                ? item.createdAt
                : Math.floor(new Date().getTime() / 1000),
            data: item
          }
        })
        .filter(val => val)
        .sort((a, b) => Number(b.data.createdAt) - Number(a.data.createdAt))
      setItems(list)
      setFilteredItems(list)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCredentials()
  }, [])

  useEffect(() => {
    if (searchKeyword && searchKeyword.trim() !== '') {
      const filteredList = filterByKeyword(items, searchKeyword, 'title')
      setFilteredItems(filteredList)
    } else {
      setFilteredItems(items)
    }
  }, [searchKeyword, items])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (fetchBpId) {
        setShowBpId(true)
      }
    }, 2000)

    return () => clearTimeout(timer)
  }, [fetchBpId])

  const getCountries = () => {
    const countries = countryWiseVerification.map(data => ({
      label: data.country,
      value: data.country,
      data
    }))
    setOptions({ ...options, country: countries })
  }

  const getUtilities = async () => {
    try {
      const response: any = await axios.get(
        `${strapiUrl}${ROUTE_TYPE[ROLE.GENERAL]}/utility/companies?country_code=${getCountryCode()?.country?.code || 'USA'}`
      )

      if (!response?.data || !Array.isArray(response.data.utility_companies)) {
        throw new Error('Invalid response format from utility companies API')
      }

      const utilities = response.data.utility_companies.map((utility: any) => {
        return {
          label: utility.company_name,
          value: utility.company_name,
          data: utility
        }
      })
      console.log(utilities)
      setOptions({ ...options, utilities: utilities })
    } catch (error) {
      console.error('Error fetching utilities:', error)
      setOptions({ ...options, utilities: [] })
    }
  }

  const handleOpenModal = () => {
    getUtilities()
    getCountries()
    setTimeout(() => {
      setOpenModal(true)
    }, 1000)
  }
  const handleCloseModal = () => {
    setFormData({
      type: 'Electricity',
      credNumber: '5487774000',
      // country: '',
      verificationMethod: 'mobile_number',
      utilityCompany: 'Duke Energy'
    })
    setOptions({ country: [], utilities: [], verificationMethods: [] })
    setOpenModal(false)
  }

  const attestDocument = async (did: string) => {
    try {
      const requestOptions = {
        method: 'POST',
        withCredentials: true
      }

      const res = await axios.post(
        `${strapiUrl}${ROUTE_TYPE[ROLE.GENERAL]}/wallet/attest`,
        {
          wallet_doc_type: 'IDENTITIES',
          document_id: did,
          deg_wallet_id: user?.did
        },
        requestOptions
      )
    } catch (err) {
      console.error('Error attesting document:', err)
    }
  }

  const handleOnSubmit = async () => {
    try {
      const errors = validateCredForm(formData) as any
      delete errors.url
      setFormErrors(prevErrors => ({
        ...prevErrors,
        ...Object.keys(errors).reduce((acc: any, key) => {
          acc[key] = t[`${errors[key]}`] || ''
          return acc
        }, {} as CredFormErrors)
      }))

      const data = {
        type: formData.type,
        credNumber: formData.credNumber?.trim(),
        // country: formData.country,
        verificationMethod: formData.verificationMethod,
        utilityCompany: formData.utilityCompany
      }
      setIsLoading(true)

      const docDetails = JSON.stringify(data)
      const createdAt = Math.floor(new Date().getTime() / 1000)
      const verificationMethodsRes = await getVerificationMethods(user?.did!).unwrap()
      const { did } = verificationMethodsRes[0]

      const authHeaderRes = await generateAuthHeader({
        subjectId: user?.did!,
        verification_did: did,
        privateKey,
        publicKey,
        payload: {
          name: `identities/type/${toSnakeCase(data?.type!)}/id/${data.credNumber}/${createdAt}/${generateRandomCode()}`,
          stream: toBase64(docDetails)
        }
      })
      const { authorization, payload } = extractAuthAndHeader(authHeaderRes)
      if (authorization && payload) {
        const addDocPayload = {
          subjectId: user?.did!,
          payload,
          authorization
        }

        const res: any = await addDocument(addDocPayload).unwrap()
        await attestDocument(res?.[0].did)

        dispatch(
          feedbackActions.setToastData({
            toastData: { message: 'Success', display: true, type: 'success', description: 'Added Successfully!' }
          })
        )
        setIsOTPModalOpen(false)
      } else {
        dispatch(
          feedbackActions.setToastData({
            toastData: { message: 'Error', display: true, type: 'error', description: t.errorText }
          })
        )
      }
    } catch (error) {
      console.error('An error occurred:', error)
    } finally {
      setIsLoading(false)
      fetchCredentials()
    }
  }

  const handleDeleteItem = useCallback(
    async (didItem: ItemMetaData) => {
      console.log(didItem)
      try {
        const data = {
          type: 'test',
          credNumber: 'test'
        }

        const docDetails = JSON.stringify(data)

        const verificationMethodsRes = await getVerificationMethods(user?.did!).unwrap()
        const { did } = verificationMethodsRes[0]

        const authHeaderRes = await generateAuthHeaderForDelete({
          subjectId: didItem.data.did,
          verification_did: did,
          privateKey,
          publicKey,
          payload: {
            name: '/data/verification',
            stream: toBase64(docDetails)
          }
        })
        const { authorization, payload } = extractAuthAndHeader(authHeaderRes)

        if (authorization && payload) {
          const deleteDocPayload = {
            subjectId: didItem.data.did!,
            payload,
            authorization
          }
          console.log(deleteDocPayload)
          await deleteDocument(deleteDocPayload).unwrap()

          dispatch(
            feedbackActions.setToastData({
              toastData: { message: 'Success', display: true, type: 'success', description: 'Deleted Successfully!' }
            })
          )
          setIsDeleteModalOpen(false)
        } else {
          dispatch(
            feedbackActions.setToastData({
              toastData: { message: 'Error', display: true, type: 'error', description: 'Something went wrong!' }
            })
          )
        }
      } catch (error) {
        console.error('An error occurred:', error)
      } finally {
        fetchCredentials()
      }
    },
    [deleteItemDetails]
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    console.log(name, value)
    setFormData((prevFormData: FormProps) => ({
      ...prevFormData,
      [name]: value
    }))

    const updatedFormData = {
      ...formData,
      [name]: value
    }

    const errors = validateCredForm(updatedFormData) as any
    setFormErrors(prevErrors => ({
      ...prevErrors,
      [name]: t[`${errors[name]}`] || ''
    }))
  }

  const handleSelectChange = (selectedItem: any) => {
    const { name, value, data } = selectedItem
    console.log(name, value)
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value
    }))

    const updatedFormData = {
      ...formData,
      [name]: value
    }

    const errors = validateCredForm(updatedFormData)
    setFormErrors(prevErrors => ({
      ...prevErrors,
      [name]: t[`${errors[name as keyof CredFormErrors]}`] || ''
    }))
  }

  const isFormFilled = useMemo(() => {
    return (
      Object.values(formData).every(value => value !== '') && Object.values(formErrors).every(value => value === '')
    )
  }, [formData, formErrors])

  return (
    <Box
      className="hideScroll"
      maxH="calc(100vh - 100px)"
      overflowY={'scroll'}
    >
      <CredLayoutRenderer
        schema={{
          items: filteredItems,
          handleOnItemClick: () => {},
          handleDeleteItem: data => {
            setDeleteItemDetails(data)
            setIsDeleteModalOpen(true)
          },
          search: {
            searchInputPlaceholder: 'Search Connections',
            searchKeyword,
            setSearchKeyword
          },
          modal: {
            schema: {
              header: 'Add New Connection',
              inputs: [
                // {
                //   type: 'select',
                //   name: 'country',
                //   options: options.country,
                //   value: formData.country!,
                //   handleChange: handleSelectChange,
                //   label: 'Select Country',
                //   error: formErrors.country
                // },
                // {
                //   type: 'text',
                //   name: 'type',
                //   value: formData.type!,
                //   handleChange: handleInputChange,
                //   label: 'Connection Type',
                //   error: formErrors.type
                // },
                {
                  type: 'text',
                  name: 'credNumber',
                  value: formData.credNumber!,
                  handleChange: handleInputChange,
                  label: 'Connection Number',
                  error: formErrors.credNumber
                },
                {
                  type: 'select',
                  name: 'utilityCompany',
                  options: options.utilities,
                  value: formData.utilityCompany!,
                  handleChange: handleSelectChange,
                  label: t.selectUtilityCompany,
                  error: formErrors.utilityCompany
                },
                {
                  type: 'select',
                  name: 'verificationMethod',
                  options: verificationMethodsOptions,
                  value: formData.verificationMethod!,
                  handleChange: handleSelectChange,
                  label: 'Method Of Verification',
                  error: formErrors.verificationMethod
                }
              ],
              buttons: [
                {
                  text: 'Add',
                  handleClick: () => {
                    setOpenModal(false)
                    setIsOTPModalOpen(true)
                    setFetchBpId(true)
                  },
                  disabled: !isFormFilled,
                  variant: 'solid',
                  colorScheme: 'primary',
                  isLoading: isLoading
                }
              ]
            },
            isLoading,
            openModal,
            handleOpenModal,
            handleCloseModal
          }
        }}
      />
      <DeleteAlertModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        handleConfirmDeleteDevice={() => handleDeleteItem(deleteItemDetails!)}
        isLoading={false}
      />
      <BottomModalScan
        isOpen={isOTPModalOpen}
        onClose={() => {
          setIsOTPModalOpen(false)
          setFetchBpId(false)
          setShowBpId(false)
        }}
        modalHeader={'OTP Verification'}
        isLoading={isLoading}
      >
        <Box
          alignItems="center"
          flexDir="column"
          padding="0 20px 0 20px"
          gap="10px"
        >
          <VerifyOTP
            description={`Enter the one-time password (OTP) sent to your registered ${formData.verificationMethod === 'mobile_number' ? 'mobile number' : 'email address'}.`}
            isLoading={isLoading}
            handleVerifyOtp={handleOnSubmit}
          />
          {fetchBpId && showBpId ? (
            <Flex
              flexDir={'column'}
              gap="0.5rem"
            >
              <Typography
                text="Connection Number"
                fontSize="16px"
                fontWeight="400"
              />
              <Divider />
              <Typography
                text={'This connection belongs to Jack Smith'}
                fontSize="12px"
                fontWeight="400"
                color="#80807F"
              />
            </Flex>
          ) : (
            <Box
              display={'grid'}
              height={'calc(100vh - 800px)'}
              alignContent={'center'}
            >
              <Loader />
            </Box>
          )}
        </Box>
      </BottomModalScan>
    </Box>
  )
}

export default Connections
