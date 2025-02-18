import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useLanguage } from '@hooks/useLanguage'
import { useDispatch, useSelector } from 'react-redux'
import CredLayoutRenderer, { CredFormErrors, FormProps } from '@components/credLayoutRenderer/LayoutRenderer'
import { validateCredForm } from '@utils/form-utils'
import { InputProps } from '@beckn-ui/molecules'
import DocIcon from '@public/images/physical_icon.svg'
import { DocumentProps } from '@components/documentsRenderer'
import { AuthRootState } from '@store/auth-slice'
import {
  useAddDocumentMutation,
  useDeleteDocumentMutation,
  useGetDocumentsMutation,
  useGetVerificationMethodsMutation
} from '@services/walletService'
import { parseDIDData } from '@utils/did'
import { extractAuthAndHeader, filterByKeyword, generateRandomCode, toBase64, toSnakeCase } from '@utils/general'
import { generateAuthHeader, generateAuthHeaderForDelete } from '@services/cryptoUtilService'
import { feedbackActions } from '@beckn-ui/common'
import { useRouter } from 'next/router'
import { ItemMetaData } from '@components/credLayoutRenderer/ItemRenderer'
import axios from '@services/axios'
import { ROLE, ROUTE_TYPE } from '@lib/config'
import DeleteAlertModal from '@components/modal/DeleteAlertModal'
import { Box } from '@chakra-ui/react'
import { v4 as uuidv4 } from 'uuid'

const options = [
  { label: 'Battery', value: 'Battery' },
  { label: 'Solar panel', value: 'Solar panel' }
]

const PhysicalAssets = () => {
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
    credName: ''
  })
  const [formErrors, setFormErrors] = useState<CredFormErrors>({
    type: '',
    credName: ''
  })

  const { t } = useLanguage()
  const dispatch = useDispatch()
  const router = useRouter()
  const { user, privateKey, publicKey } = useSelector((state: AuthRootState) => state.auth)
  const [addDocument, { isLoading: addDocLoading }] = useAddDocumentMutation()
  const [getVerificationMethods, { isLoading: verificationMethodsLoading }] = useGetVerificationMethodsMutation()
  const [getDocuments, { isLoading: verifyLoading }] = useGetDocumentsMutation()
  const [deleteDocument, { isLoading: deleteDocLoading }] = useDeleteDocumentMutation()

  const fetchCredentials = async () => {
    setIsLoading(true)
    try {
      const result = await getDocuments(user?.did!).unwrap()
      const list: ItemMetaData[] = parseDIDData(result)['assets']['physical'].map((item, index) => {
        return {
          id: index,
          title: item.type,
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

  const attestDocument = async (did: string) => {
    try {
      const requestOptions = {
        method: 'POST',
        withCredentials: true
      }

      const res = await axios.post(
        `${strapiUrl}${ROUTE_TYPE[ROLE.GENERAL]}/wallet/attest`,
        {
          wallet_doc_type: 'PHYSICAL_ASSETS',
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
        type: formData.type
      }
      if (selectedFile) {
        data.fileName = selectedFile?.title
      }
      setIsLoading(true)

      const docDetails = JSON.stringify(data)

      const verificationMethodsRes = await getVerificationMethods(user?.did!).unwrap()
      const { did } = verificationMethodsRes[0]
      let attachments = null
      if (selectedFile) {
        attachments = selectedFile?.title
      }

      const authHeaderRes = await generateAuthHeader({
        subjectId: user?.did!,
        verification_did: did,
        privateKey,
        publicKey,
        payload: {
          name: `assets/physical/type/${toSnakeCase(data?.type!)}/source/wallet${attachments ? '/' + attachments : ''}/${generateRandomCode()}`,
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
        setFormData({
          type: '',
          credName: ''
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

  // const handleSelectChange = (selectedItem: any) => {
  //   const { label, value } = selectedItem

  //   setFormData(prevFormData => ({
  //     ...prevFormData,
  //     ['type']: value
  //   }))

  //   const updatedFormData = {
  //     ...formData,
  //     ['type']: value
  //   }

  //   const errors = validateCredForm(updatedFormData)
  //   setFormErrors(prevErrors => ({
  //     ...prevErrors,
  //     ['type']: t[`${errors['type' as keyof CredFormErrors]}`] || ''
  //   }))
  // }

  const isFormFilled = useMemo(() => {
    const { credName, ...restFormData } = formData
    const { credName: credNameError, ...restFormErrors } = formErrors

    return (
      Object.values(restFormData).every(value => value !== '') &&
      Object.values(restFormErrors).every(value => value === '')
    )
  }, [formData, formErrors])

  const getInputs = useCallback(() => {
    const inputs: InputProps[] = [
      {
        type: 'select',
        name: 'type',
        value: formData.type!,
        options: options,
        handleChange: handleSelectChange,
        label: 'Type',
        error: formErrors.type
      }
      // {
      //   type: 'text',
      //   name: 'deviceLocation',
      //   value: formData.deviceLocation!,
      //   handleChange: handleInputChange,
      //   label: 'Device Location',
      //   error: formErrors.deviceLocation
      // },
      // {
      //   type: 'text',
      //   name: 'assetsMaker',
      //   value: formData?.assetsMaker!,
      //   handleChange: handleInputChange,
      //   label: 'Assets Make',
      //   error: formErrors?.assetsMaker!
      // },
      // {
      //   type: 'text',
      //   name: 'modelNumber',
      //   value: formData?.modelNumber!,
      //   handleChange: handleInputChange,
      //   label: 'Model Number',
      //   error: formErrors?.modelNumber!
      // },
      // {
      //   type: 'text',
      //   name: 'serialNumber',
      //   value: formData?.serialNumber!,
      //   handleChange: handleInputChange,
      //   label: 'Serial Number',
      //   error: formErrors?.serialNumber!
      // }
    ]

    return inputs
  }, [formData])

  const handleOpenCredDetails = (data: ItemMetaData) => {
    console.log(data)
    router.push({
      pathname: '/physicalAssetsDetails',
      query: {
        cred_name: data.title,
        data: JSON.stringify(data)
      }
    })
  }

  return (
    <Box
      className="hideScroll"
      maxH="calc(100vh - 100px)"
      overflowY={'scroll'}
    >
      <CredLayoutRenderer
        schema={{
          items: filteredItems,
          handleOnItemClick: data => handleOpenCredDetails(data),
          handleDeleteItem: data => {
            setDeleteItemDetails(data)
            setIsDeleteModalOpen(true)
          },
          showVerificationStatus: false,
          search: {
            searchInputPlaceholder: 'Search Assets',
            searchKeyword,
            setSearchKeyword
          },
          modal: {
            schema: {
              header: 'Add New Asset',
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
            renderFileUpload: true,
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

export default PhysicalAssets
