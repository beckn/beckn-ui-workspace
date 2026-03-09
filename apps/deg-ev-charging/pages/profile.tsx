import { useLanguage } from '@hooks/useLanguage'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { testIds } from '@shared/dataTestIds'
import LogoutIcon from '@public/images/logout_icon.svg'
import Image from 'next/image'
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
  const primaryColor = 'var(--ev-primary)'
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
      <div className="w-full max-w-[28rem] mx-auto px-4 py-8 flex justify-center items-center min-h-[200px]">
        <div
          className="w-10 h-10 border-4 border-gray-200 border-t-[var(--ev-primary)] rounded-full animate-spin"
          aria-hidden
        />
      </div>
    )
  }

  const inputBaseClass =
    'border rounded-lg px-4 py-2 text-base w-full box-border disabled:opacity-70 disabled:cursor-not-allowed'
  const inputErrorClass = 'border-[#a71b4a] focus:border-[#a71b4a]'
  const labelClass = 'text-sm text-[#a0aec0] mb-1 block'

  return (
    <div className="hideScroll ev-profile-page w-full max-w-[28rem] mx-auto px-6 sm:px-8 py-8 sm:py-10 max-h-[calc(100vh-100px)] overflow-y-auto p-5">
      <div
        className="flex flex-col gap-6"
        data-test={testIds.profile_form}
      >
        <div className="w-full flex justify-between items-center mb-4">
          <p className="font-semibold text-base text-[var(--ev-text)]">Personal Information</p>
        </div>
        <div className="mt-2.5">
          <div className="mb-9">
            <label className={labelClass}>{t.name}</label>
            <input
              data-test={testIds.profile_inputName}
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              onBlur={updateProfile}
              disabled={!profileEditable}
              className={`${inputBaseClass} ${formErrors.name ? inputErrorClass : ''}`}
              style={{
                borderColor: formErrors.name ? '#a71b4a' : '#989898',
                borderWidth: '1px'
              }}
            />
            {formErrors.name && <p className="text-xs text-[#a71b4a] mt-1">{formErrors.name}</p>}
          </div>
          <div className="mb-9">
            <label className={labelClass}>{t.formNumber}</label>
            <input
              type="text"
              name="mobileNumber"
              value={formData.mobileNumber ?? ''}
              onChange={handleInputChange}
              onBlur={updateProfile}
              disabled
              className={inputBaseClass}
              style={{ borderColor: '#989898', borderWidth: '1px' }}
            />
            {formErrors.mobileNumber && <p className="text-xs text-[#a71b4a] mt-1">{formErrors.mobileNumber}</p>}
          </div>
          <div className="mb-9">
            <label className={labelClass}>{t.enterEmailID}</label>
            <input
              type="text"
              name="email"
              value={formData.email ?? ''}
              onChange={handleInputChange}
              disabled
              className={inputBaseClass}
              style={{ borderColor: '#989898', borderWidth: '1px' }}
            />
            {formErrors.email && <p className="text-xs text-[#a71b4a] mt-1">{formErrors.email}</p>}
          </div>
          <div className="mb-9">
            <label className={labelClass}>{t.formAddress}</label>
            <input
              data-test={testIds.profile_address}
              type="text"
              name="address"
              value={formData.address ?? ''}
              onChange={handleInputChange}
              onBlur={updateProfile}
              disabled={!profileEditable}
              className={`${inputBaseClass} ${formErrors.address ? inputErrorClass : ''}`}
              style={{
                borderColor: formErrors.address ? '#a71b4a' : '#989898',
                borderWidth: '1px'
              }}
            />
            {formErrors.address && <p className="text-xs text-[#a71b4a] mt-1">{formErrors.address}</p>}
          </div>
          {user?.deg_wallet?.deg_wallet_id && (
            <div className="mb-9">
              <label className={labelClass}>Wallet ID</label>
              <input
                type="text"
                value={`/subj****${user.deg_wallet.deg_wallet_id.slice(-4)}`}
                disabled
                className={inputBaseClass}
                style={{ borderColor: '#989898', borderWidth: '1px' }}
              />
            </div>
          )}
        </div>

        <button
          type="button"
          className="flex justify-between items-center py-2 px-4 cursor-pointer rounded-lg border border-[var(--ev-primary)] transition-colors hover:opacity-90"
          onClick={handleLogout}
          data-test="logout"
        >
          <div className="flex gap-4 items-center">
            <Image
              src={LogoutIcon}
              alt="nav_icon"
              width={24}
              height={24}
            />
            <span className="text-base whitespace-nowrap text-[var(--ev-error)]">Logout</span>
          </div>
        </button>
      </div>
      <OpenWalletBottomModal
        modalType={modalType}
        setModalType={handleModalOpen}
        onClose={handleModalClose}
      />
    </div>
  )
}

export default ProfilePage
