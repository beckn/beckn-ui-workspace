import React, { useState } from 'react'
import { Box } from '@chakra-ui/react'
import { useLanguage } from '../../hooks/useLanguage'
import style from '../detailsCard/ShippingForm.module.css'
import { FormErrors, validateJobForm } from '../../utilities/detailsForm-utils'
import { JobApplyFormData, JobApplyPropsMdoel } from './JobApply.types'

const JobApply: React.FC<JobApplyPropsMdoel> = props => {
  const { formData, setFormData } = props

  const [formErrors, setFormErrors] = useState<FormErrors>({})
  const { t } = useLanguage()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (name === 'mobileNumber' && !/^\d*$/.test(value)) {
      return
    }
    setFormData((prevFormData: JobApplyFormData) => ({
      ...prevFormData,
      [name]: value
    }))

    const updatedFormData = {
      ...formData,
      [name]: value
    }

    const errors = validateJobForm(updatedFormData) as any
    setFormErrors(prevErrors => ({
      ...prevErrors,
      [name]: errors[name] || ''
    }))
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
      </div>
    </Box>
  )
}

export default JobApply
