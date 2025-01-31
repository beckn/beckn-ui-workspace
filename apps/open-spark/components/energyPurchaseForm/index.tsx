import {
  Box,
  Checkbox,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Input,
  SimpleGrid,
  Text,
  VStack
} from '@chakra-ui/react'
import { QuestionOutlineIcon } from '@chakra-ui/icons'
import React, { useEffect, useState } from 'react'
import { FaMinus, FaPlus } from 'react-icons/fa6'
import BecknButton from '@beckn-ui/molecules/src/components/button/Button'
import axios from '@services/axios'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@store/index'
import { DOMAIN, ROLE, ROUTE_TYPE } from '@lib/config'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import { feedbackActions } from '@beckn-ui/common'
import { useLanguage } from '@hooks/useLanguage'
import { testIds } from '@shared/dataTestIds'

interface EnergyPurchaseFormProps {
  preferenceType: string
  role: ROLE
}

const checkboxOptions = [
  { label: 'Solar Energy', key: 'solar' },
  { label: 'Trusted Source', key: 'trustedSource' }
]

const checkboxStyles = {
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
}

export default function EnergyPurchaseForm({ preferenceType, role }: EnergyPurchaseFormProps) {
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL
  const bearerToken = Cookies.get('authToken') || ''
  const router = useRouter()
  const dispatch = useDispatch()
  const { t } = useLanguage()

  const [tradeId, setTradeId] = useState<string>()
  const [energyUnits, setEnergyUnits] = useState<number>(0)
  const [pricePerUnit, setPricePerUnit] = useState<number>(0)
  const [preferences, setPreferences] = useState({ solar: false, trustedSource: false })

  useEffect(() => {
    const { tradeId, quantity, price, preferencesTags } = router.query
    if (tradeId && quantity && price) {
      setTradeId(tradeId as string)
      setEnergyUnits(Number(quantity))
      setPricePerUnit(Number(price))
      setPreferences(JSON.parse(preferencesTags as string))
    }
  }, [router.query])

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<number>>, value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '') // Allow only digits
    if (numericValue === '') {
      setter(0) // Set to 0 if empty
    } else {
      setter(Number(numericValue)) // Convert to number
    }
  }

  const handleCheckboxChange = (key: string, value: boolean) => setPreferences(prev => ({ ...prev, [key]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const payload =
      role === ROLE.BUY
        ? {
            quantity: energyUnits,
            unit: 'kwh',
            item_name: 'energy',
            trusted_source: preferences.trustedSource,
            cred_required: preferences.solar,
            recurring: false,
            domain: DOMAIN,
            price: pricePerUnit
          }
        : {
            quantity: energyUnits,
            unit: 'KWH',
            item_name: 'energy',
            trusted_source: preferences.trustedSource,
            cred_required: preferences.solar,
            recurring: true,
            price: pricePerUnit
          }

    try {
      if (tradeId) {
        const endpoint = role === ROLE.BUY ? `trade/${tradeId}` : `trade-pref`
        const response = await axios.put(`${strapiUrl}${ROUTE_TYPE[role!]}/${endpoint}`, payload, {
          headers: { Authorization: `Bearer ${bearerToken}` },
          withCredentials: true
        })

        if (response.status === 200 || response.status === 204) {
          console.log('Trade updated successfully:', response.data)
          dispatch(
            feedbackActions.setToastData({
              toastData: { message: 'Success', display: true, type: 'success', description: t.tradeUpdateSuccess }
            })
          )
          router.push('/')
        }
      } else {
        const response = await axios.post(`${strapiUrl}${ROUTE_TYPE[role!]}/trade`, payload, {
          headers: { Authorization: `Bearer ${bearerToken}` },
          withCredentials: true
        })

        if (response.status === 200 || response.status === 204) {
          console.log('Trade created successfully:', response.data)
          dispatch(
            feedbackActions.setToastData({
              toastData: { message: 'Success', display: true, type: 'success', description: t.tradeCreateSuccess }
            })
          )
          router.push('/')
        }
      }
    } catch (error) {
      console.error('Error create/update trade:', error)
      // dispatch(
      //   feedbackActions.setToastData({
      //     toastData: { message: 'Error', display: true, type: 'error', description: t.errorText }
      //   })
      // )
    }
  }

  const isFormComplete = energyUnits > 0

  return (
    <Flex
      as="form"
      onSubmit={handleSubmit}
      maxW="600px"
      mt="30px"
      flexDir={'column'}
      justifyContent={'space-between'}
      height={'calc(100vh - 8.5rem)'}
    >
      <VStack
        spacing={8}
        align="stretch"
      >
        {/* Energy Units Input */}
        <FormControl>
          <HStack mb={2}>
            <FormLabel
              m={0}
              fontSize="15"
              fontWeight="600"
              data-test={testIds.preference_type}
            >
              Energy to {preferenceType}
            </FormLabel>
            <QuestionOutlineIcon data-test={testIds.questionOutlineIcon} />
          </HStack>
          <HStack spacing={4}>
            <Box
              onClick={() => handleInputChange(setEnergyUnits, (energyUnits + 1).toString())}
              cursor="pointer"
            >
              <FaPlus data-test={testIds.FaPlus} />
            </Box>
            <Input
              type="number"
              value={energyUnits.toString()}
              onChange={e => handleInputChange(setEnergyUnits, e.target.value)}
              textAlign="center"
              width="100px"
              size="md"
              data-test={testIds.preference_type_input_buy}
            />
            <Box
              onClick={() => {
                if (energyUnits > 0) handleInputChange(setEnergyUnits, (energyUnits - 1).toString())
              }}
              cursor="pointer"
            >
              <FaMinus data-test={testIds.FaMinus} />
            </Box>
            <Text
              fontSize="15"
              fontWeight="500"
              data-test={testIds.preference_type_unit}
            >
              units (KWh)
            </Text>
          </HStack>
        </FormControl>
        <Divider />

        {/* Price Per Unit Input */}
        {role !== ROLE.BUY && (
          <FormControl>
            <HStack mb={2}>
              <FormLabel
                m={0}
                fontSize="15"
                fontWeight="600"
                data-test={testIds.set_price_per_unit}
              >
                Set a Price per unit to {preferenceType}
              </FormLabel>
              <QuestionOutlineIcon />
            </HStack>
            <HStack spacing={4}>
              <Box
                onClick={() => handleInputChange(setPricePerUnit, (pricePerUnit + 1).toString())}
                cursor="pointer"
              >
                <FaPlus data-test={testIds.FaPlus_unit} />
              </Box>
              <Input
                data-test={testIds.set_price_per_unit_input}
                type="number"
                value={pricePerUnit.toString()}
                onChange={e => handleInputChange(setPricePerUnit, e.target.value)}
                textAlign="center"
                width="100px"
                size="md"
              />
              <Box
                onClick={() => {
                  if (pricePerUnit > 0) handleInputChange(setPricePerUnit, (pricePerUnit - 1).toString())
                }}
                cursor="pointer"
              >
                <FaMinus data-test={testIds.FaMinus_unit} />
              </Box>
              <Text
                fontSize="15"
                fontWeight="500"
              >
                ₹/units
              </Text>
            </HStack>
            <Divider mt={'20px'} />
          </FormControl>
        )}

        {/* Preferences */}
        <FormControl>
          <FormLabel
            fontSize="15"
            fontWeight="500"
            mb={4}
            data-test={testIds.select_preference_type}
          >
            Select a preference to {preferenceType}
          </FormLabel>
          <SimpleGrid
            columns={2}
            spacing={4}
          >
            {checkboxOptions.map(option => (
              <Checkbox
                key={option.key}
                size="sm"
                isChecked={preferences[option.key as keyof typeof preferences]}
                onChange={e => handleCheckboxChange(option.key, e.target.checked)}
                sx={checkboxStyles}
                data-test={testIds.select_preference_type_checkbox}
              >
                {option.label}
              </Checkbox>
            ))}
          </SimpleGrid>
        </FormControl>

        {/* Submit Button */}
      </VStack>
      <BecknButton
        children="Submit"
        handleClick={handleSubmit}
        disabled={!isFormComplete} // Button disabled if form incomplete
        dataTest={testIds.submit_preference_sell_buy_btn}
      />
    </Flex>
  )
}
