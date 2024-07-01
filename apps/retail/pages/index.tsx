import axios from '@services/axios'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import kuzaMobLogo from '@public/images/Kuza-mini.svg'
import kuzaDeskLogo from '@public/images/KuzaLogo.svg'
import { useLanguage } from '@hooks/useLanguage'
import beckenFooter from '../public/images/footer.svg'
import ImportedOrder from '@components/importedOrder/ImportedOrder'
import OrderDetails from '@components/orderDetails/ImportedOrderDetails'
import ShoppingList from '@components/shoppingList/ShoppingList'
import SelectDeliveryModal from '@components/selectDeliveryModal/SelectDeliveryModal'
import { HomePageContent, ImportOrderModel, ImportOrderShoppingList, TopSheet, useGeolocation } from '@beckn-ui/common'

const HomePage = () => {
  const { t } = useLanguage()

  const [searchTerm, setSearchTerm] = useState<string>('')
  const [importedOrder, setImportedOrder] = useState<boolean>(false)
  const [viewOrderDetails, setViewOrderDetails] = useState<boolean>(false)
  const [chatGtpList, setChatGtpList] = useState<boolean>(false)
  const [selectLocationModal, setSelectLocationModal] = useState<boolean>(false)
  const [shoppingListData, setShoppingListData] = useState<ImportOrderShoppingList>([])
  const [selectedValues, setSelectedValues] = useState<string[]>([])
  const [address, setAddress] = useState('')
  const [isLoadingForChatGptRequest, setIsLoadingForChatGptRequest] = useState<boolean>(true)
  const [importedOrderObject, setImportedOrderObject] = useState<ImportOrderModel>()
  const [category, setCategory] = useState<string>('')

  const chatGptApiUrl = process.env.NEXT_PUBLIC_CHAT_GPT_URL
  const apiKeyForGoogle = process.env.NEXT_PUBLIC_GOOGLE_API_KEY

  const {
    currentAddress,
    error: currentLocationFetchError,
    loading: loadingForCurrentAddress
  } = useGeolocation(apiKeyForGoogle as string)

  const router = useRouter()

  useEffect(() => {
    if (localStorage) {
      localStorage.clear()
    }
  }, [])

  const navigateToSearchResults = () => {
    localStorage.setItem('optionTags', JSON.stringify({ name: searchTerm }))
    router.push(`/search?searchTerm=${searchTerm}`)
  }

  const searchIconClickHandler = (e: React.MouseEvent) => {
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
      <TopSheet
        currentLocationFetchError={currentLocationFetchError}
        loadingForCurrentAddress={loadingForCurrentAddress}
        currentAddress={currentAddress}
        t={key => t[key]}
      />

      <HomePageContent
        logos={{
          mobile: { src: kuzaMobLogo, alt: 'Kuza logo' },
          desktop: { src: kuzaDeskLogo, alt: 'Kuza logo' }
        }}
        textContentProps={{
          title: t.forAll,
          subTitle: t.subText
        }}
        searchProps={{
          searchPlaceholder: t.searchPlaceholder,
          setSearchTerm: setSearchTerm,
          onSearchIconClick: searchIconClickHandler,
          onSearchInputEnterPress: navigateToSearchResults
        }}
        footerProps={{
          footerText: t.footerText,
          footerLogoSrc: beckenFooter
        }}
      />

      {importedOrder ? (
        <ImportedOrder
          setImportedOrder={setImportedOrder}
          importedOrderedItem={importedOrderObject!.items}
          updateStateImportedOrder={updateStateImportedOrder}
          showChatGtpList={showChatGtpList}
          handleSetCategory={value => setCategory(value)}
        />
      ) : null}
      {viewOrderDetails ? (
        <OrderDetails
          importedOrderObject={importedOrderObject!}
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
      )}

      {selectLocationModal ? (
        <SelectDeliveryModal
          importedOrderObject={importedOrderObject!}
          backOnImportedOrder={backOnImportedOrder}
          selectedValues={selectedValues}
          addressOfTheEndLocation={address}
          category={category}
        />
      ) : null}
    </>
  )
}

export default HomePage
