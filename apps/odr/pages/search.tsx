import React, { useEffect, useState } from 'react'
import { Box, Text } from '@chakra-ui/react'
import axios from 'axios'
import SearchBar from '../components/header/SearchBar'
import ProductList from '../components/productList/ProductList'
import Loader from '../components/loader/Loader'
import { useLanguage } from '../hooks/useLanguage'
import { useRouter } from 'next/router'
import { getTransformedDataFromOdrResponse, ParsedScholarshipData } from '../components/productList/ProductList.utils'

const Search = () => {
  const router = useRouter()
  const [searchKeyword, setSearchKeyword] = useState(router.query?.searchTerm || '')
  const [scholarShips, setScholarships] = useState<ParsedScholarshipData[]>([])

  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const [isLoading, setIsLoading] = useState(true)

  const selectedCategory = router.query?.selectedItem

  const searchPayload = {
    name: searchKeyword,
    category: {
      name: selectedCategory
    }
  }

  const fetchScholarships = async () => {
    setIsLoading(true)
    try {
      const scholarshipSearchResponse = await axios.post(`${apiUrl}/search`, searchPayload)

      if (scholarshipSearchResponse.data) {
        const parsedScholarshipData: ParsedScholarshipData[] = getTransformedDataFromOdrResponse(
          scholarshipSearchResponse.data
        )
        setScholarships(parsedScholarshipData)
        setIsLoading(false)
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchScholarships()
  }, [])

  // TODO :- have to put the loader strings into translation

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
          searchString={searchKeyword}
          selectedCategory={selectedCategory}
          handleChange={(text: string) => {
            setSearchKeyword(text)
            localStorage.removeItem('optionTags')
            localStorage.setItem('optionTags', JSON.stringify({ name: text }))
            window.dispatchEvent(new Event('storage-optiontags'))
            fetchScholarships()
          }}
        />
      </Box>
      <div>
        {isLoading ? (
          <div>
            <Loader>
              <Box
                mt={'13px'}
                display={'flex'}
                flexDir={'column'}
                alignItems={'center'}
              >
                <Text fontWeight={700}>Please wait!</Text>
                <Text>
                  We're looking for <i>services</i>
                </Text>
                <Text>related to your search</Text>
              </Box>
            </Loader>
          </div>
        ) : (
          <ProductList productList={scholarShips} />
        )}
      </div>
    </>
  )
}

export default Search
