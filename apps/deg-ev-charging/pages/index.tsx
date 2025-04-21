import React, { useCallback, useState, memo, useMemo, useEffect } from 'react'
import dynamic from 'next/dynamic'
import {
  checkoutActions,
  clearSource,
  Coordinate,
  DegWalletDetails,
  discoveryActions,
  IGeoLocationSearchPageRootState,
  Item,
  Location,
  ParsedItemModel,
  toggleLocationSearchPageVisibility,
  useGeolocation
} from '@beckn-ui/common'
import OpenWalletBottomModal from '@components/Modal/OpenWalletBottomModal'
import { useConnectWallet } from '@hooks/useConnectWallet'
import { AuthRootState } from '@store/auth-slice'
import { useDispatch, useSelector } from 'react-redux'
import ChargerBottomModal from '@components/Modal/ChargerBottomModal'
import { EVCharger } from '@components/Map/Map'
import CCS_Icon from '@public/images/ccs1_icon.svg'
import CCS2_Icon from '@public/images/ccs2_icon.svg'
import Chademo_Icon from '@public/images/chademo_icon.svg'
import gbt_Icon from '@public/images/gbt_icon.svg'
import { DOMAIN } from '@lib/config'
import { getCountryCode } from '@utils/general'
import axios from '@services/axios'
import { parseSearchlist } from '@utils/search-utils'
import { useRouter } from 'next/router'
import { ChargerPort, chargerSelectActions, SelectedCharger } from '@store/chargerSelect-slice'
import { Loader } from '@beckn-ui/molecules'
import { setCurrentLocation, UserRootState } from '@store/user-slice'
import { cartActions } from '@store/cart-slice'

const MapWithNoSSR = dynamic(() => import('@components/Map'), { ssr: false })

const PortIconMap = {
  CCS: CCS_Icon,
  CHAdeMO: Chademo_Icon,
  Type2: CCS2_Icon,
  GBT: gbt_Icon,
  'GB/T': gbt_Icon
}

// Transform API response to EVCharger format
const transformToEVCharger = (parsedItem: ParsedItemModel): EVCharger => {
  return {
    id: parsedItem.id,
    latitude: Number((parsedItem.item?.locations as Location[])?.[0]?.gps?.split(',')[0]) || 0,
    longitude: Number((parsedItem.item?.locations as Location[])?.[0]?.gps?.split(',')[1]) || 0,
    name: parsedItem.item.name || '',
    status: '(4/4) Available',
    address:
      `${(parsedItem?.item?.locations as Location[])?.[0].address}, ${(parsedItem?.item?.locations as Location[])?.[0].city}, ${(parsedItem?.item?.locations as Location[])?.[0].state}, ${(parsedItem?.item?.locations as Location[])?.[0].country}` ||
      '',
    rate: Number(parsedItem.item.price?.value) || 0,
    ports:
      parsedItem?.item?.tags?.[0]?.list?.map(portData => {
        return {
          id: portData.name,
          type: portData.name,
          icon: PortIconMap[portData.name as keyof typeof PortIconMap]
        }
      }) || [],
    data: { providerDetails: parsedItem, itemDetails: parsedItem.item }
  }
}

