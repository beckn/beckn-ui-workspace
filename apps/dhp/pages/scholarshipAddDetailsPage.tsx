import { Box } from '@chakra-ui/react'
import Router from 'next/router'
import React, { useState } from 'react'
import Button from '../components/button/Button'
import ScholarshipAddDetails from '../components/scholarship/addDetails/ScholarshipAddDetails'
import UploadFile from '../components/uploadFile/UploadFile'
import { useLanguage } from '../hooks/useLanguage'

const ScholarshipAddDetailsPage = () => {
  const { t } = useLanguage()
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  return (
    <Box className="hideScroll" maxH={'calc(100vh - 100px)'} overflowY="scroll">
      <Box pt={'15px'} pb={'20px'}>
        <ScholarshipAddDetails />
        <UploadFile selectedFiles={selectedFiles} setSelectedFiles={setSelectedFiles} />
      </Box>
      <Button
        buttonText={t.submit}
        background={'rgba(var(--color-primary))'}
        color={'rgba(var(--text-color))'}
        handleOnClick={() => {
          Router.push('/scholarshipConfirmationPage')
        }}
        isDisabled={false}
      />
    </Box>
  )
}

export default ScholarshipAddDetailsPage
