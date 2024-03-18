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
      '100': '#F6D046'
    }
  }
})

const Filter = () => {
  const [formData, setFormData] = useState({})

  const handleChange = (name: string, value: string) => {
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }))
  }

  return (
    <>
      <ChakraProvider theme={theme}>
        <Box
          height={['100%', '450px']}
          w={['100%', '350px']}
          p={['unset', '20px']}
          boxShadow={['unset', '0px 8px 10px 0px #0000001A']}
          margin={['unset', '0 auto', '0 auto', 'unset']}
        >
          <Flex
            pb={'2px'}
            justifyContent="space-between"
            alignItems={'center'}
          >
            <Text fontSize={'17px'}>All Filters</Text>
            <Text
              fontSize={'15px'}
              color="#53A052"
            >
              Reset
            </Text>
          </Flex>
          <Divider mb={'44px'} />
          <Box pb={'44px'}>
            <FormControl variant="floating">
              <Select
                onChange={e => handleChange('searchBy1', e.target.value)}
                value={formData.searchBy1 || ''}
                fontSize="15px"
                height={'30px'}
                border={'unset'}
                borderRadius="unset"
                borderBottom={'1px solid'}
                paddingBottom={'2px'}
              >
                <option value="">Search by</option>
                <option value="Relevance1">Relevance1</option>
                <option value="Relevance2">Relevance2</option>
              </Select>
              <FormLabel
                className="dropDown_label"
                fontSize="15px"
              >
                Search by
              </FormLabel>
            </FormControl>
          </Box>
          <Box pb={'44px'}>
            <FormControl variant="floating">
              <Select
                onChange={e => handleChange('searchBy2', e.target.value)}
                value={formData.searchBy2 || ''}
                fontSize="15px"
                height={'30px'}
                border={'unset'}
                borderRadius="unset"
                borderBottom={'1px solid'}
                paddingBottom={'2px'}
              >
                <option value="">Service Type</option>
                <option value="Relevance1">Relevance1</option>
                <option value="Relevance2">Relevance2</option>
              </Select>
              <FormLabel
                className="dropDown_label"
                fontSize="15px"
              >
                Service Type
              </FormLabel>
            </FormControl>
          </Box>
          <Box pb={'44px'}>
            <FormControl variant="floating">
              <Select
                onChange={e => handleChange('searchBy3', e.target.value)}
                value={formData.searchBy3 || ''}
                fontSize="15px"
                height={'30px'}
                border={'unset'}
                borderRadius="unset"
                borderBottom={'1px solid'}
                paddingBottom={'2px'}
              >
                <option value="">Rating</option>
                <option value="1+">1+</option>
                <option value="2+">2+</option>
              </Select>
              <FormLabel
                className="dropDown_label"
                fontSize="15px"
              >
                Rating
              </FormLabel>
            </FormControl>
          </Box>
          <Box pb="30px">
            <FormControl variant="floating">
              <Select
                onChange={e => handleChange('searchBy4', e.target.value)}
                value={formData.searchBy4 || ''}
                fontSize="15px"
                height={'30px'}
                border={'unset'}
                borderRadius="unset"
                borderBottom={'1px solid'}
                paddingBottom={'2px'}
              >
                <option value="">Deals & Discounts</option>
                <option value="Relevance1">Relevance1</option>
                <option value="Relevance2">Relevance2</option>
              </Select>
              <FormLabel
                className="dropDown_label"
                fontSize="15px"
              >
                Deals & Discounts
              </FormLabel>
            </FormControl>
          </Box>
          {/* <Button
          text="Apply Filter"
          colorScheme="primary"
          variant="solid"
        /> */}
          <Button
            buttonText={'Apply Filter'}
            background={'primary.100'}
            color={'#565555'}
            isDisabled={false}
          />
        </Box>
      </ChakraProvider>
    </>
  )
}

export default Filter
