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
import { FilterPropsModel } from './filter.types'
import { testIds } from '@shared/dataTestIds'
import { GenericDropdown } from '@beckn-ui/molecules'
import { getLocalStorage, setLocalStorage } from '@beckn-ui/common'
import Button from '@beckn-ui/common/src/components/button/button'

const activeLabelStyles = {
  // transform: 'scale(1) translateY(-24px)'
}
const filterPriceOption = [
  {
    value: 'Energy',
    label: 'Energy'
  },
  {
    value: 'Healthcare',
    label: 'Healthcare'
  },
  {
    value: 'Retail',
    label: 'Retail'
  }
]

const Filter = ({ handleApplyFilter, handleResetFilter, handleCancelFilter = () => {} }: FilterPropsModel) => {
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
              color={primaryColor}
              cursor={'pointer'}
              data-test={testIds.searchpage_resetBtn}
              onClick={resetFilter}
            >
              Reset
            </Text>
          </Flex>
          <Divider mb={'36px'} />
          <Box pb={'24px'}>
            <GenericDropdown
              options={filterPriceOption}
              placeholder={'Domain'}
              selectedValue={formData?.domain || ''}
              handleChange={value => {
                handleChange('domain', value.value)
              }}
              buttonStyles={{
                fontSize: '14px',
                fontWeight: '400'
              }}
              name="domain"
              dataTest={testIds.searchpage_sortByPrice}
            />
          </Box>

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
