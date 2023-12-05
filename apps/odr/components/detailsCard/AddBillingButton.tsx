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

  // passed down as isFormFilled prop to the child component BillingForm to get the value as a boolean if the form is filled or not.
  const handleFormValidity = (isFilled: boolean) => {
    setIsFormValid(isFilled)
  }

  // passed up the value of isFormValid state to the parent component checkoutPage by passing the state in the checkFormValidity function received as prop
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
        isFormFilled={handleFormValidity}
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
