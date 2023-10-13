import { Box, Flex, Text, Image, Divider } from '@chakra-ui/react'
import axios from 'axios'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useLanguage } from '../hooks/useLanguage'

const applyJobsPrefilled = () => {
  const { t } = useLanguage()
  const router = useRouter()
  const [jobData, setJobData] = useState(null)
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: ''
  })
  const [documents, setDocuments] = useState([])
  const query = router.query
  const { jobId } = query
  const apiUrl = process.env.NEXT_PUBLIC_STRAPI_URL
  const bearerToken = Cookies.get('authToken')
  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${bearerToken}`,
      'Content-Type': 'application/json' // You can set the content type as needed
    }
  }

  useEffect(() => {
    const email = Cookies.get('userEmail') as string
    axios
      .get(`${apiUrl}/profiles?populate[0]=documents.attachment`, axiosConfig)
      .then(res => {
        const profileResponse = res.data
        const documents = profileResponse.data.attributes.documents.data
        setDocuments(documents)
        const profileData = profileResponse.data.attributes
        const { name, phone } = profileData
        setUserData({
          name,
          email,
          phone
        })
      })
      .catch(e => console.error(e))
  }, [])

  useEffect(() => {
    if (jobId) {
      axios
        .get(`${apiUrl}/orders/${jobId}?populate[0]=3`, axiosConfig)
        .then(res => {
          setJobData(res.data.data.attributes)
        })
        .catch(e => console.error(e))
    }
  }, [jobId])

  if (!jobData) {
    return <></>
  }

  const { delivery_status: jobStatus, items } = jobData
  const { email, name: userName, phone } = userData

  const {
    descriptor: { name }
  } = items[0]

  return (
    <Box>
      <Text fontSize={'15px'} pb="20px">
        {name}
      </Text>
      <Flex alignItems={'center'} fontSize="12px" pb={'20px'}>
        {jobStatus === 'In Review' ? (
          <Image src="/images/inProgress.svg" alt="" pr="10px" />
        ) : (
          <Image src="/images/approvedIcon.svg" alt="" pr="10px" />
        )}
        <Text>{jobStatus}</Text>
      </Flex>
      <Text fontSize={'15px'} pb="5px">
        {t.contactInformation}
      </Text>
      <Box fontSize={'12px'} padding="15px 10px" border={'1px solid #BFBFBF'} borderRadius="12px" mb={'30px'}>
        <Box pb={'8px'}>
          <Text as={'span'} fontWeight="600">
            {t.nameText}:
          </Text>
          <Text as={'span'}> {userName}</Text>
        </Box>
        <Box pb={'8px'}>
          <Text as={'span'} fontWeight="600">
            {t.mobileNo}:
          </Text>
          <Text as={'span'}> {phone}</Text>
        </Box>
        <Box>
          <Text as={'span'} fontWeight="600">
            {t.emailId}:
          </Text>
          <Text as={'span'}>{email}</Text>
        </Box>
      </Box>
      <Text fontSize={'15px'}>{t.certificates}</Text>
      {documents.map((document: any) => (
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
                  {document.attributes.attachment.data.attributes.name}
                </Text>
              </Flex>
            </Box>
          </Flex>

          {/* <Divider pt={'15px'} mb="15px" width={'unset'} mr="-20px" ml="-20px" /> */}
        </Box>
      ))}
    </Box>
  )
}

export default applyJobsPrefilled
