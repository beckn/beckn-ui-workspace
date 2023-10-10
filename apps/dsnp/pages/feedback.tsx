import { Box, Text, Flex, Textarea } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import Button from '../components/button/Button'
import StarRating from '../components/starRating/StarRating'
import { useLanguage } from '../hooks/useLanguage'
import { MdKeyboardArrowUp, MdKeyboardArrowDown } from 'react-icons/md'

const products = ['FORCLAZ - Men Trekking Water-Rep...', 'Another Product...', 'Yet Another Product...']
const Feedback = () => {
  const { t } = useLanguage()
  const router = useRouter()
  const [ratingForStore, setRatingForStore] = useState(0)
  const [selectedProduct, setSelectedProduct] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [product, setProduct] = useState(products)
  const toggleDropDown = () => {
    setIsOpen(!isOpen)
  }

  const handleProductSelect = (userSelectProduct: string) => {
    console.log(userSelectProduct)
    setSelectedProduct(userSelectProduct)
    setProduct([
      userSelectProduct,
      ...(() => {
        return product.filter(item => item !== userSelectProduct)
      })()
    ])
    setIsOpen(false)
  }

  return (
    <>
      <Box pt={'12px'} pb={'15px'}>
        <Text fontSize={'15px'} fontWeight={400}>
          {t('selectProduct')}
          <div
            style={{
              width: '332px',
              height: isOpen ? 'auto' : '40px',
              border: '1px solid #ccc',
              overflow: 'hidden',
              position: 'relative',
              boxShadow: '0px 2px 4px -2px rgba(0, 0, 0, 0.10), 0px 4px 6px -1px rgba(0, 0, 0, 0.10)',
              borderRadius: '8px',
              marginTop: '10px'
            }}
          >
            <button
              style={{
                position: 'absolute',
                top: isOpen ? '7px' : '7px',
                right: '7px',
                cursor: 'pointer'
              }}
              onClick={toggleDropDown}
            >
              {isOpen ? <MdKeyboardArrowDown size={26} /> : <MdKeyboardArrowUp size={26} />}
            </button>
            <Flex style={{ padding: '9px', fontSize: '14px', fontWeight: 400 }} flexDir={'column'} gap={2}>
              {product.map((product, index) => (
                <Box key={index} onClick={() => handleProductSelect(product)}>
                  {product}
                </Box>
              ))}
            </Flex>
          </div>
        </Text>
      </Box>

      <StarRating
        ratingText={t('ratetheproduct')}
        rating={ratingForStore}
        setRating={setRatingForStore}
        count={5}
        size={20}
        transition={''}
      />
      <Box mb={9}>
        <Text fontSize={'15px'} fontWeight={400} mb={'10px'}>
          {t('addCommentsHere')}
        </Text>
        <Textarea
          fontSize={'12px'}
          fontWeight={400}
          height={'124px'}
          resize={'none'}
          mb={'20px'}
          placeholder={t('writeExperience')}
          boxShadow={'0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -2px rgba(0, 0, 0, 0.1)'}
        />
      </Box>
      <Button
        buttonText={t('submitReview')}
        background={'rgba(var(--color-primary))'}
        color={'rgba(var(--text-color))'}
        handleOnClick={() => {
          const user = localStorage.getItem('userPhone') as string
          localStorage.clear()
          localStorage.setItem('userPhone', user)
          router.push(`/homePage`)
        }}
        isDisabled={false}
      />
      <Button
        buttonText={t('goBack')}
        background={'rgba(var(--text-color))'}
        color={'rgba(var(--color-primary))'}
        handleOnClick={() => {
          const user = localStorage.getItem('userPhone') as string
          localStorage.clear()
          localStorage.setItem('userPhone', user)
          router.push(`/homePage`)
        }}
        isDisabled={false}
      />
    </>
  )
}

export default Feedback
