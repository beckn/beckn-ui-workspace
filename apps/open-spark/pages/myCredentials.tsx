import { Box, Flex, Image, Input } from '@chakra-ui/react'
import React, { useEffect, useRef, useState } from 'react'
import pdfIcon from '@public/images/PDF.svg'
import jsonIcon from '@public/images/json_icon.svg'
import deleteIcon from '@public/images/delete_icon.svg'
import uploadIcon from '@public/images/upload_icon.svg'
import { Typography } from '@beckn-ui/molecules'
import { formatDate } from '@beckn-ui/common'
import BecknButton from '@beckn-ui/molecules/src/components/button/Button'
import { AuthRootState } from '@store/auth-slice'
import { useSelector } from 'react-redux'
import { useLanguage } from '@hooks/useLanguage'

interface DocumentProps {
  icon: string
  title: string
  file: any
  date: Date
}

const docMap: DocumentProps[] = [
  {
    icon: jsonIcon,
    title: 'Id Proof',
    file: '',
    date: new Date()
  },
  {
    icon: jsonIcon,
    title: 'Address Proof',
    file: '',
    date: new Date()
  }
]

const MyCredentials = () => {
  const [credFiles, setCredFiles] = useState<DocumentProps[] | null>(docMap)
  const [selectedFile, setSelectedFile] = useState<DocumentProps[] | null>(null)
  //   const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const { t } = useLanguage()

  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL

  const { role } = useSelector((state: AuthRootState) => state.auth)

  const getCredentials = () => {}

  useEffect(() => {
    getCredentials()
  }, [])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0]
      console.log('Selected file:', file)
      const data = { title: file?.name!, icon: pdfIcon, date: new Date(), file: file }
      setSelectedFile(prevState => (prevState ? [...prevState, data] : [data]))

      // Generate preview URL for images
      //   const preview = URL.createObjectURL(file)
      //   setPreviewUrl(preview)
    }
  }

  const handleOnDelete = (index: number, type: 'cred' | 'upload') => {
    if (type === 'cred') {
      setCredFiles(prevState => prevState!.filter((_, i) => i !== index))
    }
    if (type === 'upload') {
      setSelectedFile(prevState => prevState!.filter((_, i) => i !== index))
    }
  }

  const handleOnSave = () => {}

  const renderCredentialDocuments = (list: DocumentProps[], type: 'cred' | 'upload') => {
    return list.map((document, index) => {
      return (
        <Flex
          border={'1px solid #BFBFBF'}
          borderRadius="1rem"
          padding="1rem"
          justifyContent={'space-between'}
          key={index}
          height="78px"
          marginTop={'0.8rem'}
        >
          <Flex>
            <Image
              src={document.icon}
              alt="doc_type"
            />
            <Flex
              flexDirection={'column'}
              alignSelf={'center'}
              marginLeft="1rem"
            >
              <Typography
                text={document.title}
                fontWeight="600"
              />
              <Typography text={formatDate(document.date, "dd MMM yyyy 'at' hh:mm a")} />
            </Flex>
          </Flex>
          <Image
            src={deleteIcon}
            alt="delete"
            alignSelf={'center'}
            width={'16px'}
            height={'16px'}
            cursor="pointer"
            onClick={() => handleOnDelete(index, type)}
          />
        </Flex>
      )
    })
  }
  return (
    <Box
      margin={'0 auto'}
      maxW={['100%', '100%', '40rem', '40rem']}
      className="hideScroll"
      maxH={'calc(100vh - 80px)'}
      overflowY="scroll"
    >
      <Flex
        flexDirection={'column'}
        height={'calc(100vh - 100px)'}
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
              {renderCredentialDocuments(credFiles || [], 'cred')}
            </>
          )}
          <Typography
            text="Documents"
            fontWeight="600"
            fontSize="16px"
            style={{
              marginTop: '1rem'
            }}
          />
          {renderCredentialDocuments(selectedFile || [], 'upload')}
          <Input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            display="none"
          />
          <Flex
            border={'1px dashed #000000'}
            borderRadius="1rem"
            padding="1rem"
            justifyContent={'center'}
            height="78px"
            marginTop={'0.8rem'}
            cursor="pointer"
            onClick={() => {
              if (fileInputRef.current) {
                fileInputRef.current.click()
              }
            }}
          >
            <Flex alignItems={'center'}>
              <Image
                src={uploadIcon}
                alt="upload"
              />

              <Typography
                text={'Upload Documents'}
                sx={{
                  marginLeft: '0.5rem'
                }}
              />
            </Flex>
          </Flex>
        </Box>
        {/* {previewUrl && (
          <Image
            src={previewUrl}
            alt="Preview"
            width="200px"
            height={'200px'}
            alignSelf="center"
          />
        )} */}

        <BecknButton
          text={t.upload}
          sx={{ marginTop: '2rem' }}
          handleClick={handleOnSave}
        />
      </Flex>
    </Box>
  )
}

export default MyCredentials
