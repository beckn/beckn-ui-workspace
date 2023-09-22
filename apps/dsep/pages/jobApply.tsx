import { Box, Text, Flex } from '@chakra-ui/react'
import Router from 'next/router'
import React from 'react'
import Button from '../components/button/Button'
import JobApply from '../components/jobApply/JobApply'
import UploadFile from '../components/uploadFile/UploadFile'
import { useLanguage } from '../hooks/useLanguage'

const jobApply = () => {
  const { t } = useLanguage()
  return (
    <Box className="hideScroll" maxH={'calc(100vh - 100px)'} overflowY="scroll">
      <Box pb={'20px'}>
        <JobApply />
        <Text pb={'10px'} fontSize={'15px'}>
          {t.docText}
        </Text>
        <UploadFile />
      </Box>
      <Flex alignItems={'baseline'} pb="30px">
        <input type="checkbox" style={{ position: 'relative', top: '2px' }} />
        <Text fontSize={'12px'} pl="10px">
          {t.declarationText}
        </Text>
      </Flex>
      <Button
        buttonText={t.applyBtnText}
        background={'rgba(var(--color-primary))'}
        color={'rgba(var(--text-color))'}
        handleOnClick={() => {
          Router.push('/applicationSent')
        }}
        isDisabled={false}
      />
    </Box>
  )
}

export default jobApply
