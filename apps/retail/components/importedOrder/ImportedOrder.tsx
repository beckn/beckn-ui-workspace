import { Box, useDisclosure, Image } from '@chakra-ui/react'
import React, { FC, useEffect } from 'react'
import { useLanguage } from '../../hooks/useLanguage'
import BottomModalScan from '@components/BottomModal/BottomModalScan'
import BecknButton from '@beckn-ui/molecules/src/components/button/Button'
import Typography from '@beckn-ui/molecules/src/components/typography/typography'
import { isEmpty } from '@utils/common-utils'
import { ImportedOrderItem } from '@lib/types'

interface ImportedOrderProps {
  updateStateImportedOrder: () => void
  showChatGtpList: (newValue: boolean) => void
  importedOrderedItem: ImportedOrderItem[]
  setImportedOrder: Function
  handleSetCategory: (value: string) => void
}

const ImportedOrder: FC<ImportedOrderProps> = ({
  updateStateImportedOrder,
  showChatGtpList,
  importedOrderedItem,
  setImportedOrder,
  handleSetCategory
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure({ defaultIsOpen: true })
  const { t, locale } = useLanguage()

  console.log('Dank', importedOrderedItem)

  const viewDetailsOnClick = () => {
    updateStateImportedOrder()
  }
  const handleShowList = () => {
    setImportedOrder(false)
    showChatGtpList(true)
  }

  useEffect(() => {
    if (!isEmpty(importedOrderedItem)) {
      handleSetCategory(
        importedOrderedItem[0].tags[0].list?.find(singleListItem => singleListItem.descriptor.name === 'category')
          ?.value!
      )
    }
  }, [])

  return (
    <>
      <BottomModalScan
        isOpen={isOpen}
        onClose={onClose}
        modalHeader={t.importedOrder}
      >
        <Box p={'0px 20px'}>
          <Box
            position={'relative'}
            width={'335px'}
            height={'142px'}
            mb={'20px'}
          >
            <Image
              width={'100%'}
              height={'100%'}
              alt="item-image"
              src={importedOrderedItem[0]?.descriptor?.images[0]?.url}
            />
          </Box>
          <Typography
            variant="subTitleRegular"
            text={t.importedOrderDetails1}
          />
          <Typography
            variant="tagSemibold"
            text={importedOrderedItem[0]?.descriptor?.name}
          />
          <Typography
            variant="subTitleRegular"
            text={t.importedOrderDetails2}
          />
          <Box
            mt={'20px'}
            fontSize={'15px'}
            cursor={'pointer'}
            color={'#f6d046'}
            textAlign={'center'}
            marginBottom={'20px'}
            onClick={viewDetailsOnClick}
          >
            {t.viewOrderDetails}
          </Box>

          <BecknButton
            children={t.yesShowmethelist}
            disabled={false}
            handleClick={handleShowList}
          />
          <BecknButton
            children={t.NoIhaveeverythingIneed}
            disabled={false}
            handleClick={() => {}}
          />
        </Box>
      </BottomModalScan>
    </>
  )
}

export default ImportedOrder
