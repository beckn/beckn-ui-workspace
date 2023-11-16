import { Flex, Text, useDisclosure, Image } from '@chakra-ui/react'
import React from 'react'
import addShippingBtn from '../../public/images/addShippingBtn.svg'
import { ShippingFormData } from '../../pages/checkoutPage'
import BillingForm from './BillingForm'

export interface AddBillingButtonProps {
  addBillingdetailsBtnText: string
  setBillingFormData: Function
  billingFormData: ShippingFormData
  billingFormSubmitHandler: Function
  imgFlag: boolean
}

const AddBillingButton: React.FC<AddBillingButtonProps> = props => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <>
      <Flex alignItems={'center'} onClick={onOpen}>
        {props.imgFlag ? <Image alt="addShippingBtnImg" src={addShippingBtn} /> : null}
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
