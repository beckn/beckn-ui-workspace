import { Flex, Image, Text, useDisclosure } from '@chakra-ui/react'
import React from 'react'
import { DisputeFormData, ShippingFormData } from '../../pages/checkoutPage'
import addShippingBtn from '../../public/images/addBtn.svg'
import DisputeForm from './DisputeForm'

export interface AddDisputeButtonProps {
  addShippingdetailsBtnText: string
  setFormData: Function
  formData: DisputeFormData
  formSubmitHandler: Function
  imgFlag: boolean
}

const AddDisputeButton: React.FC<AddDisputeButtonProps> = props => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <>
      <Flex
        alignItems={'center'}
        onClick={onOpen}
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
