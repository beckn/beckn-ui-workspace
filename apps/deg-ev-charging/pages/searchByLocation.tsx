import React, { useEffect, useRef, useState } from 'react'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { Box, Portal, useDisclosure } from '@chakra-ui/react'
import { IoClose, IoLocateOutline } from 'react-icons/io5'
import { useDiscoverMutation } from '@beckn-ui/common/src/services/beckn-2.0/discover'
import { discoverActions } from '@beckn-ui/common'
import { searchByLocationActions } from '@store/searchByLocation-slice'
import type { RootState } from '@store/index'
import type { DiscoverCatalogStored } from '@beckn-ui/common/lib/types/beckn-2.0/discover'
import {
  buildDiscoverRequestByLocation,
  getCatalogsFromResponse,
  getCatalogItemsAndOffers,
  getItemLocationEntries,
  getItemPriceFromCatalog,
  getTransactionIdFromResponse,
  hasDiscoverMessageWithCatalogs
} from '@utils/discoverHelpers'
import { getUserLocation } from '@utils/geoLocation-utils'
import MapSearch from '@components/Map/MapSearch'
import type { LocationSuggestion } from '@components/Map/MapSearch'
import type { StationMarker } from '@components/Map/LocationMap'

const LocationMap = dynamic(() => import('@components/Map/LocationMap'), { ssr: false })

/** Default map + discover center (Koramangala, Bengaluru) when the page loads; user can search or use device location. */
const DEFAULT_SEARCH_LOCATION = { lat: 12.9309648, lng: 77.6182323 }

function formatAddress(addr: Record<string, unknown> | undefined): string {
  if (!addr || typeof addr !== 'object') return ''
  const parts = [addr.area_name, addr.building, addr.street, addr.locality, addr.city, addr.state, addr.country].filter(
    Boolean
  ) as string[]
  return parts.join(', ')
}

type StationDetailsRecord = Record<
  string,
  {
    name: string
    shortDesc?: string
    longDesc?: string
    address: string
    itemAttributes?: Record<string, unknown>
    /** Price from first offer that applies to this item (beckn:items contains item id) */
    price?: { value: number; currency: string }
  }
>

function buildStationsAndDetailsFromCatalogs(catalogs: DiscoverCatalogStored[]): {
  markers: StationMarker[]
  details: StationDetailsRecord
} {
  const markers: StationMarker[] = []
  const details: StationDetailsRecord = {}
  for (const catalog of catalogs) {
    const { items } = getCatalogItemsAndOffers(catalog)
    for (const item of items) {
      const rec = item as Record<string, unknown>
      const id = String(rec['id'] ?? '')
      const descriptor = (rec['descriptor'] as Record<string, unknown>) || {}
      const name = String(descriptor['name'] ?? 'Charging station')
      const shortDesc = descriptor['shortDesc'] != null ? String(descriptor['shortDesc']) : undefined
      const longDesc = descriptor['longDesc'] != null ? String(descriptor['longDesc']) : undefined
      const itemAttrs = rec['itemAttributes'] as Record<string, unknown> | undefined
      const price = getItemPriceFromCatalog(catalog, id) ?? undefined
      const entries = getItemLocationEntries(rec)
      for (const entry of entries) {
        const markerKey = `${id}_${entry.lat}_${entry.lng}`
        markers.push({ id, markerKey, lat: entry.lat, lng: entry.lng, name })
        details[markerKey] = {
          name,
          shortDesc,
          longDesc,
          address: entry.address,
          itemAttributes:
            itemAttrs && typeof itemAttrs === 'object' && !Array.isArray(itemAttrs) ? itemAttrs : undefined,
          price
        }
      }
    }
  }
  return { markers, details }
}

