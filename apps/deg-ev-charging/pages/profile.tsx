import { BecknAuth } from '@beckn-ui/becknified-components'
import { Box, Flex, Spinner } from '@chakra-ui/react'
import { useLanguage } from '@hooks/useLanguage'
import { profileValidateForm } from '@beckn-ui/common/src/utils'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { DegWalletDetails, FormErrors, ProfileProps } from '@beckn-ui/common/lib/types'
import { testIds } from '@shared/dataTestIds'
import LogoutIcon from '@public/images/logout_icon.svg'
import { setProfileEditable, UserRootState } from '@store/user-slice'
import { checkoutBeckn20Actions, clearSource, feedbackActions } from '@beckn-ui/common'
import { logout } from '@store/auth-slice'
import { InputProps, Typography } from '@beckn-ui/molecules'
import NavigationItem from '@components/NavigationItem'
import BecknButton from '@beckn-ui/molecules/src/components/button/Button'
import OpenWalletBottomModal from '@components/Modal/OpenWalletBottomModal'
import { AuthRootState } from '@store/auth-slice'
import { useConnectWallet } from '@hooks/useConnectWallet'
import { useGetProfileQuery, useUpdateProfileMutation } from '@services/UserService'

const ProfilePage = () => {
  const dispatch = useDispatch()
  const { t } = useLanguage()
  const [formData, setFormData] = useState<ProfileProps>({
    name: '',
    email: '',
    address: '',
    mobileNumber: ''
  })
  const [formErrors, setFormErrors] = useState<FormErrors>({
    name: '',
    email: '',
    address: ''
  })
  const [, setWalletDetails] = useState<DegWalletDetails>()

  const { modalType, handleModalOpen, handleModalClose } = useConnectWallet()

  const { profileEditable, shouldShowInitialAlert } = useSelector((state: UserRootState) => state.user)
  const { user } = useSelector((state: AuthRootState) => state.auth)

  const { data: profileData, isLoading } = useGetProfileQuery(undefined, { skip: !user })
  const [updateProfileApi] = useUpdateProfileMutation()

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
    if (!profileData) return
    const { user: profileUser, profile } = profileData
    setFormData(prev => ({
      ...prev,
      name: profile?.name ?? profileUser?.fullName ?? '',
      email: profileUser?.email ?? '',
      mobileNumber: profile?.phone ?? profileUser?.phoneNumber ?? '',
      address: profile?.address ?? ''
    }))
  }, [profileData])

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

    updateProfileApi({
      name: formData.name.trim(),
      address: formData.address ?? undefined
    })
      .unwrap()
      .catch(() => {
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

  if (isLoading && !profileData) {
    return (
      <Box
        w="100%"
        maxW="28rem"
        mx="auto"
        px={4}
        py={8}
        display="flex"
        justifyContent="center"
        alignItems="center"
        minH="200px"
      >
        <Spinner
          size="lg"
          color="var(--ev-primary)"
        />
      </Box>
    )
  }

  return (
    <Box
      className="hideScroll ev-profile-page"
      w="100%"
      maxW="28rem"
      mx="auto"
      px={{ base: 4, sm: 6 }}
      py={{ base: 6, sm: 8 }}
      maxH="calc(100vh - 100px)"
      overflowY="auto"
    >
      <Flex
        flexDir="column"
        gap={6}
      >
        <Box>
          <Flex
            width="100%"
            justifyContent="space-between"
            alignItems="center"
            mb={4}
          >
            <Typography
              text="Personal Information"
              fontWeight="600"
              fontSize="16px"
            />
          </Flex>
          <BecknAuth
            dataTestForm={testIds.profile_form}
            schema={{
              buttons: [],
              inputs: getInputs()
            }}
            isLoading={false}
          />
        </Box>

        <NavigationItem
          icon={LogoutIcon}
          label="Logout"
          color="var(--ev-error)"
          handleClick={() => {
            dispatch(clearSource())
            dispatch(checkoutBeckn20Actions.clearState())
            dispatch(logout())
          }}
          dataTest="logout"
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
