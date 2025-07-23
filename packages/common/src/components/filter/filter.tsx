import {
  Box,
  ChakraProvider,
  Divider,
  extendTheme,
  Flex,
  FormControl,
  FormLabel,
  Text,
  useTheme
} from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { getLocalStorage, setLocalStorage } from '../../utils'
import Button from '../button/button'
import { FilterPropsModel, FilterFieldConfig } from './filter.types'
import { testIds } from '@shared/dataTestIds'
import { GenericDropdown } from '@beckn-ui/molecules'

const activeLabelStyles = {
  // transform: 'scale(1) translateY(-24px)'
}

const defaultSortField: FilterFieldConfig = {
  name: 'sortBy',
  label: 'Sort by',
  type: 'dropdown',
  options: [
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
    },
    {
      value: 'defaultRating',
      label: 'Rating',
      isDisabled: true
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
}

const Filter = ({
  handleApplyFilter,
  handleResetFilter,
  handleCancelFilter = () => {},
  fields = []
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

  const getFormData = (): Record<string, string> => {
    if (localStorage) {
      const localFormData = getLocalStorage('formData')
      return (localFormData || {}) as Record<string, string>
    }
    return {} as Record<string, string>
  }

  const [formData, setFormData] = useState<Record<string, string>>(getFormData())

  const handleChange = (name: string, value: string) => {
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }))
  }

  const resetFilter = () => {
    setFormData({})
    handleResetFilter()
  }

  useEffect(() => {
    if (localStorage) {
      setLocalStorage('formData', formData)
    }
  }, [formData])

  const renderField = (field: FilterFieldConfig) => {
    switch (field.type) {
      case 'dropdown':
        return (
          <FormControl
            variant="floating"
            key={field.name}
          >
            <FormLabel
              className="dropDown_label"
              fontSize="15px"
            >
              {field.label}
            </FormLabel>
            <GenericDropdown
              options={field.options || []}
              selectedValue={formData[field.name] || field.defaultValue || ''}
              handleChange={value => handleChange(field.name, value.value)}
              buttonStyles={{
                fontSize: '16px'
              }}
              name={field.name}
              dataTest={`filter-${field.name}`}
            />
          </FormControl>
        )
      // Add cases for other field types here
      default:
        return null
    }
  }

  const allFields = fields.length > 0 ? fields : [defaultSortField]

  return (
    <>
      <ChakraProvider theme={customTheme}>
        <Box
          height={['100%', '100%', '320px']}
          w={['100%', '350px']}
          p={['unset', '20px']}
          boxShadow={['unset', '0px 8px 30px 0px #0000001A']}
          margin={['unset', '0 auto', '0 auto', '20px 0 0 0']}
          data-test={testIds.searchpage_filterContainer}
          className="filter-wrapper"
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
          <Divider mb={'24px'} />
          <Flex
            pb={'24px'}
            flexDir={'column'}
            gap={'1rem'}
          >
            {allFields.map(field => renderField(field))}
          </Flex>
          <Button
            buttonText={'Apply Filter'}
            background={primaryColor}
            className={'filter-btn'}
            color={'#fff'}
            isDisabled={false}
            dataTest={'apply-filter'}
            handleOnClick={() => {
              handleApplyFilter(formData)
            }}
          />
          <Box display={['block', 'block', 'none', 'none']}>
            <Button
              className="cencel_btn_filter"
              buttonText={'Back'}
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
