import { Box, Flex, Image, Input, Text } from '@chakra-ui/react'
import axios from 'axios'
import Cookies from 'js-cookie'
import React, { useEffect, useState } from 'react'
import { UploadFilepropsModel } from './UploadFile.types'

const UploadFile: React.FC<UploadFilepropsModel> = props => {
  const { selectedFiles, setSelectedFiles } = props
  const [uploadTimes, setUploadTimes] = useState<string[]>([])

  const dataPayload = {
    type: 'resume',
    description: 'resume doc'
  }

  const bearerToken = Cookies.get('authToken')
  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${bearerToken}`,
      'Content-Type': 'application/json' // You can set the content type as needed
    }
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL

    const files = event.target.files
    if (files) {
      const selectedFileArray: File[] = Array.from(files)
      const currentTime = new Date().toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })

      setSelectedFiles([...selectedFiles, ...selectedFileArray])
      setUploadTimes([...uploadTimes, currentTime])

      let uploadData = new FormData()

      uploadData.append('data', JSON.stringify(dataPayload))
      uploadData.append('files.attachment', selectedFileArray[0])

      try {
        const uploadDocumentResponse = await axios.post(`${strapiUrl}/documents`, uploadData, axiosConfig)
        if (uploadDocumentResponse.data) {
          return
        }
      } catch (error) {
        console.error(error)
      }
    }
  }

  const handleDeletePdf = (indexToDelete: number) => {
    setSelectedFiles(prevSelectedFiles => {
      const newSelectedFiles = [...prevSelectedFiles]
      newSelectedFiles.splice(indexToDelete, 1)
      return newSelectedFiles
    })

    setUploadTimes(prevUploadTimes => {
      const newUploadTimes = [...prevUploadTimes]
      newUploadTimes.splice(indexToDelete, 1)
      return newUploadTimes
    })
  }

  return (
    <>
      {selectedFiles.length > 0 && (
        <Box>
          {selectedFiles.map((file, index) => (
            <Box
              border={'1px solid'}
              borderRadius={'12px'}
              padding="15px 20px"
              mb={'10px'}
              mt={'10px'}
              fontSize="12px"
              key={index}
            >
              <Flex alignItems={'center'}>
                <Image src="/images/pdfIcon.svg" />
                <Box w={'100%'}>
                  <Flex alignItems={'center'} justifyContent="space-between">
                    <Text fontWeight="600" pr={'5px'}>
                      {file.name}
                    </Text>
                    <Image cursor={'pointer'} src="/images/deleteIcon.svg" onClick={() => handleDeletePdf(index)} />
                  </Flex>
                  <Flex alignItems={'center'}>
                    <Text pr={'10px'}>Last Used -</Text>
                    <Text>{uploadTimes[index]}</Text>
                  </Flex>
                </Box>
              </Flex>
            </Box>
          ))}
        </Box>
      )}
      <Box padding={'20px 80px'} border="dashed 1px" borderRadius={'12px'} cursor="pointer" position={'relative'}>
        <Flex alignItems={'center'} justifyContent="center">
          <Image src="/images/uploadIcon.svg" />
          <Text pl={'10px'} pt="5px" fontSize="12px">
            Upload Documents
            <Input
              type="file"
              height="100%"
              width="100%"
              position="absolute"
              top="0"
              left="0"
              opacity="0"
              aria-hidden="true"
              accept="application/pdf"
              onChange={handleFileChange}
              multiple
            />
          </Text>
        </Flex>
      </Box>
    </>
  )
}

export default UploadFile
