import { ROLE, ROUTE_TYPE } from '@lib/config'
import axios from '@services/axios'
import Cookies from 'js-cookie'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useLanguage } from '@hooks/useLanguage'
import { useDispatch, useSelector } from 'react-redux'
import CredLayoutRenderer, { CredFormErrors, FormProps } from '@components/credLayoutRenderer/LayoutRenderer'
import { validateCredForm } from '@utils/form-utils'
import { ItemMetaData } from '@components/credLayoutRenderer/CatalogueRenderer'
import AadharCard from '@public/images/aadharcard.svg'
import { SelectOptionType } from '@beckn-ui/molecules'
import { countryWiseVerification } from '@utils/constants'
import {
  useAddDocumentMutation,
  useGetDocumentsMutation,
  useGetVerificationMethodsMutation,
  useVerifyMutation
} from '@services/walletService'
import { AuthRootState } from '@store/auth-slice'
import {
  extractAuthAndHeader,
  extractMobileNumberFromSubjectDid,
  fromBase64,
  toBase64,
  toSnakeCase
} from '@utils/general'
import { feedbackActions } from '@beckn-ui/common'
import { generateKeyPairFromString, generateSignature } from '@services/cryptoUtilService'
import { generateAuthHeader } from '@utils/auth'

const options = [
  { label: 'Aadhar Card', value: 'aadhar_card' },
  { label: 'PAN Card', value: 'pan_card' },
  { label: 'Driving License', value: 'driving_license' },
  { label: 'Passport', value: 'passport' },
  { label: 'Voter ID', value: 'voter_id' },
  { label: 'Ration Card', value: 'ration_card' },
  { label: 'Birth Certificate', value: 'birth_certificate' }
]

const MyIdentities = () => {
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL
  const bearerToken = Cookies.get('authToken')

  const [items, setItems] = useState<ItemMetaData[]>([])
  const [searchKeyword, setSearchKeyword] = useState<string>('')
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const [countryDetails, setCountryDetails] = useState<Record<string, any>>()
  const [formData, setFormData] = useState<FormProps>({
    type: '',
    credNumber: '',
    country: '',
    verificationMethod: ''
  })
  const [formErrors, setFormErrors] = useState<CredFormErrors>({
    type: '',
    credNumber: '',
    country: '',
    verificationMethod: ''
  })

  const { t } = useLanguage()
  const dispatch = useDispatch()
  const { user, privateKey, publicKey } = useSelector((state: AuthRootState) => state.auth)
  const [addDocument, { isLoading: addDocLoading }] = useAddDocumentMutation()
  const [getVerificationMethods, { data: verificationMethods }] = useGetVerificationMethodsMutation()
  const [getDocuments, { isLoading: verifyLoading }] = useGetDocumentsMutation()

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

  const fetchCredentials = async () => {
    try {
      const result = await getDocuments(user?.did!).unwrap()
      console.log(result)
      const list: ItemMetaData[] = result.map((item, index) => {
        const credData = JSON.parse(fromBase64(item.did))
        return {
          id: index,
          title: credData.type,
          isVerified: true,
          image: AadharCard,
          datetime: new Date().toString(),
          data: credData
        }
      })
      setItems(list)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    }
  }

  useEffect(() => {
    fetchCredentials()
  }, [])

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
        subjectId: did,
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

        await addDocument(addDocPayload).unwrap()

        dispatch(
          feedbackActions.setToastData({
            toastData: { message: 'Success', display: true, type: 'success', description: 'Added Successfully!' }
          })
        )
        setOpenModal(false)
      } else {
        dispatch(
          feedbackActions.setToastData({
            toastData: { message: 'Error', display: true, type: 'error', description: t.errorText }
          })
        )
      }
    } catch (error) {
      console.error('An error occurred:', error)
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
    <CredLayoutRenderer
      schema={{
        items,
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
                handleClick: handleOnSubmit,
                disabled: !isFormFilled,
                variant: 'solid',
                colorScheme: 'primary'
              }
            ]
          },
          openModal,
          handleOpenModal,
          handleCloseModal
        }
      }}
    />
  )
}

export default MyIdentities