const MemoizedMap = memo(
  ({
    origin,
    destination,
    startNavigation,
    showMyLocation,
    handleOnConnectWallet,
    onChargerSelect,
    isWalletConnected,
    evChargers,
    handleOnSearch,
    searchQuery,
    returnToCurrentLocation
  }: {
    origin: Coordinate
    destination: Coordinate
    startNavigation: boolean
    showMyLocation: boolean
    handleOnConnectWallet: () => void
    onChargerSelect: (charger: EVCharger) => void
    isWalletConnected: boolean
    evChargers: EVCharger[]
    handleOnSearch: (query: string) => void
    searchQuery: string
    returnToCurrentLocation: (
      location: {
        latitude: number
        longitude: number
        address?: string
      } | null
    ) => void
  }) => {
    return (
      <MapWithNoSSR
        origin={origin}
        destination={destination}
        startNav={startNavigation}
        enableMyLocation={showMyLocation}
        showConnectWallet={!isWalletConnected}
        setCurrentOrigin={returnToCurrentLocation}
        handleOnConnectWallet={handleOnConnectWallet}
        evChargers={evChargers}
        onChargerSelect={onChargerSelect}
        handleOnSearch={handleOnSearch}
        searchQuery={searchQuery}
      />
    )
  },
  (prevProps, nextProps) => {
    return (
      prevProps.origin === nextProps.origin &&
      prevProps.destination === nextProps.destination &&
      prevProps.startNavigation === nextProps.startNavigation &&
      prevProps.showMyLocation === nextProps.showMyLocation &&
      prevProps.isWalletConnected === nextProps.isWalletConnected &&
      prevProps.evChargers === nextProps.evChargers &&
      prevProps.searchQuery === nextProps.searchQuery
    )
  }
)

MemoizedMap.displayName = 'MemoizedMap'

