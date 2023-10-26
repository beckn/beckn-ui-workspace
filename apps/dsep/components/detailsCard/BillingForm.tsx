import {
  Flex,
  Modal,
  ModalBody,
  Text,
  ModalContent,
  Image,
  ModalOverlay,
  Divider,
  ModalCloseButton,
  Box
} from '@chakra-ui/react'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import style from './ShippingForm.module.css'
import crossIcon from '../../public/images/Indicator.svg'
import Button from '../button/Button'
import { ShippingFormData } from '../../pages/checkoutPage'
import { responseDataActions } from '../../store/responseData-slice'
import { validateForm, FormErrors } from '../../utilities/detailsForm-utils'
import { useLanguage } from '../../hooks/useLanguage'

export interface ShippingFormProps {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
  setBillingFormData: Function
  billingFormData: ShippingFormData
  formSubmitHandler: Function
}
const nameRegex = /^[A-Za-z\s]*$/
const mobNumberRegex = /^\d*$/
const BillingForm: React.FC<ShippingFormProps> = props => {
  const dispatch = useDispatch()
  const [formErrors, setFormErrors] = useState<FormErrors>({})

  const { t } = useLanguage()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (name === 'name' && !nameRegex.test(value)) {
      return
    }
    if (name === 'mobileNumber' && !mobNumberRegex.test(value)) {
      return
    }
    props.setBillingFormData((prevFormData: ShippingFormData) => ({
      ...prevFormData,
      [name]: value
    }))

    const updatedFormData = {
      ...props.billingFormData,
      [name]: value
    }

    const errors = validateForm(updatedFormData)
    setFormErrors(prevErrors => ({
      ...prevErrors,
      [name]: errors[name] || ''
    }))
  }

  const handleButtonClick = () => {
    const errors = validateForm(props.billingFormData)
    setFormErrors(errors)
    if (Object.keys(errors).length === 0) {
      dispatch(responseDataActions.addCustomerDetails(props.billingFormData))
      props.setBillingFormData(props.billingFormData)
      props.formSubmitHandler()
    } else {
      setFormErrors(errors)
    }
  }

  const isFormValid = Object.entries(props.billingFormData)
    .filter(([key]) => key !== 'landmark')
    .every(([_, value]) => value.trim() !== '')

  return (
    <>
      <Modal
        isCentered
        onClose={props.onClose}
        isOpen={props.isOpen}
        scrollBehavior="outside"
        motionPreset="slideInBottom"
      >
        <ModalOverlay height="100vh" />
        <ModalContent position="fixed" bottom="0px" mb="0" borderRadius="1.75rem 1.75rem 0px 0px" maxW="lg">
          <ModalCloseButton height={'unset'} pt={'5px'} margin={'0 auto'} position={'unset'}>
            <Image src={crossIcon} alt="Close Icon" />
          </ModalCloseButton>
          <Flex justifyContent={'space-between'} alignItems={'center'} padding={'15px 20px'}>
            <Text>{t.addBillingDetails}</Text>
          </Flex>
          <Box>
            <Divider />
          </Box>

          <ModalBody>
            <div className={style.container}>
              <div className={style.did_floating_label_content}>
                <input
                  className={style.did_floating_input}
                  type="text"
                  placeholder=" "
                  name="name"
                  value={props.billingFormData.name}
                  onChange={handleInputChange}
                />
                <label className={style.did_floating_label}>{t.formName}</label>
                {formErrors.name && <div className={style.error}>{t[`${formErrors.name}`]}</div>}
              </div>
              <div className={style.did_floating_label_content}>
                <input
                  className={style.did_floating_input}
                  type="number"
                  placeholder=" "
                  name="mobileNumber"
                  value={props.billingFormData.mobileNumber}
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
                  value={props.billingFormData.email}
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
                  value={props.billingFormData.address}
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
                  value={props.billingFormData.pinCode}
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
              buttonText={t.saveBillingDetails}
              background={'rgba(var(--color-primary))'}
              color={'rgba(var(--text-color))'}
              handleOnClick={handleButtonClick}
              isDisabled={!isFormValid}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default BillingForm
