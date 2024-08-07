import React from 'react'
import { Box, Divider, Flex, Image, Text } from '@chakra-ui/react'
import { DetailCard } from '@beckn-ui/becknified-components'
import { Typography } from '@beckn-ui/molecules'

const profiles = [
  {
    profileTitle: 'Personal Details',
    details: [
      { label: 'Raj Kumar', img: '/images/Profile.svg' },
      { label: 'rajkumar@example.com', img: '/images/mail.svg' },
      { label: '+91-9876543210', img: '/images/Call.svg' }
    ]
  },
  {
    profileTitle: 'Vehicle Details',
    details: [
      { label: 'MH12TB4032', img: '/images/local_taxi.svg' },
      { label: 'Maruti Suzuki Swift', img: '/images/manufacturing.svg' },
      { label: '2020', img: '/images/directions_car.svg' },
      { label: 'Sedan', img: '/images/oil_barrel.svg' }
    ]
  }
]

const ProfilePage = () => {
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
                  text={detail.label}
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
