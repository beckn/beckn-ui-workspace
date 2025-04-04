'use client'

import React from 'react'
import { TopSheet, useGeolocation } from '@beckn-ui/common'
import { useLanguage } from '@hooks/useLanguage'
import { useRouter } from 'next/router'
import profileIcon from '@public/images/user_profile.svg'
import { Typography } from '@beckn-ui/molecules'
import { Box, Divider, Flex, Image, Select, useTheme } from '@chakra-ui/react'
import IdentityIcon from '@public/images/identity.svg'
import AssetsIcon from '@public/images/assets.svg'
import TransactionsIcon from '@public/images/transactions.svg'
import beckenFooter from '@public/images/footer.svg'
import PoweredBy from '@beckn-ui/common/src/components/poweredBy'
import NavigationItem from '@components/navigationItem'
import { AuthRootState } from '@store/auth-slice'
import { useSelector } from 'react-redux'
import { UserRootState } from '@store/user-slice'

const Dashboard = () => {
  const { t } = useLanguage()
  const router = useRouter()
  const { profileDetails } = useSelector((state: UserRootState) => state.user)

  const { user } = useSelector((state: AuthRootState) => state.auth)
  const theme = useTheme()
  const primaryColor = theme.colors.primary['100']

  return (
    <>
      <Flex
        // justifyContent={'space-between'}
        alignItems={'center'}
        mt={'20px'}
        mb={'15px'}
        width={'50%'}
        gap="1rem"
      >
        <Image
          src={profileIcon}
          alt="profileIcon"
          onClick={() => router.push('/profile')}
        />
        {profileDetails?.agent ? (
          <Typography
            fontSize="16px"
            color={'#3A3A3A'}
            text={profileDetails?.agent?.first_name + ' ' + (profileDetails?.agent?.last_name ?? '')}
            style={{
              pointerEvents: 'none',
              width: 'fit-content'
            }}
          />
        ) : (
          user?.did && (
            <Select
              variant="unstyled"
              placeholder={`/subj****${user?.did.slice(-4)}`}
              value=""
              style={{
                pointerEvents: 'none',
                width: 'fit-content'
              }}
            />
          )
        )}
      </Flex>
      <Divider mb={'36px'} />
      <Box
        maxWidth={{ base: '100vw', md: '30rem', lg: '40rem' }}
        margin="calc(0rem + 50px) auto"
        background="#d9ebce"
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
            label={'Identities'}
            handleClick={() => {}}
            dataTest={'identity'}
            renderType="card"
          />
          <NavigationItem
            icon={IdentityIcon}
            label={'Connections'}
            handleClick={() => router.push('/connections')}
            dataTest={'connections'}
            renderType="card"
          />
          <NavigationItem
            icon={AssetsIcon}
            label={'Assets'}
            handleClick={() => router.push('/myAssets')}
            dataTest={'assets'}
            renderType="card"
          />
          <NavigationItem
            icon={TransactionsIcon}
            label={'Transactions'}
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
