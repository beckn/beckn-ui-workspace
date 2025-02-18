import Cookies from 'js-cookie'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Box, Grid, Spinner, useToast, Flex } from '@chakra-ui/react'
import { Typography } from '@beckn-ui/molecules'

const bearerToken = Cookies.get('authToken')

interface RetailProduct {
  id: number
  sku: string
  min_price: string
  max_price: string
  on_sale: boolean
  stock_quantity: number
  average_rating: number
  trusted_source: boolean
  cred_required: boolean
  recurring: boolean
}

interface Catalogue {
  id: number
  name: string
  short_desc: string
  code: string
  long_desc: string
  sc_retail_product: RetailProduct
}

interface ApiResponse {
  data: {
    data: Catalogue[]
    meta: any
  }
}

const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL

const EnergyFinance = () => {
  const [catalogues, setCatalogues] = useState<Catalogue[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const toast = useToast()

  const fetchCatalogues = async () => {
    try {
      const response: ApiResponse = await axios.get(`${strapiUrl}/beckn-energy-finance/catalogues`, {
        headers: {
          Authorization: `Bearer ${bearerToken}`
        }
      })

      // Safely access the data
      const catalogueData = response?.data?.items || []
      console.log(response.data.items)
      setCatalogues(catalogueData)
    } catch (error) {
      console.error('Error fetching catalogues:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch catalogues. Please try again later.',
        status: 'error',
        duration: 5000,
        isClosable: true
      })
      // Set empty array in case of error
      setCatalogues([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCatalogues()
  }, [])

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Spinner
          size="xl"
          color="blue.500"
        />
      </Box>
    )
  }

  // Show message if no catalogues
  if (!catalogues.length) {
    return (
      <Box
        p={6}
        textAlign="center"
      >
        <Typography
          text="No catalogues available"
          fontSize="18px"
          color="gray.600"
        />
      </Box>
    )
  }

  console.log('Dank', catalogues)

  return (
    <Box p={6}>
      <Typography
        text="Solar Panel Loan Schemes"
        fontSize="24px"
        fontWeight="600"
        style={{ marginBottom: '24px' }}
      />

      <Grid
        templateColumns="repeat(auto-fill, minmax(350px, 1fr))"
        gap={6}
      >
        {catalogues.map(catalogue => (
          <Box
            key={catalogue.id}
            borderWidth="1px"
            borderRadius="16px"
            overflow="hidden"
            p={5}
            boxShadow="0px 4px 8px rgba(0, 0, 0, 0.1)"
            bg="white"
          >
            {/* Header */}
            <Flex
              justifyContent="space-between"
              alignItems="center"
              mb={4}
            >
              <Box>
                <Typography
                  text="Energy Financing"
                  fontSize="14px"
                  color="#3182CE"
                  style={{
                    backgroundColor: '#EBF8FF',
                    padding: '4px 12px',
                    borderRadius: '16px'
                  }}
                />
              </Box>
              <Box>
                <Typography
                  text="Active"
                  fontSize="14px"
                  color="#38A169"
                  style={{
                    backgroundColor: '#F0FFF4',
                    padding: '4px 12px',
                    borderRadius: '16px'
                  }}
                />
              </Box>
            </Flex>

            {/* Principal Amount */}
            <Box mb={4}>
              <Typography
                text="Principal Amount"
                fontSize="14px"
                color="gray.600"
                mb={1}
              />
              <Typography
                text={`Rs. ${catalogue.sc_retail_product.min_price} - Rs. ${catalogue.sc_retail_product.max_price}`}
                fontSize="16px"
                fontWeight="600"
              />
            </Box>

            {/* Interest Rate */}
            <Grid
              templateColumns="repeat(2, 1fr)"
              gap={4}
              mb={4}
            >
              <Box>
                <Typography
                  text="Interest Rate"
                  fontSize="14px"
                  color="gray.600"
                  mb={1}
                />
                <Typography
                  text={`${catalogue.code}%`}
                  fontSize="16px"
                  fontWeight="600"
                />
              </Box>
              <Box>
                <Typography
                  text="Processing Fees"
                  fontSize="14px"
                  color="gray.600"
                  mb={1}
                />
                <Typography
                  text={`Rs.${catalogue.sc_retail_product.min_price}`}
                  fontSize="16px"
                  fontWeight="600"
                />
              </Box>
            </Grid>

            {/* Loan Tenure */}
            <Box>
              <Typography
                text="Loan Tenure:"
                fontSize="14px"
                color="gray.600"
                mb={2}
              />
              <Flex gap={2}>
                {[6, 9, 12].map(months => (
                  <Box
                    key={months}
                    bg={catalogue.name === months.toString() ? 'blue.500' : 'gray.100'}
                    color={catalogue.name === months.toString() ? 'white' : 'gray.600'}
                    px={3}
                    py={1}
                    borderRadius="full"
                    fontSize="14px"
                  >
                    {months} months
                  </Box>
                ))}
              </Flex>
            </Box>

            {/* Rating */}
            <Flex
              alignItems="center"
              mt={4}
            >
              <Box
                color="yellow.400"
                mr={2}
              >
                ★
              </Box>
              <Typography
                text={catalogue.sc_retail_product.average_rating}
                fontSize="14px"
                fontWeight="500"
              />
            </Flex>
          </Box>
        ))}
      </Grid>
    </Box>
  )
}

export default EnergyFinance
