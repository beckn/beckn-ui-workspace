import Cookies from 'js-cookie'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {
  Box,
  Grid,
  Spinner,
  useToast,
  Flex,
  Divider,
  Tooltip,
  PopoverBody,
  PopoverTrigger,
  Popover,
  IconButton,
  PopoverContent,
  Text,
  Image
} from '@chakra-ui/react'
import { Typography } from '@beckn-ui/molecules'
import DetailsCard from '@beckn-ui/becknified-components/src/components/checkout/details-card'
import { IoIosInformationCircleOutline } from 'react-icons/io'
import { MdOutlineModeEdit } from 'react-icons/md'
import { useRouter } from 'next/router'

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

interface TagGroupItem {
  value: string
  // add other properties that exist in tag_group_id items
}

interface Catalogue {
  id: number
  name: string
  short_desc: string
  code: string
  long_desc: string
  sc_retail_product: RetailProduct
  tag_group_id: TagGroupItem[] | null
  cat_attr_tag_relations: Array<{
    taxanomy_id: {
      title: string
      value: string
    }
  }>
}

interface ApiResponse {
  data: {
    data: Catalogue[]
    meta: any
  }
}

const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL

interface CardDetail {
  value: string
  label: string
  index: number
}

const cardDetails: CardDetail[] = [
  { value: '0', label: 'Principal Amount', index: 0 },
  { value: '1', label: 'Initial Payment', index: 1 },
  { value: '2', label: 'Interest Rate', index: 2 },
  { value: '3', label: 'Processing Fees', index: 3 },
  { value: '4', label: 'Foreclosure Charges', index: 4 },
  { value: '5', label: 'EMI Method', index: 5 }
]

const renderCardDetails = (catalogue: Catalogue, details: CardDetail[]) => {
  return details.reduce((acc: JSX.Element[], curr, idx) => {
    if (idx % 2 === 0) {
      acc.push(
        <Flex
          key={idx / 2}
          mt={idx > 0 ? '5px' : '0'}
        >
          <Flex
            justifyContent={'center'}
            w={'50%'}
            borderRight="0.5px solid #F0F0F0"
            borderBottom={'0.5px solid #F0F0F0'}
          >
            <Box mb={4}>
              <Typography
                text={catalogue?.tag_group_id?.[details[idx].index]?.value || 'N/A'}
                fontSize="10px"
                fontWeight="300"
                style={{ opacity: '0.6', marginBottom: '5px', textAlign: 'center' }}
              />
              <Typography
                text={details[idx].label}
                fontSize="10px"
                fontWeight="500"
                style={{ textAlign: 'center' }}
              />
            </Box>
          </Flex>
          {idx + 1 < details.length && (
            <Flex
              justifyContent={'center'}
              w={'50%'}
              borderBottom={'0.5px solid #F0F0F0'}
            >
              <Box>
                <Typography
                  text={catalogue?.tag_group_id?.[details[idx + 1].index]?.value || 'N/A'}
                  fontSize="10px"
                  fontWeight="300"
                  style={{ opacity: '0.6', marginBottom: '5px', textAlign: 'center' }}
                />
                <Typography
                  text={details[idx + 1].label}
                  fontSize="10px"
                  fontWeight="500"
                  style={{ textAlign: 'center' }}
                />
              </Box>
            </Flex>
          )}
        </Flex>
      )
    }
    return acc
  }, [])
}

