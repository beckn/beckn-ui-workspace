import { Box, Checkbox, useDisclosure, Text, Flex, Image, Divider } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { TypeAnimation } from 'react-type-animation'
import { useLanguage } from '../../hooks/useLanguage'
import BottomModal from '../BottomModal'
import Button from '../button/Button'
import Loader from '../loader/Loader'

interface ShoppingListProps {
  shoppingListData: any[]
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
      <BottomModal
        isOpen={isOpen}
        onClose={onClose}
        modalHeader={t('shoppingList')}
      >
        {isLoadingForChatGptRequest ? (
          <Loader
            loadingText={t('catalogLoader')}
            subLoadingText={t('loaderSubText')}
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
                sequence={[t('shoppingListSubText')]}
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
                  <div key={indx}>
                    {indx <= index && (
                      <Checkbox
                        display={'flex'}
                        alignItems={'center'}
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
              <Text pr={'5px'}>{t('poweredby')}</Text>
              <Image
                alt="chat-gpt-imag"
                src="/images/chatGtp.svg"
              />
            </Flex>
            <Button
              buttonText={t('selectDeliveryLocation')}
              background={'rgba(var(--color-primary))'}
              color={'rgba(var(--text-color))'}
              isDisabled={false}
              handleOnClick={selectDeliveryLocation}
            />
            <Box
              textAlign={'center'}
              fontSize={'15px'}
              cursor={'pointer'}
              color={'rgba(var(--color-primary))'}
            >
              {t('cancel')}
            </Box>
          </Box>
        )}
      </BottomModal>
    </>
  )
}

export default ShoppingList
