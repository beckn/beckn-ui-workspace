import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useLanguage } from '@hooks/useLanguage'
import { useDispatch, useSelector } from 'react-redux'
import CredLayoutRenderer, { CredFormErrors, FormProps } from '@components/credLayoutRenderer/LayoutRenderer'
import { validateCredForm } from '@utils/form-utils'
import { InputProps } from '@beckn-ui/molecules'
import { AuthRootState } from '@store/auth-slice'
import {
  useAddDocumentMutation,
  useDeleteDocumentMutation,
  useGetDocumentsMutation,
  useGetVerificationMethodsMutation
} from '@services/walletService'
import DocIcon from '@public/images/doc_icon.svg'
import { parseDIDData } from '@utils/did'
import { extractAuthAndHeader, filterByKeyword, toBase64, toSnakeCase } from '@utils/general'
import { generateAuthHeader, generateAuthHeaderForDelete } from '@services/cryptoUtilService'
import { feedbackActions, formatDate } from '@beckn-ui/common'
import { DocumentProps } from '@components/documentsRenderer'
import { ItemMetaData } from '@components/credLayoutRenderer/ItemRenderer'
import axios from '@services/axios'
import { ROLE, ROUTE_TYPE } from '@lib/config'
import DeleteAlertModal from '@components/modal/DeleteAlertModal'
import { Box } from '@chakra-ui/react'
import { useUploadFileMutation } from '@services/UserService'

const options = [
  { label: 'Document', value: 'document' },
  { label: 'URL', value: 'url' }
]

const MyCredentials = () => {
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL

  const [items, setItems] = useState<ItemMetaData[]>([])
  const [filteredItems, setFilteredItems] = useState(items)
  const [searchKeyword, setSearchKeyword] = useState<string>('')
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [selectedFile, setSelectedFile] = useState<DocumentProps>()
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false)
  const [deleteItemDetails, setDeleteItemDetails] = useState<ItemMetaData>()

  const [formData, setFormData] = useState<FormProps>({
    type: '',
    credName: 'Solar Panel Ownership Certificate'
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
  const [deleteDocument, { isLoading: deleteDocLoading }] = useDeleteDocumentMutation()
  const [uploadFile] = useUploadFileMutation()

  const fetchCredentials = async () => {
    try {
      setIsLoading(true)
      const result = await getDocuments(user?.did!).unwrap()
      const list: ItemMetaData[] = parseDIDData(result)
        ['assets']['credentials'].map((item, index) => {
          return {
            id: index,
            title: item.name,
            isVerified: true,
            image: DocIcon,
            datetime: item?.createdAt?.length > 5 ? item.createdAt : Math.floor(new Date().getTime() / 1000),
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

  const handleOpenModal = () => setOpenModal(true)
  const handleCloseModal = () => setOpenModal(false)

  const attestDocument = async (did: string) => {
    try {
      const requestOptions = {
        method: 'POST',
        withCredentials: true
      }

      const res = await axios.post(
        `${strapiUrl}${ROUTE_TYPE[ROLE.GENERAL]}/wallet/attest`,
        {
          wallet_doc_type: 'CREDENTIALS',
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
        const uploadPayload = new FormData()
        uploadPayload.append('file', selectedFile.file)
        const res: any = await uploadFile(uploadPayload)
        data.fileUrl = res.data.fileUrl
      } else if (formData.type === 'url' && formData.url !== '') {
        data.url = formData.url
      }
      setIsLoading(true)

      const docDetails = JSON.stringify(data)
      const createdAt = Math.floor(new Date().getTime() / 1000)
      const verificationMethodsRes = await getVerificationMethods(user?.did!).unwrap()
      const { did } = verificationMethodsRes[0]
      let attachments = null
      if (formData.url && formData.url !== '') {
        attachments = formData.url.replace(/^https?:\/\//, '')
      } else if (selectedFile) {
        attachments = selectedFile?.title
      }

      const authHeaderRes = await generateAuthHeader({
        subjectId: user?.did!,
        verification_did: did,
        privateKey,
        publicKey,
        payload: {
          name: `assets/credentials/type/${toSnakeCase(data?.type!)}/cred_name/${toSnakeCase(data.credName)}${attachments ? '/' + attachments : ''}/${createdAt}`,
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
        setOpenModal(false)
        setSelectedFile(undefined)
        setIsDeleteModalOpen(false)
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
    return Object.values(formData).every(value => value !== '') &&
      Object.values(formErrors).every(value => value === '') &&
      formData.type === 'url'
      ? formData.url !== '' && formErrors.url === ''
      : selectedFile
  }, [formData, formErrors, selectedFile])

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

  useEffect(() => {
    if (formData.type === 'url') {
      setSelectedFile(undefined)
    }
  }, [formData])

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
          showVerificationStatus: false,
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
      <DeleteAlertModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        handleConfirmDeleteDevice={() => handleDeleteItem(deleteItemDetails!)}
        isLoading={false}
      />
    </Box>
  )
}

export default MyCredentials
