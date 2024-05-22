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
import { useLanguage } from '@hooks/useLanguage'
import React, { useEffect, useState } from 'react'

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
      '100': '#387F9A'
    }
  }
})

const Filter = ({ handleApplyFilter, handleResetFilter, handleCancelFilter = () => {} }) => {
  const { t } = useLanguage()
  const getFormData = (): any => {
    if (localStorage) {
      const localFormData = localStorage.getItem('formData')
      return localFormData ? JSON.parse(localFormData) : ''
    }
  }
  const [formData, setFormData] = useState(getFormData())
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
  useEffect(() => {
    if (localStorage) {
      localStorage.setItem('formData', JSON.stringify(formData))
    }
  }, [formData, sortBy])

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
            <Text fontSize={'17px'}>{t.allFilter}</Text>
            <Text
              fontSize={'15px'}
              color={'primary.100'}
              cursor={'pointer'}
              onClick={resetFilter}
            >
              {t.reset}
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
                <option value="">{t.filterPrice}</option>
                <option value="LowtoHigh">{t.priceLowToHigh}</option>
                <option value="HightoLow">{t.priceHighToLow}</option>
              </Select>
              <FormLabel
                className="dropDown_label"
                fontSize="15px"
              >
                {t.sortByPrice}
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
                <option value="">{t.rating}</option>
                <option value="RatingLowtoHigh">{t.ratingLowToHigh}</option>
                <option value="RatingHightoLow">{t.ratingHighToLow}</option>
              </Select>
              <FormLabel
                className="dropDown_label"
                fontSize="15px"
              >
                {t.filterByRating}
              </FormLabel>
            </FormControl>
          </Box>
          <Button
            buttonText={t.applyFilter}
            background={'primary.100'}
            color={'#FFE7E7'}
            isDisabled={false}
            handleOnClick={() => {
              handleApplyFilter(sortBy)
            }}
          />
        </Box>
      </ChakraProvider>

      <Box display={['block', 'block', 'none', 'none']}>
        <Button
          className="cencel_btn_filter"
          buttonText={t.cancel}
          background={'#fff'}
          color={'#E93324'}
          isDisabled={false}
          handleOnClick={handleCancelFilter}
        />
      </Box>
    </>
  )
}

export default Filter
