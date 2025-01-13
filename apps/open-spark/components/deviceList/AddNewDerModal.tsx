import React, { useState } from 'react'
import BottomModalScan from '@beckn-ui/common/src/components/BottomModal/BottomModalScan'
import { Input, LoaderWithMessage, Typography } from '@beckn-ui/molecules'
import BecknButton from '@beckn-ui/molecules/src/components/button'
import { Box, Flex, Image } from '@chakra-ui/react'
import uploadIcon from '@public/images/upload_icon.svg'
import pdfIcon from '@public/images/PDF.svg'
import DragAndDropUpload from '@components/dragAndDropUpload'
import RenderDocuments, { DocumentProps } from '@components/documentsRenderer'

interface Proofs {
  id: number
  name: string
  date: string
}

interface AddNewDerModalProps {
  isOpen: boolean
  onClose: () => void
  proofs?: Proofs[]
  handleDelete?: (id: number) => void
  handleFileUpload?: (event: any) => void
  onSubmit: (category: string, uploadedFiles: File[]) => Promise<void>
  isLoading?: boolean
}

const AddNewDerModal = (props: AddNewDerModalProps) => {
  const [category, setCategory] = useState('')
  const [uploadedFiles, setUploadedFiles] = useState<DocumentProps[]>([])
  const [allFilesProcessed, setAllFilesProcessed] = useState<boolean>(false)

  const { isOpen, onClose, onSubmit, isLoading } = props

  const handleFileChange = (files: File[]) => {
    if (files.length > 0) {
      const docs = files.map(file => {
        console.log('Selected file:', file)
        return { title: file?.name!, icon: pdfIcon, date: new Date(), file: file }
      })
      setUploadedFiles(prevState => (prevState ? [...prevState, ...docs] : docs))
    }
  }

  const handleAddDevice = () => {
    if (!category || uploadedFiles.length === 0) {
      alert('Please provide all details.')
      return
    }
    const files = uploadedFiles.map(doc => doc.file)
    onSubmit(category, files)
      .then(() => {
        setCategory('')
        setUploadedFiles([])
      })
      .catch(err => {
        console.error('Error adding device:', err.message)
      })
  }

  const handleOnDelete = (index: number, document: DocumentProps, type: 'cred' | 'upload') => {
    if (type === 'cred') {
      setUploadedFiles(prevState => prevState!.filter((_, i) => i !== index))
    }
  }

  return (
    <BottomModalScan
      isOpen={isOpen}
      onClose={onClose}
      modalHeader="Add New DER"
      isLoading={isLoading}
    >
      {isLoading ? (
        <Box
          display="grid"
          height="100%"
          alignContent="center"
        >
          <LoaderWithMessage
            loadingText="Please Wait"
            loadingSubText="While We are adding DERS"
          />
        </Box>
      ) : (
        <Flex
          padding="0 20px"
          flexDir="column"
        >
          <Input
            name="category"
            type="text"
            value={category}
            label="Category"
            handleChange={e => setCategory(e.target.value)}
          />
          <Typography
            text="Proofs"
            fontSize="15px"
            fontWeight="500"
          />
          <RenderDocuments
            list={uploadedFiles || []}
            type="cred"
            handleOnDelete={handleOnDelete}
            onAllComplete={status => {
              setAllFilesProcessed(status)
            }}
          />
          <DragAndDropUpload
            multiple={true}
            accept="image/png, image/jpeg, image/jpg, image/gif, .pdf, .txt"
            setFiles={handleFileChange}
            fileSelectionElement={(fileInputRef: any) => {
              return (
                <Flex
                  alignItems="center"
                  cursor="pointer"
                  onClick={() => {
                    if (fileInputRef.current) {
                      fileInputRef.current.click()
                    }
                  }}
                >
                  <Image
                    src={uploadIcon}
                    alt="upload"
                  />
                  <Typography
                    text="Upload Documents"
                    sx={{
                      marginLeft: '0.5rem'
                    }}
                  />
                </Flex>
              )
            }}
          />
          <BecknButton
            children="Add DER"
            handleClick={handleAddDevice}
            disabled={!category.trim() || uploadedFiles.length === 0}
            sx={{ marginTop: '20px' }}
            isLoading={isLoading}
          />
        </Flex>
      )}
    </BottomModalScan>
  )
}

export default AddNewDerModal
