import React, { useRef, useEffect, useState, useCallback } from 'react'
import { Transition } from 'react-transition-group'
import dynamic from 'next/dynamic'
import BottomModal from '../components/BottomModal'
import OptionCard from '../components/Map/OptionCard'
import { optionData } from '../components/Map/StoreMarkerData'
import { useRouter } from 'next/router'
import useRequest from '../hooks/useRequest'
import cs from 'classnames'
import { Image } from '@chakra-ui/react'
import { useLanguage } from '../hooks/useLanguage'

const tagValuetoApiMap = {
    Books: 'books',
    restaurant: 'bakery',
    Shopping: 'supermarket',
}

enum StoreType {
    books = 'Books',
    restaurant = 'restaurant',
    shopping = 'Shopping',
}

type Coords = {
    lat: number
    long: number
}
type OptionType = {
    tagName: string
    tagValue: string
    title?: string
}

const initialOption: OptionType = {
    tagName: '',
    tagValue: '',
}

const duration = 300

const defaultStyle = {
    transition: `height ${duration}ms ease-in-out`,
    height: '4rem',
}

const transitionStyles = {
    entering: { height: '12rem' },
    entered: { height: '12rem' },
    exiting: { height: '3.8rem' },
    exited: { height: '3.8rem' },
}

const getProperImages = (selectedStore: any) => {
    if (selectedStore && selectedStore.tags) {
        if (selectedStore.tags.image) return selectedStore.tags.image
        else return selectedStore.tags.images
    } else return ''
}

const getStaticTags = (tag: string) => {
    if (tag === StoreType.books)
        return ['inStoreShopping', 'delivery', 'clickAndCollect']
    else return ['dineIn', 'takeAway', 'delivery']
}

import MapSearch from '../components/Map/MapSearch'
import { isEmpty } from 'lodash'
import { getUserLocation } from '../utilities/common-utils'

