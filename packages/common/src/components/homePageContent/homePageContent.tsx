import React, { useMemo } from 'react'
import { Box, Divider, Flex, Icon, useBreakpoint, useTheme } from '@chakra-ui/react'
import { SearchInput } from '@beckn-ui/becknified-components'
import { Typography } from '@beckn-ui/molecules'
import { RiArrowRightSLine } from 'react-icons/ri'
import PoweredBy from '../poweredBy'
import { HomePageContentProps } from './homePageContent.types'
import { testIds } from '@shared/dataTestIds'
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md'

const HomePageContent: React.FC<HomePageContentProps> = ({
  blockOrder = [],
  logos,
  headerProps,
  selectInputProps,
  searchProps,
  searchByLocation,
  footerProps
}) => {
  const { name, title, description } = headerProps || {}
  const {
    searchPlaceholder,
    setSearchTerm,
    onSearchIconClick,
    onSearchInputEnterPress,
    label: searchInputLabel
  } = searchProps
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
          <>
            {searchInputLabel && (
              <Typography
                text={searchInputLabel!}
                color={primaryColor}
                fontSize="15px"
                fontWeight="600"
              />
            )}
            <SearchInput
              onChangeHandler={(e: React.BaseSyntheticEvent) => setSearchTerm(e.target.value)}
              searchIcon={'/images/search.svg'}
              searchIconClickHandler={onSearchIconClick}
              onEnterHandler={(e: { key: string }) => e.key === 'Enter' && onSearchInputEnterPress()}
              placeHolder={searchPlaceholder}
            />
          </>
        )
      case 'selectInput':
        return (
          <Box
            position="relative"
            display="inline-block"
            width={'100%'}
            m="1.25rem 0"
            data-test={testIds.select_input}
          >
            <Typography
              fontSize={'15px'}
              fontWeight="600"
              text="Category"
              color={'#8D353A'}
            />
            <Box
              mt={'8px'}
              padding="12px"
              cursor="pointer"
              border="1px solid #ccc"
              borderRadius={'5px'}
              onClick={selectInputProps?.toggleDropdown}
              fontSize={'15px'}
              fontWeight={400}
              backgroundColor={'transparent'}
              display="flex"
              alignItems="center"
              justifyContent={'space-between'}
              color={'#747474'}
            >
              {selectInputProps?.selectedItem || 'Select Category'}

              <Icon
                as={selectInputProps?.isOpen ? MdKeyboardArrowUp : MdKeyboardArrowDown}
                ml="2"
                w={'20px'}
                h={'20px'}
              />
            </Box>
            {selectInputProps?.isOpen && (
              <Box
                display="block"
                position="absolute"
                backgroundColor="#fff"
                boxShadow="0 8px 16px rgba(0, 0, 0, 0.2)"
                zIndex="1"
                width={'100%'}
                borderRadius={'5px'}
              >
                {selectInputProps?.items.map((item, index) => (
                  <Box
                    key={index}
                    className="dropdown-item"
                    data-test={testIds.dropdown_item}
                    cursor="pointer"
                    onClick={() => selectInputProps?.handleItemClick(item)}
                    p="0 15px 15px 15px"
                    _hover={{
                      bg: '#E9C378',
                      fontWeight: '500'
                    }}
                  >
                    <Box
                      pt="15px"
                      data-test={testIds.dropdown_item_list}
                    >
                      {item}
                      {selectInputProps?.items.length - 1 !== index ? (
                        <Divider
                          position={'relative'}
                          top={'15px'}
                        />
                      ) : null}
                    </Box>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
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
            data-test={testIds.search_By_Location_Text}
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
