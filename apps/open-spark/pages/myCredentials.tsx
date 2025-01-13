import { Box, Flex, HStack, Icon, Image, Input, VStack } from '@chakra-ui/react'
import React, { useEffect, useRef, useState } from 'react'
import jsonIcon from '@public/images/json_icon.svg'
import uploadIcon from '@public/images/upload_file_icon.svg'
import { Typography } from '@beckn-ui/molecules'
import { feedbackActions, formatDate } from '@beckn-ui/common'
import BecknButton from '@beckn-ui/molecules/src/components/button/Button'
import { AuthRootState } from '@store/auth-slice'
import { useDispatch, useSelector } from 'react-redux'
import { useLanguage } from '@hooks/useLanguage'
import axios from '@services/axios'
import { ROUTE_TYPE } from '@lib/config'
import Cookies from 'js-cookie'
import DragAndDropUpload from '@components/dragAndDropUpload'
import { FiPlusCircle } from 'react-icons/fi'
import RenderDocuments from '@components/documentsRenderer'
import DeleteAlertModal from '@components/modal/DeleteAlertModal'

interface DocumentProps {
  id?: string
  icon: string
  title: string
  date: Date
  file?: any
  data?: any
}

const MyCredentials = () => {
  const [credFiles, setCredFiles] = useState<DocumentProps[]>([])
  const [selectedFile, setSelectedFile] = useState<DocumentProps[]>([])
  const [allFilesProcessed, setAllFilesProcessed] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [openDeleteModal, setOpenDeleteModal] = useState<{ isOpen: boolean; handleOperation?: () => void }>()

  const dispatch = useDispatch()
  const { t } = useLanguage()
  const bearerToken = Cookies.get('authToken')

  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL

  const { role } = useSelector((state: AuthRootState) => state.auth)

  const getCredentials = async () => {
    const requestOptions = {
      method: 'GET',
      headers: { Authorization: `Bearer ${bearerToken}` },
      withCredentials: true
    }

    const response = await axios.get(`${strapiUrl}${ROUTE_TYPE[role!]}/cred`, requestOptions)
    if (response.status === 200) {
      const result = response.data
      console.log(result)
      const credData = result.map((data: any) => {
        const { credential } = data
        return {
          id: data.cred_id,
          title: credential.credentialSubject?.documentName,
          icon: jsonIcon,
          date: credential.issuanceDate,
          data: credential
        }
      })
      setCredFiles(credData)
    }
  }

  useEffect(() => {
    getCredentials()
  }, [])

  const handleFileChange = (files: File[]) => {
    console.log(files)
    if (files.length > 0) {
      const docs = files.map(file => {
        console.log('Selected file:', file)
        return { title: file?.name!, icon: uploadIcon, date: new Date(), file: file }
      })
      // setSelectedFile(prevState => (prevState ? [...prevState, ...docs] : docs))
      setSelectedFile(docs)
    }
  }

  const deleteCredById = (data: any) => {
    const requestOptions = {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${bearerToken}` },
      withCredentials: true
    }

    axios
      .delete(`${strapiUrl}${ROUTE_TYPE[role!]}/cred/${data.id}`, requestOptions)
      .then(response => {
        console.log('Deleted successfully:', response.data)
        getCredentials()
        dispatch(
          feedbackActions.setToastData({
            toastData: { message: t.success, display: true, type: 'success', description: 'Deleted successfully' }
          })
        )
        setOpenDeleteModal({ isOpen: false })
      })
      .catch(error => {
        console.error('Error deleting:', error)
      })
  }

  const handleOnDelete = (index: number, document: DocumentProps, type: 'cred' | 'upload') => {
    if (type === 'cred') {
      setOpenDeleteModal({ isOpen: true, handleOperation: () => deleteCredById(document) })
    }
    if (type === 'upload') {
      setSelectedFile(prevState => prevState!.filter((_, i) => i !== index))
    }
  }

  const handleOnUpload = () => {
    setIsLoading(true)
    const formData = new FormData()
    selectedFile?.forEach((data, index) => {
      formData.append(`credential`, data.file)
    })

    axios
      .post(`${strapiUrl}${ROUTE_TYPE[role!]}/upload-cred`, formData, {
        headers: {
          Authorization: `Bearer ${bearerToken}`
        }
      })
      .then(response => {
        console.log('Uploaded successfully:', response.data)
        setSelectedFile([])
        getCredentials()
      })
      .catch(error => {
        console.error('Error uploading:', error)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }
  const clearAllFiles = () => {
    setSelectedFile([])
  }

  return (
    <Box
      margin={'0 auto'}
      maxW={['100%', '100%', '40rem', '40rem']}
      className="hideScroll"
      maxH={'calc(100vh - 100px)'}
      overflowY="scroll"
    >
      <Flex
        flexDirection={'column'}
        // height={'calc(100vh - 100px)'}
        justifyContent="space-between"
      >
        <Box>
          {credFiles!?.length > 0 && (
            <>
              <Typography
                text="Credentials"
                fontWeight="600"
                fontSize="16px"
                style={{
                  marginTop: '1rem'
                }}
              />
              <RenderDocuments
                list={credFiles || []}
                type="cred"
                handleOnDelete={handleOnDelete}
              />
            </>
          )}
          <Typography
            text="Upload a file"
            fontWeight="600"
            fontSize="16px"
            style={{
              marginTop: '1rem'
            }}
          />
          <Typography text="File upload description" />
          {selectedFile.length === 0 && (
            <DragAndDropUpload
              multiple={false}
              accept={'.json'}
              dragAndDrop={true}
              setFiles={handleFileChange}
              fileSelectionElement={(fileInputRef: any) => {
                return (
                  <VStack>
                    <Icon
                      as={FiPlusCircle}
                      boxSize={6}
                      color="gray.500"
                    />
                    <Typography text={'Drop your file here'} />
                    <HStack gap={1}>
                      <Typography
                        color="#4498E8"
                        fontSize="8px"
                        onClick={() => {
                          if (fileInputRef.current) {
                            fileInputRef.current.click()
                          }
                        }}
                        sx={{ cursor: 'pointer', _hover: { textDecoration: 'underline' } }}
                        text="Browse file"
                      />{' '}
                      <Typography
                        fontSize="8px"
                        text={'from your computer'}
                      />
                    </HStack>
                  </VStack>
                )
              }}
            />
          )}
          <RenderDocuments
            list={selectedFile || []}
            type="upload"
            handleOnDelete={handleOnDelete}
            onAllComplete={status => {
              setAllFilesProcessed(status)
            }}
          />
        </Box>
        <Flex
          alignItems={'center'}
          mt={'20px'}
        >
          <BecknButton
            children="Cancel"
            variant="outline"
            disabled={selectedFile?.length === 0 || !allFilesProcessed}
            color="#E93324"
            sx={{ marginRight: '8px', border: '1px solid red' }}
            handleClick={clearAllFiles}
          />
          <BecknButton
            text={t.upload}
            disabled={selectedFile?.length === 0 || !allFilesProcessed}
            sx={{ marginLeft: '8px' }}
            handleClick={handleOnUpload}
            isLoading={isLoading}
          />
        </Flex>
      </Flex>
      <DeleteAlertModal
        isOpen={openDeleteModal?.isOpen!}
        onClose={() => setOpenDeleteModal({ isOpen: false })}
        handleConfirmDeleteDevice={() => openDeleteModal?.handleOperation?.()}
      />
    </Box>
  )
}

export default MyCredentials
