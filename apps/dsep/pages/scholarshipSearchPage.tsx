import { ProductCard } from '@beckn-ui/becknified-components'
import LoaderWithMessage from '@beckn-ui/molecules/src/components/LoaderWithMessage/loader-with-message'
import { Box } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import scholarshipListCard from '../components/scholarship/scholarshipCard/scholarshipListCard'
import { useLanguage } from '../hooks/useLanguage'
import { ParsedItemModel } from '../types/search.types'
import { getParsedSearchlist } from '../utilities/search-utils'
import axios from '../services/axios'
import { testIds } from '@shared/dataTestIds'
import { useRouter } from 'next/router'

const ScholarshipCard = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [scholarShips, setScholarships] = useState<ParsedItemModel[]>([])
  const [isError, setIsError] = useState(false)
  const dsepScholarshipUrl = process.env.NEXT_PUBLIC_API_URL
  const [searchKeyword, setSearchKeyword] = useState(router.query?.searchTerm || '')

  const { t } = useLanguage()

  const fetchScholarships = async () => {
    try {
      const scholarshipSearchResponse = await axios.post(`${dsepScholarshipUrl}/search`, {
        context: {
          domain: 'dsep:scholarships'
        },
        searchString: searchKeyword
      })
      const searchData = getParsedSearchlist(scholarshipSearchResponse.data.data)
      setScholarships(searchData)
      setIsLoading(false)
    } catch (error) {
      setIsError(true)
      setIsLoading(false)
      console.error(error)
    }
  }

  useEffect(() => {
    fetchScholarships()
  }, [])

  if (isLoading) {
    return (
      <Box
        display={'grid'}
        height={'calc(100vh - 300px)'}
        alignContent={'center'}
      >
        <LoaderWithMessage
          loadingSubText={t.scholarshipSearchLoader}
          loadingText={t.categoryLoadPrimary}
          dataTest={testIds.loadingIndicator}
        />
      </Box>
    )
  }

  return (
    <Box
      className="hideScroll"
      maxH={'calc(100vh - 100px)'}
      overflowY="scroll"
    >
      {scholarShips.length > 0 ? (
        scholarShips.map(scholarShip => {
          return (
            <ProductCard
              key={scholarShip.item.id}
              dataSource={scholarShip}
              ComponentRenderer={scholarshipListCard}
            />
          )
        })
      ) : (
        <></>
      )}
    </Box>
  )
}

export default ScholarshipCard
