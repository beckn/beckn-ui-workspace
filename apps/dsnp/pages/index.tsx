/* eslint-disable react-hooks/rules-of-hooks */
import { Box, Text } from '@chakra-ui/react'
import axios from 'axios'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import GeoLocationInput from '../components/geoLocationInput/GeoLocationInput'
import ImportedOrder from '../components/importedOrder/ImportedOrder'
import Loader from '../components/loader/Loader'
import OrderDetails from '../components/orderDetails/ImportedOrderDetails'
import SelectDeliveryModal from '../components/selectDeliveryModal/SelectDeliveryModal'
import ShoppingList from '../components/shoppingList/ShoppingList'
import TopSheet from '../components/topSheet/TopSheet'
import { useLanguage } from '../hooks/useLanguage'

const homePage = () => {
  const { t, locale } = useLanguage()
  const [importedOrder, setImportedOrder] = useState(false)
  const [viewOrderDetails, setViewOrderDetails] = useState(false)
  const [chatGtpList, setChatGtpList] = useState(false)
  const [selectLocationModal, setSelectLocationModal] = useState(false)
  const [shoppingListData, setShoppingListData] = useState([])
  const [importedOrderObject, setImportedOrderObject] = useState(null)
  const [address, setAddress] = useState('')
  const [selectedValues, setSelectedValues] = useState<string[]>([])
  const [searchInputValue, setSearchInputValue] = useState<string>('')
  const [isLoadingForChatGptRequest, setIsLoadingForChatGptRequest] = useState(true)
  const [currentAddress, setCurrentAddress] = useState('')
  const [loadingForCurrentAddress, setLoadingForCurrentAddress] = useState(true)
  const [error, setFetchCurrentLocationError] = useState('')

  const router = useRouter()
  const apiKeyForGoogle = process.env.NEXT_PUBLIC_GOOGLE_API_KEY
  const chatGptApiUrl = process.env.NEXT_PUBLIC_CHAT_GPT_URL

  useEffect(() => {
    if (localStorage) localStorage.clear()
    const URL = window.location.href

    if (URL.includes('external_url')) {
      const urlParams = new URLSearchParams(URL)
      const externalUrl = urlParams.get('external_url')

      axios
        .get(externalUrl as string)
        .then(res => {
          setImportedOrder(true)
          setImportedOrderObject(res.data)
        })
        .catch(error => console.error(error))
    }
  }, [])

  useEffect(() => {
    if (importedOrderObject) {
      const latLongValues = (importedOrderObject as any).message.order.item[0].tags.fulfillment_end_loc
      const [latStr, langStr] = latLongValues.split('/')
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
            // Replace with your Google Maps Geocoding API key

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
                alert('Failed to fetch address data.')
              }
            } catch (error) {
              alert('Error fetching address data: ' + (error as any).message)
            } finally {
              setLoadingForCurrentAddress(false)
            }
          },
          error => {
            alert('Error getting location: ' + error.message)
            setLoadingForCurrentAddress(false)
          }
        )
      } else {
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
      const payload = {
        message: {
          prompt_type: 'HIMALAYAS',
          searchQuery: (importedOrderObject as any).message.order.item[0].descriptor.name
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

  const updateStateImportedOrder = () => {
    setImportedOrder(false)
    setViewOrderDetails(true)
  }
  const backOnImportedOrder = () => {
    setViewOrderDetails(false)
    setImportedOrder(true)
  }
  const showChatGtpList = () => {
    fetchData()
    setViewOrderDetails(false)
    setChatGtpList(true)
  }
  const selectDeliveryLocationText = () => {
    setSelectLocationModal(true)
    setViewOrderDetails(false)
    setChatGtpList(false)
  }

  return (
    <>
      <TopSheet currentAddress={currentAddress} />
      <Box pt={'40px'} fontSize={'40px'} fontWeight={'800'} color={'rgba(var(--color-primary))'} lineHeight={'110%'}>
        {t('openCommerce1')}
        <br />
        {t('openCommerce2')}
      </Box>

      <Box fontSize={'27px'} fontWeight={'800'} pt={'10px'}>
        {t('forAll')}
      </Box>

      <Box fontSize={'15px'} pt={'15px'} pb={'40px'}>
        {t('openCommerceDescription')}
      </Box>

      <GeoLocationInput
        searchInputValue={searchInputValue}
        setSearchInputValue={setSearchInputValue}
        homeSearchInputButtonHandler={() => router.push(`/search?searchTerm=${searchInputValue}`)}
      />

      {importedOrder ? (
        <ImportedOrder
          setImportedOrder={setImportedOrder}
          importedOrderedItem={(importedOrderObject as any).message.order.item}
          updateStateImportedOrder={updateStateImportedOrder}
          showChatGtpList={showChatGtpList}
        />
      ) : null}
      {viewOrderDetails ? (
        <OrderDetails importedOrderObject={importedOrderObject} backOnImportedOrder={backOnImportedOrder} />
      ) : null}

      {chatGtpList && (
        <ShoppingList
          isLoadingForChatGptRequest={isLoadingForChatGptRequest}
          shoppingListData={shoppingListData}
          selectDeliveryLocationText={selectDeliveryLocationText}
          setSelectedValues={setSelectedValues}
          selectedValues={selectedValues}
        />
      )}

      {selectLocationModal ? (
        <SelectDeliveryModal selectedValues={selectedValues} addressOfTheEndLocation={address} />
      ) : null}
    </>
  )
}

export default homePage
