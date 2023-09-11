import { Flex, Text, useDisclosure } from '@chakra-ui/react'
import React from 'react'
import { ShippingFormData } from '../../pages/checkoutPage'
import BillingForm from './BillingForm'

export interface AddBillingButtonProps {
  addBillingdetailsBtnText: string
  setBillingFormData: Function
  billingFormData: ShippingFormData
  billingFormSubmitHandler: Function
}

const AddBillingButton: React.FC<AddBillingButtonProps> = props => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <>
      <Flex alignItems={'center'} onClick={onOpen}>
        <Text fontSize={'15px'} color={'rgba(var(--color-primary))'} pl={'10px'}>
          {props.addBillingdetailsBtnText}
        </Text>
      </Flex>
      <BillingForm
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
