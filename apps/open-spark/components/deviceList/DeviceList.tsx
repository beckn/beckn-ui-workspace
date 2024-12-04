'use client'

import React, { useState, useEffect } from 'react'
import { Box, VStack, IconButton, Container, Flex } from '@chakra-ui/react'
import { BiPlusCircle } from 'react-icons/bi'
import { CiCirclePlus, CiCircleMinus } from 'react-icons/ci'
import BecknButton from '@beckn-ui/molecules/src/components/button/Button'
import { Typography } from '@beckn-ui/molecules'

interface Device {
  name: string
  paired: boolean
}

interface DeviceListProps {
  initialDevices: Device[]
  initialNearbyDevices: Device[]
  onDeviceChange: (devices: Device[], nearbyDevices: Device[]) => void
}

export default function DeviceList({ initialDevices, initialNearbyDevices, onDeviceChange }: DeviceListProps) {
  const [devices, setDevices] = useState<Device[]>(initialDevices)
  const [nearbyDevices, setNearbyDevices] = useState<Device[]>(initialNearbyDevices)

  useEffect(() => {
    onDeviceChange(devices, nearbyDevices)
  }, [devices, nearbyDevices, onDeviceChange])

  const handleRemoveDevice = (index: number) => {
    const newDevices = devices.filter((_, i) => i !== index)
    setDevices(newDevices)
  }

  const handleAddDevice = (index: number) => {
    const addedDevice = nearbyDevices[index]
    const newNearbyDevices = nearbyDevices.filter((_, i) => i !== index)
    const newDevices = [...devices, { ...addedDevice, paired: true }]
    setNearbyDevices(newNearbyDevices)
    setDevices(newDevices)
  }

  return (
    <Container>
      <Box>
        <VStack
          align="stretch"
          spacing={4}
        >
          <Flex
            justifyContent={'space-between'}
            alignItems="center"
          >
            <Typography
              text="Pair Device"
              fontWeight={'600'}
              fontSize={'15px'}
            />
            <IconButton
              aria-label="Add device"
              icon={<BiPlusCircle size={20} />}
              variant="ghost"
            />
          </Flex>

          <Typography
            text="Paired"
            fontWeight={'600'}
            fontSize={'12px'}
          />

          <VStack
            spacing={4}
            align="stretch"
          >
            {devices.map((device, index) => (
              <Flex
                key={index}
                p={3}
                borderWidth="1px"
                borderRadius="12px"
                justify="space-between"
                alignItems="center"
                cursor="pointer"
                _hover={{ bg: 'gray.50' }}
                boxShadow={'rgba(0, 0, 0, 0.35) 0px 5px 15px'}
              >
                <Typography text={device.name} />
                <CiCircleMinus
                  onClick={() => handleRemoveDevice(index)}
                  style={{ cursor: 'pointer' }}
                  size={24}
                  opacity={'0.5'}
                />
              </Flex>
            ))}
          </VStack>
          {nearbyDevices.length > 0 ? (
            <>
              <Typography
                text="Nearby Devices"
                fontWeight={'600'}
                fontSize={'12px'}
              />
              <VStack
                spacing={2}
                align="stretch"
                mb={'50px'}
              >
                {nearbyDevices.map((device, index) => (
                  <Flex
                    key={index}
                    p={3}
                    borderWidth="1px"
                    borderRadius="12px"
                    justify="space-between"
                    alignItems="center"
                    cursor="pointer"
                    _hover={{ bg: 'gray.50' }}
                    boxShadow={'rgba(0, 0, 0, 0.35) 0px 5px 15px'}
                  >
                    <Typography text={device.name} />
                    <CiCirclePlus
                      onClick={() => handleAddDevice(index)}
                      style={{ cursor: 'pointer' }}
                      size={24}
                      opacity={0.5}
                    />
                  </Flex>
                ))}
              </VStack>
            </>
          ) : null}

          <BecknButton children="Save" />
        </VStack>
      </Box>
    </Container>
  )
}
