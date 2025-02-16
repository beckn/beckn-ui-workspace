import React, { useEffect, useMemo, useState } from 'react'
import { useLanguage } from '@hooks/useLanguage'
import { useDispatch, useSelector } from 'react-redux'
import CredLayoutRenderer, { CredFormErrors, FormProps } from '@components/credLayoutRenderer/LayoutRenderer'
import { validateCredForm } from '@utils/form-utils'
import AadharCard from '@public/images/aadharcard.svg'
import DocIcon from '@public/images/doc_icon.svg'
import { SelectOptionType } from '@beckn-ui/molecules'
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
  extractMobileNumberFromSubjectDid,
  filterByKeyword,
  toBase64,
  toSnakeCase
} from '@utils/general'
import { feedbackActions } from '@beckn-ui/common'
import { generateAuthHeader, generateAuthHeaderForDelete } from '@services/cryptoUtilService'
import { parseDIDData } from '@utils/did'
import BottomModalScan from '@beckn-ui/common/src/components/BottomModal/BottomModalScan'
import { Box } from '@chakra-ui/react'
import VerifyOTP from '@components/VerifyOTP/VerifyOTP'
import { ItemMetaData } from '@components/credLayoutRenderer/ItemRenderer'
import Cookies from 'js-cookie'
import axios from '@services/axios'
import { ROLE, ROUTE_TYPE } from '@lib/config'

const documentPatterns: Record<string, { regex: RegExp; image: string }> = {
  aadhar: { regex: /\baadhar\s?(card)?\b/i, image: AadharCard },
  pan: { regex: /\bpan\s?(card)?\b/i, image: DocIcon },
  passport: { regex: /\bpass[-\s]?port\b/i, image: DocIcon },
  drivinglicense: { regex: /\bdriving\s?(license|licence)\b/i, image: DocIcon }
}

const MyIdentities = () => {
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL

  const [items, setItems] = useState<ItemMetaData[]>([])
  const [filteredItems, setFilteredItems] = useState(items)
  const [searchKeyword, setSearchKeyword] = useState<string>('')
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isOTPModalOpen, setIsOTPModalOpen] = useState<boolean>(false)

  // const [countryDetails, setCountryDetails] = useState<Record<string, any>>()
  const [formData, setFormData] = useState<FormProps>({
    type: '',
    credNumber: '',
    country: '',
    verificationMethod: '',
    energyBPId: ''
  })
  const [formErrors, setFormErrors] = useState<CredFormErrors>({
    type: '',
    credNumber: '',
    country: '',
    verificationMethod: '',
    energyBPId: ''
  })

  const { t } = useLanguage()
  const dispatch = useDispatch()
  const { user, privateKey, publicKey } = useSelector((state: AuthRootState) => state.auth)
  const [addDocument, { isLoading: addDocLoading }] = useAddDocumentMutation()
  const [getVerificationMethods, { data: verificationMethods }] = useGetVerificationMethodsMutation()
  const [getDocuments, { isLoading: verifyLoading }] = useGetDocumentsMutation()
  const [deleteDocument, { isLoading: deleteDocLoading }] = useDeleteDocumentMutation()

  const bearerToken = Cookies.get('authToken')

  const [options, setOptions] = useState<{
    country: SelectOptionType[]
    verificationMethods: SelectOptionType[]
  }>({
    country: [],
    verificationMethods: [
      {
        label: 'Mobile Number',
        value: user?.did ? extractMobileNumberFromSubjectDid(user?.did)! : ''
      },
      {
        label: 'Email Id',
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
      const list: ItemMetaData[] = parseDIDData(result)['identities'].map((item, index) => {
        const docType: any = item.type.toLowerCase().replace(/[^a-z]/g, '')
        const { image } = getDocIcon(docType)
        return {
          id: index,
          title: item.type,
          description: item.id,
          isVerified: true,
          image,
          datetime: new Date().toString(),
          data: item
        }
      })
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

  const getCountries = () => {
    const countries = countryWiseVerification.map(data => ({
      label: data.country,
      value: data.country,
      data
    }))
    setOptions({ ...options, country: countries })
  }

  const handleOpenModal = () => {
    getCountries()
    setOpenModal(true)
  }
  const handleCloseModal = () => {
    setFormData({ type: '', credNumber: '', country: '', verificationMethod: '' })
    setOptions({ country: [], verificationMethods: [] })
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
          document_id: did
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
        country: formData.country,
        verificationMethod: formData.verificationMethod
      }
      setIsLoading(true)

      const docDetails = JSON.stringify(data)

      const verificationMethodsRes = await getVerificationMethods(user?.did!).unwrap()
      const { did } = verificationMethodsRes[0]

      const authHeaderRes = await generateAuthHeader({
        subjectId: user?.did!,
        verification_did: did,
        privateKey,
        publicKey,
        payload: {
          name: `identities/type/${toSnakeCase(data?.type!)}/id/${data.credNumber}`,
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

  const handleDeleteItem = async (didItem: ItemMetaData) => {
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
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

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
    <>
      <CredLayoutRenderer
        schema={{
          items: filteredItems.reverse(),
          handleOnItemClick: () => {},
          handleDeleteItem,
          search: {
            searchInputPlaceholder: 'Search Identities',
            searchKeyword,
            setSearchKeyword
          },
          modal: {
            schema: {
              header: 'Add New Identity',
              inputs: [
                {
                  type: 'select',
                  name: 'country',
                  options: options.country,
                  value: formData.country!,
                  handleChange: handleSelectChange,
                  label: 'Select Country',
                  error: formErrors.country
                },
                {
                  type: 'text',
                  name: 'type',
                  value: formData.type!,
                  handleChange: handleInputChange,
                  label: 'Identity Type',
                  error: formErrors.type
                },
                {
                  type: 'text',
                  name: 'energyBPId',
                  value: formData.energyBPId!,
                  handleChange: handleInputChange,
                  label: 'Energy BP ID',
                  error: formErrors.energyBPId
                },
                {
                  type: 'select',
                  name: 'verificationMethod',
                  options: options.verificationMethods,
                  value: formData.verificationMethod!,
                  handleChange: handleSelectChange,
                  label: 'Method Of Verification',
                  error: formErrors.verificationMethod
                },
                {
                  type: 'text',
                  name: 'credNumber',
                  value: formData.credNumber!,
                  handleChange: handleInputChange,
                  label: 'ID Number',
                  error: formErrors.credNumber
                }
              ],
              buttons: [
                {
                  text: 'Add',
                  handleClick: () => {
                    setOpenModal(false)
                    setIsOTPModalOpen(true)
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
      <BottomModalScan
        isOpen={isOTPModalOpen}
        onClose={() => setIsOTPModalOpen(false)}
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
            description="Enter the one time password the we have just sent to your mobile number"
            isLoading={isLoading}
            handleVerifyOtp={handleOnSubmit}
          />
        </Box>
      </BottomModalScan>
    </>
  )
}

export default MyIdentities
