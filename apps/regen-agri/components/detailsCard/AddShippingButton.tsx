import { Flex, Image, Text, useDisclosure } from '@chakra-ui/react'
import React from 'react'
import { ShippingFormData } from '../../pages/checkoutPage'
import addShippingBtn from '../../public/images/addShippingBtn.svg'
import ShippingForm from './ShippingForm'

export interface AddShippingButtonProps {
    addShippingdetailsBtnText: string
    setFormData: Function
    formData: ShippingFormData
    formSubmitHandler: Function
    imgFlag: boolean
}

const AddShippingButton: React.FC<AddShippingButtonProps> = (props) => {
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
            <ShippingForm
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

export default AddShippingButton
