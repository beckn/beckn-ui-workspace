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
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import style from './ShippingForm.module.css'
import crossIcon from '../../public/images/Indicator.svg'
import Button from '../button/Button'
import { DisputeFormData } from '../../pages/checkoutPage'
import { responseDataActions } from '../../store/responseData-slice'
import { FormErrors, validateDisputeForm } from '../../utilities/detailsForm-utils'
import { useLanguage } from '../../hooks/useLanguage'

export interface DisputeFormProps {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
  setFormData: Function
  formData: DisputeFormData
  formSubmitHandler: Function
  isFormValid: (isFormValid: boolean) => void
}

const DisputeForm: React.FC<DisputeFormProps> = props => {
  const dispatch = useDispatch()
  const [formErrors, setFormErrors] = useState<FormErrors>({})

  const { t } = useLanguage()

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const { name, value } = e.target
    e.target.style.height = '40px'
    e.target.style.height = e.target.scrollHeight + 'px'
    props.setFormData((prevFormData: DisputeFormData) => ({
      ...prevFormData,
      [name]: value
    }))

    const updatedFormData = {
      ...props.formData,
      [name]: value
    }

    const errors = validateDisputeForm(updatedFormData)
    setFormErrors(prevErrors => ({
      ...prevErrors,
      [name]: errors[name] || ''
    }))
  }

  const handleButtonClick = () => {
    const errors = validateDisputeForm(props.formData)
    setFormErrors(errors)
    if (Object.keys(errors).length === 0) {
      dispatch(responseDataActions.addDisputeDetails(props.formData))
      props.setFormData(props.formData)
      props.formSubmitHandler()
    } else {
      setFormErrors(errors)
    }
  }

  const isFormValid = Object.entries(props.formData)
    .filter(([key]) => key !== 'landmark')
    .every(([_, value]) => value.trim() !== '')

  useEffect(() => {
    props.isFormValid(isFormValid)
  }, [isFormValid, props.isFormValid])

  return (
    <>
      <Modal
        isCentered
        onClose={props.onClose}
        isOpen={props.isOpen}
        scrollBehavior="inside"
        motionPreset="slideInBottom"
        size="xl"
      >
        <ModalOverlay height="100vh" />
        <ModalContent
          position="fixed"
          bottom="0px"
          mb="0"
          borderRadius="1.75rem 1.75rem 0px 0px"
          maxW="lg"
          top={'100px'}
        >
          <ModalCloseButton
            height={'unset'}
            pt={'5px'}
            margin={'0 auto'}
            position={'unset'}
          >
            <Image
              src={crossIcon}
              alt="Close Icon"
            />
          </ModalCloseButton>
          <Flex
            justifyContent={'space-between'}
            alignItems={'center'}
            padding={'15px 20px'}
          >
            <Text>{t.addDisputeDetailsBtn}</Text>
          </Flex>
          <Box>
            <Divider />
          </Box>

          <ModalBody>
            <div className={style.container}>
              <div className={style.did_floating_label_content}>
                <textarea
                  className={`${style.did_floating_input} ${style.did_floating_textarea}`}
                  placeholder=" "
                  name="name"
                  value={props.formData.name}
                  onChange={handleInputChange}
                />
                <label
                  className={style.did_floating_label}
                  style={{ display: 'block', width: '100%' }}
                >
                  {t.disputeDetails}
                </label>
                {formErrors.name && <div className={style.error}>{t[`${formErrors.name}`]}</div>}
              </div>
              <div className={style.did_floating_label_content}>
                <input
                  className={style.did_floating_input}
                  type="text"
                  placeholder=" "
                  name="claimValue"
                  value={props.formData.claimValue}
                  onChange={handleInputChange}
                />
                <label className={style.did_floating_label}>{t.claimValue}</label>
                {formErrors.claimValue && <span className={style.error}>{t[`${formErrors.claimValue}`]}</span>}
              </div>
              <div className={style.did_floating_label_content}>
                <input
                  className={style.did_floating_input}
                  type="text"
                  placeholder=" "
                  name="address"
                  value={props.formData.address}
                  onChange={handleInputChange}
                />
                <label className={style.did_floating_label}>{t.formAddress}</label>
                {formErrors.address && <span className={style.error}>{t[`${formErrors.address}`]}</span>}
              </div>
            </div>
            <Box mt={'50px'}>
              <Button
                buttonText={'Save'}
                background={'rgba(var(--color-primary))'}
                color={'rgba(var(--text-color))'}
                handleOnClick={handleButtonClick}
                isDisabled={!isFormValid}
              />
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default DisputeForm
