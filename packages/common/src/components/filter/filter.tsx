import {
  Box,
  ChakraProvider,
  Divider,
  extendTheme,
  Flex,
  FormControl,
  FormLabel,
  Select,
  Text,
  useTheme
} from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { getLocalStorage, setLocalStorage } from '../../utils'
import Button from '../button/button'
import { FilterPropsModel } from './filter.types'
import { testIds } from '@shared/dataTestIds'
import { GenericDropdown } from '@beckn-ui/molecules'

const activeLabelStyles = {
  // transform: 'scale(1) translateY(-24px)'
}
const filterPriceOption = [
  {
    value: '',
    label: 'Price'
  },
  {
    value: 'LowtoHigh',
    label: 'Price -- Low to High'
  },
  {
    value: 'HightoLow',
    label: 'Price -- High to Low'
  }
]
const filterRatingOption = [
  {
    value: '',
    label: 'Rating'
  },
  {
    value: 'RatingLowtoHigh',
    label: 'Rating -- Low to High'
  },
  {
    value: 'RatingHightoLow',
    label: 'Rating -- High to Low'
  }
]

const Filter = ({
  handleApplyFilter,
  handleResetFilter,
  handleCancelFilter = () => {},
  sortByRating = true
}: FilterPropsModel) => {
  const theme = useTheme()
  const customTheme = extendTheme({
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
                // zIndex: 2,
                position: 'relative',
                // backgroundColor: 'white',
                pointerEvents: 'none',
                mx: 3,
                px: 1,
                // my: 2,
                transformOrigin: 'left top'
              }
            }
          }
        }
      }
    },
    colors: {
      primary: {
        100: theme.colors.primary['100']
      },
      secondary: {
        100: theme.colors.secondary['100']
      }
    }
  })

  const primaryColor = customTheme.colors.primary['100']
  const secondaryColor = customTheme.colors.secondary['100']

  const getFormData = (): Record<string, any> | undefined => {
    if (localStorage) {
      const localFormData: any = getLocalStorage('formData')
      return localFormData
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
      setLocalStorage('formData', formData)
    }
  }, [formData, sortBy])

  return (
    <>
      <ChakraProvider theme={customTheme}>
        <Box
          height={['100%', '100%', '320px']}
          w={['100%', '350px']}
          p={['unset', '20px']}
          boxShadow={['unset', '0px 8px 10px 0px #0000001A']}
          margin={['unset', '0 auto', '0 auto', '20px 0 0 0']}
          data-test={testIds.searchpage_filterContainer}
        >
          <Flex
            pb={'2px'}
            justifyContent="space-between"
            alignItems={'center'}
          >
            <Text fontSize={'17px'}>All Filters</Text>
            <Text
              fontSize={'15px'}
              color={secondaryColor}
              cursor={'pointer'}
              data-test={testIds.searchpage_resetBtn}
              onClick={resetFilter}
            >
              Reset
            </Text>
          </Flex>
          <Divider mb={'44px'} />
          <Box pb={'24px'}>
            <FormControl variant="floating">
              {/* <Select
                data-test={testIds.searchpage_sortByPrice}
                onChange={e => handleChange('searchByPrice', e.target.value)}
                value={formData?.searchByPrice || ''}
                fontSize="15px"
                height={'30px'}
                border={'unset'}
                borderRadius="unset"
                borderBottom={'1px solid'}
                paddingBottom={'2px'}
                cursor="pointer"
                _focusVisible={{ zIndex: 1, borderColor: '#3182ce' }}
              >
                <option value="">Price</option>
                <option value="LowtoHigh">Price -- Low to High</option>
                <option value="HightoLow">Price -- High to Low</option>
              </Select> */}
              <FormLabel
                className="dropDown_label"
                fontSize="15px"
              >
                Sort By Price
              </FormLabel>
              <GenericDropdown
                options={filterPriceOption}
                placeholder="Select Information Category"
                selectedValue={formData?.searchByPrice || ''}
                handleChange={value => {
                  // dispatch(updatePolicyType(value || ''))
                  handleChange('searchByPrice', value.value)
                }}
                name="searchByPrice"
              />
            </FormControl>
          </Box>

          {sortByRating && (
            <Box pb={'26px'}>
              <FormControl variant="floating">
                {/* <Select
                  data-test={testIds.searchpage_filterByRating}
                  onChange={e => handleChange('searchByRating', e.target.value)}
                  value={formData?.searchByRating || ''}
                  fontSize="15px"
                  height={'30px'}
                  border={'unset'}
                  borderRadius="unset"
                  borderBottom={'1px solid'}
                  paddingBottom={'2px'}
                  boxShadow={'none'}
                  cursor="pointer"
                  _focusVisible={{ zIndex: 1, borderColor: '#3182ce' }}
                >
                  <option value="">Rating</option>
                  <option value="RatingLowtoHigh">Rating -- Low to High</option>
                  <option value="RatingHightoLow">Rating -- High to Low</option>
                </Select> */}
                <FormLabel
                  className="dropDown_label"
                  fontSize="15px"
                >
                  Filter By Rating
                </FormLabel>
                <GenericDropdown
                  options={filterRatingOption}
                  placeholder="Select Information Category"
                  selectedValue={formData?.searchByRating || ''}
                  handleChange={value => {
                    // dispatch(updatePolicyType(value || ''))
                    handleChange('searchByRating', value.value)
                  }}
                  buttonStyles={{
                    fontSize: '16px'
                  }}
                  name="searchByRating"
                />
              </FormControl>
            </Box>
          )}
          <Button
            buttonText={'Apply Filter'}
            background={primaryColor}
            className={'filter-btn'}
            color={'#fff'}
            isDisabled={false}
            dataTest={'apply-filter'}
            handleOnClick={() => {
              handleApplyFilter(sortBy)
            }}
          />
          <Box display={['block', 'block', 'none', 'none']}>
            <Button
              className="cencel_btn_filter"
              buttonText={'Cancel'}
              background={'#fff'}
              color={'#e93324'}
              isDisabled={false}
              dataTest={'cancel-filter'}
              handleOnClick={handleCancelFilter}
            />
          </Box>
        </Box>
      </ChakraProvider>
    </>
  )
}

export default Filter
