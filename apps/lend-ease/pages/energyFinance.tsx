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
  tag_group_id: TagGroupItem[] | null // mark as possibly null
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

          {/* Principal Amount */}
          <Flex>
            <Flex
              justifyContent={'center'}
              w={'50%'}
              borderRight="0.5px solid #F0F0F0"
              borderBottom={'0.5px solid #F0F0F0'}
            >
              <Box mb={4}>
                <Typography
                  text={catalogue?.tag_group_id?.[0]?.value || 'N/A'}
                  fontSize="10px"
                  fontWeight="300"
                  style={{ opacity: '0.6', marginBottom: '5px', textAlign: 'center' }}
                />
                <Typography
                  text="Principal Amount"
                  fontSize="10px"
                  fontWeight="500"
                  style={{ textAlign: 'center' }}
                />
              </Box>
            </Flex>
            <Flex
              justifyContent={'center'}
              w={'50%'}
              borderBottom={'0.5px solid #F0F0F0'}
            >
              <Box>
                <Typography
                  text={catalogue?.tag_group_id?.[1]?.value || 'N/A'}
                  fontSize="10px"
                  fontWeight="300"
                  style={{ opacity: '0.6', marginBottom: '5px', textAlign: 'center' }}
                />
                <Typography
                  text="Initial Payment"
                  fontWeight="500"
                  fontSize="10px"
                  style={{ textAlign: 'center' }}
                />
              </Box>
            </Flex>
          </Flex>

          {/* Interest Rate */}
          <Flex mt="5px">
            <Flex
              justifyContent={'center'}
              w={'50%'}
              borderRight="0.5px solid #F0F0F0"
              borderBottom={'0.5px solid #F0F0F0'}
            >
              <Box mb={4}>
                <Typography
                  text={catalogue?.tag_group_id?.[2]?.value || 'N/A'}
                  fontSize="10px"
                  fontWeight="300"
                  style={{ opacity: '0.6', marginBottom: '5px', textAlign: 'center' }}
                />
                <Typography
                  text="Interest Rate"
                  fontSize="10px"
                  fontWeight="500"
                  style={{ textAlign: 'center' }}
                />
              </Box>
            </Flex>
            <Flex
              justifyContent={'center'}
              w={'50%'}
              borderBottom={'0.5px solid #F0F0F0'}
            >
              <Box>
                <Typography
                  text={catalogue?.tag_group_id?.[3]?.value || 'N/A'}
                  fontSize="10px"
                  fontWeight="300"
                  style={{ opacity: '0.6', marginBottom: '5px', textAlign: 'center' }}
                />
                <Typography
                  text="Processing Fees"
                  fontSize="10px"
                  fontWeight="500"
                  style={{ textAlign: 'center' }}
                />
              </Box>
            </Flex>
          </Flex>

          {/* Foreclosure Charges */}
          <Flex mt="5px">
            <Flex
              justifyContent={'center'}
              w={'50%'}
              borderRight="0.5px solid #F0F0F0"
              borderBottom={'0.5px solid #F0F0F0'}
            >
              <Box mb={4}>
                <Typography
                  text={catalogue?.tag_group_id?.[4]?.value || 'N/A'}
                  fontSize="10px"
                  fontWeight="300"
                  style={{ opacity: '0.6', marginBottom: '5px', textAlign: 'center' }}
                />
                <Typography
                  text="Foreclosure Charges"
                  fontSize="10px"
                  fontWeight="500"
                  style={{ textAlign: 'center' }}
                />
              </Box>
            </Flex>
            <Flex
              justifyContent={'center'}
              w={'50%'}
              borderBottom={'0.5px solid #F0F0F0'}
            >
              <Box>
                <Typography
                  text={catalogue?.tag_group_id?.[5]?.value || 'N/A'}
                  fontSize="10px"
                  fontWeight="300"
                  style={{ opacity: '0.6', marginBottom: '5px', textAlign: 'center' }}
                />
                <Typography
                  text="EMI Method"
                  fontSize="10px"
                  fontWeight="500"
                  style={{ textAlign: 'center' }}
                />
              </Box>
            </Flex>
          </Flex>

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
