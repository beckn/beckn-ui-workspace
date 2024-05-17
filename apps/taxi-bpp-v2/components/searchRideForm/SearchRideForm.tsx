import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { Box, Divider, Flex, Image, useTheme } from '@chakra-ui/react'
import BecknButton from '@beckn-ui/molecules/src/components/button/Button'
import TripLocation from './TripLocation'
import { Input, Typography } from '@beckn-ui/molecules'
import { useLanguage } from 'hooks/useLanguage'
import CustomDropdown from './CustomDropdown'
import BottomDrawer from '../bottomDrawer/BottomDrawer'
import { validateSearchRideForm } from 'utilities/detailsForm-utils'
import { SearchRideFormProps } from './SearchRideForm.types'
const SearchRideForm: React.FC<SearchRideFormProps> = ({ cabDetails, location, optionsList }) => {
  const { t } = useLanguage()
  const router = useRouter()
  const theme = useTheme()
  const { rideTimeOptionsList, riderOptionsList } = optionsList
  const [formData, setFormData] = useState({
    name: '',
    mobileNumber: ''
  })
  const [formErrors, setFormErrors] = useState({ name: '', mobileNumber: '' })
  const [dropDownOptions, setDropDownOptions] = useState({
    rideTimeOptions: 'ridenow',
    riderOptions: 'myself'
  })
  const [isFormFilled, setIsFormFilled] = useState(false)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value
    }))
    const updatedFormData = {
      ...formData,
      [name]: value
    }
    const errors = validateSearchRideForm(updatedFormData) as any
    setFormErrors(prevErrors => ({
      ...prevErrors,
      [name]: t[`${errors[name]}`] || ''
    }))
    setIsFormFilled(updatedFormData.name.trim() !== '' && updatedFormData.mobileNumber.trim() !== '')
  }
  const handleDropdownChange = (newValue: string, tag: string) => {
    setDropDownOptions(prev => ({
      ...prev,
      [tag]: newValue
    }))
  }
  console.log(location)
  return (
    <BottomDrawer>
      <Flex
        dir="row"
        alignItems="center"
        justifyContent={'space-between'}
      >
        <Flex alignItems={'center'}>
          <Image
            src="./images/cabIcon.svg"
            alt="Cab-Image"
            marginRight={'16px'}
          />
          <Flex
            direction={'column'}
            alignItems={'center'}
            justifyContent={'center'}
          >
            <Typography
              text={cabDetails.name}
              fontSize="15px"
              fontWeight="500"
            />
            <Typography
              text={cabDetails.waitTime}
              fontSize="9px"
              fontWeight="400"
              color="#8A8D8E"
            />
          </Flex>
        </Flex>
        <Typography
          text={cabDetails.fare}
          fontSize="15px"
          fontWeight="700"
          color={theme.colors.primary[100]}
        />
      </Flex>
      <Divider
        mb="20px"
        mt="8px"
        w={'unset'}
        mr="-20px"
        ml="-20px"
        borderBottomWidth={'2px'}
      />
      <CustomDropdown
        items={rideTimeOptionsList}
        value={dropDownOptions.rideTimeOptions}
        onChange={handleDropdownChange}
      />
      <Box
        mb={'30px'}
        mt={'20px'}
      >
        <TripLocation
          pickupLocation={location.pickup}
          dropLocation={location.dropOff}
        />
      </Box>
      <CustomDropdown
        items={riderOptionsList}
        value={dropDownOptions.riderOptions}
        onChange={handleDropdownChange}
      />
      <Box mt={'20px'}>
        <Input
          type="text"
          name="name"
          value={formData.name}
          label="Name"
          error={formErrors.name}
          handleChange={handleInputChange}
        />
        <Input
          type="text"
          name="mobileNumber"
          value={formData.mobileNumber}
          label="Mobile Number"
          error={formErrors.mobileNumber}
          handleChange={handleInputChange}
        />
      </Box>
      <BecknButton
        text="Confirm & Proceed"
        disabled={!isFormFilled}
        handleClick={() => {
          router.push('/paymentMode')
        }}
      />
    </BottomDrawer>
  )
}
export default SearchRideForm
