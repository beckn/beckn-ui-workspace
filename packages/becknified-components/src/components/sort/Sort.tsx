import React from 'react'
import { BsFilterLeft } from 'react-icons/bs'
import { Box } from '@chakra-ui/react'
import { SortComponentProps } from './Sort.types'
import Styles from './sort.module.css'

const radioBtnValue = ['all', 'cheapest', 'expensive']

const Sort: React.FC<SortComponentProps> = ({ selectedBtn: selectedRadioBtn, onChangeSelectedBtn }) => {
  const isRadioSelected = (value: string): boolean => (value === selectedRadioBtn ? true : false)

  return (
    <Box
      position={'fixed'}
      zIndex={'8'}
      background={'#fff'}
      padding={'20px 0 0 0'}
      width={'100%'}
      ml={'-20px'}
    >
      <Box
        width={'calc(100% - 40px)'}
        margin={'0 auto'}
        // className="my-4 pb-2 flex flex-wrap border-b-2 border-slate-300"
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
          <h5 className={Styles.sort_text}>sort</h5>
        </Box>

        <Box
          marginTop={'5px'}
          className="flex flex-wrap items-center"
        >
          {radioBtnValue.map(radioInput => {
            return (
              <div
                key={radioInput}
                className={Styles.radio_input}
              >
                <label
                  htmlFor={radioInput}
                  className={`${Styles.radio_input_label} ${
                    radioInput === selectedRadioBtn
                      ? Styles.selected_radio_input_label
                      : Styles.unselected_radio_input_label
                  }`}
                >
                  {radioInput}
                </label>
                <input
                  type="radio"
                  className="hidden"
                  id={radioInput}
                  value={selectedRadioBtn}
                  name="sortProduct"
                  checked={isRadioSelected(radioInput)}
                  onChange={onChangeSelectedBtn}
                />
              </div>
            )
          })}
        </Box>
      </Box>
    </Box>
  )
}

export default Sort