export default function SearchByLocationPage() {
  const router = useRouter()
  const dispatch = useDispatch()
  const catalogs = useSelector((s: RootState) => s.discover?.catalogs ?? [])
  const lastDiscoverCoords = useSelector((s: RootState) => s.searchByLocation?.lastDiscoverCoords ?? null)
  const [discover] = useDiscoverMutation()
  const discoverRef = useRef(discover)

  const [coords, setCoords] = useState(DEFAULT_SEARCH_LOCATION)
  const [locationName, setLocationName] = useState('Koramangala')
  const [nominatimLocations, setNominatimLocations] = useState<LocationSuggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [stations, setStations] = useState<StationMarker[]>([])
  const [stationDetails, setStationDetails] = useState<StationDetailsRecord>({})
  const [selectedStation, setSelectedStation] = useState<StationMarker | null>(null)
  const [loadingStations, setLoadingStations] = useState(false)
  const [discoverError, setDiscoverError] = useState<string | null>(null)
  const [loadingLocation, setLoadingLocation] = useState(false)

  const { isOpen: isDetailOpen, onOpen: onDetailOpen, onClose: onDetailClose } = useDisclosure()
  discoverRef.current = discover

  // When coords are set: use cached stations if coords match last discover, else call discover API.
  useEffect(() => {
    if (coords.lat === 0 && coords.lng === 0) return
    if (
      catalogs.length > 0 &&
      lastDiscoverCoords &&
      coords.lat === lastDiscoverCoords.lat &&
      coords.lng === lastDiscoverCoords.lng
    ) {
      const { markers, details } = buildStationsAndDetailsFromCatalogs(catalogs)
      setStations(markers)
      setStationDetails(details)
      return
    }
    setLoadingStations(true)
    setDiscoverError(null)
    const payload = buildDiscoverRequestByLocation(coords.lat, coords.lng)
    discoverRef
      .current(payload)
      .unwrap()
      .then(res => {
        if (!hasDiscoverMessageWithCatalogs(res)) {
          setStations([])
          setStationDetails({})
          return
        }
        const newCatalogs = getCatalogsFromResponse(res) as DiscoverCatalogStored[]
        const tid = getTransactionIdFromResponse(res)
        if (tid) dispatch(discoverActions.setTransactionId({ transactionId: tid }))
        dispatch(discoverActions.setDiscoverCatalogs({ catalogs: newCatalogs }))
        dispatch(searchByLocationActions.setLastDiscoverCoords({ lat: coords.lat, lng: coords.lng }))
        const ctx = (res as unknown as Record<string, unknown>).context
        if (ctx && typeof ctx === 'object') {
          dispatch(discoverActions.setDiscoverResponseContext({ context: ctx as Record<string, unknown> }))
        }
        const { markers, details } = buildStationsAndDetailsFromCatalogs(newCatalogs)
        setStations(markers)
        setStationDetails(details)
      })
      .catch(() => {
        setDiscoverError('Unable to load stations for this location')
        setStations([])
        setStationDetails({})
      })
      .finally(() => setLoadingStations(false))
  }, [coords.lat, coords.lng, dispatch, catalogs.length, lastDiscoverCoords])

  const fetchLocationByQuery = async (query: string) => {
    if (!query || !query.trim()) {
      setNominatimLocations([])
      return
    }
    try {
      const res = await fetch(`/api/nominatim/search?q=${encodeURIComponent(query.trim())}&limit=5`, {
        headers: { Accept: 'application/json' }
      })
      const data = await res.json()
      setNominatimLocations(Array.isArray(data) ? data : [])
    } catch {
      setNominatimLocations([])
    }
  }

  const handleLocationClick = (lat: number, lon: number) => {
    setCoords({ lat, lng: lon })
    setShowSuggestions(false)
  }

  const handleUseMyLocation = () => {
    setDiscoverError(null)
    setLoadingLocation(true)
    getUserLocation()
      .then(position => {
        setCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        })
        setShowSuggestions(false)
      })
      .catch(() => {
        setDiscoverError('Unable to get your location. Check permissions or try again.')
      })
      .finally(() => setLoadingLocation(false))
  }

  const handleStationClick = (station: StationMarker) => {
    setSelectedStation(station)
    onDetailOpen()
  }

  const handleViewStation = () => {
    if (selectedStation) {
      onDetailClose()
      setSelectedStation(null)
      router.push(`/detailView?itemId=${encodeURIComponent(selectedStation.id)}`)
    }
  }

  return (
    <>
      <Head>
        <title>Search by location – EV Charging</title>
        <meta
          name="description"
          content="Find charging stations near a location"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
      </Head>
      <div className="ev-app relative flex flex-1 min-h-0 w-full flex-col bg-[var(--ev-bg)]">
        {/* Map: full bleed, fills entire page height */}
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          minH={0}
          minW={0}
          overflow="hidden"
          zIndex={0}
        >
          <LocationMap
            center={coords}
            stations={stations}
            selectedStationId={selectedStation?.markerKey ?? null}
            onStationClick={handleStationClick}
          />
          {loadingStations && (
            <Box
              position="absolute"
              top="50%"
              left="50%"
              transform="translate(-50%,-50%)"
              zIndex={10}
              pointerEvents="none"
            >
              <div className="w-10 h-10 border-4 border-[var(--ev-border)] border-t-[var(--ev-primary)] rounded-full animate-spin" />
            </Box>
          )}
        </Box>

        {/* Search + Use my location: one card on top of map; button is inside the search row */}
        <Box
          position="absolute"
          top={3}
          left={4}
          right={4}
          zIndex={10}
          className="rounded-2xl bg-white/95 shadow-lg backdrop-blur-sm border border-[var(--ev-border)]"
          px={3}
          py={2}
        >
          <MapSearch
            setQuery={setLocationName}
            locations={nominatimLocations}
            query={locationName}
            handleLocationClick={handleLocationClick}
            fetchResults={fetchLocationByQuery}
            setShowSuggestions={setShowSuggestions}
            rightElement={
              <button
                type="button"
                onClick={handleUseMyLocation}
                disabled={loadingLocation}
                className="flex items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 min-h-[2.25rem] text-sm font-medium text-[var(--ev-primary)] hover:opacity-80 active:opacity-70 disabled:opacity-50 shrink-0"
                aria-label="Use my current location"
              >
                <IoLocateOutline size={18} />
                <span className="hidden sm:inline">Use my location</span>
              </button>
            }
          />
        </Box>

        {/* Error message: below search card */}
        {discoverError && (
          <Box
            position="absolute"
            top="140px"
            left={4}
            right={4}
            zIndex={11}
            px={4}
            py={2}
            bg="var(--ev-error)"
            color="white"
            fontSize="sm"
            textAlign="center"
            borderRadius="md"
            boxShadow="md"
          >
            {discoverError}
          </Box>
        )}

        {isDetailOpen && (
          <Portal>
            <div
              role="dialog"
              aria-modal
              className="fixed inset-0 z-[9999]"
            >
              {/* Backdrop */}
              <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-200"
                onClick={onDetailClose}
                aria-hidden
              />
              {/* Sheet */}
              <div
                className="ev-bottom-sheet absolute bottom-0 left-0 right-0 flex h-[58vh] max-h-[58vh] flex-col overflow-hidden rounded-t-3xl bg-white shadow-[0_-8px_40px_rgba(0,0,0,0.12)]"
                style={{
                  animation: 'evSheetSlideUp 0.35s cubic-bezier(0.32,0.72,0,1) forwards',
                  paddingBottom: 'calc(1rem + var(--ev-safe-bottom, 0px))'
                }}
              >
                <style>{`
                                    @keyframes evSheetSlideUp {
                                        from { transform: translateY(100%); opacity: 0; }
                                        to { transform: translateY(0); opacity: 1; }
                                    }
                                `}</style>
                {/* Handle */}
                <div className="flex shrink-0 justify-center pt-3 pb-1">
                  <div className="h-1 w-10 rounded-full bg-gray-300" />
                </div>
                {/* Header */}
                <header className="flex shrink-0 items-start justify-between gap-3 border-b border-gray-100 px-5 pb-4 pt-0">
                  <div className="min-w-0 flex-1">
                    <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-widest text-[var(--ev-primary)]">
                      Charging station
                    </p>
                    <h2 className="text-lg font-bold leading-tight text-gray-900 line-clamp-2">
                      {selectedStation
                        ? (stationDetails[selectedStation.markerKey]?.name ??
                          selectedStation.name ??
                          'Charging station')
                        : ''}
                    </h2>
                  </div>
                  <button
                    type="button"
                    aria-label="Close"
                    onClick={onDetailClose}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 active:bg-gray-200"
                  >
                    <IoClose
                      size={22}
                      strokeWidth={2}
                    />
                  </button>
                </header>
                {/* Body */}
                {selectedStation &&
                  (() => {
                    const detail = stationDetails[selectedStation.markerKey]
                    const shortDesc = detail?.shortDesc ?? ''
                    const attrs = detail?.itemAttributes
                    const entries: Array<{ key: string; label: string; value: string }> = []
                    if (detail?.price != null) {
                      const { value, currency } = detail.price
                      const curr = currency === 'INR' ? '₹' : `${currency} `
                      entries.push({ key: 'price', label: 'Price', value: `${curr}${value} per kWh` })
                    }
                    if (shortDesc) entries.push({ key: 'shortDesc', label: 'Description', value: shortDesc })
                    if (attrs && typeof attrs === 'object' && !Array.isArray(attrs)) {
                      const skipKeys = ['@context', '@type', 'serviceLocation', 'service_location', 'amenityFeature']
                      for (const [key, value] of Object.entries(attrs)) {
                        if (skipKeys.includes(key)) continue
                        const label = key
                          .replace(/([A-Z])/g, ' $1')
                          .replace(/^./, s => s.toUpperCase())
                          .trim()
                        let displayValue = ''
                        if (value == null) continue
                        if (Array.isArray(value)) displayValue = value.map(v => String(v ?? '')).join(', ')
                        else if (typeof value === 'object') {
                          try {
                            displayValue = JSON.stringify(value)
                          } catch {
                            displayValue = String(value)
                          }
                        } else displayValue = String(value)
                        if (displayValue) entries.push({ key, label, value: displayValue })
                      }
                    }
                    return (
                      <>
                        <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-5 py-4">
                          {entries.length === 0 ? (
                            <p className="py-8 text-center text-sm text-gray-400">No details available</p>
                          ) : (
                            <ul className="divide-y divide-gray-100">
                              {entries.map(({ key, label, value }) => (
                                <li
                                  key={key}
                                  className="flex items-start gap-4 py-3 first:pt-0"
                                >
                                  <span className="w-28 shrink-0 text-xs font-semibold uppercase tracking-wider text-gray-400">
                                    {label}
                                  </span>
                                  <span className="min-w-0 flex-1 break-words text-sm font-medium text-gray-800 leading-snug">
                                    {value}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                        {/* CTA */}
                        <div className="shrink-0  bg-white px-5 pt-4">
                          <button
                            type="button"
                            onClick={handleViewStation}
                            className=" border border-solid border-[#008000] flex h-[52px] w-full items-center justify-center rounded-xl bg-[var(--ev-primary)] px-4 text-base font-semibold text-[#008000] shadow-sm transition-all duration-200 hover:bg-[var(--ev-primary-hover)] hover:shadow-md active:scale-[0.98]"
                          >
                            View station details
                          </button>
                        </div>
                      </>
                    )
                  })()}
              </div>
            </div>
          </Portal>
        )}
      </div>
    </>
  )
}
