import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useLanguage } from '@hooks/useLanguage'
import { useDispatch, useSelector } from 'react-redux'
import CredLayoutRenderer, { CredFormErrors, FormProps } from '@components/credLayoutRenderer/LayoutRenderer'
import { validateCredForm } from '@utils/form-utils'
import { InputProps } from '@beckn-ui/molecules'
import DocIcon from '@public/images/battery_icon.svg'
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
import { ConfirmResponseModel, feedbackActions, formatDate } from '@beckn-ui/common'
import { useRouter } from 'next/router'
import { ItemMetaData } from '@components/credLayoutRenderer/ItemRenderer'
import axios from '@services/axios'
import { ROLE, ROUTE_TYPE } from '@lib/config'
import DeleteAlertModal from '@components/modal/DeleteAlertModal'
import { Box } from '@chakra-ui/react'
import { useUploadFileMutation } from '@services/UserService'
import QRCodeScanner from '@components/QRCode/QRScanner'
import { UserRootState } from '@store/user-slice'

const options = [
  { label: 'Battery', value: 'Battery' },
  { label: 'Solar panel', value: 'Solar panel' }
]

const PhysicalAssets = () => {
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL
  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  const [items, setItems] = useState<ItemMetaData[]>([])
  const [filteredItems, setFilteredItems] = useState(items)
  const [searchKeyword, setSearchKeyword] = useState<string>('')
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [selectedFile, setSelectedFile] = useState<DocumentProps>()
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false)
  const [deleteItemDetails, setDeleteItemDetails] = useState<ItemMetaData>()
  const [showScanner, setShowScanner] = useState(false)
  const [confirmResOfQRScannedData, setConfirmResOfQRScannedData] = useState<any>(null)

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
  const { profileDetails } = useSelector((state: UserRootState) => state.user)
  const [addDocument, { isLoading: addDocLoading }] = useAddDocumentMutation()
  const [getVerificationMethods, { isLoading: verificationMethodsLoading }] = useGetVerificationMethodsMutation()
  const [getDocuments, { isLoading: verifyLoading }] = useGetDocumentsMutation()
  const [deleteDocument, { isLoading: deleteDocLoading }] = useDeleteDocumentMutation()
  const [uploadFile] = useUploadFileMutation()

  const fetchCredentials = async () => {
    setIsLoading(true)
    try {
      const result = await getDocuments(user?.did!).unwrap()
      const list: ItemMetaData[] = parseDIDData(result)
        ['assets']['physical'].map((item, index) => {
          return {
            id: index,
            title: item.type,
            isVerified: true,
            image: DocIcon,
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

  const handleOpenModal = () => setOpenModal(true)
  const handleCloseModal = () => {
    setFormData({
      type: '',
      credName: ''
    })
    setSelectedFile(undefined)
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

  const extractItemsWithProvider = (orders: ConfirmResponseModel[] | string): string => {
    if (!orders || (Array.isArray(orders) && orders.length === 0)) return ''

    if (typeof orders === 'string') {
      return orders.length > 50 ? orders.slice(0, 47) + '...' : orders
    }

    return orders
      .map(order => {
        const providerName = order.message.provider.name
        const itemNames = order.message.items.map((item: any) => item.name).join(', ')
        let result = `${itemNames} by ${providerName}`

        return result.length > 50 ? result.slice(0, 47) + '...' : result
      })
      .join('; ')
  }

  const handleOnSubmit = async (statusRes?: any) => {
    try {
      const orderConfirmationData = statusRes
      if (!orderConfirmationData) {
        const errors = validateCredForm(formData) as any
        delete errors?.url
        setFormErrors(prevErrors => ({
          ...prevErrors,
          ...Object.keys(errors).reduce((acc: any, key) => {
            acc[key] = t[`${errors[key]}`] || ''
            return acc
          }, {} as CredFormErrors)
        }))
      }

      const data: any = {
        type: formData?.type || ''
      }

      if (selectedFile) {
        if (selectedFile.file.size > 1 * 1024 * 1024) {
          dispatch(
            feedbackActions.setToastData({
              toastData: {
                message: 'Error',
                display: true,
                type: 'error',
                description: 'File size should be less than 1MB.'
              }
            })
          )
          return
        }
        data.fileName = selectedFile?.title
        const uploadPayload = new FormData()
        uploadPayload.append('file', selectedFile.file)
        const res: any = await uploadFile(uploadPayload)
        data.fileUrl = res.data.fileUrl
      }
      setIsLoading(true)

      const docDetails = JSON.stringify(data)
      const createdAt = Math.floor(new Date().getTime() / 1000)
      let generatedOrderId = generateRandomCode()
      const verificationMethodsRes = await getVerificationMethods(user?.did!).unwrap()
      const { did } = verificationMethodsRes[0]

      if (orderConfirmationData) {
        const totalItemsStr = extractItemsWithProvider(orderConfirmationData[0].message.order.items[0].name)
        data.type = totalItemsStr
        data.confirmDetails = orderConfirmationData
        generatedOrderId = orderConfirmationData[0].message.order.id
      }

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
          name: `assets/physical/type/${toSnakeCase(data?.type!)}/source/wallet/${createdAt}${attachments ? '/' + attachments : ''}/${generatedOrderId}`,
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
    console.log(formData, formErrors, selectedFile)
    return (
      Object.values(restFormData).every(value => value !== '') &&
      Object.values(restFormErrors).every(value => value === '') &&
      selectedFile
    )
  }, [formData, formErrors, selectedFile])

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
  }, [formData, formErrors])

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

  const handleOpenScanner = () => {
    setShowScanner(true)
  }

  const getOrderStatusData = (scannedData: any) => {
    if (
      profileDetails &&
      scannedData &&
      scannedData?.userId === profileDetails?.id &&
      scannedData?.userPhone === profileDetails?.agent?.agent_profile.phone_number &&
      scannedData?.payload
    ) {
      setIsLoading(true)
      axios
        .post(`${apiUrl}/status`, scannedData.payload)
        .then(res => {
          handleOnSubmit(res.data.data)
        })
        .catch(err => {
          console.error('Error fetching asset status:', err)
        })
        .finally(() => {
          setIsLoading(false)
        })
    } else {
      dispatch(
        feedbackActions.setToastData({
          toastData: {
            message: 'Invalid QR code!',
            display: true,
            type: 'error',
            description: 'Please scan a valid QR code.'
          }
        })
      )
    }
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
                  handleClick: () => handleOnSubmit(),
                  disabled: !isFormFilled,
                  variant: 'solid',
                  colorScheme: 'primary',
                  isLoading: isLoading
                },
                {
                  text: 'Scan QR Code',
                  handleClick: handleOpenScanner,
                  disabled: false,
                  variant: 'outline',
                  colorScheme: 'primary',
                  isLoading: false
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
      <QRCodeScanner
        showScanner={showScanner}
        setShowScanner={setShowScanner}
        setScannedData={scannedData => getOrderStatusData(scannedData)}
      />
    </Box>
  )
}

export default PhysicalAssets
