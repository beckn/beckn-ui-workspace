import React, { useState } from 'react'
import style from '../../detailsCard/ShippingForm.module.css'
import { Box } from '@chakra-ui/react'
import { useLanguage } from '../../../hooks/useLanguage'
import { ScholarshipApplyFormDataModel } from '../scholarshipCard/Scholarship.types'
import { FormErrors, validateForm } from '../../../utilities/detailsForm-utils'

export interface CreateProfileProps {
  formData: ScholarshipApplyFormDataModel
  setFormData: React.Dispatch<React.SetStateAction<ScholarshipApplyFormDataModel>>
}

const ScholarshipAddDetails: React.FC<CreateProfileProps> = ({ formData, setFormData }) => {
  const [formErrors, setFormErrors] = useState<FormErrors>({})
  const { t } = useLanguage()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (name === 'mobileNumber' && !/^\d*$/.test(value)) {
      return
    }
    setFormData((prevFormData: ScholarshipApplyFormDataModel) => ({
      ...prevFormData,
      [name]: value
    }))

    const updatedFormData: any = {
      ...formData,
      [name]: value
    }

    const errors = validateForm(updatedFormData) as any
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
            placeholder=" "
            name="scholarshipInfo"
            value={formData.scholarshipInfo}
            onChange={handleInputChange}
          />
          <label className={style.did_floating_label}>{t.aboutScholarship}</label>
          {/* {formErrors.email && <span className={style.error}>{t[`${formErrors.email}`]}</span>} */}
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
    </Box>
  )
}

export default ScholarshipAddDetails
