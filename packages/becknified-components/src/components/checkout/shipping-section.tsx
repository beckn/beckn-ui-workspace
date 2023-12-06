import React from 'react'
import { Box, Flex, Image, useDisclosure } from '@chakra-ui/react'
import DetailsCard from './details-card'
import ShippingForm from './shipping-form'
import { ShippingFormProps } from './checkout.types'
import AddShippingButtonImage from '../../../public/images/addShippingBtn.svg'

import { BottomModal, FormField, Typography } from '@beckn-ui/molecules'

export interface ShippingSectionProps<T extends FormField[]> {
  shippingForm: ShippingFormProps<T>
  sectionTitle?: string
  sectionSubtitle?: string
  formTitle?: string
}

const ShippingSection: React.FC<ShippingSectionProps<FormField[]>> = ({
  shippingForm,
  sectionSubtitle = 'Add Shipping Details',
  sectionTitle = 'Shipping',
  formTitle = 'Add Shipping Details'
}) => {
  const { isOpen, onClose, onOpen } = useDisclosure()
  return (
    <Box>
      <Flex
        pb={'10px'}
        mt={'20px'}
        justifyContent={'space-between'}
      >
        <Typography
          variant="titleRegular"
          text={sectionTitle}
        />
      </Flex>
      <DetailsCard>
        <Flex
          alignItems={'center'}
          onClick={onOpen}
        >
          <Image src={AddShippingButtonImage} />
          <Typography
            variant="subTitleRegular"
            text={sectionSubtitle}
            color="primary.100"
            style={{ paddingLeft: '10px' }}
          />
        </Flex>
        <BottomModal
          title={formTitle}
          isOpen={isOpen}
          onClose={onClose}
        >
          <ShippingForm {...shippingForm} />
        </BottomModal>
      </DetailsCard>
    </Box>
  )
}

export default ShippingSection
