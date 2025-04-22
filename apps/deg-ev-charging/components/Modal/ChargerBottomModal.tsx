import React, { useEffect, useState } from 'react'
import { Text, VStack, HStack, Box, Flex, useTheme, Image } from '@chakra-ui/react'
import { EVCharger } from '../Map/Map'
import { BottomModal, GenericDropdown } from '@beckn-ui/molecules'
import BecknButton from '@beckn-ui/molecules/src/components/button/Button'
import { OptionModel } from '@beckn-ui/molecules/src/components/genericDropdown/genericDropdown'
import { currencyMap } from '@lib/config'
import { getCountryCode } from '@utils/general'
import { ChargerPort } from '@store/chargerSelect-slice'

interface BottomModalProps {
  charger: EVCharger
  onNavigate: () => void
  onSelect: (vehicleType: string, port: ChargerPort) => void
  onClose?: () => void
}

const vehicleTypes = [
  { label: '2 Wheeler', value: '2_wheel' },
  { label: '3 Wheeler', value: '3_wheel' },
  { label: '4 Wheeler', value: '4_wheel' }
]

const ChargerBottomModal: React.FC<BottomModalProps> = ({ charger, onNavigate, onSelect, onClose }) => {
  const [selectedVehicleType, setSelectedVehicleType] = useState<string>('')
  const [selectedPort, setSelectedPort] = useState<ChargerPort | null>(null)
  const [isMinimized, setIsMinimized] = useState(false)
  const [isNavigating, setIsNavigating] = useState(false)

  const theme = useTheme()
  const primaryColor = theme.colors.primary[100]

  useEffect(() => {
    setIsMinimized(false)
    setIsNavigating(false)
  }, [charger])

  const handleOnVehicleTypeChange = (value: OptionModel) => {
    setSelectedVehicleType(value.value)
  }

  const handleHeaderClick = () => {
    setIsMinimized(!isMinimized)
  }

  return (
    <BottomModal
      isOpen={true}
      onClose={() => {
        if (isNavigating) {
          setIsMinimized(true)
        } else {
          onClose?.()
        }
      }}
      responsive={true}
      backgroundAccessControl={isMinimized}
      title={
        <HStack
          justify="space-between"
          mb={2}
          onClick={handleHeaderClick}
          cursor="pointer"
        >
          <Text
            fontSize="17px"
            fontWeight="400"
            noOfLines={1}
          >
            {charger.name}
          </Text>
          <Box
            bg={'#D2F9EA'}
            p={'4px 4px'}
            borderRadius={'4px'}
            whiteSpace={'nowrap'}
          >
            <Text
              color="#11704C"
              fontSize="14px"
            >
              {charger.status}
            </Text>
          </Box>
        </HStack>
      }
    >
      {!isMinimized && (
        <VStack align="stretch">
          <Text
            color="gray.600"
            fontSize="sm"
            mb={4}
          >
            {charger.address}
          </Text>

          <Text
            fontSize="12px"
            fontWeight="400"
            color="#000000"
          >
            Select Vehicle Type:
          </Text>

          <GenericDropdown
            name="Select Vehicle Type"
            placeholder="Select Vehicle"
            variant="clean"
            options={vehicleTypes}
            selectedValue={selectedVehicleType}
            handleChange={handleOnVehicleTypeChange}
          />

          <Text
            fontSize="12px"
            fontWeight="400"
            mt={2}
            mb={2}
            color="#000000"
          >
            Select Port:
          </Text>
          <HStack
            spacing={6}
            justify="flex-start"
            mb={4}
            padding={'0 10px'}
          >
            {charger.ports.map(port => (
              <VStack
                key={port.type}
                spacing={2}
                align="center"
                onClick={() => {
                  setSelectedPort(port as ChargerPort)
                }}
              >
                <Box
                  position="relative"
                  width="40px"
                  height="40px"
                  placeItems={'center'}
                >
                  <Image
                    src={port.icon as string}
                    alt={port.type}
                    objectFit={'cover'}
                    width={'50px'}
                    height={'50px'}
                  />
                </Box>
                <Text
                  fontSize="15px"
                  fontWeight="400"
                  color={selectedPort?.type === port.type ? primaryColor : '#000000'}
                >
                  {port.type}
                </Text>
              </VStack>
            ))}
          </HStack>

          <Flex
            bg="#F0F0F0"
            p={3}
            borderRadius="md"
            mb={4}
            gap={2}
            flexDir={'column'}
          >
            <Text
              fontSize="12px"
              fontWeight="400"
            >
              Rate:
            </Text>
            <Text
              fontSize="14px"
              fontWeight="600"
            >
              {currencyMap[getCountryCode().country.code as keyof typeof currencyMap]}
              {charger.rate} / kwh
            </Text>
          </Flex>

          <VStack spacing={3}>
            <BecknButton
              text="Navigate"
              variant="outline"
              colorScheme="primary"
              handleClick={() => {
                setIsNavigating(true)
                onNavigate()
                setIsMinimized(true)
              }}
              rightIcon={
                <Image
                  src="/images/map_nav_icon.svg"
                  alt="Navigate"
                  marginTop={'4px'}
                  width={'20px'}
                  height={'20px'}
                />
              }
            />
            <BecknButton
              text="Select"
              colorScheme="primary"
              handleClick={() => onSelect(selectedVehicleType, selectedPort!)}
              disabled={selectedVehicleType === '' || !selectedPort}
            />
          </VStack>
        </VStack>
      )}
    </BottomModal>
  )
}

export default ChargerBottomModal