const SearchByLocation = () => {
    const MapWithNoSSR = dynamic(() => import('../components/Map'), {
        ssr: false,
    })

    const nodeRef = useRef(null)
    const [showSuggestions, setShowSuggestions] = useState(false)

    const { t, locale } = useLanguage()

    // create a state value called query in typescript
    const [query, setQuery] = useState<string>('')
    // const [coords, setCoords] = useState<Coords>({
    //   lat: 48.719242,
    //   long: 2.346078,
    // });
    const [coords, setCoords] = useState<Coords>({
        lat: 0,
        long: 0,
    })

    const [isOptionModalOpen, setIsOptionModalOpen] = useState<boolean>(true)
    const [isOptionDetailOpen, setIsOptionDetailOpen] = useState<boolean>(false)
    const [isMenuModalOpen, setIsMenuModalOpen] = useState<boolean>(true)
    const [option, setOption] = useState<OptionType>(initialOption)

    //TODO local store and coords states can be removed in further iterations
    const [stores, setStores] = useState<any>([])
    // const [selectedStore, setSelectedStore] = useState<any>(null);
    const [selectedStore, setSelectedStore] = useState<any>(null)

    const {
        data: searchedLocationData,
        loading,
        error,
        fetchData,
    } = useRequest()
    const {
        data: locationData,
        loading: loadingLocation,
        error: locationError,
        fetchData: fetchLocation,
    } = useRequest()
    const {
        data: storesByLocation,
        loading: loadingStores,
        error: errorStores,
        fetchData: fetchStores,
    } = useRequest()
    const router = useRouter()

    useEffect(() => {
        getUserLocation()
            .then((position) => {
                setCoords({
                    lat: position.coords.latitude,
                    long: position.coords.longitude,
                })
            })
            .catch((error) => {
                console.error(`Error getting user location: ${error.message}`)
            })
    }, [])

    useEffect(() => {
        setOption(JSON.parse(localStorage.getItem('selectedOption') as string))
    }, [])

    useEffect(() => {
        localStorage.setItem('selectedOption', JSON.stringify(option))
    }, [option])

    const handleModalOpen = () => {
        setIsOptionModalOpen((prevState) => !prevState)
    }

    const handleModalClose = () => {
        setIsOptionModalOpen(false)
    }

    const handleOptionDetailOpen = () => {
        setIsOptionDetailOpen((prevState) => !prevState)
    }

    const handleOptionDetailClose = () => {
        setIsOptionDetailOpen(false)
        setSelectedStore(null)
    }

    const handleMenuModalClose = () => {
        setIsMenuModalOpen(false)
    }

    const handleLocationClick = (lat: number, long: number) => {
        setCoords({ lat, long })
    }

    const fetchLocationByQuery = (query: string) => {
        let url = `${process.env.NEXT_PUBLIC_NOMINATIM_URL}/search?format=jsonv2&q=${query}`

        fetchData(url, 'GET')
    }

    const fetchLocationNameByCoords = (lat: number, long: number) => {
        let url = `${process.env.NEXT_PUBLIC_NOMINATIM_URL}/reverse?format=jsonv2&lat=${lat}&lon=${long}`

        fetchLocation(url, 'GET')
    }

    const fetchStoresByLocation = (
        lat: number,
        long: number,
        tagValue: string,
        tagName: string
    ) => {
        // static tagName and tagValue for now
        let url = `${process.env.NEXT_PUBLIC_BECKN_API_URL}/stores?tagName=becknified&tagValue=true&latitude=${lat}&longitude=${long}&filter=${tagValuetoApiMap[tagValue]}`

        // Only fetch when Books are selected for now
        fetchStores(url, 'GET')
    }

    useEffect(() => {
        // Not refilling stores if option is empty
        if (storesByLocation && !isEmpty(option.tagValue)) {
            setStores(storesByLocation)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [storesByLocation])

    useEffect(() => {
        if (isEmpty(query) && !isEmpty(coords)) {
            fetchLocationNameByCoords(coords.lat, coords.long)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [coords])

    useEffect(() => {
        if (
            !isEmpty(coords) &&
            !isEmpty(option?.tagValue) &&
            (option?.tagValue === StoreType.books ||
                option?.tagValue === StoreType.restaurant ||
                option?.tagValue === StoreType.shopping)
        ) {
            fetchStoresByLocation(
                coords.lat,
                coords.long,
                option?.tagValue,
                option?.tagName
            )
        }
        if (option?.tagValue !== StoreType.books) {
            setStores([])
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [coords, option])

    //resetting option state and stores when location changes
    useEffect(() => {
        // setOption(initialOption);
        setStores([])
    }, [coords])

    return (
        <div>
            <MapSearch
                setQuery={setQuery}
                locations={searchedLocationData as any}
                query={query}
                handleLocationClick={handleLocationClick}
                fetchResults={fetchLocationByQuery}
                setShowSuggestions={setShowSuggestions}
            />
            {!showSuggestions && (
                <>
                    <div className="overflow-hidden max-h-[85vh]">
                        <MapWithNoSSR
                            stores={stores}
                            coords={coords}
                            selectedStore={selectedStore}
                            handleModalOpen={handleModalOpen}
                            handleOptionDetailOpen={handleOptionDetailOpen}
                            setSelectedStore={setSelectedStore}
                        />
                    </div>

                    <div className="bottom-0 absolute z-[1000] max-h-fit w-[100vw]  flex items-end justify-center  sm:p-0">
                        <Transition
                            nodeRef={nodeRef}
                            in={isMenuModalOpen}
                            timeout={duration}
                        >
                            {(state) => (
                                <div
                                    ref={nodeRef}
                                    style={{
                                        ...defaultStyle,
                                        ...transitionStyles[state],
                                    }}
                                    className={cs(
                                        'w-full   px-4 pb-4 pt-2 mx-auto bg-[#F3F4F5]  rounded-t-[1rem] shadow-lg sm:rounded-lg sm:overflow-hidden'
                                    )}
                                >
                                    <div
                                        onClick={() =>
                                            setIsMenuModalOpen((prev) => !prev)
                                        }
                                    >
                                        <Image
                                            src="/images/Indicator.svg"
                                            className="mx-auto mb-3"
                                            alt="swipe indicator"
                                        />
                                        <h3 className="text-[17px]/[20px]">
                                            {t.explorePlaces}
                                        </h3>
                                    </div>
                                    <div
                                        className={cs(
                                            'justify-between  py-5',
                                            { ['flex']: isMenuModalOpen },
                                            { ['hidden']: !isMenuModalOpen }
                                        )}
                                    >
                                        {optionData.map(
                                            (currentOption, index) => {
                                                const isSelected = option
                                                    ? option.tagValue ===
                                                      currentOption.tagValue
                                                    : false
                                                const optionMeta = {
                                                    tagName:
                                                        currentOption.tagName,
                                                    tagValue:
                                                        currentOption.tagValue,
                                                    title: currentOption.title,
                                                }
                                                const optionIcons = {
                                                    iconUrl:
                                                        currentOption.iconUrl,
                                                    iconUrlLight:
                                                        currentOption.iconUrl_light,
                                                }
                                                return (
                                                    <OptionCard
                                                        key={index}
                                                        isSelected={isSelected}
                                                        setOption={setOption}
                                                        optionMeta={optionMeta}
                                                        optionIcons={
                                                            optionIcons
                                                        }
                                                    />
                                                )
                                            }
                                        )}
                                    </div>
                                </div>
                            )}
                        </Transition>
                    </div>

                    <BottomModal
                        isOpen={isOptionDetailOpen}
                        onClose={handleOptionDetailClose}
                    >
                        <div className="flex flex-col gap-2">
                            <p className="text-[16px] leading-[20px]">
                                {
                                    t[
                                        option?.tagValue === StoreType.books
                                            ? 'localStores'
                                            : 'restaurants'
                                    ]
                                }{' '}
                                <span className="font-bold">
                                    {query ? query : locationData?.name}
                                </span>{' '}
                            </p>
                            <div className="flex">
                                <p className="block  text-[12px] leading-[18px]">
                                    <span className="font-bold text-ellipsis max-w-[70%]">
                                        {selectedStore?.tags.name}
                                    </span>{' '}
                                    -{' '}
                                    {option?.tagValue === StoreType.books
                                        ? t.bookstore
                                        : t.optionRestaurant}
                                </p>
                            </div>
                            <div className="flex justify-between gap-2 overflow-x-scroll">
                                {getProperImages(selectedStore)
                                    .split(',')
                                    .map((singleImage: string, i: number) => {
                                        return (
                                            <Image
                                                key={i}
                                                src={singleImage}
                                                className="rounded-xl object-cover min-w-[75px] h-[75px]"
                                                alt="store"
                                            />
                                        )
                                    })}
                            </div>
                            <p className="text-[10px] leading-[15px]">
                                {selectedStore?.tags['addr:full'] ||
                                    selectedStore?.tags['addr:street']}
                            </p>
                            <div className="flex justify-between w-[90%] ">
                                {getStaticTags(option?.tagValue).map(
                                    (tag, i) => {
                                        return (
                                            <div
                                                key={tag}
                                                className="flex items-center"
                                            >
                                                <div className="h-2 w-2 bg-palette-primary mr-2 rounded-full"></div>
                                                <p className="text-[10px] leading-[15px]">
                                                    {t[`${tag}`]}
                                                </p>
                                            </div>
                                        )
                                    }
                                )}
                            </div>
                            <button
                                onClick={() => {
                                    router.push('/search')
                                    localStorage.setItem(
                                        'optionTags',
                                        JSON.stringify(selectedStore?.tags)
                                    )
                                }}
                                className="px-[47px] mt-1 py-[12px]  bg-palette-primary border_radius_all text-white"
                            >
                                {t['shopButton']}
                            </button>
                        </div>
                    </BottomModal>
                </>
            )}
        </div>
    )
}

export default SearchByLocation
