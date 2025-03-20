import DetailsCard from '@beckn-ui/becknified-components/src/components/checkout/details-card'
import { feedbackActions } from '@beckn-ui/common'
import { Typography } from '@beckn-ui/molecules'
import BecknButton from '@beckn-ui/molecules/src/components/button/Button'
import { Box, Flex, Switch } from '@chakra-ui/react'
import { ROLE, ROUTE_TYPE } from '@lib/config'
import axios from '@services/axios'
import Cookies from 'js-cookie'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { setPreferences } from '@store/user-slice'

const LABEL_MAPPING: Record<string, string> = {
  trustedSource: 'Trusted Sources',
  credRequired: 'Solar Power'
}

const MyPreference = () => {
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL
  const token = Cookies.get('p2pAuthToken')
  const dispatch = useDispatch()

  const [updatedPreferences, setUpdatedPreferences] = useState<{ [key: string]: boolean }>({})

  useEffect(() => {
    if (!strapiUrl) {
      console.error('Strapi URL is not defined in environment variables.')
      return
    }

    const fetchPreferences = async () => {
      try {
        const response = await axios.get(`${strapiUrl}${ROUTE_TYPE[ROLE.GENERAL]}/user-pref`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        dispatch(setPreferences(response.data || {}))
        setUpdatedPreferences(response.data || {})
      } catch (error) {
        console.error('Error fetching user preferences:', error)
      }
    }

    fetchPreferences()
  }, [strapiUrl])

  const handleToggle = (key: string) => {
    setUpdatedPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const handleUpdatePreferences = async () => {
    try {
      await axios.put(`${strapiUrl}${ROUTE_TYPE[ROLE.GENERAL]}/user-pref`, updatedPreferences, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      dispatch(setPreferences(updatedPreferences))
      dispatch(
        feedbackActions.setToastData({
          toastData: {
            message: 'Success',
            display: true,
            type: 'success',
            description: 'Your preferences have been successfully updated!'
          }
        })
      )
      console.log('Preferences updated successfully:', updatedPreferences)
    } catch (error) {
      console.error('Error updating preferences:', error)
    }
  }

  return (
    <Box
      mt="20px"
      position={'relative'}
      height={'calc(100vh - 130px)'}
    >
      <Typography
        text={'Select your preference'}
        fontWeight="600"
        fontSize="15px"
        color="#4A4A4A"
      />
      <Box mt="20px">
        {Object.entries(updatedPreferences).map(([key, value]) => (
          <DetailsCard key={key}>
            <Flex
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography
                text={LABEL_MAPPING[key] || key}
                fontWeight="600"
                fontSize="15px"
              />
              <Switch
                size="md"
                colorScheme="blue"
                isChecked={value}
                onChange={() => handleToggle(key)}
              />
            </Flex>
          </DetailsCard>
        ))}
      </Box>
      <Box
        position={'absolute'}
        bottom="0"
        w="100%"
      >
        <BecknButton
          text="Save"
          handleClick={handleUpdatePreferences}
        />
      </Box>
    </Box>
  )
}

export default MyPreference
