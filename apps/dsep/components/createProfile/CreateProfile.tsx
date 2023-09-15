import React, { useState } from 'react'
import style from '../detailsCard/ShippingForm.module.css'
import Button from '../button/Button'
import { validateForm, FormErrors } from '../../utilities/detailsForm-utils'
import { useLanguage } from '../../hooks/useLanguage'
import { Box } from '@chakra-ui/react'

export interface CreateProfileProps {}

const CreateProfile: React.FC<CreateProfileProps> = () => {
  const [formData, setFormData] = useState({
    name: '',
    mobileNumber: '',
    email: '',
    address: '',
    pinCode: ''
  })

  const [formErrors, setFormErrors] = useState<FormErrors>({})
  const { t } = useLanguage()

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

  const handleButtonClick = () => {
    const errors = validateForm(formData)
    setFormErrors(errors)

    const hasErrors = Object.values(errors).some(error => !!error)

    // if (!hasErrors) {
    //   onSubmit(formData)
    // }
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
            name="address"
            value={formData.address}
            onChange={handleInputChange}
          />
          <label className={style.did_floating_label}>{t.formAddress}</label>
          {formErrors.address && <span className={style.error}>{t[`${formErrors.address}`]}</span>}
        </div>

        <div className={style.did_floating_label_content}>
          <input
            className={style.did_floating_input}
            type="text"
            placeholder=" "
            name="pinCode"
            value={formData.pinCode}
            onChange={e => {
              e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, '')
              handleInputChange(e)
            }}
          />
          <label className={style.did_floating_label}>{t.formZipCode}</label>
          {formErrors.pinCode && <span className={style.error}>{t[`${formErrors.pinCode}`]}</span>}
        </div>
      </div>
      <Button
        buttonText={t.saveShippingDetails}
        background={'rgba(var(--color-primary))'}
        color={'rgba(var(--text-color))'}
        handleOnClick={handleButtonClick}
        isDisabled={false}
      />
    </Box>
  )
}

export default CreateProfile
