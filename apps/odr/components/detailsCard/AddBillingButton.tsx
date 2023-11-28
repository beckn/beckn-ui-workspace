import { Flex, Text, useDisclosure, Image } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import addShippingBtn from '../../public/images/addBtn.svg'
import { ShippingFormData } from '../../pages/checkoutPage'
import BillingForm from './BillingForm'

export interface AddBillingButtonProps {
  addBillingdetailsBtnText: string
  setBillingFormData: Function
  billingFormData: ShippingFormData
  billingFormSubmitHandler: Function
  imgFlag: boolean
  checkFormValidity: (isFormValid: boolean) => void
}

const AddBillingButton: React.FC<AddBillingButtonProps> = props => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [isFormValid, setIsFormValid] = useState<boolean>(false)

  const handleFormValidity = (newFormValidity: boolean) => {
    setIsFormValid(newFormValidity)
  }
  useEffect(() => {
    props.checkFormValidity(isFormValid)
  }, [isFormValid])

  return (
    <>
      <Flex
        alignItems={'center'}
        onClick={onOpen}
      >
        {props.imgFlag ? (
          <Image
            alt="addShippingBtnImg"
            src={addShippingBtn}
          />
        ) : null}
        <Text
          fontSize={'15px'}
          color={'rgba(var(--color-primary))'}
          pl={'10px'}
        >
          {props.addBillingdetailsBtnText}
        </Text>
      </Flex>
      <BillingForm
        isFormValid={handleFormValidity}
        billingFormData={props.billingFormData}
        setBillingFormData={props.setBillingFormData}
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        formSubmitHandler={props.billingFormSubmitHandler}
      />
    </>
  )
}

export default AddBillingButton
