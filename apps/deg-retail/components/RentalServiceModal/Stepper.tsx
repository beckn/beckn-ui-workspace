import React from 'react'
import { Box, Flex, Text } from '@chakra-ui/react'

interface StepperProps {
  currentStep: number
  steps: Array<{
    label: string
    step: number
  }>
}

const Stepper: React.FC<StepperProps> = ({ currentStep, steps }) => {
  return (
    <Flex
      w="100%"
      justify="space-between"
      align="center"
      mb={6}
      position="relative"
    >
      {/* Continuous line that connects both steps */}
      <Box
        position="absolute"
        top="12px"
        left="24px"
        right="24px"
        height="1px"
        bg="#4398E8"
        zIndex={0}
      />

      {steps.map((step, index) => (
        <React.Fragment key={step.step}>
          <Flex
            direction="column"
            align="center"
            position="relative"
            flex="1"
          >
            <Box
              w="24px"
              h="24px"
              borderRadius="full"
              bg={currentStep >= step.step ? '#4398E8' : 'transparent'}
              border="1px solid"
              borderColor="#4398E8"
              display="flex"
              alignItems="center"
              justifyContent="center"
              color={currentStep >= step.step ? 'white' : '#4398E8'}
              fontSize="12px"
              fontWeight="600"
              zIndex={1}
            >
              {currentStep >= step.step ? '✓' : step.step}
            </Box>
            <Text
              mt={2}
              fontSize="12px"
              color={currentStep >= step.step ? '#4398E8' : '#6B7280'}
              textAlign="center"
              maxW="80px"
              lineHeight="1.2"
            >
              {step.label}
            </Text>
          </Flex>
        </React.Fragment>
      ))}
    </Flex>
  )
}

export default Stepper
