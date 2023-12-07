import React from 'react'
import { Box, Flex, Image, useDisclosure } from '@chakra-ui/react'
import DetailsCard from './details-card'
import ShippingForm from './shipping-form'
import { ShippingFormProps, ShippingSectionProps, ShippingFormInitialValuesType } from './checkout.types'
import AddShippingButtonImage from '../../../public/images/addShippingBtn.svg'

import { BottomModal, FormField, Typography, FormData } from '@beckn-ui/molecules'

import ShippingDetails from './shipping-details'

const ShippingSection: React.FC<ShippingSectionProps<FormField[]>> = ({
  shippingForm,
  sectionSubtitle = 'Add Shipping Details',
  sectionTitle = 'Shipping',
  formTitle = 'Add Shipping Details',
  triggerFormTitle = 'change',
  showDetails = false,
  isBilling = false,
  shippingDetails
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
        {(showDetails || isBilling) && (
          <Typography
            variant="subTitleRegular"
            color="primary.100"
            text={triggerFormTitle}
            onClick={onOpen}
          />
        )}
      </Flex>
      {!showDetails ? (
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
        </DetailsCard>
      ) : (
        <ShippingDetails {...shippingDetails} />
      )}

      <BottomModal
        title={formTitle}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ShippingForm {...shippingForm} />
      </BottomModal>
    </Box>
  )
}

export default ShippingSection
