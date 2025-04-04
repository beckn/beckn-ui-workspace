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
import { extractMobileNumberFromSubjectDid } from '@utils/general'

const ProfilePage = () => {
  const dispatch = useDispatch()
  const { t } = useLanguage()
  const router = useRouter()
  const bearerToken = Cookies.get('authToken')
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<ProfileProps>({
    name: '',
    mobileNumber: ''
  })
  const [formErrors, setFormErrors] = useState<FormErrors>({
    name: '',
    mobileNumber: ''
  })

  const { user } = useSelector((state: AuthRootState) => state.auth)
  const { profileDetails } = useSelector((state: UserRootState) => state.user)
  useEffect(() => {
    setFormData({
      name: profileDetails?.agent
        ? (profileDetails?.agent?.first_name ?? '') + ' ' + (profileDetails?.agent?.last_name ?? '')
        : '',
      address: profileDetails?.agent?.agent_profile?.address ?? '',
      mobileNumber: user?.did ? extractMobileNumberFromSubjectDid(user?.did!) : ''
    })
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
        disabled: true
        // customInputBlurHandler: updateProfile
      },
      {
        type: 'text',
        name: 'address',
        value: formData.address!,
        handleChange: handleInputChange,
        label: t.formAddress,
        error: formErrors.address,
        dataTest: testIds.profile_address,
        disabled: true
        // customInputBlurHandler: updateProfile
      },
      {
        type: 'text',
        name: 'mobileNumber',
        value: formData.mobileNumber!,
        handleChange: handleInputChange,
        label: t.enterMobileNumber,
        error: formErrors.mobileNumber,
        dataTest: testIds.profile_inputMobileNumber,
        disabled: true,
        customInputBlurHandler: () => {}
      }
    ]
    if (user?.did) {
      inputs.push({
        type: 'text',
        name: 'userDid',
        value: `/subj****${user?.did.slice(-4)}`,
        handleChange: handleInputChange,
        label: 'Wallet ID',
        disabled: true,
        customInputBlurHandler: () => {}
      })
    }
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
            <NavigationItem
              icon={logoutIcon}
              label={t.logout}
              arrow={false}
              divider={false}
              color="red"
              handleClick={() => {
                dispatch(logout())
              }}
            />
          </Box>
        }
      />
    </Box>
  )
}

export default ProfilePage
