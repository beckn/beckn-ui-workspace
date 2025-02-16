import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useLanguage } from '@hooks/useLanguage'
import { useDispatch, useSelector } from 'react-redux'
import CredLayoutRenderer, { CredFormErrors, FormProps } from '@components/credLayoutRenderer/LayoutRenderer'
import { validateCredForm } from '@utils/form-utils'
import { InputProps } from '@beckn-ui/molecules'
import { AuthRootState } from '@store/auth-slice'
import {
  useAddDocumentMutation,
  useGetDocumentsMutation,
  useGetVerificationMethodsMutation
} from '@services/walletService'
import DocIcon from '@public/images/doc_icon.svg'
import { parseDIDData } from '@utils/did'
import { extractAuthAndHeader, filterByKeyword, toBase64, toSnakeCase } from '@utils/general'
import { generateAuthHeader } from '@services/cryptoUtilService'
import { feedbackActions } from '@beckn-ui/common'
import { DocumentProps } from '@components/documentsRenderer'
import { ItemMetaData } from '@components/credLayoutRenderer/ItemRenderer'

const options = [
  { label: 'Document', value: 'document' },
  { label: 'URL', value: 'url' }
]

const MyCredentials = () => {
  const [items, setItems] = useState<ItemMetaData[]>([])
  const [filteredItems, setFilteredItems] = useState(items)
  const [searchKeyword, setSearchKeyword] = useState<string>('')
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [selectedFile, setSelectedFile] = useState<DocumentProps>()

  const [formData, setFormData] = useState<FormProps>({
    type: '',
    credName: ''
  })
  const [formErrors, setFormErrors] = useState<CredFormErrors>({
    type: '',
    credName: ''
  })

  const { t } = useLanguage()
  const dispatch = useDispatch()
  const { user, privateKey, publicKey } = useSelector((state: AuthRootState) => state.auth)
  const [addDocument, { isLoading: addDocLoading }] = useAddDocumentMutation()
  const [getVerificationMethods, { isLoading: verificationMethodsLoading }] = useGetVerificationMethodsMutation()
  const [getDocuments, { isLoading: verifyLoading }] = useGetDocumentsMutation()

  const fetchCredentials = async () => {
    try {
      setIsLoading(true)
      const result = await getDocuments(user?.did!).unwrap()
      const list: ItemMetaData[] = parseDIDData(result)['assets']['credentials'].map((item, index) => {
        return {
          id: index,
          title: item.name,
          isVerified: true,
          image: DocIcon,
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

  const handleOpenModal = () => setOpenModal(true)
  const handleCloseModal = () => setOpenModal(false)

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

      const data: any = {
        type: formData.type,
        credName: formData.credName?.trim()
      }
      if (formData.type === 'document' && selectedFile) {
        data.fileName = selectedFile?.title
      } else if (formData.type === 'url' && formData.url !== '') {
        data.url = formData.url
      }
      setIsLoading(true)

      const docDetails = JSON.stringify(data)

      const verificationMethodsRes = await getVerificationMethods(user?.did!).unwrap()
      const { did } = verificationMethodsRes[0]
      let attachments = null
      if (formData.url && formData.url !== '') {
        attachments = formData.url
      } else if (selectedFile) {
        attachments = selectedFile?.title
      }

      const authHeaderRes = await generateAuthHeader({
        subjectId: user?.did!,
        verification_did: did,
        privateKey,
        publicKey,
        payload: {
          name: `assets/credentials/type/${toSnakeCase(data?.type!)}/cred_name/${toSnakeCase(data.credName)}${attachments ? '/' + attachments : ''}`,
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
        setFormData({
          type: '',
          credName: '',
          url: ''
        })
        setSelectedFile(undefined)
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

  const handleOnFileselectionChange = (data: DocumentProps[]) => {
    setSelectedFile(data[0])
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
    const { label, value } = selectedItem

    setFormData(prevFormData => ({
      ...prevFormData,
      ['type']: value
    }))

    const updatedFormData = {
      ...formData,
      ['type']: value
    }

    const errors = validateCredForm(updatedFormData)
    setFormErrors(prevErrors => ({
      ...prevErrors,
      ['type']: t[`${errors['type' as keyof CredFormErrors]}`] || ''
    }))
  }

  const isFormFilled = useMemo(() => {
    return (
      Object.values(formData).every(value => value !== '') && Object.values(formErrors).every(value => value === '')
    )
  }, [formData, formErrors])

  const getInputs = useCallback(() => {
    const inputs: InputProps[] = [
      {
        type: 'select',
        name: 'type',
        options: options,
        value: formData.type!,
        handleChange: handleSelectChange,
        label: 'Credential Type',
        error: formErrors.type
      },
      {
        type: 'text',
        name: 'credName',
        value: formData.credName!,
        handleChange: handleInputChange,
        label: 'Credential Name',
        error: formErrors.credName
      }
    ]

    if (formData.type === 'url') {
      inputs.push({
        type: 'text',
        name: 'url',
        value: formData?.url!,
        handleChange: handleInputChange,
        label: 'URL',
        error: formErrors?.url!
      })
    }

    return inputs
  }, [formData])

  return (
    <CredLayoutRenderer
      schema={{
        items: filteredItems.reverse(),
        handleOnItemClick: () => {},
        search: {
          searchInputPlaceholder: 'Search Credentials',
          searchKeyword,
          setSearchKeyword
        },
        modal: {
          schema: {
            header: 'Add New Credential',
            inputs: getInputs(),
            buttons: [
              {
                text: 'Add',
                handleClick: handleOnSubmit,
                disabled: !isFormFilled,
                variant: 'solid',
                colorScheme: 'primary',
                isLoading: isLoading
              }
            ]
          },
          isLoading,
          openModal,
          clearDocuments: !selectedFile,
          handleOpenModal,
          handleCloseModal,
          renderFileUpload: formData.type === 'document',
          handleOnFileselectionChange
        }
      }}
    />
  )
}

export default MyCredentials
