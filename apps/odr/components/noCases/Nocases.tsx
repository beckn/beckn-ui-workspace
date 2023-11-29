import { Box, Image, Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import React from 'react'
import { useLanguage } from '../../hooks/useLanguage'
import Button from '../button/Button'

const Nocases = () => {
  const { t } = useLanguage()
  const router = useRouter()
  return (
    <Box>
      <Image
        mb={'40px'}
        src="/images/no-cases.svg"
        alt="no-cases"
      />
      <Box textAlign={'center'}>
        <Text
          fontSize={'15px'}
          fontWeight="600"
        >
          {t.noCases}
        </Text>
        <Text fontSize={'12px'}>{t.noCasesDiscription}</Text>
      </Box>
      <Box
        position={'absolute'}
        left={'5%'}
        width={'90%'}
        bottom={'0'}
      >
        <Button
          buttonText={t.goBackBtn}
          background={'rgba(var(--color-primary))'}
          color={'rgba(var(--text-color))'}
          handleOnClick={() => router.push('/')}
          isDisabled={false}
        />
      </Box>
    </Box>
  )
}

export default Nocases
