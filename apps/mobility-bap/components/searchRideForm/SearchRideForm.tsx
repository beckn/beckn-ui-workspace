import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Box, Divider, Flex, Image, useTheme } from '@chakra-ui/react'
import BecknButton from '@beckn-ui/molecules/src/components/button/Button'
import TripLocation from './TripLocation'
import { Input, Typography } from '@beckn-ui/molecules'
import { useLanguage } from '@hooks/useLanguage'
import CustomDropdown from './CustomDropdown'
import BottomDrawer from '../bottomDrawer/BottomDrawer'
import { validateSearchRideForm } from '@utils/detailsForm-utils'
import { SearchRideFormProps } from './SearchRideForm.types'
import { useInitMutation } from '@beckn-ui/common/src/services/init'
import { useDispatch, useSelector } from 'react-redux'
import { getInitPayload, getSelectPayload } from '@utils/payload'
import { OptionsList } from '@utils/cabDetails'
import { DiscoveryRootState } from '@store/discovery-slice'
import { DOMAIN } from '@lib/config'
import { feedbackActions } from '@beckn-ui/common'
import { useSelectMutation } from '@beckn-ui/common/src/services/select'

const optionsList: OptionsList = {
  rideTimeOptionsList: [
    {
      label: 'Ride Now',
      value: 'ridenow',
      tag: 'rideTimeOptions'
    },
    {
      label: 'Ride Later',
      value: 'ridelater',
      tag: 'rideTimeOptions'
    }
  ],
  riderOptionsList: [
    {
      label: 'Myself',
      value: 'myself',
      tag: 'riderOptions'
    },
    {
      label: 'Others',
      value: 'others',
      tag: 'riderOptions'
    }
  ]
}

const SearchRideForm: React.FC<SearchRideFormProps> = () => {
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

  const { t } = useLanguage()
  const dispatch = useDispatch()
  const router = useRouter()
  const theme = useTheme()
  const { transactionId, selectedRide } = useSelector((state: DiscoveryRootState) => state.discovery)
  const [initialize] = useInitMutation()
  const [fetchQuotes] = useSelectMutation()

  const { provider, pickup, dropoff } = selectedRide

  // const selectResponse = useSelector((state: SelectRideRootState) => state.selectRide.selectResponse)

  useEffect(() => {
    if (Object.keys(selectedRide).length > 0) {
      fetchQuotes(getSelectPayload(selectedRide, transactionId, DOMAIN))
    }
  }, [selectedRide])

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

  const formSubmitHandler = () => {
    try {
      // const { id, type } = selectResponse[0].message.order.fulfillments[0]
      const contactDetails = {
        name: formData.name,
        phone: formData.mobileNumber,
        email: formData.name.replace(/\s+/g, '') + '@example.com'
      }
      getInitPayload(contactDetails, selectedRide, transactionId, DOMAIN).then(res => {
        return initialize(res)
      })
    } catch (error) {
      console.log('error while init--> ', error)
      dispatch(
        feedbackActions.setToastData({
          toastData: {
            message: 'Error',
            display: true,
            type: 'error',
            description: 'Something went wrong, please try again'
          }
        })
      )
      router.back()
    }
  }

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
              text={provider?.cabDetails?.[0]?.name}
              fontSize="15px"
              fontWeight="500"
            />
            <Typography
              text={provider?.cabDetails?.[0]?.waitTime}
              fontSize="9px"
              fontWeight="400"
              color="#8A8D8E"
            />
          </Flex>
        </Flex>
        <Typography
          text={`${t.currencySymbol}${provider?.cabDetails?.[0]?.fare}`}
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
          pickupLocation={pickup}
          dropLocation={dropoff}
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
          formSubmitHandler()
          router.push('/paymentMode')
        }}
      />
    </BottomDrawer>
  )
}
export default SearchRideForm
