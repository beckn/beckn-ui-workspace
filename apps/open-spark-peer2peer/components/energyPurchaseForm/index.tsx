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
import { GoAlert } from 'react-icons/go'
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
import BuyPaymentModule from '@components/buyPaymentModule/BuyPaymentModule'
import BottomModal from '@beckn-ui/common/src/components/BottomModal/BottomModalScan'
import { Typography } from '@beckn-ui/molecules'

interface EnergyPurchaseFormProps {
  preferenceType: string
  role: ROLE
}

export default function EnergyPurchaseForm({ preferenceType, role }: EnergyPurchaseFormProps) {
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL
  const bearerToken = Cookies.get('p2pAuthToken') || ''
  const router = useRouter()
  const dispatch = useDispatch()
  const { t } = useLanguage()

  const [isChecked, setIsChecked] = useState(true)
  const [tradeId, setTradeId] = useState<string>()
  const [energyUnits, setEnergyUnits] = useState<number>(0)
  const [pricePerUnit, setPricePerUnit] = useState<number>(0)
  const [preferences, setPreferences] = useState({ solar: false, trustedSource: false })
  const [isBuyModal, setIsBuyModal] = useState(false)
  const preferencesTags = useSelector((state: RootState) => state.user.preferences)

  useEffect(() => {
    const { tradeId, quantity, price, preferencesTags } = router.query
    const formStorageKey = `energyFormData_${role}`

    if (tradeId && quantity && price) {
      setTradeId(tradeId as string)
      setEnergyUnits(Number(quantity))
      setPricePerUnit(Number(price))
      if (preferencesTags) {
        setPreferences(JSON.parse(preferencesTags as string))
      }
    } else {
      try {
        const savedData = JSON.parse(localStorage.getItem(formStorageKey) || '{}')

        if (savedData.energyUnits !== undefined) setEnergyUnits(savedData.energyUnits)
        if (savedData.pricePerUnit !== undefined) setPricePerUnit(savedData.pricePerUnit)
        if (savedData.isChecked !== undefined) setIsChecked(savedData.isChecked)
        if (savedData.tradeId) setTradeId(savedData.tradeId)
      } catch (error) {
        console.error('Error loading saved form data:', error)
      }
    }
  }, [router.query, role])

  useEffect(() => {
    const formStorageKey = `energyFormData_${role}`

    localStorage.setItem(
      formStorageKey,
      JSON.stringify({
        energyUnits,
        pricePerUnit,
        isChecked,
        tradeId
      })
    )
  }, [energyUnits, pricePerUnit, isChecked, tradeId, role])

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<number>>, value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '')
    if (numericValue === '') {
      setter(0)
    } else {
      setter(Number(numericValue))
    }
  }

  const handleSubmitPreferences = () => {
    setIsBuyModal(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const payload =
      role === ROLE.BUY
        ? {
            quantity: energyUnits,
            unit: 'kwh',
            item_name: 'energy',
            trusted_source: preferencesTags.trustedSource,
            cred_required: preferencesTags.credRequired,
            recurring: false,
            domain: DOMAIN,
            price: pricePerUnit
          }
        : {
            quantity: energyUnits,
            unit: 'KWH',
            item_name: 'energy',
            trusted_source: preferencesTags.trustedSource,
            cred_required: preferencesTags.credRequired,
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
          localStorage.removeItem(`energyFormData_${role}`)

          dispatch(
            feedbackActions.setToastData({
              toastData: { message: 'Success', display: true, type: 'success', description: t.tradeUpdateSuccess }
            })
          )
          router.push(`/?tab=${role === ROLE.BUY ? 'buy' : 'sell'}`)
        }
      } else {
        const response = await axios.post(`${strapiUrl}${ROUTE_TYPE[role!]}/trade`, payload, {
          headers: { Authorization: `Bearer ${bearerToken}` },
          withCredentials: true
        })

        if (response.status === 200 || response.status === 204) {
          console.log('Trade created successfully:', response.data)
          localStorage.removeItem(`energyFormData_${role}`)

          dispatch(
            feedbackActions.setToastData({
              toastData: { message: 'Success', display: true, type: 'success', description: t.tradeCreateSuccess }
            })
          )
          router.push(`/?tab=${role === ROLE.BUY ? 'buy' : 'sell'}`)
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

  const isFormComplete = role === ROLE.BUY ? energyUnits > 0 && isChecked : energyUnits > 0 && pricePerUnit > 0

  const handleCheckboxChange = (checked: boolean) => {
    setIsChecked(checked)
  }

  const alertModalHeader = (
    <Flex alignItems={'center'}>
      <Typography
        text={'Alert'}
        fontSize={'20px'}
        fontWeight={'500'}
        color={'#000000'}
        sx={{ mr: '10px' }}
      />
      <GoAlert
        color="#F3D020"
        size={'20px'}
      />
    </Flex>
  )

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
        spacing={6}
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
              onClick={() => {
                if (energyUnits > 0) handleInputChange(setEnergyUnits, (energyUnits - 1).toString())
              }}
              cursor="pointer"
            >
              <FaMinus data-test={testIds.FaMinus} />
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
              onClick={() => handleInputChange(setEnergyUnits, (energyUnits + 1).toString())}
              cursor="pointer"
            >
              <FaPlus data-test={testIds.FaPlus} />
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
                onClick={() => {
                  if (pricePerUnit > 0) handleInputChange(setPricePerUnit, (pricePerUnit - 1).toString())
                }}
                cursor="pointer"
              >
                <FaMinus data-test={testIds.FaMinus_unit} />
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
                onClick={() => handleInputChange(setPricePerUnit, (pricePerUnit + 1).toString())}
                cursor="pointer"
              >
                <FaPlus data-test={testIds.FaPlus_unit} />
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
        <Text>
          <Text
            as={'span'}
            fontWeight="500"
          >
            Please Note:
          </Text>{' '}
          Energy order will be placed as per your selected preferences. Click here to{' '}
          <Text
            as={'span'}
            cursor="pointer"
            color={'#4498E8'}
            onClick={() => router.push('/myPreference')}
          >
            change your preferences
          </Text>
        </Text>

        {/* payment */}
        {/* {role === ROLE.BUY && (
          <BuyPaymentModule
            isChecked={isChecked}
            fare="₹500"
            onChange={handleCheckboxChange}
          />
        )} */}
        {/* Submit Button */}
      </VStack>
      <BecknButton
        children={role === ROLE.BUY ? 'Place Buy Order' : 'List for Trade'}
        handleClick={role === ROLE.BUY ? handleSubmitPreferences : handleSubmit}
        disabled={!isFormComplete} // Button disabled if form incomplete
        dataTest={testIds.submit_preference_sell_buy_btn}
      />

      <BottomModal
        isOpen={isBuyModal}
        onClose={() => {
          setIsBuyModal(false)
        }}
        modalHeader={alertModalHeader}
      >
        <Box p="0 24px">
          <Text mb="34px">
            The trades will only be executed during market hours. Any buy or sell orders placed after the market has
            closed will be processed when the market opens again.
          </Text>
          <BecknButton
            text="Ok, I Understand"
            handleClick={handleSubmit}
          />
        </Box>
      </BottomModal>
    </Flex>
  )
}
