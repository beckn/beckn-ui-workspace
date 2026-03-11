import React, { useState, useEffect, useRef } from 'react'
import { Spinner } from '@chakra-ui/react'
import { GoSearch } from 'react-icons/go'
import { isEmpty } from 'lodash'
import { Image } from '@chakra-ui/react'
import { useLanguage } from '../../hooks/useLanguage'
import useDebounce from '../../hooks/useDebounce'

const MIN_QUERY_LENGTH = 2

interface LocalNameFormat {
  primaryName: string
  secondaryName: string
}

function formatLocationName(name: string): LocalNameFormat {
  const index = name.indexOf(',')
  if (index !== -1) {
    return {
      primaryName: name.slice(0, index).trim(),
      secondaryName: name.slice(index + 1).trim()
    }
  } else {
    return {
      primaryName: name.trim(),
      secondaryName: ''
    }
  }
}

export interface LocationSuggestion {
  display_name?: string
  place_id?: string
  lat?: number
  lon?: number
  [key: string]: unknown
}

export interface SearchBarProp {
  setQuery: React.Dispatch<React.SetStateAction<string>>
  locations: LocationSuggestion[]
  query: string
  handleLocationClick: (lat: number, long: number) => void
  fetchResults: (query: string) => void
  setShowSuggestions: React.Dispatch<React.SetStateAction<boolean>>
  /** Optional element rendered in the same row as the search input (e.g. "Use my location" button) */
  rightElement?: React.ReactNode
}

const SearchBar: React.FC<SearchBarProp> = ({
  setQuery,
  locations,
  handleLocationClick,
  fetchResults,
  setShowSuggestions,
  rightElement
}) => {
  const { t } = useLanguage()
  const fetchResultsRef = useRef(fetchResults)
  fetchResultsRef.current = fetchResults

  const [loading, setLoading] = useState<boolean>(false)
  const [value, setValue] = useState<string>('')

  const debouncedValue = useDebounce(value, 400)

  useEffect(() => {
    setShowSuggestions(!isEmpty(value) && locations && !isEmpty(locations))
  }, [locations, value, setShowSuggestions])

  useEffect(() => {
    setLoading(true)
    const tid = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(tid)
  }, [debouncedValue])

  useEffect(() => {
    const q = debouncedValue.trim()
    if (q.length < MIN_QUERY_LENGTH) {
      return
    }
    fetchResultsRef.current(q)
  }, [debouncedValue])

  return (
    <div className="relative w-full">
      <div className="w-full flex items-center gap-2 flex-grow min-w-0 rounded-[12px] border border-[#C9C9C9] border-solid dark:bg-slate-800 bg-gray-100 px-3 py-2">
        <GoSearch
          style={{
            color: 'rgb(156 163 175)'
          }}
        />
        <input
          className="flex-1 min-w-0 py-2 md:py-2.5 bg-transparent outline-none text-[15px]"
          type="search"
          placeholder={`${t.search}`}
          onChange={e => setValue(e.target.value)}
        />
        {loading && (
          <Spinner
            color="#A71B4A"
            size="sm"
          />
        )}
        {rightElement != null ? <div className="shrink-0 flex items-center">{rightElement}</div> : null}
      </div>
      {!isEmpty(value) && locations && !isEmpty(locations) && (
        <div className="absolute left-0 right-0 top-full mt-1 z-[9995] flex flex-col overflow-auto max-h-[70vh] bg-white rounded-lg shadow-lg border border-[var(--ev-border)] divide-y">
          {locations.map(singleLocation => {
            const { primaryName, secondaryName } = formatLocationName(
              typeof singleLocation.display_name === 'string' ? singleLocation.display_name : ''
            )
            return (
              <div
                key={singleLocation.place_id}
                className="text-ellipsis flex items-start gap-3 my-1 p-2 cursor-pointer hover:bg-gray-50 active:bg-gray-100"
                onClick={() => {
                  if (singleLocation.lat != null && singleLocation.lon != null) {
                    handleLocationClick(singleLocation.lat, singleLocation.lon)
                    setQuery(primaryName)
                    setValue('')
                  }
                }}
              >
                <Image
                  className="mt-1 shrink-0"
                  src="/images/SearchLocationMarker.svg"
                  alt="Location point"
                />
                <div className="min-w-0">
                  <h3 className="text-[15px]/[22.5px] font-[600] text-[#37474F] truncate">{primaryName}</h3>
                  <h4 className="text-[15px]/[17.5px] font-[400] text-[#7C7C7C] truncate">{secondaryName}</h4>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default SearchBar
