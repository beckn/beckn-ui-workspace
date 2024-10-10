import React, { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { Box, Divider, Flex, Image, useTheme } from '@chakra-ui/react'
import BecknButton from '@beckn-ui/molecules/src/components/button/Button'
import TripLocation from './TripLocation'
import { Input, LoaderWithMessage, Typography } from '@beckn-ui/molecules'
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
import { getCurrencyWithFare, getDistance } from '@utils/general'
import { UserGeoLocationRootState } from '@lib/types/user'
import { SelectRideRootState } from '@store/selectRide-slice'
import { testIds } from '@shared/dataTestIds'

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
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const { t } = useLanguage()
  const dispatch = useDispatch()
  const router = useRouter()
  const theme = useTheme()
  const { transactionId, selectedRide } = useSelector((state: DiscoveryRootState) => state.discovery)
  const selectResponse = useSelector((state: SelectRideRootState) => state.selectRide.selectResponse)
  const [initialize] = useInitMutation()
  const [fetchQuotes] = useSelectMutation()
  const { cabDetail, pickup, dropoff } = selectedRide

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
  }
  const handleDropdownChange = (newValue: string, tag: string) => {
    setDropDownOptions(prev => ({
      ...prev,
      [tag]: newValue
    }))
  }

  const formSubmitHandler = async () => {
    try {
      if (!selectResponse) return
      setIsLoading(true)
      // const { id, type } = selectResponse[0].message.order.fulfillments[0]
      const contactDetails = {
        name: formData.name,
        phone: formData.mobileNumber,
        email: formData.name.replace(/\s+/g, '') + '@example.com'
      }
      await getInitPayload(contactDetails, selectedRide, transactionId, DOMAIN).then(res => {
        return initialize(res)
      })
      router.push('/paymentMode')
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
    } finally {
      setIsLoading(false)
    }
  }

  const isFormFilled = useMemo(() => {
    const { ...restFormData } = formData
    const { ...restFormErrors } = formErrors

    return (
      Object.values(restFormData).every(value => value !== '') &&
      Object.values(restFormErrors).every(value => value === '')
    )
  }, [formData, formErrors])

  const getTotalFare = (fare: string) => {
    const distance = getDistance(pickup, dropoff)
    return (Number(fare) * distance).toFixed(2)
  }
  console.log(cabDetail)
  return (
    <>
      {isLoading ? (
        <Box
          display={'flex'}
          alignItems="center"
          justifyContent={'center'}
          height={'300px'}
        >
          <LoaderWithMessage
            loadingText={t.pleaseWait}
            loadingSubText={''}
          />
        </Box>
      ) : (
        <BottomDrawer dataTest={testIds.mobility_search_ride_details_form}>
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
                  text={cabDetail?.name}
                  fontSize="15px"
                  fontWeight="500"
                />
                <Typography
                  text={cabDetail?.waitTime}
                  fontSize="9px"
                  fontWeight="400"
                  color="#8A8D8E"
                />
              </Flex>
            </Flex>
            <Typography
              text={`${getCurrencyWithFare(pickup.country!, getTotalFare(cabDetail?.fare))}`}
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
            handleClick={formSubmitHandler}
          />
        </BottomDrawer>
      )}
    </>
  )
}
export default SearchRideForm
