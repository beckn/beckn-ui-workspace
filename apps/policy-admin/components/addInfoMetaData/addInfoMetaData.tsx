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
  Switch,
  Divider,
  Code,
  Image
} from '@chakra-ui/react'
import CustomDatePicker from '@components/customDatePicker'
import { Typography } from '@beckn-ui/molecules'
import { useRouter } from 'next/router'
import addIcon from '@public/images/plus_icon.svg'
import { cities, countries, infoCategories, mockedRulesData } from '@lib/constants'
import CustomButton from '@components/Button/CustomButton'

function AddInformationMetadata() {
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())
  const [isChecked, setIsChecked] = useState<boolean>(true)

  const router = useRouter()

  const handleOnSwitch = () => {
    setIsChecked(!isChecked)
  }

  return (
    <Box
      maxH={'calc(100vh - 110px)'}
      overflowY="auto"
      overflowX="hidden"
      display={'flex'}
      flexDir="column"
      gap="2rem"
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
            width={'9%'}
          >
            <Typography
              text="Activate"
              style={{
                alignSelf: 'center'
              }}
              fontSize={'14px !important'}
            />
            <Switch
              size={'lg'}
              isChecked={isChecked}
              colorScheme={'green'}
              onChange={handleOnSwitch}
            />
          </Box>
        </Flex>
        <Box height={'1rem'} />
        <Divider />
        <Box height={'1rem'} />

        <HStack
          spacing={3}
          gap="4rem"
        >
          <FormControl mb="1rem">
            <FormLabel>Title</FormLabel>
            <Input
              type="text"
              placeholder="Enter Title"
            />
          </FormControl>

          <FormControl mb="1rem">
            <FormLabel>Information Category</FormLabel>
            <Select placeholder="Select Information Category">
              {infoCategories.map((category, index) => (
                <option
                  key={index}
                  value={category.value.toLowerCase()}
                >
                  {category.name}
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl mb="1rem">
            <FormLabel>Information Source Owner</FormLabel>
            <Input
              type="text"
              placeholder="Enter Information Source Owner Name"
            />
          </FormControl>
        </HStack>

        <FormControl mb="1rem">
          <FormLabel>Description</FormLabel>
          <Textarea placeholder="Add Description" />
        </FormControl>

        <HStack
          spacing={4}
          gap="4rem"
        >
          <FormControl mb="1rem">
            <FormLabel>Country</FormLabel>
            <Select placeholder="Select Country">
              {countries.map((country, index) => (
                <option
                  key={index}
                  value={country.value.toLowerCase()}
                >
                  {country.name}
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl mb="1rem">
            <FormLabel>City</FormLabel>
            <Select placeholder="Select City">
              {cities.map((city, index) => (
                <option
                  key={index}
                  value={city.value.toLowerCase()}
                >
                  {city.name}
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl mb="1rem">
            <FormLabel>From</FormLabel>
            <CustomDatePicker
              selected={startDate}
              placeholderText="Select 'from' date"
              onChange={date => setStartDate(date!)}
              dateFormat="dd-MM-yyyy"
            />
          </FormControl>

          <FormControl mb="1rem">
            <FormLabel>To</FormLabel>
            <CustomDatePicker
              selected={endDate}
              placeholderText="Select 'to' date"
              onChange={date => setEndDate(date!)}
              dateFormat="dd-MM-yyyy"
            />
          </FormControl>
        </HStack>

        <HStack
          spacing={4}
          gap="4rem"
        >
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
              width={'45.2%'}
            >
              <option value="bangalore">BAP</option>
              <option value="new york">BPP</option>
            </Select>
          </FormControl>
        </HStack>
      </Box>

      <Box
        p={4}
        border="1px solid #72767e"
      >
        <FormControl>
          <FormLabel>Geofence</FormLabel>
          <Box
            width="fit-content"
            border={'1px dotted #004e92 !important'}
            padding="1rem 2rem"
            borderRadius={'md'}
            cursor="pointer"
            onClick={() => {
              router.push('/createGeofence')
            }}
          >
            <Flex
              flexDirection={'row'}
              alignItems="center"
              mr="1rem"
              cursor="pointer"
            >
              <Image
                src={addIcon}
                alt="add_icon"
                width={'1rem'}
                height={'1rem'}
              />
              <Typography
                text="Draw geofence on a map"
                fontSize="14px"
                color="#013b76"
              />
            </Flex>
          </Box>
        </FormControl>
      </Box>

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
              {JSON.stringify(mockedRulesData, undefined, 4)}
            </Code>
          </Box>
        </FormControl>
      </Box>

      <Flex width={'31rem'}>
        <CustomButton
          variant="outline"
          text="Go back"
          onClick={() => router.push('/')}
          mr="1rem"
        />
        <CustomButton
          variant="solid"
          bgGradient="linear(180deg, #000428 0%, #004e92 100%) !important"
          text="Save"
          _hover={{ opacity: 0.9 }}
          onClick={() => {}}
        />
      </Flex>
    </Box>
  )
}

export default AddInformationMetadata
