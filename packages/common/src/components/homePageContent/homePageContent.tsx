import React, { useMemo } from 'react'
import { Box, Flex, useBreakpoint, useTheme } from '@chakra-ui/react'
import { SearchInput } from '@beckn-ui/becknified-components'
import { Typography } from '@beckn-ui/molecules'
import { RiArrowRightSLine } from 'react-icons/ri'
import PoweredBy from '../poweredBy'
import { HomePageContentProps } from './homePageContent.types'
import { testIds } from '@shared/dataTestIds'

const HomePageContent: React.FC<HomePageContentProps> = ({
  blockOrder = [],
  logos,
  headerProps,
  searchProps,
  searchByLocation,
  footerProps
}) => {
  const { name, title, description } = headerProps || {}
  const { searchPlaceholder, setSearchTerm, onSearchIconClick, onSearchInputEnterPress } = searchProps
  const { label, onSearchByLocationClick } = searchByLocation || {}
  const { poweredByText, poweredByLogoSrc } = footerProps

  const theme = useTheme()
  const breakpoint = useBreakpoint()

  const primaryColor = theme.colors.primary['100']
  const secondaryColor = theme.colors.secondary['100']

  // Determine current logo based on breakpoint
  const currentLogo = useMemo(() => {
    const mobileBreakpoints = ['base', 'sm', 'md', 'lg']
    return mobileBreakpoints.includes(breakpoint) ? logos?.mobile : logos?.desktop
  }, [breakpoint, logos])

  const renderBlock = (block: string) => {
    switch (block) {
      case 'header':
        return (
          <>
            <Box
              pt={'12px'}
              pb={'12px'}
              fontSize={'40px'}
              fontWeight={'800'}
              color={secondaryColor}
              lineHeight={'110%'}
              data-test={testIds.homepage_appTitle}
              style={{ marginBottom: title ? '0px' : '15px' }}
            >
              {name}
            </Box>
            {title && (
              <Typography
                style={{ marginTop: '-15px', marginBottom: '15px' }}
                fontSize="27px"
                fontWeight="800"
                text={title!}
              />
            )}
          </>
        )
      case 'description':
        return (
          <Typography
            style={{ marginBottom: '40px' }}
            fontSize="15px"
            fontWeight="400"
            dataTest={testIds.homepage_appDescription}
            text={description!}
          />
        )
      case 'searchInput':
        return (
          <SearchInput
            onChangeHandler={(e: React.BaseSyntheticEvent) => setSearchTerm(e.target.value)}
            searchIcon={'/images/search.svg'}
            searchIconClickHandler={onSearchIconClick}
            onEnterHandler={(e: { key: string }) => e.key === 'Enter' && onSearchInputEnterPress()}
            placeHolder={searchPlaceholder}
          />
        )
      case 'searchByLocation':
        return (
          <Flex
            justifyContent={'center'}
            alignItems={'center'}
            columnGap={'5px'}
            cursor={'pointer'}
            onClick={onSearchByLocationClick}
            mt="40px"
          >
            <Typography text={label!} />

            <RiArrowRightSLine
              size={22}
              color={'#A71B4A'}
            />
          </Flex>
        )
      default:
        return <></>
    }
  }

  return (
    <Box
      maxWidth={{ base: '100vw', md: '30rem', lg: '40rem' }}
      margin="calc(0rem + 90px) auto"
      backgroundColor="white"
    >
      {blockOrder.map(block => renderBlock(block))}
      <PoweredBy
        logoSrc={poweredByLogoSrc}
        poweredByText={poweredByText}
      />
    </Box>
  )
}

export default HomePageContent
