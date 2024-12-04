import {
  Box,
  Checkbox,
  Divider,
  FormControl,
  FormLabel,
  HStack,
  Input,
  SimpleGrid,
  Text,
  VStack
} from '@chakra-ui/react'
import { QuestionOutlineIcon } from '@chakra-ui/icons'
import React, { useState } from 'react'
import { FaMinus, FaPlus } from 'react-icons/fa6'
import BecknButton from '@beckn-ui/molecules/src/components/button/Button'

export default function EnergyPurchaseForm() {
  const [energyUnits, setEnergyUnits] = useState(0)
  const [pricePerUnit, setPricePerUnit] = useState(0)
  const [preferences, setPreferences] = useState({
    solar: false,
    wind: false,
    biomass: false,
    hydro: false
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log({
      energyUnits,
      pricePerUnit,
      preferences
    })
  }

  return (
    <Box
      as="form"
      onSubmit={handleSubmit}
      maxW="600px"
      mt="30px"
    >
      <VStack
        spacing={8}
        align="stretch"
      >
        <FormControl>
          <HStack mb={2}>
            <FormLabel
              m={0}
              fontSize="15"
              fontWeight="600"
            >
              Energy to Buy
            </FormLabel>
            <QuestionOutlineIcon />
          </HStack>
          <HStack spacing={4}>
            <Box onClick={() => setEnergyUnits(prev => prev + 1)}>
              <FaPlus />
            </Box>
            <Input
              type="number"
              value={energyUnits}
              onChange={e => setEnergyUnits(Number(e.target.value))}
              textAlign="center"
              width="100px"
              size="md"
            />
            <Box onClick={() => setEnergyUnits(prev => Math.max(0, prev - 1))}>
              <FaMinus />
            </Box>
            <Text
              fontSize="15"
              fontWeight="500"
            >
              units(KWh)
            </Text>
          </HStack>
        </FormControl>
        <Divider />

        {/* Price Per Unit Input */}
        <FormControl>
          <HStack mb={2}>
            <FormLabel
              m={0}
              fontSize="15"
              fontWeight="600"
            >
              Set a Price per unit to buy
            </FormLabel>
            <QuestionOutlineIcon />
          </HStack>
          <HStack spacing={4}>
            <Box onClick={() => setPricePerUnit(prev => prev + 1)}>
              <FaPlus />
            </Box>
            <Input
              type="number"
              value={pricePerUnit}
              onChange={e => setPricePerUnit(Number(e.target.value))}
              textAlign="center"
              width="100px"
              size="md"
            />
            <Box onClick={() => setPricePerUnit(prev => Math.max(0, prev - 1))}>
              <FaMinus />
            </Box>
            <Text
              fontSize="15"
              fontWeight="500"
            >
              ₹/units
            </Text>
          </HStack>
        </FormControl>
        <Divider />

        <FormControl>
          <FormLabel
            fontSize="15"
            fontWeight="500"
            mb={4}
          >
            Select a preference to buy
          </FormLabel>
          <SimpleGrid
            columns={2}
            spacing={4}
          >
            <Checkbox
              size="sm"
              isChecked={preferences.solar}
              onChange={e => setPreferences(prev => ({ ...prev, solar: e.target.checked }))}
              sx={{
                '& .chakra-checkbox__control': {
                  border: '1px solid #141414',
                  borderRadius: '2px',
                  backgroundColor: '#FFFFFF'
                },
                '& .chakra-checkbox__control[data-checked]': {
                  backgroundColor: '#4498E8',
                  color: '#FFFFFF',
                  borderRadius: '2px'
                }
              }}
            >
              Solar Energy
            </Checkbox>
            <Checkbox
              size="sm"
              isChecked={preferences.wind}
              onChange={e => setPreferences(prev => ({ ...prev, wind: e.target.checked }))}
              sx={{
                '& .chakra-checkbox__control': {
                  border: '1px solid #141414',
                  borderRadius: '2px',
                  backgroundColor: '#FFFFFF'
                },
                '& .chakra-checkbox__control[data-checked]': {
                  backgroundColor: '#4498E8',
                  color: '#FFFFFF',
                  borderRadius: '2px'
                }
              }}
            >
              Wind Power
            </Checkbox>
            <Checkbox
              size="sm"
              isChecked={preferences.biomass}
              onChange={e => setPreferences(prev => ({ ...prev, biomass: e.target.checked }))}
              sx={{
                '& .chakra-checkbox__control': {
                  border: '1px solid #141414',
                  borderRadius: '2px',
                  backgroundColor: '#FFFFFF'
                },
                '& .chakra-checkbox__control[data-checked]': {
                  backgroundColor: '#4498E8',
                  color: '#FFFFFF',
                  borderRadius: '2px'
                }
              }}
            >
              Biomass Energy
            </Checkbox>
            <Checkbox
              size="sm"
              isChecked={preferences.hydro}
              onChange={e => setPreferences(prev => ({ ...prev, hydro: e.target.checked }))}
              sx={{
                '& .chakra-checkbox__control': {
                  border: '1px solid #141414',
                  borderRadius: '2px',
                  backgroundColor: '#FFFFFF'
                },
                '& .chakra-checkbox__control[data-checked]': {
                  backgroundColor: '#4498E8',
                  color: '#FFFFFF',
                  borderRadius: '2px'
                }
              }}
            >
              Hydroelectric Energy
            </Checkbox>
          </SimpleGrid>
        </FormControl>
        <BecknButton
          children={'Submit'}
          handleClick={() => {
            console.log('object')
          }}
        />
      </VStack>
    </Box>
  )
}
