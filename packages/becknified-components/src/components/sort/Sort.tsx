import React from 'react'
import { BsFilterLeft } from 'react-icons/bs'
import { Box, FormLabel, Input, useTheme } from '@chakra-ui/react'
import { SortComponentProps } from './Sort.types'
import Styles from './sort.module.css'
import { Typography } from '@beckn-ui/molecules'

const radioBtnValue = ['all', 'cheapest', 'expensive']

const Sort: React.FC<SortComponentProps> = ({ selectedBtn: selectedRadioBtn, onChangeSelectedBtn }) => {
  const theme = useTheme()
  const isRadioSelected = (value: string): boolean => (value === selectedRadioBtn ? true : false)

  return (
    <Box
      position={'fixed'}
      zIndex={'8'}
      background={'#fff'}
      width={'100%'}
      ml={'-20px'}
    >
      <Box
        width={'calc(100% - 40px)'}
        margin={'0 auto'}
        mt={'1rem'}
        mb={'0.5rem'}
        display={'flex'}
        flexWrap={'wrap'}
        borderBottom={'2px solid #f2f2f2'}
      >
        <Box
          fontSize={'15px'}
          className="flex items-center"
        >
          <Box
            fontSize={'12px'}
            className="flex items-center"
          >
            <BsFilterLeft
              style={{
                fontSize: '1.5rem',
                paddingRight: '5px'
              }}
            />
          </Box>

          <Typography
            text="sort"
            variant="subTitleRegular"
          />
        </Box>

        <Box
          display={'flex'}
          flexWrap={'wrap'}
          alignItems={'center'}
          ml={'7px'}
        >
          {radioBtnValue.map(radioInput => {
            return (
              <Box
                key={radioInput}
                pl={'0.5rem'}
                pr={'0.5rem'}
                mr={'unset'}
                mt={'0.25rem'}
                mb={'0.25rem'}
              >
                <FormLabel
                  color={radioInput === selectedRadioBtn ? theme.colors.primary['100'] : 'rgba(117, 117, 117, 0.8)'}
                  htmlFor={radioInput}
                  fontSize={'0.875rem'}
                  mb={'unset'}
                >
                  {radioInput}
                </FormLabel>

                <Input
                  type="radio"
                  className="hidden"
                  id={radioInput}
                  value={selectedRadioBtn}
                  name="sortProduct"
                  checked={isRadioSelected(radioInput)}
                  onChange={onChangeSelectedBtn}
                />
              </Box>
            )
          })}
        </Box>
      </Box>
    </Box>
  )
}

export default Sort
