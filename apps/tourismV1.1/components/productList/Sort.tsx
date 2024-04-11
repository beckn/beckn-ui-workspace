import React, { ChangeEvent } from 'react'
import { useLanguage } from '../../hooks/useLanguage'
import { BsFilterLeft, BsArrowDown } from 'react-icons/bs'
import { radioBtnValue } from '../../mock/sortRadioInput'
import { Box } from '@chakra-ui/react'

interface Props {
  selectedBtn: string
  onChangeSelectedBtn: (e: ChangeEvent<HTMLInputElement>) => void
}

const Sort: React.FC<Props> = ({ selectedBtn: selectedRadioBtn, onChangeSelectedBtn }) => {
  const { t } = useLanguage()

  const isRadioSelected = (value: string): boolean => (value === selectedRadioBtn ? true : false)

  return (
    <Box
      bg="#fff"
      w="100%"
      ml="-20px"
    >
      <Box
        w="calc(100% - 40px)"
        mx="auto"
        borderBottom="2px solid #ccc"
        pb="2"
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent={'flex-start'}
        >
          <Box
            mr="2"
            fontSize="1.5rem"
          >
            <BsFilterLeft />
          </Box>
          <Box
            mr="2"
            fontSize="1.25rem"
          >
            <BsArrowDown />
          </Box>
          <h5>{t.sort}</h5>
        </Box>
        <Box
          display="flex"
          flexWrap="wrap"
          mt="5px"
        >
          {radioBtnValue.map(radioInput => (
            <Box
              key={radioInput}
              px="2"
              mx="2"
              my={{ base: '1', sm: '0' }}
              style={{
                marginRight: 'unset'
              }}
            >
              <label
                htmlFor={radioInput}
                style={{
                  fontSize: '15px',
                  cursor: 'pointer',
                  fontWeight: radioInput === selectedRadioBtn ? 'bold' : 'normal',
                  color: radioInput === selectedRadioBtn ? '#387F9A' : 'black',
                  transition: 'all 0.3s'
                }}
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
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  )
}

export default Sort
