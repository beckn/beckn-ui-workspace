import {
  Image,
  Box,
  ChakraProvider,
  Divider,
  extendTheme,
  Flex,
  FormControl,
  FormLabel,
  Select,
  Text
} from '@chakra-ui/react'
import Button from '@components/button/Button'
import React, { useState } from 'react'

const activeLabelStyles = {
  transform: 'scale(1) translateY(-24px)'
}

export const theme = extendTheme({
  components: {
    Form: {
      variants: {
        floating: {
          container: {
            _focusWithin: {
              label: {
                ...activeLabelStyles
              }
            },
            'input:not(:placeholder-shown) + label, .chakra-select__wrapper + label, textarea:not(:placeholder-shown) ~ label':
              {
                ...activeLabelStyles
              },
            label: {
              top: 0,
              left: 0,
              zIndex: 2,
              position: 'absolute',
              backgroundColor: 'white',
              pointerEvents: 'none',
              mx: 3,
              px: 1,
              my: 2,
              transformOrigin: 'left top'
            }
          }
        }
      }
    }
  },
  colors: {
    primary: {
      '100': '#A71B4A'
    }
  }
})

const Filter = ({ handleApplyFilter, handleResetFilter }) => {
  const [formData, setFormData] = useState({})
  const [sortBy, setSortBy] = useState<string>('')

  const handleChange = (name: string, value: string) => {
    setSortBy(value)
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }))
  }
  const resetFilter = () => {
    setSortBy('')
    setFormData({})
    handleResetFilter()
  }
  return (
    <>
      <ChakraProvider theme={theme}>
        <Box
          height={['100%', '320px']}
          w={['100%', '350px']}
          p={['unset', '20px']}
          boxShadow={['unset', '0px 8px 10px 0px #0000001A']}
          margin={['unset', '0 auto', '0 auto', '20px 0 0 0']}
        >
          <Flex
            pb={'2px'}
            justifyContent="space-between"
            alignItems={'center'}
          >
            <Text fontSize={'17px'}>All Filters</Text>
            <Text
              fontSize={'15px'}
              color="#A71B4A"
              cursor={'pointer'}
              onClick={resetFilter}
            >
              Reset
            </Text>
          </Flex>
          <Divider mb={'44px'} />
          <Box pb={'44px'}>
            <FormControl variant="floating">
              <Select
                onChange={e => handleChange('searchByPrice', e.target.value)}
                value={formData.searchByPrice || ''}
                fontSize="15px"
                height={'30px'}
                border={'unset'}
                borderRadius="unset"
                borderBottom={'1px solid'}
                paddingBottom={'2px'}
              >
                <option value="">Price</option>
                <option value="LowtoHigh">Price -- Low to High</option>
                <option value="HightoLow">Price -- High to Low</option>
              </Select>
              <FormLabel
                className="dropDown_label"
                fontSize="15px"
              >
                Sort By Price
              </FormLabel>
            </FormControl>
          </Box>

          <Box pb={'44px'}>
            <FormControl variant="floating">
              <Select
                onChange={e => handleChange('searchByRating', e.target.value)}
                value={formData.searchByRating || ''}
                fontSize="15px"
                height={'30px'}
                border={'unset'}
                borderRadius="unset"
                borderBottom={'1px solid'}
                paddingBottom={'2px'}
              >
                <option value="">Rating</option>
                <option value="RatingLowtoHigh">Rating -- Low to High</option>
                <option value="RatingHightoLow">Rating -- High to Low</option>
              </Select>
              <FormLabel
                className="dropDown_label"
                fontSize="15px"
              >
                Filter By Rating
              </FormLabel>
            </FormControl>
          </Box>
          <Button
            buttonText={'Apply Filter'}
            background={'primary.100'}
            color={'#fff'}
            isDisabled={false}
            handleOnClick={() => {
              handleApplyFilter(sortBy)
            }}
          />
        </Box>
      </ChakraProvider>
    </>
  )
}

export default Filter
