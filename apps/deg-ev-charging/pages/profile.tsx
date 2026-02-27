import { Box, Flex, FormControl, FormLabel, Input, Spinner, Text, Image, useTheme } from '@chakra-ui/react'
import { useLanguage } from '@hooks/useLanguage'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { testIds } from '@shared/dataTestIds'
import LogoutIcon from '@public/images/logout_icon.svg'
import { setProfileEditable, UserRootState } from '@store/user-slice'
import { logout } from '@store/auth-slice'
import OpenWalletBottomModal from '@components/Modal/OpenWalletBottomModal'
import { AuthRootState } from '@store/auth-slice'
import { useConnectWallet } from '@hooks/useConnectWallet'
import { useGetProfileQuery, useUpdateProfileMutation } from '@services/UserService'

interface ProfileProps {
  name: string
  email?: string
  address?: string
  mobileNumber?: string
}

interface FormErrors {
  name?: string
  email?: string
  address?: string
  mobileNumber?: string
}

interface DegWalletDetails {
  deg_wallet_id?: string
  energy_identities_consent?: boolean
  energy_assets_consent?: boolean
  energy_transactions_consent?: boolean
}

const profileValidateForm = (formData: ProfileProps): FormErrors => {
  const errors: FormErrors = {}

  if (formData.name.trim() === '') {
    errors.name = 'errorName'
  } else if (!/^[A-Za-z\s]*$/.test(formData.name)) {
    errors.name = 'errorName2'
  } else if (formData.name.length < 3) {
    errors.name = 'errorName3'
  }

  if (formData?.mobileNumber?.trim() === '') {
    errors.mobileNumber = 'errorNumber'
  } else if (formData?.mobileNumber && !/^\d{10}$/.test(formData.mobileNumber)) {
    errors.mobileNumber = 'errorNumber2'
  }

  return errors
}

const ProfilePage = () => {
  const dispatch = useDispatch()
  const { t } = useLanguage()
  const theme = useTheme()
  const primaryColor = theme.colors?.primary?.[100] ?? 'var(--ev-primary)'
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
        dispatch({
          type: 'ui-feedback/setToastData',
          payload: {
            toastData: { message: 'Error!', display: true, type: 'error', description: 'Unable to update' }
          }
        })
      })
  }

  const handleLogout = () => {
    dispatch({ type: 'geoLocationSearchPageUI/clearSource' })
    dispatch({ type: 'checkoutBeckn20/clearState' })
    dispatch(logout())
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
      px={{ base: 6, sm: 8 }}
      py={{ base: 8, sm: 10 }}
      maxH="calc(100vh - 100px)"
      overflowY="auto"
    >
      <Flex
        flexDir="column"
        gap={6}
      >
        <Box data-test={testIds.profile_form}>
          <Flex
            width="100%"
            justifyContent="space-between"
            alignItems="center"
            mb={4}
          >
            <Text
              fontWeight="600"
              fontSize="16px"
            >
              Personal Information
            </Text>
          </Flex>
          <Box mt="10px">
            <FormControl mb="35px">
              <FormLabel
                fontSize="14px"
                color="#a0aec0"
                mb={1}
              >
                {t.name}
              </FormLabel>
              <Input
                data-test={testIds.profile_inputName}
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                onBlur={updateProfile}
                isDisabled={!profileEditable}
                border="1px solid #989898"
                borderRadius="8px"
                padding="8px 16px"
                fontSize="16px"
                borderColor={formErrors.name ? '#a71b4a' : undefined}
                _focus={{ borderColor: formErrors.name ? '#a71b4a' : primaryColor, outline: 'none' }}
              />
              {formErrors.name && (
                <Text
                  fontSize="12px"
                  color="#a71b4a"
                  mt={1}
                >
                  {formErrors.name}
                </Text>
              )}
            </FormControl>
            <FormControl mb="35px">
              <FormLabel
                fontSize="14px"
                color="#a0aec0"
                mb={1}
              >
                {t.formNumber}
              </FormLabel>
              <Input
                type="text"
                name="mobileNumber"
                value={formData.mobileNumber ?? ''}
                onChange={handleInputChange}
                onBlur={updateProfile}
                isDisabled
                border="1px solid #989898"
                borderRadius="8px"
                padding="8px 16px"
                fontSize="16px"
              />
              {formErrors.mobileNumber && (
                <Text
                  fontSize="12px"
                  color="#a71b4a"
                  mt={1}
                >
                  {formErrors.mobileNumber}
                </Text>
              )}
            </FormControl>
            <FormControl mb="35px">
              <FormLabel
                fontSize="14px"
                color="#a0aec0"
                mb={1}
              >
                {t.enterEmailID}
              </FormLabel>
              <Input
                type="text"
                name="email"
                value={formData.email ?? ''}
                onChange={handleInputChange}
                isDisabled
                border="1px solid #989898"
                borderRadius="8px"
                padding="8px 16px"
                fontSize="16px"
              />
              {formErrors.email && (
                <Text
                  fontSize="12px"
                  color="#a71b4a"
                  mt={1}
                >
                  {formErrors.email}
                </Text>
              )}
            </FormControl>
            <FormControl mb="35px">
              <FormLabel
                fontSize="14px"
                color="#a0aec0"
                mb={1}
              >
                {t.formAddress}
              </FormLabel>
              <Input
                data-test={testIds.profile_address}
                type="text"
                name="address"
                value={formData.address ?? ''}
                onChange={handleInputChange}
                onBlur={updateProfile}
                isDisabled={!profileEditable}
                border="1px solid #989898"
                borderRadius="8px"
                padding="8px 16px"
                fontSize="16px"
                borderColor={formErrors.address ? '#a71b4a' : undefined}
                _focus={{ borderColor: formErrors.address ? '#a71b4a' : primaryColor, outline: 'none' }}
              />
              {formErrors.address && (
                <Text
                  fontSize="12px"
                  color="#a71b4a"
                  mt={1}
                >
                  {formErrors.address}
                </Text>
              )}
            </FormControl>
            {user?.deg_wallet?.deg_wallet_id && (
              <FormControl mb="35px">
                <FormLabel
                  fontSize="14px"
                  color="#a0aec0"
                  mb={1}
                >
                  Wallet ID
                </FormLabel>
                <Input
                  type="text"
                  value={`/subj****${user.deg_wallet.deg_wallet_id.slice(-4)}`}
                  isDisabled
                  border="1px solid #989898"
                  borderRadius="8px"
                  padding="8px 16px"
                  fontSize="16px"
                />
              </FormControl>
            )}
          </Box>
        </Box>

        <Flex
          justifyContent="space-between"
          padding="0.5rem 1rem"
          cursor="pointer"
          onClick={handleLogout}
          style={{
            border: `1px solid ${primaryColor}`,
            borderRadius: '8px'
          }}
          data-test="logout"
        >
          <Flex
            gap="1rem"
            alignItems="center"
          >
            <Image
              src={LogoutIcon}
              alt="nav_icon"
            />
            <Text
              fontSize="16px"
              sx={{ textWrap: 'noWrap' }}
              color="var(--ev-error)"
            >
              Logout
            </Text>
          </Flex>
        </Flex>
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
