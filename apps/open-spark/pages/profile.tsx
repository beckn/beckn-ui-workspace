import { BecknAuth } from '@beckn-ui/becknified-components'
import { Box } from '@chakra-ui/react'
import { useLanguage } from '@hooks/useLanguage'
import { profileValidateForm } from '@beckn-ui/common/src/utils'
import Cookies from 'js-cookie'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FormErrors, ProfileProps } from '@beckn-ui/common/lib/types'
import axios from '@services/axios'
import { testIds } from '@shared/dataTestIds'
import credIcon from '@public/images/cred_icon.svg'
import tradeIcon from '@public/images/trade_icon.svg'
import myPreferenceIcon from '@public/images/myPreference.svg'
import derIcon from '@public/images/der_icon.svg'
import fundsIcon from '@public/images/funds.svg'
import logoutIcon from '@public/images/logOutIcon.svg'
import NavigationItem from '@components/navigationItem'
import { setProfileEditable, UserRootState } from '@store/user-slice'
import { feedbackActions, logout } from '@beckn-ui/common'
import { ROLE, ROUTE_TYPE } from '@lib/config'
import { AuthRootState } from '@store/auth-slice'
import { useRouter } from 'next/router'
import { InputProps } from '@beckn-ui/molecules'
import { clearCache } from '@utils/indexedDB'

const ProfilePage = () => {
  const dispatch = useDispatch()
  const { t } = useLanguage()
  const router = useRouter()
  const bearerToken = Cookies.get('authToken')
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<ProfileProps>({
    name: '',
    customerId: '',
    address: ''
  })
  const [formErrors, setFormErrors] = useState<FormErrors>({
    name: '',
    customerId: '',
    address: ''
  })

  const { profileEditable } = useSelector((state: UserRootState) => state.user)

  useEffect(() => {
    return () => {
      dispatch(setProfileEditable({ profileEditable: false }))
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setFormData((prevFormData: ProfileProps) => ({
      ...prevFormData,
      [name]: value
    }))

    const updatedFormData = {
      ...formData,
      [name]: value
    }

    const errors = profileValidateForm(updatedFormData) as any
    setFormErrors(prevErrors => ({
      ...prevErrors,
      [name]: t[`${errors[name]}`] || ''
    }))
  }

  useEffect(() => {
    const requestOptions = {
      method: 'GET',
      headers: { Authorization: `Bearer ${bearerToken}` },
      withCredentials: true
    }

    setIsLoading(true)

    axios
      .get(`${strapiUrl}${ROUTE_TYPE[ROLE.GENERAL]}/user-profile`, requestOptions)
      .then(response => {
        const result = response.data.agent

        console.log(result)
        const { first_name, last_name, address, agent_profile } = result
        setFormData({
          ...formData,
          name: `${first_name}`,
          address: agent_profile.address,
          customerId: agent_profile.customer_id,
          mobileNumber: agent_profile.phone_number
        })
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  const updateProfile = () => {
    if (formData.name === '' || formData.address === '') {
      return
    }
    const errors = profileValidateForm(formData) as any
    setFormErrors(prevErrors => ({
      ...prevErrors,
      ...Object.keys(errors).reduce((acc: any, key) => {
        acc[key] = t[`${errors[key]}`] || ''
        return acc
      }, {} as FormErrors)
    }))

    const data = {
      fullname: formData.name.trim(),
      address: formData.address
    }

    axios
      .put(`${strapiUrl}${ROUTE_TYPE[ROLE.GENERAL]}/user-profile`, data, {
        headers: { Authorization: `Bearer ${bearerToken}` }
      })
      .then(response => {
        // dispatch(
        //   feedbackActions.setToastData({
        //     toastData: { message: t.success, display: true, type: 'success', description: t.profileUpdateSuccess }
        //   })
        // )
      })
      .catch(error => {
        console.log(error)
        dispatch(
          feedbackActions.setToastData({
            toastData: { message: 'Error!', display: true, type: 'error', description: 'Unable to update' }
          })
        )
      })
  }

  const getInputs = () => {
    const inputs: InputProps[] = [
      {
        type: 'text',
        name: 'name',
        value: formData.name,
        handleChange: handleInputChange,
        label: t.fullName,
        error: formErrors.name,
        dataTest: testIds.profile_inputName,
        disabled: !profileEditable,
        customInputBlurHandler: updateProfile
      },
      // {
      //   type: 'text',
      //   name: 'customerId',
      //   value: formData.customerId!,
      //   handleChange: handleInputChange,
      //   label: t.formCustomerId,
      //   error: formErrors.customerId,
      //   dataTest: testIds.profile_customerId,
      //   disabled: true
      // },
      {
        type: 'text',
        name: 'address',
        value: formData.address!,
        handleChange: handleInputChange,
        label: t.formAddress,
        error: formErrors.address,
        dataTest: testIds.profile_address,
        disabled: !profileEditable,
        customInputBlurHandler: updateProfile
      },
      {
        type: 'text',
        name: 'mobileNumber',
        value: formData.mobileNumber!,
        handleChange: handleInputChange,
        label: t.formNumber,
        error: formErrors.mobileNumber,
        dataTest: '',
        disabled: true,
        customInputBlurHandler: updateProfile
      }
    ]

    return inputs
  }

  return (
    <Box
      margin={'0 auto'}
      mt={['-20px', '-20px', '-70px', '-70px']}
      maxW={['100%', '100%', '40rem', '40rem']}
      className="hideScroll osc_profile"
      maxH={'calc(100vh - 80px)'}
      overflowY="scroll"
    >
      <BecknAuth
        dataTestForm={testIds.profile_form}
        schema={{
          buttons: [],
          inputs: getInputs()
        }}
        isLoading={isLoading}
        customComponent={
          <Box marginTop={'-1.8rem'}>
            {/* <>
              <NavigationItem
                icon={myPreferenceIcon}
                label={'My Preferences'}
                handleClick={() => router.push('/myPreference')}
                dataTest={'myPreference'}
              />
              <NavigationItem
                icon={credIcon}
                label={'My Credentials'}
                handleClick={() => router.push('/myCredentials')}
                dataTest={'myCredintial'}
              />
              <NavigationItem
                icon={tradeIcon}
                label={'My Trades'}
                handleClick={() => router.push('/myTrades')}
                dataTest={'myTrades'}
              />
              <NavigationItem
                icon={derIcon}
                label={'My DERs'}
                handleClick={() => router.push('/myDers')}
                dataTest={'myDers'}
              />
              <NavigationItem
                icon={fundsIcon}
                label={'My Funds'}
                handleClick={() => router.push('/myFunds')}
                dataTest={'myFunds'}
              />
            </> */}
            <NavigationItem
              icon={logoutIcon}
              label={t.logout}
              arrow={false}
              divider={false}
              color="red"
              handleClick={async () => {
                try {
                  // Clear IndexedDB first
                  // await clearCache()
                  // Then dispatch logout action
                  dispatch(logout())
                } catch (error) {
                  console.error('Error clearing cache during logout:', error)
                  // Still proceed with logout even if cache clear fails
                  dispatch(logout())
                }
              }}
            />
          </Box>
        }
      />
    </Box>
  )
}

export default ProfilePage
