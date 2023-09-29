import React, { useState } from 'react'
import style from '../detailsCard/ShippingForm.module.css'
import Button from '../button/Button'
import { validateForm, FormErrors } from '../../utilities/createProfileForm-utils'
import { useLanguage } from '../../hooks/useLanguage'
import { Box, Grid, Text } from '@chakra-ui/react'
import { useToast } from '@chakra-ui/react'
import { UserData } from './createProfile.types'
import { useRouter } from 'next/router'

export interface CreateProfileProps {
  createProfileSubmitHandler: Function
}

const CreateProfile: React.FC<CreateProfileProps> = props => {
  const [formData, setFormData] = useState<UserData>({
    name: '',
    mobileNumber: '',
    email: '',
    dob: '',
    gender: ''
  })
  const toast = useToast()
  const router = useRouter()

  const [formErrors, setFormErrors] = useState<FormErrors>({})
  const { t } = useLanguage()
  const [selectedGender, setSelectedGender] = useState<string>('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (name === 'mobileNumber' && !/^\d*$/.test(value)) {
      return
    }
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleGenderSelection = (gender: string) => {
    setSelectedGender(gender)
    setFormData(prevData => ({
      ...prevData,
      gender: gender
    }))
  }

  const handleAccountCreate = () => {
    const errors = validateForm(formData)
    setFormErrors(errors)
    const hasErrors = Object.values(errors).some(error => !!error)

    if (!formData.gender) {
      toast({
        title: 'Error',
        description: 'Please select a gender',
        status: 'error',
        position: 'top',
        duration: 3000,
        isClosable: true
      })
    }
    if (!hasErrors) {
      return props.createProfileSubmitHandler(formData)
    }
  }
  const handleSkipClick = () => {
    router.push('/homePage')
  }

  return (
    <Box>
      <div className={style.container}>
        <div className={style.did_floating_label_content}>
          <input
            className={style.did_floating_input}
            type="text"
            placeholder=" "
            name="name"
            value={formData.name}
            onChange={handleInputChange}
          />
          <label className={style.did_floating_label}>{t.formName}</label>
          {formErrors.name && <div className={style.error}>{t[`${formErrors.name}`]}</div>}
        </div>
        <div className={style.did_floating_label_content}>
          <input
            className={style.did_floating_input}
            type="text"
            placeholder=" "
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleInputChange}
          />
          <label className={style.did_floating_label}>{t.formNumber}</label>
          {formErrors.mobileNumber && <span className={style.error}>{t[`${formErrors.mobileNumber}`]}</span>}
        </div>
        <div className={style.did_floating_label_content}>
          <input
            className={style.did_floating_input}
            type="text"
            placeholder=" "
            name="email"
            value={formData.email}
            onChange={handleInputChange}
          />
          <label className={style.did_floating_label}>{t.formEmail}</label>
          {formErrors.email && <span className={style.error}>{t[`${formErrors.email}`]}</span>}
        </div>
        <div className={style.did_floating_label_content}>
          <input
            className={style.did_floating_input}
            type="text"
            placeholder=" "
            name="dob"
            value={formData.dob}
            onChange={handleInputChange}
          />
          <label className={style.did_floating_label}>{t.formDOB}</label>
          {formErrors.dob && <span className={style.error}>{t[`${formErrors.dob}`]}</span>}
        </div>
        <Box mb={'20px'}>
          <Text fontFamily={'Poppins'} fontSize={'15px'} fontWeight={400} mb={3}>
            {t.formSelectGender}
          </Text>
          <Grid templateColumns={'repeat(2, 1fr)'} columnGap="10px">
            <Button
              buttonText={'Male'}
              handleOnClick={() => handleGenderSelection('Male')}
              background={selectedGender === 'Male' ? 'rgba(var(--color-primary))' : 'transparent'}
              color={selectedGender === 'Male' ? 'rgba(var(--text-color))' : 'rgba(var(--color-primary))'}
              isDisabled={false}
            />

            <Button
              buttonText={'Female'}
              handleOnClick={() => handleGenderSelection('Female')}
              background={selectedGender === 'Female' ? 'rgba(var(--color-primary))' : 'transparent'}
              color={selectedGender === 'Female' ? 'rgba(var(--text-color))' : 'rgba(var(--color-primary))'}
              isDisabled={false}
            />

            <Button
              buttonText={'Other'}
              handleOnClick={() => handleGenderSelection('Other')}
              background={selectedGender === 'Other' ? 'rgba(var(--color-primary))' : 'transparent'}
              color={selectedGender === 'Other' ? 'rgba(var(--text-color))' : 'rgba(var(--color-primary))'}
              isDisabled={false}
            />
          </Grid>
          {/* {formErrors.gender && (
            <span className={style.error}>{t[`${formErrors.gender}`]}</span>
          )} */}
        </Box>
      </div>
      <Button
        buttonText={t.createAccount}
        background={'rgba(var(--color-primary))'}
        color={'rgba(var(--text-color))'}
        handleOnClick={handleAccountCreate}
        isDisabled={false}
      />
      <Button
        buttonText={'Skip'}
        background={'transparent'}
        color={'rgba(var(--color-primary))'}
        handleOnClick={handleSkipClick}
        isDisabled={false}
      />
    </Box>
  )
}

export default CreateProfile
