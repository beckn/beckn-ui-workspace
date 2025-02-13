'use client'

import React from 'react'
import { TopSheet, useGeolocation } from '@beckn-ui/common'
import { useLanguage } from '@hooks/useLanguage'
import { useRouter } from 'next/router'
import profileIcon from '@public/images/user_profile.svg'
import { Typography } from '@beckn-ui/molecules'
import { Box, Flex, useTheme } from '@chakra-ui/react'
import IdentityIcon from '@public/images/identity.svg'
import AssetsIcon from '@public/images/assets.svg'
import TransactionsIcon from '@public/images/transactions.svg'
import beckenFooter from '@public/images/footer.svg'
import PoweredBy from '@beckn-ui/common/src/components/poweredBy'
import NavigationItem from '@components/navigationItem'

const Dashboard = () => {
  const { t } = useLanguage()
  const router = useRouter()
  const apiKeyForGoogle = process.env.NEXT_PUBLIC_GOOGLE_API_KEY

  const {
    currentAddress,
    error: currentLocationFetchError,
    loading: loadingForCurrentAddress
  } = useGeolocation(apiKeyForGoogle as string)

  const theme = useTheme()
  const primaryColor = theme.colors.primary['100']

  return (
    <>
      <TopSheet
        currentLocationFetchError={currentLocationFetchError}
        loadingForCurrentAddress={loadingForCurrentAddress}
        currentAddress={currentAddress}
        t={key => t[key]}
        profileSection={{
          src: profileIcon,
          handleClick: () => router.push('/profile')
        }}
      />
      <Box
        maxWidth={{ base: '100vw', md: '30rem', lg: '40rem' }}
        margin="calc(0rem + 130px) auto"
        backgroundColor="white"
      >
        <Typography
          style={{ marginTop: '-15px', marginBottom: '15px' }}
          fontSize="27px"
          fontWeight="800"
          color={primaryColor}
          text={'Hi, Welcome!'}
        />
        <Flex
          marginTop={'1rem'}
          gap="1.5rem"
          flexDirection="column"
          justifyContent="space-between"
        >
          <NavigationItem
            icon={IdentityIcon}
            label={'My Identities'}
            handleClick={() => router.push('/myIdentities')}
            dataTest={'identity'}
            renderType="card"
          />
          <NavigationItem
            icon={AssetsIcon}
            label={'My Assets'}
            handleClick={() => router.push('/myAssets')}
            dataTest={'assets'}
            renderType="card"
          />
          <NavigationItem
            icon={TransactionsIcon}
            label={'My Transactions'}
            handleClick={() => router.push('/myTransactions')}
            dataTest={'transactions'}
            renderType="card"
          />
        </Flex>
        <PoweredBy
          logoSrc={beckenFooter}
          poweredByText={t.footerText}
        />
      </Box>
    </>
  )
}

export default Dashboard
