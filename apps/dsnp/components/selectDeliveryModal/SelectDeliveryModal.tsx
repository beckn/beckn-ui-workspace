import { Box, Radio, RadioGroup, Stack, Text, useDisclosure } from '@chakra-ui/react'
import React from 'react'
import { useLanguage } from '../../hooks/useLanguage'
import BottomModal from '../BottomModal'
import Button from '../button/Button'
import { useRouter } from 'next/router'

interface SelectDeliveryModalProps {
  addressOfTheEndLocation: string
  selectedValues: string[]
}

const SelectDeliveryModal: React.FC<SelectDeliveryModalProps> = props => {
  const router = useRouter()
  const { isOpen, onOpen, onClose } = useDisclosure({ defaultIsOpen: true })
  const { t } = useLanguage()
  return (
    <BottomModal isOpen={isOpen} onClose={onClose} modalHeader={t('selectdelivery')}>
      <Box p={'20px'} pt={'unset'} pb={'unset'}>
        <Text fontSize={'15px'}> {t('selectdeliveryText')}</Text>
        <RadioGroup defaultValue="2" pt={'20px'} pb={'20px'}>
          <Stack spacing={4}>
            <Radio
              _checked={{
                bg: '#F37A20',
                color: '#F37A20'
              }}
              size="md"
              value="1"
            >
              <span style={{ fontSize: '15px' }}>{props.addressOfTheEndLocation}</span>
            </Radio>
            {/* TODO :- will have to check for the behaviour here */}
            {/* <Radio
                            _checked={{
                                bg: '#F37A20',
                                color: '#F37A20',
                            }}
                            size="md"
                            value="2"
                        >
                            <span style={{ fontSize: '15px' }}>
                                Orchad Greens, Log Huts Area Rd, Old Manali,
                                Manali, Himachal Pradesh 175131
                            </span>
                        </Radio> */}
          </Stack>
        </RadioGroup>
        <Button
          buttonText={t('searchItems')}
          background={'rgba(var(--color-primary))'}
          color={'rgba(var(--text-color))'}
          isDisabled={false}
          handleOnClick={() => {
            const selectedItems = props.selectedValues.join(',').replace(',', ' ')
            router.push(`/search?searchTerm=${selectedItems}`)
          }}
        />
        <Box textAlign={'center'} fontSize={'15px'} cursor={'pointer'} color={'rgba(var(--color-primary))'}>
          {t('cancel')}
        </Box>
      </Box>
    </BottomModal>
  )
}

export default SelectDeliveryModal
