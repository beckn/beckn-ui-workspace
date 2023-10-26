import { Box, Divider, Flex, useDisclosure, Text, Image } from '@chakra-ui/react'
import React, { FC, useState } from 'react'
import { useLanguage } from '../../hooks/useLanguage'
import BottomModal from '../BottomModal'
import Button from '../button/Button'

interface ImportedOrderProps {
  updateStateImportedOrder: () => void
  showChatGtpList: (newValue: boolean) => void
  importedOrderedItem: any
  setImportedOrder: Function
}

const ImportedOrder: FC<ImportedOrderProps> = ({
  updateStateImportedOrder,
  showChatGtpList,
  importedOrderedItem,
  setImportedOrder
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure({ defaultIsOpen: true })
  const { t, locale } = useLanguage()

  const viewDetailsOnClick = () => {
    updateStateImportedOrder()
  }
  const handleShowList = () => {
    setImportedOrder(false)
    showChatGtpList(true)
  }

  return (
    <>
      <BottomModal isOpen={isOpen} onClose={onClose} modalHeader={t('importedOrder')}>
        <Box p={'0px 20px'}>
          <Box position={'relative'} width={'335px'} height={'142px'}>
            <Image width={'100%'} height={'100%'} alt="item-image" src={importedOrderedItem[0].descriptor.images[0]} />
          </Box>
          <Text pt={'20px'} pb={'25px'} fontSize={'15px'}>
            {t('importedOrderDetails1', {
              itemName: importedOrderedItem[0].descriptor.name
            })}
          </Text>
          <Text fontSize={'15px'} pb={'20px'}>
            {t('importedOrderDetails2')}
          </Text>
          <Box
            fontSize={'15px'}
            cursor={'pointer'}
            color={'rgba(var(--color-primary))'}
            textAlign={'center'}
            marginBottom={'20px'}
            onClick={viewDetailsOnClick}
          >
            {t('viewOrderDetails')}
          </Box>
          <Button
            buttonText={t('yesShowmethelist')}
            background={'rgba(var(--color-primary))'}
            color={'rgba(var(--text-color))'}
            isDisabled={false}
            handleOnClick={handleShowList}
          ></Button>
          <Button
            buttonText={t('NoIhaveeverythingIneed')}
            background={'rgba(var(--text-color))'}
            color={'rgba(var(--color-primary))'}
            isDisabled={false}
          ></Button>
        </Box>
      </BottomModal>
    </>
  )
}

export default ImportedOrder
