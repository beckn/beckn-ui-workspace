
import React, { useEffect, useState,useRef } from 'react'
import { Box, Flex, Image, Text, useBreakpoint,Icon,Divider } from '@chakra-ui/react'
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md'
import axios from 'axios'
import { useRouter } from 'next/router'
import {Typography} from '@beckn-ui/molecules'
import KuzaLogo from '@public/images/Kuza-mini.svg'
import AlternateLogo from '@public/images/KuzaLogo.svg'
import TopSheet from '@components/topSheet/TopSheet'
import { useLanguage } from '@hooks/useLanguage'
import beckenFooter from '../public/images/footer.svg'
import SearchInput from '@beckn-ui/becknified-components/src/components/search-input'
import ImportedOrder from '@components/importedOrder/ImportedOrder'
import OrderDetails from '@components/orderDetails/ImportedOrderDetails'
import ShoppingList from '@components/shoppingList/ShoppingList'
import SelectDeliveryModal from '@components/selectDeliveryModal/SelectDeliveryModal'


const items = ['Civil Disputes', 'Financial Disputes', 'Family Disputes', 'Employment Disputes', 'Commercial Disputes']
const disputeCategoryMapper: any = {
  ['Civil Disputes']: 'civil-dispute',
  ['Family Disputes']: 'family-dispute',
  ['Employment Disputes']: 'employment-dispute',
  ['Commercial Disputes']: 'commercial-dispute',
  ['Financial Disputes']: 'financial-dispute'
}

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState<string>('')
  const breakpoint = useBreakpoint()
  const mobileBreakpoints = ['base', 'sm', 'md', 'lg']
  const currentLogo = mobileBreakpoints.includes(breakpoint) ? KuzaLogo : AlternateLogo
  const { t } = useLanguage()

  const [importedOrder, setImportedOrder] = useState(false)
  const [viewOrderDetails, setViewOrderDetails] = useState(false)
  const [chatGtpList, setChatGtpList] = useState(false)
  const [selectLocationModal, setSelectLocationModal] = useState(false)
  const [shoppingListData, setShoppingListData] = useState([])
  const [selectedValues, setSelectedValues] = useState<string[]>([])
  const [address, setAddress] = useState('')
  const [isLoadingForChatGptRequest, setIsLoadingForChatGptRequest] = useState(true)
  const [importedOrderObject, setImportedOrderObject] = useState(null)
  const chatGptApiUrl = process.env.NEXT_PUBLIC_CHAT_GPT_URL

  const apiKeyForGoogle = process.env.NEXT_PUBLIC_GOOGLE_API_KEY
  const [currentAddress, setCurrentAddress] = useState('')
  const [loadingForCurrentAddress, setLoadingForCurrentAddress] = useState(true)
  const [currentLocationFetchError, setFetchCurrentLocationError] = useState('')
  const router = useRouter()
  useEffect(() => {
    if (localStorage) {
      localStorage.clear()
    }
  }, [])
  // const navigateToSearchResults = () => {
  //   localStorage.setItem('optionTags', JSON.stringify({ name: searchTerm }))
  //   router.push(`/search?searchTerm=${searchTerm}`)
  // }

  const navigateToSearchResults = () => {
    localStorage.setItem('optionTags', JSON.stringify({ name: searchTerm }))
    localStorage.setItem('optionTags1', JSON.stringify({ name: selectedItem }))
    const selectedCategory = selectedItem.trim().length ? disputeCategoryMapper[selectedItem] : ''
    router.push(`/search?searchTerm=${searchTerm}&selectedItem=${selectedCategory}`)
  }

  const searchIconClickHandler = (e: any) => {
    if (searchTerm) {
      navigateToSearchResults()
    }
    e.preventDefault()
  }

  useEffect(() => {
    if (localStorage) localStorage.clear()

    if (JSON.stringify(router.query) !== '{}') {
      const externalUrl = router.query.external_url

      if (externalUrl) {
        axios
          .get(externalUrl as string)
          .then(res => {
            setImportedOrder(true)
            setImportedOrderObject(res.data)
          })
          .catch(error => console.error(error))
      }
    }
  }, [router.isReady])

  useEffect(() => {
    if (importedOrderObject) {
      const latLongValues = importedOrderObject?.fulfillments[0]?.stops[0]?.location?.gps

      console.log(latLongValues)
      const [latStr, langStr] = latLongValues.split(',')
      const result = {
        lat: parseFloat(latStr),
        lang: parseFloat(langStr)
      }
      handleConvert(result.lat, result.lang)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [importedOrderObject])

  useEffect(() => {
    // Check if geolocation is available in the browser
    if (navigator) {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          async position => {
            const latitude = position.coords.latitude
            const longitude = position.coords.longitude

            const coordinates = {
              latitude,
              longitude
            }

            localStorage.setItem('coordinates', JSON.stringify(coordinates))

            try {
              const response = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKeyForGoogle}`
              )

              if (response.ok) {
                const data = await response.json()

                if (data.results.length > 0) {
                  const formattedAddress = data.results[0].formatted_address
                  setCurrentAddress(formattedAddress)
                } else {
                  setFetchCurrentLocationError('No address found for the given coordinates.')
                }
              } else {
                setFetchCurrentLocationError('Failed to fetch address data.')
                alert('Failed to fetch address data.')
              }
            } catch (error) {
              setFetchCurrentLocationError('Error fetching address data: ' + (error as any).message)
              alert('Error fetching address data: ' + (error as any).message)
            } finally {
              setLoadingForCurrentAddress(false)
            }
          },
          error => {
            setFetchCurrentLocationError('Error getting location: ' + error.message)
            alert('Error getting location: ' + error.message)
            setLoadingForCurrentAddress(false)
          }
        )
      } else {
        setFetchCurrentLocationError('Geolocation is not available in this browser.')
        alert('Geolocation is not available in this browser.')
        setLoadingForCurrentAddress(false)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleConvert = async (lat: number, lang: number) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lang}&key=${apiKeyForGoogle}`
      )

      if (response.data.results.length > 0) {
        setAddress(response.data.results[0].formatted_address)
      } else {
        setAddress('No address found')
      }
    } catch (error) {
      console.error('Error converting coordinates to address:', error)
    }
  }

  const fetchData = async () => {
    if (importedOrderObject) {
      const tags = importedOrderObject.items[0].tags
      const himalayasTag = tags.find(tag => {
        if (tag.list) {
          return tag.list.some(item => item.descriptor.name === 'Himalayas')
        }
        return false
      })
      const promptType = himalayasTag ? 'HIMALAYAS' : 'PARIS'

      const payload = {
        message: {
          prompt_type: promptType,
          searchQuery: importedOrderObject.items[0].descriptor.name
        }
      }

      axios
        .post(chatGptApiUrl as string, payload)
        .then(response => {
          setShoppingListData(response.data.item)
          setIsLoadingForChatGptRequest(false)
        })
        .catch(error => {
          console.log(error)
        })
    }
  }
  const [isOpen, setIsOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState('')
  const dropdownRef = useRef<any>(null)

  const isButtonDisabled = !selectedItem && !searchTerm.trim()
  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  const handleItemClick = (item: string) => {
    setSelectedItem(item)
    setIsOpen(false)
  }

  const handleOutsideClick = (e: any) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setIsOpen(false)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick)

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [])

  return (
    <>
      <TopSheet
        currentLocationFetchError={currentLocationFetchError}
        loadingForCurrentAddress={loadingForCurrentAddress}
        currentAddress={currentAddress}
      />
      <Box
        p={'0 20px'}
        maxWidth={{ base: '100vw', md: '30rem', lg: '40rem' }}
        margin="calc(1rem + 90px)  auto"
        backgroundColor="white"
      >
      
          <Typography
        fontSize={'40px'}
        fontWeight="800"
        text={t.homeHeading}
      />
      <Text
        fontSize={'15px'}
        mt={'15px'}
        fontFamily="Poppins"
      >
        {t.homeText}{' '}
      </Text>
      <Box
          position="relative"
          display="inline-block"
          width={'100%'}
          m='2rem 0'
        >
          <Box
            padding="12px"
            cursor="pointer"
            border="1px solid #ccc"
            borderRadius={'5px'}
            onClick={toggleDropdown}
            fontSize={'15px'}
            fontWeight={400}
            backgroundColor={'transparent'}
            display="flex"
            alignItems="center"
            justifyContent={'space-between'}
            color={'#747474'}
          >
            {selectedItem || 'Select Category'}

            <Icon
              as={isOpen ? MdKeyboardArrowUp : MdKeyboardArrowDown}
              ml="2"
              w={'20px'}
              h={'20px'}
            />
          </Box>
          {isOpen && (
            <Box
              display="block"
              position="absolute"
              backgroundColor="#fff"
              boxShadow="0 8px 16px rgba(0, 0, 0, 0.2)"
              zIndex="1"
              width={'100%'}
              borderRadius={'5px'}
            >
              {items.map((item, index) => (
                <Box
                  key={index}
                  className="dropdown-item"
                  cursor="pointer"
                  onClick={() => handleItemClick(item)}
                  p="0 15px 15px 15px"
                  _hover={{
                    bg: '#E9C378',
                    fontWeight: '500'
                  }}
                >
                  <Box pt="15px">
                    {item}
                    {items.length - 1 !== index ? (
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
        <SearchInput
          onChangeHandler={(e: React.BaseSyntheticEvent) => setSearchTerm(e.target.value)}
          searchIcon={'/images/search.svg'}
          searchIconClickHandler={searchIconClickHandler}
          onEnterHandler={(e: { key: string }) => e.key === 'Enter' && navigateToSearchResults()}
          placeHolder="Mediation, arbitriation, Lawyers....."
        />

        <Flex
          justifyContent={'center'}
          alignItems="center"
          width=" calc(100% - 40px)"
          position={'fixed'}
          bottom="15px"
        >
          <Text
            pr={'8px'}
            fontSize="12px"
            color={'#000000'}
          >
            {t.footerText}
          </Text>
          <Image
            src={beckenFooter}
            alt="footerLogo"
            width={39}
            height={13}
          />
        </Flex>
      </Box>

      {/* {importedOrder ? (
        <ImportedOrder
          setImportedOrder={setImportedOrder}
          importedOrderedItem={(importedOrderObject as any).items}
          updateStateImportedOrder={updateStateImportedOrder}
          showChatGtpList={showChatGtpList}
        />
      ) : null}
      {viewOrderDetails ? (
        <OrderDetails
          importedOrderObject={importedOrderObject}
          backOnImportedOrder={backOnImportedOrder}
        />
      ) : null}

      {chatGtpList && (
        <ShoppingList
          isLoadingForChatGptRequest={isLoadingForChatGptRequest}
          shoppingListData={shoppingListData}
          selectDeliveryLocationText={selectDeliveryLocationText}
          setSelectedValues={setSelectedValues}
          selectedValues={selectedValues}
        />
      )} */}

      {/* {selectLocationModal ? (
        <SelectDeliveryModal
          importedOrderObject={importedOrderObject}
          backOnImportedOrder={backOnImportedOrder}
          selectedValues={selectedValues}
          addressOfTheEndLocation={address}
        />
      ) : null} */}
    </>
  )
}

export default HomePage
