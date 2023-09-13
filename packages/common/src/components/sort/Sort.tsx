import React from 'react'
import { BsFilterLeft } from 'react-icons/bs'
import { Box } from '@chakra-ui/react'
import { SortComponentProps } from './Sort.types'

const radioBtnValue = ['all', 'cheapest', 'expensive']

const Sort: React.FC<SortComponentProps> = ({ selectedBtn: selectedRadioBtn, onChangeSelectedBtn }) => {
  const isRadioSelected = (value: string): boolean => (value === selectedRadioBtn ? true : false)

  return (
    <Box position={'fixed'} zIndex={'8'} background={'#fff'} padding={'20px 0 0 0'} width={'100%'} ml={'-20px'}>
      <Box
        width={'calc(100% - 40px)'}
        margin={'0 auto'}
        className="my-4 pb-2 flex flex-wrap border-b-2 border-slate-300"
      >
        <div className="flex items-center" style={{ fontSize: '15px' }}>
          <div className="flex items-center" style={{ fontSize: '12px' }}>
            <BsFilterLeft style={{ fontSize: '1.5rem', paddingRight: '5px' }} />
          </div>
          <h5 className="ltr:ml-1 rtl:mr-1">sort</h5>
        </div>

        <Box marginTop={'5px'} className="flex flex-wrap items-center">
          {radioBtnValue.map(radioInput => {
            return (
              <div
                key={radioInput}
                className="px-2 md:px-2 mx-2 my-1 sm:my-0"
                style={{ marginRight: 'unset !important' }}
              >
                <label
                  htmlFor={radioInput}
                  className={`text-sm  cursor-pointer ${
                    radioInput === selectedRadioBtn
                      ? 'text-palette-primary font-bold'
                      : 'text-palette-mute/80 hover:text-palette-base transition-all'
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
