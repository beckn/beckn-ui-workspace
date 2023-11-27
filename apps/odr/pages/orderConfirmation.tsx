import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import { Box, Flex, HStack, Image, Stack, StackDivider, Text, VStack } from '@chakra-ui/react'
import CallphoneIcon from '../public/images/CallphoneIcon.svg'
import nameIcon from '../public/images/nameIcon.svg'
import { useSelector } from 'react-redux'
import { useLanguage } from '../hooks/useLanguage'
import useRequest from '../hooks/useRequest'
import { getInitMetaDataPerBpp, getPayloadForConfirmRequest } from '../utilities/confirm-utils'
import Loader from '../components/loader/Loader'
import { TransactionIdRootState } from '../lib/types/cart'
import Button from '../components/button/Button'
import ConfirmOrder from '../components/confirmOrder/ConfirmOrder'

const OrderConfirmation = () => {
  const { t } = useLanguage()
  const confirmRequest = useRequest()
  const router = useRouter()
  const initResponse = useSelector((state: any) => state.initResponse.initResponse)
  const transactionId = useSelector((state: { transactionId: TransactionIdRootState }) => state.transactionId)

  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL

  useEffect(() => {
    if (initResponse) {
      const payLoadForConfirmRequest = getPayloadForConfirmRequest(initResponse, transactionId)
      confirmRequest.fetchData(`${apiUrl}/confirm`, 'POST', payLoadForConfirmRequest)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!initResponse && localStorage && localStorage.getItem('initResult')) {
      const payLoadForConfirmRequest = getPayloadForConfirmRequest(initResponse, transactionId)
      confirmRequest.fetchData(`${apiUrl}/confirm`, 'POST', payLoadForConfirmRequest)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (confirmRequest.loading) {
    return (
      <Loader
        stylesForLoadingText={{
          fontWeight: '600',
          fontSize: '16px'
        }}
        subLoadingText={t.caseAssignedLoaderText}
        loadingText={t.catalogLoader}
      />
    )
  }
  const handleViewOrder = () => {
    if (confirmRequest.data) {
      localStorage.setItem('confirmData', JSON.stringify(confirmRequest.data))
      router.push('/orderDetails')
    }
  }

  const agentName = confirmRequest.data?.scholarshipProvider?.scholarships[0]?.scholarshipDetails?.agentDetails?.name
  const agentNumber =
    confirmRequest.data?.scholarshipProvider?.scholarships[0]?.scholarshipDetails?.agentDetails?.contactDetails?.phone

  return (
    <Box>
      <ConfirmOrder
        confirmationText={
          <>
            <Text>
              {t.caseID} <span style={{ fontSize: '17px', fontWeight: 600 }}>#789171 Submitted!</span>
            </Text>
            <Text>{t.caseManagerText}</Text>
            <Stack
              justifyContent={'center'}
              align={'center'}
              gap={'5px'}
              m={'10px 0px'}
            >
              <Flex alignItems={'center'}>
                <Image
                  src={nameIcon}
                  pr={'12px'}
                />
                <Text fontSize={'15px'}>{agentName}</Text>
              </Flex>
              <Flex alignItems={'center'}>
                <Image
                  src={CallphoneIcon}
                  pr={'12px'}
                />
                <Text fontSize={'15px'}>{agentNumber}</Text>
              </Flex>
            </Stack>
            <Stack>
              <Text
                textAlign={'center'}
                marginTop={'8px'}
                marginBottom={'40px'}
                fontSize={'15px'}
                fontWeight="400"
              >
                {t.confirmMessage1} <br />
                <a
                  href="#"
                  style={{ color: '#8D353A' }}
                  target="blank"
                >
                  provider link
                </a>{' '}
                {t.confirmMessage2}
              </Text>
            </Stack>
          </>
        }
      />
      <VStack>
        <Button
          buttonText={t.viewOrderDetails}
          background={'rgba(var(--color-primary))'}
          color={'rgba(var(--text-color))'}
          isDisabled={false}
          handleOnClick={handleViewOrder}
        />
        <Button
          buttonText={t.backToHome}
          background={'transparent'}
          color={'rgba(var(--color-primary))'}
          isDisabled={false}
          handleOnClick={() => router.push('/homePage')}
        />
      </VStack>
    </Box>
  )
}

export default OrderConfirmation
