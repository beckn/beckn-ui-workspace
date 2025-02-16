import React, { useState } from 'react'
import { BottomModal, Typography } from '@beckn-ui/molecules'
import {
  Box,
  Flex,
  Input,
  Text,
  Step,
  StepIndicator,
  StepStatus,
  Stepper,
  useSteps,
  Circle,
  StepSeparator,
  Button,
  Progress
} from '@chakra-ui/react'
import { CheckIcon, AddIcon } from '@chakra-ui/icons'
import Image from 'next/image'

interface RentalServiceModalProps {
  isOpen: boolean
  onClose: () => void
}

const steps = [{ title: 'Add Asset for rental' }, { title: 'Add Price & Rental Duration' }]

interface FileUploadInfo {
  name: string
  size: string
  progress: number
}

interface BatteryOption {
  id: string
  name: string
  assetId: string
  invoice: string
  timestamp: string
  isSelected?: boolean
}

const RentalServiceModal: React.FC<RentalServiceModalProps> = ({ isOpen, onClose }) => {
  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length
  })

  const [uploadedFile, setUploadedFile] = useState<FileUploadInfo | null>(null)
  const [currentView, setCurrentView] = useState<'upload' | 'select' | 'pricing'>('upload')
  const [selectedBattery, setSelectedBattery] = useState<string | null>(null)

  const [batteryOptions, setBatteryOptions] = useState<BatteryOption[]>([
    {
      id: '1',
      name: 'Battery -1',
      assetId: '123456',
      invoice: 'Invoice.pdf',
      timestamp: '21st Jun 2021, 3.30pm'
    },
    {
      id: '2',
      name: 'Battery -2',
      assetId: '123456',
      invoice: 'Invoice.pdf',
      timestamp: '21st Jun 2021, 3.30pm'
    }
  ])

  const handleAddFromWallet = async () => {
    // TODO: write code from adding things to wallet and then update the state
    // setBatteryOptions([...batteryOptions, {
    //   id: '3',
    //   name: 'Battery -3',
    //   assetId: '123456',
    //   invoice: 'Invoice.pdf',
    // }])
  }

  const handlePublish = async () => {
    //TODO:Aniket Generate this payload using wallet
    const payload = {
      providerDetails: {
        data: [
          {
            context: {
              domain: 'deg:retail',
              action: 'on_confirm',
              version: '1.1.0',
              bpp_id: 'bpp-ps-network-strapi2-dev.becknprotocol.io',
              bpp_uri: 'http://bpp-ps-network-strapi2-dev.becknprotocol.io',
              country: 'IND',
              city: 'std:080',
              location: {
                country: {
                  name: 'India',
                  code: 'IND'
                },
                city: {
                  name: 'Bangalore',
                  code: 'std:080'
                }
              },
              bap_id: 'bap-ps-network-dev.becknprotocol.io',
              bap_uri: 'https://bap-ps-network-dev.becknprotocol.io',
              transaction_id: '68256397-8c35-41bc-94df-1d14bccce6bc',
              message_id: 'd55cf853-4bca-4c09-933c-63ac82581e51',
              ttl: 'PT10M',
              timestamp: '2025-02-13T05:53:12.992Z'
            },
            message: {
              // ... rest of the message object from your curl
            }
          }
        ]
      },
      walletId: 'B124ZX',
      startTime: '1739446641',
      endTime: '2749646641',
      price: '150'
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/unified-beckn-energy/rent-catalogue`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDI1LCJpYXQiOjE3Mzk0NDYzMTUsImV4cCI6MTczOTUzMjcxNX0.-XbdsHb1hVJAgwhaFjUGmVaHh9S1t6klZbmHG0iqjtY'
        },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log('API Response:', data)
      return data
    } catch (error) {
      console.error('Error making API call:', error)
      throw error
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadedFile({
        name: file.name,
        size: `${Math.round(file.size / 1024)}kb`,
        progress: 100
      })
    }
  }

  const handleNext = () => {
    setCurrentView('select')
    setActiveStep(1)
  }

  const handlePricing = () => {
    setCurrentView('pricing')
    setActiveStep(1)
  }

  // Reset state when modal closes
  const handleClose = () => {
    setActiveStep(0)
    setCurrentView('upload')
    setSelectedBattery(null)
    setUploadedFile(null)
    onClose()
  }

  const renderContent = () => {
    if (currentView === 'upload') {
      return (
        <>
          <Box mb={4}>
            <Text mb={2}>Device</Text>
            <Input
              placeholder="Battery"
              value="Battery"
              isReadOnly
            />
          </Box>

          <Box mb={4}>
            <Text mb={2}>Asset ID</Text>
            <Input
              placeholder="MK-0123459"
              value="MK-0123459"
              isReadOnly
            />
          </Box>

          {/* File Upload Section */}
          <Box
            border="1px dashed #E2E8F0"
            borderRadius="md"
            p={4}
            mb={4}
            textAlign="center"
          >
            <input
              type="file"
              id="file-upload"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            <label htmlFor="file-upload">
              <Flex
                direction="column"
                align="center"
                cursor="pointer"
              >
                <Circle
                  size="20px"
                  border="1px solid #E2E8F0"
                  mb={2}
                >
                  <AddIcon />
                </Circle>
                <Text>Drop your files here</Text>
                <Text
                  color="gray.500"
                  fontSize="xs"
                >
                  <span style={{ textDecoration: 'underline', color: '#4398E8' }}>Browse file</span> from your device
                </Text>
              </Flex>
            </label>
          </Box>

          {/* File Preview */}
          {uploadedFile && (
            <Box
              border="1px solid #E2E8F0"
              borderRadius="md"
              p={4}
              mb={4}
            >
              <Flex
                justify="space-between"
                align="center"
              >
                <Flex align="center">
                  <Box
                    as="span"
                    mr={2}
                    color="#4398E8"
                  >
                    📄
                  </Box>
                  <Box>
                    <Text>{uploadedFile.name}</Text>
                    <Text
                      fontSize="sm"
                      color="gray.500"
                    >
                      {uploadedFile.size}
                    </Text>
                  </Box>
                </Flex>
                <CheckIcon color="#4398E8" />
              </Flex>
              <Progress
                value={uploadedFile.progress}
                size="sm"
                colorScheme="blue"
                mt={2}
              />
            </Box>
          )}

          <Button
            width="100%"
            bg="#4398E8"
            color="white"
            _hover={{ bg: '#3182CE' }}
            borderRadius="full"
            onClick={handleNext}
          >
            Next
          </Button>
        </>
      )
    }

    if (currentView === 'select') {
      return (
        <Box>
          {batteryOptions.map(battery => (
            <Box
              key={battery.id}
              mb={4}
              p={4}
              borderRadius="md"
              border="1px solid #E2E8F0"
              cursor="pointer"
              onClick={() => setSelectedBattery(battery.id)}
              position="relative"
              bg="white"
              boxShadow="sm"
            >
              <Flex align="center">
                <Circle
                  size="20px"
                  border="1px solid"
                  borderColor={selectedBattery === battery.id ? '#4398E8' : '#E2E8F0'}
                  mr={3}
                >
                  {selectedBattery === battery.id && (
                    <Circle
                      size="12px"
                      bg="#4398E8"
                    />
                  )}
                </Circle>
                <Box>
                  <Flex
                    align="center"
                    mb={2}
                  >
                    <Image
                      src="/images/battery-box.svg"
                      alt="Battery Box"
                      width={65}
                      height={65}
                      style={{ marginRight: '16px' }}
                    />
                    <Box>
                      <Text
                        fontSize="16px"
                        fontWeight="500"
                        mb={1}
                      >
                        {battery.name}
                      </Text>
                      <Text
                        fontSize="13px"
                        color="gray.600"
                        mb={1}
                      >
                        {battery.assetId}
                      </Text>
                      <Text
                        fontSize="12px"
                        color="#4398E8"
                        textDecoration="underline"
                        mb={1}
                      >
                        {battery.invoice}
                      </Text>
                      <Text
                        fontSize="12px"
                        color="gray.500"
                      >
                        {battery.timestamp}
                      </Text>
                    </Box>
                  </Flex>
                </Box>
              </Flex>
            </Box>
          ))}

          <Button
            width="100%"
            bg="#4398E8"
            color="white"
            _hover={{ bg: '#3182CE' }}
            borderRadius="full"
            onClick={handlePricing}
          >
            Next
          </Button>
        </Box>
      )
    }

    // Pricing View (third screen)
    return (
      <Box>
        <Box mb={6}>
          <Text
            mb={3}
            fontSize="16px"
          >
            Date
          </Text>
          <Flex align="center">
            <Input
              value="20/02/2025"
              width="200px"
              borderRadius="md"
              mr={2}
            />
            <Box
              as="span"
              cursor="pointer"
            >
              <Image
                src="/images/calendar.svg"
                alt="Calendar"
                width={24}
                height={24}
              />
            </Box>
          </Flex>
        </Box>

        <Box mb={6}>
          <Text
            mb={3}
            fontSize="16px"
          >
            Time
          </Text>
          <Flex align="center">
            <Input
              value="10:00 AM"
              width="200px"
              borderRadius="md"
              mr={2}
            />
            <Text mx={3}>-</Text>
            <Input
              value="10:00 PM"
              width="200px"
              borderRadius="md"
            />
          </Flex>
        </Box>

        <Box mb={6}>
          <Text
            mb={3}
            fontSize="16px"
          >
            Price
          </Text>
          <Flex align="center">
            <Input
              value="100"
              width="100px"
              borderRadius="md"
              mr={3}
            />
            <Text color="gray.600">Rs. per hour</Text>
          </Flex>
        </Box>

        <Button
          width="100%"
          bg="#4398E8"
          color="white"
          _hover={{ bg: '#3182CE' }}
          borderRadius="full"
          onClick={handlePublish}
        >
          Submit & Publish
        </Button>
      </Box>
    )
  }

  return (
    <BottomModal
      isOpen={isOpen}
      onClose={handleClose}
      title={
        <Flex
          justify="space-between"
          align="center"
          width="100%"
        >
          <Typography
            text="Provide Rental Service"
            fontSize="16px"
          />
          <Text
            color="#4398E8"
            fontSize="sm"
            cursor="pointer"
            onClick={handleAddFromWallet}
          >
            Add from wallet
          </Text>
        </Flex>
      }
    >
      <Box p={4}>
        <Stepper
          index={activeStep}
          colorScheme="blue"
          size="sm"
          gap={2}
          mb={2}
          mr={7}
          ml={7}
        >
          {steps.map((step, index) => (
            <Step key={index}>
              <StepIndicator>
                <StepStatus
                  complete={
                    <Circle
                      size="24px"
                      bg="#4398E8"
                      color="white"
                    >
                      <CheckIcon />
                    </Circle>
                  }
                  incomplete={
                    <Circle
                      size="24px"
                      bg="transparent"
                      color="#4398E8"
                      border="1px solid #4398E8"
                    >
                      {index + 1}
                    </Circle>
                  }
                  active={
                    <Circle
                      size="24px"
                      bg="#4398E8"
                      color="white"
                    >
                      <CheckIcon />
                    </Circle>
                  }
                />
              </StepIndicator>
              <StepSeparator
                _horizontal={{
                  ml: '0',
                  height: '4px'
                }}
                backgroundColor="#4398E8"
              />
            </Step>
          ))}
        </Stepper>

        <Flex
          justify="space-between"
          mb={6}
        >
          {steps.map((step, index) => (
            <Text
              key={index}
              fontSize="12px"
              color={activeStep >= index ? '#4398E8' : '#6B7280'}
              textAlign="center"
              maxW="80px"
            >
              {step.title}
            </Text>
          ))}
        </Flex>

        {renderContent()}
      </Box>
    </BottomModal>
  )
}

export default RentalServiceModal
