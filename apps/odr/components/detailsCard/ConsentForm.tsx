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
  Box,
  Checkbox
} from '@chakra-ui/react'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import style from './ShippingForm.module.css'
import crossIcon from '../../public/images/Indicator.svg'
import Button from '../button/Button'
import { ConsentFormData } from '../../pages/checkoutPage'
import { responseDataActions } from '../../store/responseData-slice'
import { FormErrors, validateConsentForm } from '../../utilities/detailsForm-utils'
import { useLanguage } from '../../hooks/useLanguage'

export interface ConsentFormProps {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
  setFormData: Function
  formData: ConsentFormData
  formSubmitHandler: Function
}

const ConsentForm: React.FC<ConsentFormProps> = props => {
  const dispatch = useDispatch()
  const [formErrors, setFormErrors] = useState<FormErrors>({})
  const [isDeclarationChecked, setIsDeclarationChecked] = useState(false)

  const { t } = useLanguage()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    props.setFormData((prevFormData: ConsentFormData) => ({
      ...prevFormData,
      [name]: value
    }))

    const updatedFormData = {
      ...props.formData,
      [name]: value
    }

    const errors = validateConsentForm(updatedFormData)
    setFormErrors(prevErrors => ({
      ...prevErrors,
      [name]: errors[name] || ''
    }))
  }

  const handleButtonClick = () => {
    const errors = validateConsentForm(props.formData)
    setFormErrors(errors)
    if (Object.keys(errors).length === 0) {
      dispatch(responseDataActions.addConsentDetails(props.formData))
      props.setFormData(props.formData)
      props.formSubmitHandler()
    } else {
      setFormErrors(errors)
    }
  }

  const isFormValid = Object.entries(props.formData)
    .filter(([key]) => key !== 'landmark')
    .every(([_, value]) => value.trim() !== '')

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
            <Text>{t.consentForm}</Text>
          </Flex>
          <Box>
            <Divider />
          </Box>
          <ModalBody>
            <Flex
              flexDir={'column'}
              rowGap={'5px'}
            >
              <Text
                fontSize={'15px'}
                fontWeight={600}
              >
                Term and Conditions
              </Text>
              <Text>
                <span style={{ fontSize: '15px', fontWeight: 600 }}>I, [Complainant’s Full Legal Name],</span> confirm
                that I’ve read and understand the terms of representation by{' '}
                <span style={{ fontSize: '15px', fontWeight: 600 }}>[Service Provider Name].</span> I agree to be
                represented in the described legal matter and acknowledge the fee structure, billing terms, and
                potential costs.I understand the attorney-client privilege and agree to communicate promptly and
                honestly. I’m aware of the conditions for terminating the relationship and its consequences.
              </Text>
            </Flex>

            <div className={style.container}>
              <div className={style.did_floating_label_content}>
                <input
                  className={style.did_floating_input}
                  type="text"
                  placeholder=" "
                  name="name"
                  value={props.formData.name}
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
                  name="address"
                  value={props.formData.address}
                  onChange={handleInputChange}
                />
                <label className={style.did_floating_label}>{t.formAddress}</label>
                {formErrors.address && <span className={style.error}>{t[`${formErrors.address}`]}</span>}
              </div>
              <Flex
                alignItems={'center'}
                pb="30px"
                textAlign={'center'}
              >
                {/* <input
                  onChange={() => setIsDeclarationChecked(prevValue => !prevValue)}
                  type="checkbox"
                  style={{
                    position: 'relative',
                    top: '2px',
                    width: '20px',
                    height: '20px',
                    backgroundColor: isDeclarationChecked ? '#8D353A' : 'transparent'
                  }}
                /> */}
                <Checkbox
                  colorScheme="red"
                  onChange={() => setIsDeclarationChecked(prevValue => !prevValue)}
                />
                <Text
                  fontSize={'15px'}
                  fontWeight={400}
                  pl="10px"
                >
                  {t.declarationText}
                </Text>
              </Flex>
            </div>
            <Button
              buttonText={'Confirm'}
              background={'rgba(var(--color-primary))'}
              color={'rgba(var(--text-color))'}
              handleOnClick={handleButtonClick}
              isDisabled={!isDeclarationChecked}
            />
            <Button
              buttonText={'Cancle'}
              background={'transparent'}
              color={'rgba(var(--color-primary))'}
              handleOnClick={() => props.onClose}
              isDisabled={!isFormValid}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default ConsentForm
