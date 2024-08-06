import React, { useState } from 'react'
import { Box, Flex, Image, useDisclosure, Checkbox } from '@chakra-ui/react'
import DetailsCard from './details-card'
import useResponsive from '../../hooks/useResponsive'
import ShippingForm from './shipping-form'
import { PlusSquareIcon } from '@chakra-ui/icons'
import { ShippingSectionProps } from './checkout.types'
import AddShippingButtonImage from '../../../public/images/addShippingBtn.svg'

import { BottomModal, FormField, Typography, FormData, Input } from '@beckn-ui/molecules'

import ShippingDetails from './shipping-details'

const ShippingSection: React.FC<ShippingSectionProps<FormField[]>> = ({
  shippingForm,
  sectionSubtitle = 'Add Shipping Details',
  sectionTitle = 'Shipping',
  formTitle = 'Add Shipping Details',
  triggerFormTitle = 'change',
  sameAsTitle = 'Same as Shipping Details',
  showDetails = false,
  isBilling = false,
  shippingDetails,
  addButtonImage = AddShippingButtonImage,
  isChecked = true,
  isDisabled = false,
  onCheckChange,
  color,
  dataTest,
  dataTestChangeFormText = 'changeFormDetails',
  dataTestCheckbox = 'checkbox',
  dataTestOpenForm = 'open-form'
}) => {
  const { isOpen, onClose, onOpen } = useDisclosure()
  // const [isChecked, setIsChecked] = useState<boolean>(true)
  const { isDesktop, isTablet } = useResponsive()

  return (
    <Box data-test={dataTest}>
      <Flex
        pb={'10px'}
        justifyContent={'space-between'}
      >
        <Typography
          variant="titleRegular"
          text={sectionTitle}
        />
        {((isBilling && !isChecked) || (!isBilling && showDetails)) && (
          <Typography
            variant="subTitleRegular"
            color={color}
            dataTest={dataTestChangeFormText}
            text={triggerFormTitle}
            onClick={onOpen}
            style={{ cursor: 'pointer' }}
          />
        )}
      </Flex>
      {isBilling && isChecked ? (
        <DetailsCard>
          <Checkbox
            iconColor="secondary.100"
            colorScheme="primary"
            pr={'12px'}
            fontSize={'17px'}
            data-test={dataTestCheckbox}
            checked={isChecked}
            defaultChecked={isChecked}
            onChange={() => onCheckChange && onCheckChange()}
          >
            {sameAsTitle}
          </Checkbox>
        </DetailsCard>
      ) : !showDetails ? (
        <DetailsCard isDisabled={isDisabled}>
          <Flex
            alignItems={'center'}
            data-test={dataTestOpenForm}
            onClick={onOpen}
          >
            {/* <Image src={addButtonImage} /> */}
            <PlusSquareIcon color={color} />
            <Typography
              variant="subTitleRegular"
              text={sectionSubtitle}
              color={color}
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
        responsive={isTablet || isDesktop}
      >
        <ShippingForm {...shippingForm} />
      </BottomModal>
    </Box>
  )
}

export default ShippingSection