const EnergyFinance = () => {
  const [catalogues, setCatalogues] = useState<Catalogue[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const toast = useToast()
  const router = useRouter()

  const fetchCatalogues = async () => {
    try {
      setIsLoading(true)
      console.log('Fetching catalogues with token:', bearerToken)
      console.log('API URL:', `${strapiUrl}/beckn-energy-finance/catalogues`)

      const response = await axios.get(`${strapiUrl}/beckn-energy-finance/catalogues`, {
        headers: {
          Authorization: `Bearer ${bearerToken}`
        }
      })

      console.log('Raw API response:', response)

      if (!response.data || !response.data.items) {
        throw new Error('Invalid response structure')
      }

      // Get loan types from query
      const loanTypes = ((router.query.type as string) || '').split('-').filter(Boolean)
      console.log('Filtering for loan types:', loanTypes)

      // Filter catalogues based on loan types
      const catalogueData = response.data.items.filter(catalogue => {
        const catalogueType = catalogue.cat_attr_tag_relations?.[0]?.taxanomy_id?.title
        console.log('Catalogue type:', catalogueType, 'for catalogue:', catalogue.id)
        return loanTypes.includes(catalogueType)
      })

      console.log('Filtered catalogues:', catalogueData)
      setCatalogues(catalogueData)
    } catch (error: any) {
      console.error('Detailed error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      })

      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to fetch catalogues. Please try again later.',
        status: 'error',
        duration: 5000,
        isClosable: true
      })
      setCatalogues([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (router.query.type) {
      fetchCatalogues()
    }
  }, [router.query.type])

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

  if (!catalogues.length) {
    return (
      <Box textAlign="center">
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
    <Box
      w={'100%'}
      className="hideScroll"
      maxH={'calc(100vh - 100px)'}
      overflowY="scroll"
    >
      {catalogues.map((catalogue, ind) => (
        <DetailsCard key={catalogue.id}>
          {/* Header section */}
          <Flex
            justifyContent={'space-between'}
            mb="10px"
          >
            <Flex alignItems="center">
              <Typography
                text={catalogue.short_desc}
                fontSize="14px"
                fontWeight="600"
                style={{ marginRight: '10px' }}
              />
              <Popover trigger="click">
                <PopoverTrigger>
                  <IoIosInformationCircleOutline />
                </PopoverTrigger>
                <PopoverContent
                  w={'fit-content'}
                  top="34px"
                  left={'10px'}
                  background="#E3E1E1"
                  _focusVisible={{ boxShadow: 'unset', outline: 'unset' }}
                >
                  <Box
                    w={'fit-content'}
                    p="10px 20px"
                  >
                    <Text fontSize={'10px'}>Foreclosure charges: 2%</Text>
                    <Text fontSize={'10px'}>Late payment charges: 3%</Text>
                    <Text fontSize={'10px'}>Pre-payment terms:Allowed with 1% fee</Text>
                  </Box>
                </PopoverContent>
              </Popover>
            </Flex>
            <Image
              src="./images/edit.svg"
              opacity={'0.8'}
            />
          </Flex>

          {/* Status badges */}
          <Flex
            justifyContent={'space-between'}
            alignItems="center"
          >
            <Typography
              text="Energy Financing"
              fontSize="10px"
              color="#fff"
              style={{
                backgroundColor: '#0069B4',
                padding: '4px 8px',
                borderRadius: '4px'
              }}
            />
            <Typography
              text="Active"
              fontSize="10px"
              color="#fff"
              style={{
                backgroundColor: '#51B651',
                padding: '4px 8px',
                borderRadius: '4px'
              }}
            />
          </Flex>
          <Divider
            mb="10px"
            mt="10px"
          />

          {/* Card Details */}
          {renderCardDetails(catalogue, cardDetails)}

          {/* Loan Tenure */}
          <Flex
            mt="10px"
            alignItems={'center'}
          >
            <Typography
              text="Loan Tenure:"
              fontSize="10px"
              fontWeight="500"
            />
            <Flex
              gap={2}
              ml="10px"
            >
              {(() => {
                const value = catalogue?.tag_group_id?.[6]?.value || 'N/A'
                const valuesArray = value.split(',').map(item => item.trim())

                return valuesArray.map((item, index) => (
                  <Box
                    key={index}
                    padding="4px 8px"
                    bg="#BEBBBB"
                    color="#000"
                    borderRadius="4px"
                    fontSize="8px"
                  >
                    {item}
                  </Box>
                ))
              })()}
            </Flex>
          </Flex>
        </DetailsCard>
      ))}
    </Box>
  )
}

export default EnergyFinance
