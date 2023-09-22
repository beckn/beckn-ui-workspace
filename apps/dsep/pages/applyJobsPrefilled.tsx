import { Box, Flex, Text, Image, Divider } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useLanguage } from '../hooks/useLanguage'

const applyJobsPrefilled = () => {
  const { t } = useLanguage()
  const [jobsStatus, setJobsStatus] = useState('In Progress')
  return (
    <Box>
      <Text fontSize={'15px'} pb="20px">
        Senior UX Analyst: Company name
      </Text>
      <Flex alignItems={'center'} fontSize="12px" pb={'20px'}>
        {jobsStatus === 'In Progress' ? (
          <Image src="/images/inProgress.svg" alt="" pr="10px" />
        ) : (
          <Image src="/images/approvedIcon.svg" alt="" pr="10px" />
        )}
        <Text>{jobsStatus}</Text>
      </Flex>
      <Text fontSize={'15px'} pb="5px">
        {t.contactInformation}
      </Text>
      <Box fontSize={'12px'} padding="15px 10px" border={'1px solid #BFBFBF'} borderRadius="12px" mb={'30px'}>
        <Box pb={'8px'}>
          <Text as={'span'} fontWeight="600">
            {t.nameText}:
          </Text>
          <Text as={'span'}> Maria</Text>
        </Box>
        <Box pb={'8px'}>
          <Text as={'span'} fontWeight="600">
            {t.mobileNo}:
          </Text>
          <Text as={'span'}> +91 9876543210</Text>
        </Box>
        <Box>
          <Text as={'span'} fontWeight="600">
            {t.emailId}:
          </Text>
          <Text as={'span'}> abc@example.com</Text>
        </Box>
      </Box>
      <Text fontSize={'15px'}>{t.certificates}</Text>
      <Box
        border={'1px solid #BFBFBF'}
        borderRadius={'12px'}
        padding="15px 20px"
        mb={'10px'}
        mt={'10px'}
        fontSize="12px"
      >
        <Flex alignItems={'center'}>
          <Image src="/images/pdfIcon.svg" />
          <Box>
            <Flex alignItems={'center'} justifyContent="space-between">
              <Text fontWeight="600" pr={'5px'}>
                Resume_Maria
              </Text>
            </Flex>
          </Box>
        </Flex>
        {/* ///////// */}
        <Divider pt={'15px'} mb="15px" width={'unset'} mr="-20px" ml="-20px" />
        {/* //////// */}
        <Flex alignItems={'center'}>
          <Image src="/images/pdfIcon.svg" />
          <Box>
            <Flex alignItems={'center'} justifyContent="space-between">
              <Text fontWeight="600" pr={'5px'}>
                Resume_Maria
              </Text>
            </Flex>
          </Box>
        </Flex>
      </Box>
    </Box>
  )
}

export default applyJobsPrefilled
