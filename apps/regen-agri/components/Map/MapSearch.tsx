import React, { useState, useEffect } from 'react'
import { Spinner } from '@chakra-ui/react'
import { GoSearch } from 'react-icons/go'
import { isEmpty } from 'lodash'
import { Image } from '@chakra-ui/react'
import { useLanguage } from '../../hooks/useLanguage'
import useDebounce from '../../hooks/useDebounce'

interface LocalNameFormat {
    primaryName: string
    secondaryName: string
}

function formatLocationName(name: string): LocalNameFormat {
    const index = name.indexOf(',')
    if (index !== -1) {
        return {
            primaryName: name.slice(0, index).trim(),
            secondaryName: name.slice(index + 1).trim(),
        }
    } else {
        return {
            primaryName: name.trim(),
            secondaryName: '',
        }
    }
}

export interface SearchBarProp {
    setQuery: React.Dispatch<React.SetStateAction<string>>
    locations: any[]
    query: string
    handleLocationClick: (lat: number, long: number) => void
    fetchResults: (query: string) => void
    setShowSuggestions: React.Dispatch<React.SetStateAction<boolean>>
}

const SearchBar: React.FC<SearchBarProp> = ({
    setQuery,
    locations,
    query,
    handleLocationClick,
    fetchResults,
    setShowSuggestions,
}) => {
    const { t } = useLanguage()

    //TODO Pseudo loading for now. Need to figure out to do this using map load events
    const [loading, setLoading] = useState<boolean>(false)

    const [value, setValue] = useState<string>('')

    const debouncedValue = useDebounce(value, 300)

    useEffect(() => {
        setShowSuggestions(!isEmpty(value) && locations && !isEmpty(locations))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [locations, value])

    useEffect(() => {
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
        }, 500)
    }, [debouncedValue])

    useEffect(() => {
        // setQuery(debouncedValue);
        fetchResults(debouncedValue)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedValue])

    return (
        <>
            <div className="max-w-[50rem] w-[90%] md:w-[90%] px-4 mx-auto mt-4 mb-3 border border-[#C9C9C9] border-solid  md:ltr:ml-4 md:rtl:mr-4 rounded-[12px]  dark:bg-slate-800 flex items-center justify-center flex-grow">
                <GoSearch style={{ color: 'rgb(156 163 175)' }} />
                <input
                    className="px-4 py-2 md:py-3 bg-transparent outline-none w-full text-[15px]"
                    type="search"
                    placeholder={`${t.search}`}
                    onChange={(e) => setValue(e.target.value)}
                />
                {loading && (
                    <Spinner
                        color="#A71B4A"
                        size="sm"
                    />
                )}
            </div>
            {!isEmpty(value) && locations && !isEmpty(locations) && (
                <div className="flex flex-col overflow-scroll max-h-[100vh]  bg-white  rounded-md h-[100vh] relative z-[9995] divide-y">
                    {locations.map((singleLocation, index) => {
                        const { primaryName, secondaryName } =
                            formatLocationName(singleLocation.display_name)
                        return (
                            <div
                                key={singleLocation.place_id}
                                className="text-ellipsis  flex items-start gap-3 my-1 p-2 "
                                onClick={() => {
                                    handleLocationClick(
                                        singleLocation.lat,
                                        singleLocation.lon
                                    )
                                    setQuery(primaryName)
                                    setValue('')
                                }}
                            >
                                <Image
                                    className="mt-1"
                                    src="/images/SearchLocationMarker.svg"
                                    alt="Location point"
                                />
                                <div>
                                    <h3 className="text-[15px]/[22.5px] font-[600] text-[#37474F]">
                                        {primaryName}
                                    </h3>
                                    <h4 className="text-[15px]/[17.5px] font-[400] text-[#7C7C7C]">
                                        {secondaryName}
                                    </h4>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </>
    )
}

export default SearchBar
