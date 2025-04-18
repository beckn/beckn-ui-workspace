import { BecknAuth } from '@beckn-ui/becknified-components'
import { Box, Flex } from '@chakra-ui/react'
import { useLanguage } from '@hooks/useLanguage'
import { profileValidateForm } from '@beckn-ui/common/src/utils'
import Cookies from 'js-cookie'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { DegWalletDetails, FormErrors, ProfileProps } from '@beckn-ui/common/lib/types'
import axios from '@services/axios'
import { testIds } from '@shared/dataTestIds'
import LogoutIcon from '@public/images/logout_icon.svg'
import { setProfileEditable, UserRootState } from '@store/user-slice'
import { checkoutActions, clearSource, feedbackActions, logout } from '@beckn-ui/common'
import { ROLE, ROUTE_TYPE } from '@lib/config'
import { InputProps, Typography } from '@beckn-ui/molecules'
import NavigationItem from '@components/NavigationItem'
import BecknButton from '@beckn-ui/molecules/src/components/button/Button'
import OpenWalletBottomModal from '@components/Modal/OpenWalletBottomModal'
import { AuthRootState } from '@store/auth-slice'
import { useConnectWallet } from '@hooks/useConnectWallet'

const ProfilePage = () => {
  const dispatch = useDispatch()
  const { t } = useLanguage()
  const bearerToken = Cookies.get('authToken')
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<ProfileProps>({
    name: '',
    email: '',
    address: ''
  })
  const [formErrors, setFormErrors] = useState<FormErrors>({
    name: '',
    email: '',
    address: ''
  })
  const [walletDetails, setWalletDetails] = useState<DegWalletDetails>()

  const { modalType, handleModalOpen, handleModalClose } = useConnectWallet()

  const { profileEditable, shouldShowInitialAlert } = useSelector((state: UserRootState) => state.user)
  const { user } = useSelector((state: AuthRootState) => state.auth)

  useEffect(() => {
    return () => {
      dispatch(setProfileEditable({ profileEditable: false }))
    }
  }, [])

  useEffect(() => {
    if (user && user?.deg_wallet) {
      setWalletDetails(user.deg_wallet)
    }
    console.log(shouldShowInitialAlert)
    if (
      shouldShowInitialAlert &&
      user?.deg_wallet &&
      (!user?.deg_wallet.energy_assets_consent ||
        !user?.deg_wallet.energy_identities_consent ||
        !user?.deg_wallet.energy_transactions_consent)
    ) {
      handleModalOpen('alert')
    }
  }, [user, shouldShowInitialAlert])

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

    const errors = profileValidateForm(updatedFormData) as Record<string, string>
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

        const { first_name, agent_profile } = result
        setFormData({
          ...formData,
          name: `${first_name}`,
          address: agent_profile.address,
          email: response.data.email,
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
    const errors = profileValidateForm(formData) as Record<string, string>
    setFormErrors(prevErrors => ({
      ...prevErrors,
      ...Object.keys(errors).reduce<FormErrors>((acc, key) => {
        acc[key as keyof FormErrors] = t[`${errors[key]}`] || ''
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
      .then(() => {
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
        variant: 'rounded',
        value: formData.name,
        handleChange: handleInputChange,
        label: t.name,
        error: formErrors.name,
        dataTest: testIds.profile_inputName,
        disabled: !profileEditable,
        customInputBlurHandler: updateProfile
      },
      {
        type: 'text',
        name: 'mobileNumber',
        variant: 'rounded',
        value: formData.mobileNumber!,
        handleChange: handleInputChange,
        label: t.formNumber,
        error: formErrors.mobileNumber,
        dataTest: '',
        disabled: true,
        customInputBlurHandler: updateProfile
      },
      {
        type: 'text',
        name: 'email',
        variant: 'rounded',
        value: formData.email!,
        handleChange: handleInputChange,
        label: t.enterEmailID,
        error: formErrors.email,
        dataTest: '',
        disabled: true
      },
      {
        type: 'text',
        name: 'address',
        variant: 'rounded',
        value: formData.address!,
        handleChange: handleInputChange,
        label: t.formAddress,
        error: formErrors.address,
        dataTest: testIds.profile_address,
        disabled: !profileEditable,
        customInputBlurHandler: updateProfile
      }
    ]
    const walletId = user?.deg_wallet?.deg_wallet_id?.slice(-4)
    if (user?.deg_wallet?.deg_wallet_id) {
      inputs.push({
        type: 'text',
        name: 'userDid',
        variant: 'rounded',
        value: `/subj****${walletId}`,
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
      className="hideScroll"
      maxH={'calc(100vh - 100px)'}
      overflowY="scroll"
      w={['100%', '100%', '70%', '62%']}
      margin="0 auto"
    >
      <Flex
        flexDir={'column'}
        justifyContent={'space-between'}
        height={'calc(100vh - 14rem)'}
      >
        <Box position={'relative'}>
          <Flex
            pos={'absolute'}
            width={'100%'}
            justifyContent={'space-between'}
            alignItems={'center'}
            height={'38px'}
          >
            <Typography
              text="Personal Information"
              fontWeight="600"
              fontSize="16px"
            />
            {!user?.deg_wallet?.deg_wallet_id && (
              <BecknButton
                text="Connect Wallet"
                handleClick={() => handleModalOpen('link')}
                sx={{
                  width: '113px',
                  height: '38px',
                  fontSize: '12px',
                  fontWeight: '400',
                  padding: '10px',
                  borderRadius: '12px',
                  mb: 'unset'
                }}
              />
            )}
          </Flex>
          <BecknAuth
            dataTestForm={testIds.profile_form}
            schema={{
              buttons: [],
              inputs: getInputs()
            }}
            isLoading={isLoading}
          />
        </Box>

        <NavigationItem
          icon={LogoutIcon}
          label={'Logout'}
          color="#4461F2"
          handleClick={() => {
            dispatch(clearSource())
            dispatch(checkoutActions.clearState())
            dispatch(logout())
          }}
          dataTest={'logout'}
        />
      </Flex>
      <OpenWalletBottomModal
        modalType={modalType}
        setModalType={handleModalOpen}
        onClose={handleModalClose}
      />
    </Box>
  )
}

export default ProfilePage
