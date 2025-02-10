'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { formatDate, TopSheet, useGeolocation } from '@beckn-ui/common'
import { useLanguage } from '@hooks/useLanguage'
import { useRouter } from 'next/router'
import profileIcon from '@public/images/user_profile.svg'
import { Typography } from '@beckn-ui/molecules'
import { Box, Flex, useTheme } from '@chakra-ui/react'
import { format } from 'date-fns'
import { ROLE, ROUTE_TYPE } from '@lib/config'
import { useTradeDashboardMutation } from '@services/DashboardService'
import Cookies from 'js-cookie'
import axios from '@services/axios'
import { DashboardData, StatusItem, TradeData } from '@lib/types/dashboard'
import { parseAndFormatDate } from '@utils/parsedFormatDate-utils'
import IdentityIcon from '@public/images/identity.svg'
import AssetsIcon from '@public/images/assets.svg'
import TransactionsIcon from '@public/images/transactions.svg'
import FinancialIcon from '@public/images/financial.svg'
import SparkIcon from '@public/images/spark.svg'
import { useDispatch } from 'react-redux'
import beckenFooter from '@public/images/footer.svg'
import PoweredBy from '@beckn-ui/common/src/components/poweredBy'
import NavigationItem from '@components/navigationItem'

const MyAssets = () => {
  const router = useRouter()

  return (
    <Box
      maxWidth={{ base: '100vw', md: '30rem', lg: '40rem' }}
      margin="calc(0rem + 26px) auto"
      backgroundColor="white"
    >
      <Flex
        marginTop={'1rem'}
        gap="1.5rem"
        flexDirection="column"
        justifyContent="space-between"
      >
        <NavigationItem
          icon={IdentityIcon}
          label={'My Credentials'}
          handleClick={() => router.push('/myCredentials')}
          dataTest={'credentials'}
          renderType="card"
        />
        <NavigationItem
          icon={AssetsIcon}
          label={'Physical Assets'}
          handleClick={() => router.push('/physicalAssets')}
          dataTest={'physical-assets'}
          renderType="card"
        />
        <NavigationItem
          icon={FinancialIcon}
          label={'Financial Assets'}
          handleClick={() => router.push('/financialAssets')}
          dataTest={'financial-assets'}
          renderType="card"
        />
        <NavigationItem
          icon={SparkIcon}
          label={'Energy Assets'}
          handleClick={() => router.push('/energyAssets')}
          dataTest={'energy-assets'}
          renderType="card"
        />
      </Flex>
    </Box>
  )
}

export default MyAssets
