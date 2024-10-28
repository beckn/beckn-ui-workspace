import { Box, Checkbox, useDisclosure, Flex, Image } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { TypeAnimation } from 'react-type-animation'
import { useLanguage } from '../../hooks/useLanguage'
import LoaderWithMessage from '@components/loader/LoaderWithMessage'
import BecknButton from '@beckn-ui/molecules/src/components/button/Button'
import BottomModalScan from '@components/BottomModal/BottomModalScan'
import Typography from '@beckn-ui/molecules/src/components/typography/typography'
import { ImportOrderShoppingList } from '@beckn-ui/common/lib/types'
import { testIds } from '@shared/dataTestIds'

interface ShoppingListProps {
  shoppingListData: ImportOrderShoppingList
  selectDeliveryLocationText: (newValue: boolean) => void
  isLoadingForChatGptRequest: boolean
  setSelectedValues: Function
  selectedValues: string[]
}

const shoppingData = [
  'sunglasses',
  'bottle',
  'sunglasses',
  'bottle',
  'sunglasses',
  'bottle',
  'sunglasses',
  'bottle',
  'sunglasses',
  'bottle'
]

const ShoppingList: React.FC<ShoppingListProps> = ({
  shoppingListData,
  selectDeliveryLocationText,
  isLoadingForChatGptRequest,
  setSelectedValues,
  selectedValues
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure({ defaultIsOpen: true })
  const [index, setIndex] = useState(0)
  const { t, locale } = useLanguage()
  const selectDeliveryLocation = () => {
    selectDeliveryLocationText(false)
  }

  useEffect(() => {
    if (!isLoadingForChatGptRequest) {
      const interval = setInterval(() => {
        setIndex(prevIndex => {
          if (prevIndex < shoppingData.length - 1) {
            return prevIndex + 1
          } else {
            clearInterval(interval) // Stop the animation when all checkboxes are displayed
            return prevIndex
          }
        })
      }, 1000) // Change the interval duration as needed
    }
  }, [isLoadingForChatGptRequest])

  const handleCheckboxChange = (item: string) => {
    if (selectedValues.includes(item)) {
      setSelectedValues((prevSelectedValues: string[]) => prevSelectedValues.filter(value => value !== item))
    } else {
      setSelectedValues((prevSelectedValues: string[]) => [...prevSelectedValues, item])
    }
  }

  return (
    <>
      <BottomModalScan
        isOpen={isOpen}
        onClose={onClose}
        modalHeader={t.shoppingList}
      >
        {isLoadingForChatGptRequest ? (
          <LoaderWithMessage
            loadingText={t.catalogLoader}
            loadingSubText={t.loaderSubText}
          />
        ) : (
          <Box
            m={'20px'}
            mt={'unset'}
            mb={'unset'}
          >
            <Box
              fontSize={'15px'}
              pb={'10px'}
            >
              <TypeAnimation
                cursor={false}
                sequence={[t.shoppingListSubText]}
              />
            </Box>
            <Box
              fontSize={'12px'}
              p={'10px'}
              border={'1px solid #E2E2E2'}
              borderRadius="2px"
              mb={'20px'}
              maxH={'292px'}
              overflow={'auto'}
            >
              {shoppingListData.map((item, indx) => {
                return (
                  <div
                    key={indx}
                    data-test={testIds.homepage_shoppingListItem}
                  >
                    {indx <= index && (
                      <Checkbox
                        display={'flex'}
                        alignItems={'center'}
                        data-test={testIds.chat_gpt_list}
                        pb={'10px'}
                        checked={selectedValues.includes(item)}
                        onChange={() => handleCheckboxChange(item)}
                      >
                        <TypeAnimation
                          cursor={false}
                          sequence={[item]}
                        />
                      </Checkbox>
                    )}
                  </div>
                )
              })}
            </Box>
            <Flex
              fontSize={'10px'}
              justifyContent={'center'}
              alignItems={'center'}
              pb={'20px'}
            >
              <Typography
                variant="subTitleRegular"
                text={t.poweredby}
              />
              <Image
                alt="chat-gpt-imag"
                src="/images/chatGpt.svg"
              />
            </Flex>
            <BecknButton
              children={t.selectDeliveryLocation}
              data-test={testIds.chat_gpt_button}
              handleClick={selectDeliveryLocation}
              disabled={false}
            />
            <Box
              textAlign={'center'}
              fontSize={'15px'}
              cursor={'pointer'}
              color={'#f6d046'}
              onClick={onClose}
            >
              {t.cancel}
            </Box>
          </Box>
        )}
      </BottomModalScan>
    </>
  )
}

export default ShoppingList
