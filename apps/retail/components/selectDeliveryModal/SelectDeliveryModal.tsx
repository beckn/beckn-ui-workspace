import { Box, Radio, RadioGroup, Stack, Text, useDisclosure } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useLanguage } from '../../hooks/useLanguage'
import { useRouter } from 'next/router'
import BecknButton from '@beckn-ui/molecules/src/components/button/Button'
import BottomModalScan from '@components/BottomModal/BottomModalScan'
import Typography from '@beckn-ui/molecules/src/components/typography/typography'

interface SelectDeliveryModalProps {
  backOnImportedOrder: (newValue: boolean) => void
  importedOrderObject: any
  addressOfTheEndLocation: string
  selectedValues: string[]
  category?: string
}

const convertTourismCategoryToRetail = (category: string) => {
  switch (category) {
    case 'TourismEnglish':
      return 'RetailEnglish'
    case 'TourismFrench':
      return 'RetailFrench'
    default:
      return 'Retail'
  }
}

const SelectDeliveryModal: React.FC<SelectDeliveryModalProps> = props => {
  const router = useRouter()
  const { isOpen, onOpen, onClose } = useDisclosure({ defaultIsOpen: true })
  const { t } = useLanguage()

  const travelerAddress = props.importedOrderObject.billing.address

  const { category = 'Tourism' } = props

  return (
    <BottomModalScan
      isOpen={isOpen}
      onClose={onClose}
      modalHeader={t.selectdelivery}
    >
      <Box
        p={'20px'}
        pt={'unset'}
        pb={'unset'}
      >
        <Typography
          variant="subTitleRegular"
          text={t.selectdeliveryText}
        />
        <RadioGroup
          defaultValue="2"
          pt={'20px'}
          pb={'20px'}
        >
          <Stack spacing={4}>
            <Radio
              _checked={{
                bg: '#f6d046',
                color: '#f6d046'
              }}
              size="md"
              value="1"
            >
              <span style={{ fontSize: '15px' }}>{props.addressOfTheEndLocation}</span>
            </Radio>
            <Radio
              _checked={{
                bg: '#f6d046',
                color: '#f6d046'
              }}
              size="md"
              value="2"
            >
              <Box style={{ fontSize: '15px' }}>
                <Typography
                  variant="subTitleRegular"
                  text={travelerAddress}
                />
              </Box>
            </Radio>
          </Stack>
        </RadioGroup>
        <BecknButton
          children={t.searchItems}
          handleClick={() => {
            const selectedItems = props.selectedValues.join(',').replace(',', ' ')
            router.push(`/search?searchTerm=${selectedItems}&category=${convertTourismCategoryToRetail(category)}`)
          }}
          disabled={false}
        />
        <Box
          textAlign={'center'}
          fontSize={'15px'}
          cursor={'pointer'}
          color={'#f6d046'}
          onClick={() => router.back()}
        >
          {t.cancel}
        </Box>
      </Box>
    </BottomModalScan>
  )
}

export default SelectDeliveryModal
