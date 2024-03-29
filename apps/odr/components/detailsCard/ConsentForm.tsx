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
import React, { useEffect, useState } from 'react'
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
  providerName?: string
}

const ConsentForm: React.FC<ConsentFormProps> = props => {
  const dispatch = useDispatch()
  const [formErrors, setFormErrors] = useState<FormErrors>({})
  const [isDeclarationChecked, setIsDeclarationChecked] = useState(false)
  const [providerName, setProviderName] = useState('')
  const [complainantName, setComplainantName] = useState('')

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

  useEffect(() => {
    if (localStorage && typeof window !== 'undefined') {
      setProviderName(JSON.parse(localStorage.getItem('providerName') as string))
    }
  }, [])
  useEffect(() => {
    if (localStorage && localStorage.getItem('billingAddress') && typeof window !== 'undefined') {
      const billingAddress = JSON.parse(localStorage.getItem('billingAddress') as string)
      setComplainantName(billingAddress.name)
    }
  }, [])

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
    .filter(([key]) => key !== 'checkbox')
    .every(([_, value]) => value.trim() !== '')

  const handleCancel = () => {
    props.onClose()
  }
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
                {t.termAndCondition}
              </Text>
              <Text>
                <span style={{ fontSize: '15px', fontWeight: 600 }}>
                  {t.i}, {complainantName},
                </span>
                {t.confirmThat}
                <span style={{ fontSize: '15px', fontWeight: 600 }}> {props.providerName} </span> {t.consentPara}
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
              buttonText={t.confirm}
              background={'rgba(var(--color-primary))'}
              color={'rgba(var(--text-color))'}
              handleOnClick={handleButtonClick}
              isDisabled={!isFormValid}
            />
            <Button
              buttonText={t.cancel}
              background={'transparent'}
              color={'rgba(var(--color-primary))'}
              handleOnClick={handleCancel}
              isDisabled={false}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default ConsentForm
