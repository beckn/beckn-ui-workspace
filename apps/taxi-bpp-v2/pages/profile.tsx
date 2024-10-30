import React, { useEffect, useState } from 'react'
import { Box, Divider, Flex, Image } from '@chakra-ui/react'
import { DetailCard } from '@beckn-ui/becknified-components'
import { Typography } from '@beckn-ui/molecules'
import { useGetMyProfileMutation } from '@services/RiderService'
import { UserDetailsModel, VehicleDetailsModel, ProviderDetailsModel } from '@lib/types/profile'
import { testIds } from '@shared/dataTestIds'

const ProfilePage = () => {
  const [personalDetails, setPersonalDetails] = useState<UserDetailsModel>()
  const [vehicleDetails, setVehicleDetails] = useState<VehicleDetailsModel>()
  const [providerDetails, setProviderDetails] = useState<ProviderDetailsModel>()

  const [getMyProfile] = useGetMyProfileMutation()

  const getMyProfileDetails = async () => {
    const data: any = await getMyProfile({})
    if (data && data?.data) {
      const { user_details, vehicle_details, provider_details } = data.data
      setPersonalDetails({
        name: user_details.name,
        email: user_details.email,
        phoneNumber: user_details.phone_number,
        username: user_details.username
      })
      setVehicleDetails({
        registrationNo: vehicle_details.registration_no,
        vehicleMake: vehicle_details.vehicle_make,
        vehicleModel: vehicle_details.vehicle_model,
        powerSource: vehicle_details.power_source
      })
      setProviderDetails({
        id: provider_details.id,
        name: provider_details.name,
        short_desc: provider_details.short_desc,
        long_desc: provider_details.long_desc,
        rating: provider_details.rating
      })
    }
  }

  useEffect(() => {
    getMyProfileDetails()
  }, [])

  const profiles = [
    {
      profileTitle: 'Personal Details',
      data_test: testIds.taxi_BPP_Personal_Details,
      details: [
        { label: personalDetails?.name, img: '/images/Profile.svg', data_test: testIds.taxi_BPP_personal_name },
        { label: personalDetails?.email, img: '/images/mail.svg', data_test: testIds.taxi_BPP_personal_email },
        { label: personalDetails?.phoneNumber, img: '/images/Call.svg', data_test: testIds.taxi_BPP_personal_phone }
      ]
    },
    {
      profileTitle: 'Vehicle Details',
      data_test: testIds.taxi_BPP_Vehicle_Details,
      details: [
        {
          label: vehicleDetails?.registrationNo,
          img: '/images/local_taxi.svg',
          data_test: testIds.taxi_BPP_vehicle_registration
        },
        {
          label: vehicleDetails?.vehicleMake,
          img: '/images/manufacturing.svg',
          data_test: testIds.taxi_BPP_vehicle_make
        },
        {
          label: vehicleDetails?.vehicleModel,
          img: '/images/directions_car.svg',
          data_test: testIds.taxi_BPP_vehicle_model
        },
        {
          label: vehicleDetails?.powerSource,
          img: '/images/oil_barrel.svg',
          data_test: testIds.taxi_BPP_vehicle_power_source
        }
      ]
    },
    {
      profileTitle: 'Provider Details',
      data_test: testIds.taxi_BPP_Provider_Details,
      details: [
        { label: providerDetails?.name, img: '/images/local_taxi.svg', data_test: testIds.taxi_BPP_provider_name },
        {
          label: providerDetails?.short_desc,
          img: '/images/description.svg',
          data_test: testIds.taxi_BPP_provider_short_desc
        },
        { label: providerDetails?.rating, img: '/images/Star.svg', data_test: testIds.taxi_BPP_provider_rating }
      ]
    }
  ]

  return (
    <Box
      mt="110px"
      p="0 20px"
      maxH={'calc(100vh - 110px)'}
      overflowY="scroll"
      className="hideScroll"
    >
      {profiles.map((profile, index) => (
        <DetailCard key={index}>
          <Typography
            variant="subTitleSemibold"
            text={profile.profileTitle}
            dataTest={profile.data_test}
          />
          {profile.details.map((detail, idx) => (
            <Box key={idx}>
              <Flex
                mt={'18px'}
                mb="16px"
                alignItems="center"
              >
                <Image
                  height="24px"
                  w="24px"
                  src={detail.img}
                  alt={`${detail.label} icon`}
                  mr="12px"
                />
                <Typography
                  variant="subTitleRegular"
                  text={detail.label!}
                  dataTest={detail.data_test}
                />
              </Flex>
              {idx < profile.details.length - 1 && <Divider />}
            </Box>
          ))}
        </DetailCard>
      ))}
    </Box>
  )
}

export default ProfilePage
