import React, { useEffect, useRef, useState } from 'react'
import { Box, Text, VStack, Icon, Input, HStack } from '@chakra-ui/react'
import { FiPlusCircle } from 'react-icons/fi'
import { Typography } from '@beckn-ui/molecules'

interface DragAndDropUploadProps {
  multiple?: boolean
  dragAndDrop?: boolean
  fileSelectionElement?: (
    inputRef: React.MutableRefObject<HTMLInputElement | null>
  ) => React.ReactElement<any, any> | null
  setFiles: (files: File[]) => void
  accept?: string
}

const DragAndDropUpload = (props: DragAndDropUploadProps) => {
  const { fileSelectionElement, multiple, setFiles, dragAndDrop = false, accept } = props
  const [isDragging, setIsDragging] = useState(false)

  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    if (e.dataTransfer.files) {
      const uploadedFiles = Array.from(e.dataTransfer.files)
      setFiles(uploadedFiles)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const uploadedFiles = Array.from(e.target.files)

      const validFiles = uploadedFiles.filter(file => file.name.endsWith('.json'))

      if (validFiles.length !== uploadedFiles.length) {
        alert('Only JSON files are allowed. Please upload valid .json files.')
      }

      if (validFiles.length > 0) {
        setFiles(validFiles)
      }

      e.target.value = ''
    }
  }

  return (
    <Box
      width="100%"
      padding={'2rem 0'}
      border="1px dashed"
      borderColor={isDragging ? 'blue.400' : 'gray.300'}
      borderRadius="lg"
      backgroundColor={isDragging ? 'blue.50' : 'transparent'}
      display="flex"
      justifyContent="center"
      alignItems="center"
      marginTop={'1rem'}
      position="relative"
      onDrop={dragAndDrop ? handleDrop : () => {}}
      onDragOver={dragAndDrop ? handleDragOver : () => {}}
      onDragLeave={dragAndDrop ? handleDragLeave : () => {}}
    >
      <Input
        type="file"
        multiple={multiple}
        accept={accept}
        style={{
          opacity: 0,
          width: '100%',
          height: '100%',
          position: 'absolute',
          cursor: 'pointer'
        }}
        display="none"
        ref={fileInputRef}
        onChange={handleFileInput}
      />
      <>{fileSelectionElement?.(fileInputRef)}</>
    </Box>
  )
}

export default DragAndDropUpload