const Homepage = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  const [startNavigation] = useState<boolean>(false)
  const [showMyLocation] = useState<boolean>(true)
  const [selectedCharger, setSelectedCharger] = useState<EVCharger | null>(null)
  const [evChargers, setEvChargers] = useState<EVCharger[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [destination, setDestination] = useState<Coordinate>()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [walletDetails, setWalletDetails] = useState<DegWalletDetails>()

  const { modalType, handleModalOpen, handleModalClose } = useConnectWallet()

  const apiKeyForGoogle = process.env.NEXT_PUBLIC_GOOGLE_API_KEY
  const { coordinates } = useGeolocation(apiKeyForGoogle as string)
  const dispatch = useDispatch()
  const { user } = useSelector((state: AuthRootState) => state.auth)
  const router = useRouter()
  const { currentLocation, shouldShowInitialAlert } = useSelector((state: UserRootState) => state.user)
  const { geoLatLong, geoAddress } = useSelector(
    (state: IGeoLocationSearchPageRootState) => state.geoLocationSearchPageUI
  )

  const returnToCurrentLocation = useCallback(
    (
      location?: {
        latitude: number
        longitude: number
        address?: string
      } | null
    ) => {
      if (coordinates || location) {
        dispatch(
          setCurrentLocation({
            latitude: Number(coordinates?.latitude || location?.latitude),
            longitude: Number(coordinates?.longitude || location?.longitude)
          })
        )
        if (location) {
          setSearchQuery('')
          dispatch(clearSource())
        }
      }
    },
    [coordinates, dispatch]
  )

  useEffect(() => {
    if (geoLatLong) {
      dispatch(
        setCurrentLocation({ latitude: Number(geoLatLong.split(',')[0]), longitude: Number(geoLatLong.split(',')[1]) })
      )
      setSearchQuery(geoAddress)
    } else if (coordinates) {
      returnToCurrentLocation()
    }
  }, [coordinates, geoLatLong])

  useEffect(() => {
    if (user && user?.deg_wallet) {
      setWalletDetails(user.deg_wallet)
    }
    console.log(shouldShowInitialAlert)
    if (
      shouldShowInitialAlert &&
      user?.deg_wallet &&
      (!user?.deg_wallet.energy_assets_consent ||
        !user?.deg_wallet.energy_identities_consent ||
        !user?.deg_wallet.energy_transactions_consent)
    ) {
      handleModalOpen('alert')
    }
  }, [user, shouldShowInitialAlert])

  const fetchEvChargers = useCallback(async () => {
    try {
      const searchPayload = {
        context: {
          domain: DOMAIN,
          location: getCountryCode()
        },
        searchString: 'ev charger',
        fulfillment: {
          stops: [
            {
              location: `${currentLocation?.latitude},${currentLocation?.longitude}`
            }
          ]
        }
      }
      setIsLoading(true)
      setDestination(undefined)

      const res = await axios.post(`${apiUrl}/search`, searchPayload)
      if (res.data.data.length > 0) {
        dispatch(
          discoveryActions.addTransactionId({
            transactionId: res.data.data[0].context.transaction_id
          })
        )

        const parsedSearchItems = parseSearchlist(res.data.data)
        const transformedChargers = parsedSearchItems.map((item: ParsedItemModel) => transformToEVCharger(item))
        setEvChargers(transformedChargers)
      } else {
        setEvChargers([])
      }
    } catch (error) {
      console.error('Error fetching EV chargers:', error)
    } finally {
      setIsLoading(false)
    }
  }, [apiUrl, dispatch, currentLocation])

  useEffect(() => {
    let timeoutId: NodeJS.Timeout

    if (geoLatLong) {
      // Debounce the fetch call to prevent multiple rapid calls
      timeoutId = setTimeout(() => {
        fetchEvChargers()
      }, 500)
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [geoLatLong, fetchEvChargers])

  const handleConnectWallet = useCallback(() => {
    handleModalOpen('link')
  }, [handleModalOpen])

  const handleChargerSelect = useCallback((charger: EVCharger) => {
    setSelectedCharger(charger)
    setDestination(undefined)
  }, [])

  const handleNavigate = useCallback(() => {
    console.log('Navigating to charger:', selectedCharger)
    setDestination({
      latitude: selectedCharger?.latitude || 0,
      longitude: selectedCharger?.longitude || 0
    })
  }, [selectedCharger])

  const handleSelect = useCallback(
    (vehicleType: string, port: ChargerPort) => {
      console.log('Selected charger:', selectedCharger)
      if (selectedCharger) {
        dispatch(cartActions.clearCart())
        dispatch(checkoutActions.clearState())
        dispatch(
          chargerSelectActions.setSelectedCharger({
            ...(selectedCharger as SelectedCharger),
            selectedPort: port,
            selectedVehicleType: vehicleType
          })
        )
        dispatch(
          cartActions.addItemToCart({
            product: {
              ...selectedCharger?.data?.providerDetails,
              item: selectedCharger?.data?.itemDetails as Item
            } as ParsedItemModel,
            quantity: 1
          })
        )
        router.push(`/checkout`)
      }
    },
    [selectedCharger]
  )

  const handleCloseChargerModal = useCallback(() => {
    setSelectedCharger(null)
  }, [])

  const handleWhenSearchLocation = () => {
    dispatch(toggleLocationSearchPageVisibility({ visible: true, addressType: '' }))
  }

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query)
    if (query) {
      handleWhenSearchLocation()
    } else if (!query) {
      dispatch(clearSource())
    }
  }, [])

  const isWalletConnected = useMemo(() => Boolean(user?.deg_wallet?.deg_wallet_id), [user?.deg_wallet?.deg_wallet_id])

  return (
    <>
      <div className="relative overflow-hidden max-h-[100vh]">
        <MemoizedMap
          origin={currentLocation!}
          destination={destination!}
          startNavigation={startNavigation}
          showMyLocation={showMyLocation}
          handleOnConnectWallet={handleConnectWallet}
          onChargerSelect={handleChargerSelect}
          isWalletConnected={isWalletConnected}
          evChargers={evChargers}
          handleOnSearch={handleSearch}
          searchQuery={searchQuery}
          returnToCurrentLocation={returnToCurrentLocation}
        />
        {isLoading && (
          <div className="absolute inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50 h-[100vh]">
            <Loader />
          </div>
        )}
      </div>
      <OpenWalletBottomModal
        modalType={modalType}
        setModalType={handleModalOpen}
        onClose={handleModalClose}
      />
      {selectedCharger && (
        <ChargerBottomModal
          charger={selectedCharger}
          onNavigate={handleNavigate}
          onSelect={handleSelect}
          onClose={handleCloseChargerModal}
        />
      )}
    </>
  )
}

export default Homepage
