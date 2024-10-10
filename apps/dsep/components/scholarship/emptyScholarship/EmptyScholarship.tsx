import { Box, Flex, Text } from '@chakra-ui/react'
import { Image } from '@chakra-ui/react'
import Router from 'next/router'
import React from 'react'
import { Button, Typography } from '@beckn-ui/molecules'
import CartEmpty from '../../../public/images/cartEmptyIcon.svg'
import { useLanguage } from '../../../hooks/useLanguage'
import { testIds } from '@shared/dataTestIds'

const EmptyScholarship: React.FC = () => {
  const { t } = useLanguage()
  const handleGoBack = (): void => {
    Router.push('/scholarshipSearchPage')
  }

  return (
    <Flex
      paddingTop={'15px'}
      flexDir={'column'}
      width={'100%'}
    >
      <Box
        mb={'40px'}
        display={'flex'}
        justifyContent={'center'}
      >
        <Image
          src={CartEmpty}
          data-test={testIds.cartpage_emptyImage}
          width={'306px'}
          height={'245px'}
          alt="empty cart logo"
        />
      </Box>
      <Flex
        flexDir={'column'}
        alignItems={'center'}
        marginBottom={'40px'}
      >
        <Typography
          fontSize="15px"
          dataTest={testIds.noScholarship}
          fontWeight="600"
          text={t.noScholarship}
          style={{
            lineHeight: '25px'
          }}
        />
        <Typography
          fontSize="12px"
          fontWeight="400"
          style={{
            lineHeight: '25px'
          }}
          text={t.noScholarshipText1}
          dataTest={testIds.noScholarshipText1}
        />
        <Typography
          fontSize="12px"
          fontWeight="400"
          style={{
            lineHeight: '25px'
          }}
          text={t.noScholarshipText2}
          dataTest={testIds.noScholarshipText2}
        />
      </Flex>

      <Button
        dataTest={testIds.emptyScholarshipButton}
        text={t.searchScholarships}
        color={'rgba(var(--text-color))'}
        disabled={false}
        handleClick={handleGoBack}
      />
    </Flex>
  )
}

export default EmptyScholarship
