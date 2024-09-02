import React, { useState } from 'react'
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  HStack,
  VStack,
  Switch,
  Divider,
  Code
} from '@chakra-ui/react'
import CustomDatePicker from '@components/customDatePicker'
import { Typography } from '@beckn-ui/molecules'
import BecknButton from '@beckn-ui/molecules/src/components/button/Button'

const rulesData = {
  // Your JSON data here
  content:
    '{"action":"policy","domain":"mobility","location":{"country":"IND","city":"080"},"version":"1.0.0","message":{"policy":{"id":1,"owner":{"descriptor":{"name":""},"email":"support@moh.gov.in","contact":{}}}}'
}

function AddInformationMetadata() {
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())
  const [isChecked, setIsChecked] = useState<boolean>(true)

  const handleOnSwitch = () => {
    setIsChecked(!isChecked)
  }

  return (
    <Box
      maxH={'calc(100vh - 110px)'}
      overflowY="auto"
      overflowX="hidden"
    >
      <Box
        p={4}
        border="1px solid #72767e"
      >
        <Flex
          width={'auto'}
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography
            text="Add Information Metadata"
            fontWeight="600"
            fontSize={'18px !important'}
          />
          <Box
            display={'flex'}
            flexDir={'row'}
            justifyContent="space-between"
            width={'7%'}
          >
            <Typography
              text="Activate"
              fontSize={'14px !important'}
            />
            <Switch
              isChecked={isChecked}
              colorScheme={'green'}
              onChange={handleOnSwitch}
            />
          </Box>
        </Flex>
        <Box height={'1rem'} />
        <Divider />
        <Box height={'1rem'} />

        <HStack spacing={3}>
          <FormControl>
            <FormLabel>Title</FormLabel>
            <Input
              type="text"
              placeholder="Enter Title"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Information Category</FormLabel>
            <Select placeholder="Select Information Category">
              <option value="option1">Geofence</option>
              <option value="option2">Privacy</option>
              <option value="option2">Alcohol</option>
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel>Information Source Owner</FormLabel>
            <Input
              type="text"
              placeholder="Enter Information Source Owner Name"
            />
          </FormControl>
        </HStack>

        <Box height={'2rem'} />

        <FormControl>
          <FormLabel>Description</FormLabel>
          <Textarea placeholder="Add Description" />
        </FormControl>

        <Box height={'2rem'} />

        <HStack spacing={4}>
          <FormControl>
            <FormLabel>Country</FormLabel>
            <Select placeholder="Select Country">
              <option value="india">India</option>
              <option value="usa">USA</option>
              <option value="usa">Egypt</option>
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel>City</FormLabel>
            <Select placeholder="Select City">
              <option value="bangalore">Bangalore</option>
              <option value="delhi">Delhi</option>
              <option value="mumbai">Mumbai</option>
              <option value="chennai">Chennai</option>
              <option value="hyderabad">Hyderabad</option>
              <option value="pune">Pune</option>
              <option value="ahmedabad">Ahmedabad</option>
              <option value="vishakhapatnam">Vishakhapatnam</option>
              <option value="jaipur">Jaipur</option>
              <option value="noida">Noida</option>
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel>From</FormLabel>
            <CustomDatePicker
              selected={startDate}
              placeholderText="Select 'from' date"
              onChange={date => setStartDate(date!)}
              dateFormat="dd-MM-yyyy"
            />
          </FormControl>

          <FormControl>
            <FormLabel>To</FormLabel>
            <CustomDatePicker
              selected={endDate}
              placeholderText="Select 'to' date"
              onChange={date => setEndDate(date!)}
              dateFormat="dd-MM-yyyy"
            />
          </FormControl>
        </HStack>

        <Box height={'2rem'} />

        <HStack spacing={4}>
          <FormControl>
            <FormLabel>Sources</FormLabel>
            <Input
              type="text"
              placeholder="Add Source URL"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Applicable To</FormLabel>
            <Select
              placeholder="Select"
              width={'49%'}
            >
              <option value="bangalore">BAP</option>
              <option value="new york">BPP</option>
            </Select>
          </FormControl>
        </HStack>
      </Box>
      <Box height={'2rem'} />
      <Box
        p={4}
        border="1px solid #72767e"
      >
        <FormControl>
          <FormLabel>Rules</FormLabel>
          <Box
            sx={{
              height: { base: '40px', md: '20rem' },
              border: '1px solid',
              borderColor: 'inherit',
              borderRadius: 'md'
            }}
          >
            <Code
              height={'100%'}
              background="transparent"
              contentEditable={true}
              whiteSpace="pre-wrap"
              width="100%"
              overflowY="auto"
              overflowX="hidden"
              lineHeight={'normal'}
            >
              {JSON.stringify(rulesData, null, 2)}
            </Code>
          </Box>
        </FormControl>
      </Box>
      <Box height={'2rem'} />
      <Flex width={'25rem'}>
        <BecknButton
          text="Go Back"
          variant="outline"
        />
        <BecknButton
          text="Save"
          // bgGradient={'linear(180deg, #000428 0%, #004e92 100%) !important'}
          // bgClip="text"
        />
      </Flex>
    </Box>
  )
}

export default AddInformationMetadata
