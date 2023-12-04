import { Flex, Image, Text, useDisclosure } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { DisputeFormData, ShippingFormData } from '../../pages/checkoutPage'
import addShippingBtn from '../../public/images/addBtn.svg'
import DisputeForm from './DisputeForm'

export interface AddDisputeButtonProps {
  addShippingdetailsBtnText: string
  setFormData: Function
  formData: DisputeFormData
  formSubmitHandler: Function
  imgFlag: boolean
  isDisabled: boolean
  checkFormValidity: (isFormValid: boolean) => void
}

const AddDisputeButton: React.FC<AddDisputeButtonProps> = props => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [isFormValid, setIsFormValid] = useState<boolean>(false)
  // passed up the value of isFormValid state to the parent component checkoutPage by passing the state in the checkFormValidity function received as prop

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
        pointerEvents={props.isDisabled ? 'none' : 'auto'}
        opacity={props.isDisabled ? 0.5 : 1}
      >
        {/* eslint-disable-next-line jsx-a11y/alt-text */}
        {props.imgFlag ? <Image src={addShippingBtn} /> : null}
        <Text
          fontSize={'15px'}
          color={'rgba(var(--color-primary))'}
          pl={'10px'}
        >
          {props.addShippingdetailsBtnText}
        </Text>
      </Flex>
      <DisputeForm
        isFormFilled={handleFormValidity}
        formData={props.formData}
        setFormData={props.setFormData}
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        formSubmitHandler={props.formSubmitHandler}
      />
    </>
  )
}

export default AddDisputeButton
