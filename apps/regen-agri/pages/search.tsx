import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Box } from '@chakra-ui/react'
import SearchBar from '../components/header/SearchBar'
import ProductList from '../components/productList/ProductList'
import useRequest from '../hooks/useRequest'
import { responseDataActions } from '../store/responseData-slice'
import { RetailItem } from '../lib/types/products'
import Loader from '../components/loader/Loader'
import { useLanguage } from '../hooks/useLanguage'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'

//Mock data for testing search API. Will remove after the resolution of CORS issue

const Search = () => {
    const [items, setItems] = useState([])
    const dispatch = useDispatch()
    const [providerId, setProviderId] = useState('')
    const { t, locale } = useLanguage()
    const [tagValue, setTagValue] = useState('')
    const [searchString, setSearchString] = useState('')

    const apiUrl = process.env.NEXT_PUBLIC_API_URL

    const { data, loading, error, fetchData } = useRequest()

    const router = useRouter()

    const categoryMap = {
        Books: { en: 'BookEnglish', fa: 'BookFrench' },
        restaurant: { en: 'FoodEnglish', fa: 'FoodFrench' },
        Shopping: { en: 'retail', fa: 'retail' },
    }

    const categoryName = () => {
        if (tagValue && categoryMap[tagValue]) {
            return categoryMap[tagValue][locale] || categoryMap[tagValue]['en']
        }
    }

    const searchPayload = {
        context: {
            domain: 'retail',
        },
        message: {
            criteria: {
                dropLocation: '48.85041854,2.343660801',
                categoryName: categoryName(),
                providerId: providerId,
            },
        },
    }

    const fetchDataForSearch = (searchString: string) =>
        fetchData(`${apiUrl}/client/v2/search`, 'POST', {
            ...searchPayload,
            message: {
                ...searchPayload.message,
                criteria: {
                    ...searchPayload.message.criteria,
                    searchString: searchString,
                },
            },
        })

    useEffect(() => {
        if (localStorage && localStorage.getItem('coordinates')) {
            const parsedCoordinates = JSON.parse(
                localStorage.getItem('coordinates') as string
            )
            const { latitude, longitude } = parsedCoordinates
            if (router.query.searchTerm) {
                const searchTerm = router.query.searchTerm
                const searchPayloadWithSearchQuery = {
                    context: {
                        domain: 'retail',
                    },
                    message: {
                        criteria: {
                            // dropLocation: '12.9063433,77.5856825',
                            dropLocation: `${latitude},${longitude}`,
                            categoryName: 'Retail',
                            searchString: searchTerm,
                        },
                    },
                }

                fetchData(
                    `${apiUrl}/client/v2/search`,
                    'POST',
                    searchPayloadWithSearchQuery
                )
            }
            const searchPayloadWithLocValues = {
                ...searchPayload,
                message: {
                    ...searchPayload.message,
                    criteria: {
                        ...searchPayload.message.criteria,
                        dropLocation: `${latitude},${longitude}`,
                    },
                },
            }
            if (providerId) {
                fetchData(
                    `${apiUrl}/client/v2/search`,
                    'POST',
                    searchPayloadWithLocValues
                )
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router.isReady, providerId])

    useEffect(() => {
        if (localStorage) {
            const stringifiedOptiontags = localStorage.getItem('optionTags')
            const stringifiedSelectedOption =
                localStorage.getItem('selectedOption')
            if (stringifiedOptiontags) {
                const providerId = JSON.parse(stringifiedOptiontags).providerId
                setProviderId(providerId)
            }
            if (stringifiedSelectedOption) {
                setTagValue(JSON.parse(stringifiedSelectedOption).tagValue)
            }
        }
    }, [])

    useEffect(() => {
        if (data) {
            dispatch(
                responseDataActions.addTransactionId(
                    data.context.transaction_id
                )
            )
            localStorage.setItem('transactionId', data.context.transaction_id)
            const allItems = data.message.catalogs.flatMap((catalog: any) => {
                if (
                    catalog.message &&
                    catalog.message.catalog &&
                    catalog.message.catalog['bpp/providers'].length > 0
                ) {
                    const providers = catalog.message.catalog['bpp/providers']
                    return providers.flatMap((provider: any) => {
                        if (provider.items && provider.items.length > 0) {
                            return provider.items.map((item: RetailItem) => {
                                return {
                                    bpp_id: catalog.context.bpp_id,
                                    bpp_uri: catalog.context.bpp_uri,
                                    ...item,
                                    providerId: provider.id,
                                    locations: provider.locations,
                                    bppName:
                                        catalog.message.catalog[
                                            'bpp/descriptor'
                                        ].name,
                                }
                            })
                        }
                        return []
                    })
                }
                return []
            })
            localStorage.setItem(
                'searchItems',
                JSON.stringify({ [providerId]: allItems })
            )
            setItems(allItems)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data])

    if (error) {
        toast.error('Something went wrong', {
            position: 'top-center',
        })
    }

    return (
        <>
            <Box
                height={'61px'}
                ml={'-20px'}
                mr={'-20px'}
                position={'fixed'}
                zIndex={'9'}
                background={'#fff'}
                width={'100%'}
                mt={'-20px'}
            >
                <SearchBar
                    searchString={searchString}
                    handleChange={(text: string) => {
                        localStorage.removeItem('searchItems')
                        setSearchString(text)
                        fetchDataForSearch(text)
                    }}
                />
            </Box>
            <div>
                {loading ? (
                    <div>
                        <Loader
                            stylesForLoadingText={{
                                fontWeight: '600',
                                fontSize: '17px',
                            }}
                            subLoadingText={t.catalogSubLoader}
                            loadingText={t.catalogLoader}
                        />
                    </div>
                ) : (
                    <ProductList productList={items} />
                )}
            </div>
        </>
    )
}

export default Search
