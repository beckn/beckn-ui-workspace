import { Box, Text, Flex, Textarea } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import Button from '../components/button/Button'
import StarRating from '../components/starRating/StarRating'
import { useLanguage } from '../hooks/useLanguage'
import { MdKeyboardArrowUp, MdKeyboardArrowDown } from 'react-icons/md'

const products = ['FORCLAZ - Men Trekking Water-Rep...', 'Another Product...', 'Yet Another Product...']

const productURL =
  'http://localhost:3000/product?productDetails=ewAiAGIAcABwAF8AaQBkACIAOgAiAGIAYQB6AGEAYQByAC4AYgBlAGMAawBuAHAAcgBvAHQAbwBjAG8AbAAuAGkAbwAiACwAIgBiAHAAcABfAHUAcgBpACIAOgAiAGgAdAB0AHAAcwA6AC8ALwBiAGEAegBhAGEAcgAuAGIAZQBjAGsAbgBwAHIAbwB0AG8AYwBvAGwALgBpAG8ALwAvAGIAbwBjAC8AYgBwAHAAIgAsACIAZQB4AHQAZQBuAGQAZQBkAF8AYQB0AHQAcgBpAGIAdQB0AGUAcwAiADoAewB9ACwAIgBwAHIAaQBjAGUAIgA6AHsAIgBsAGkAcwB0AGUAZABfAHYAYQBsAHUAZQAiADoAIgAxADYAOQA5AC4AMAAiACwAIgBjAHUAcgByAGUAbgBjAHkAIgA6ACIASQBOAFIAIgAsACIAdgBhAGwAdQBlACIAOgAiADEANgA5ADkALgAwACIAfQAsACIAbQBhAHQAYwBoAGUAZAAiADoAdAByAHUAZQAsACIAaQBkACIAOgAiAC4ALwByAGUAdABhAGkAbAAuAGsAaQByAGEAbgBhAC8AaQBuAGQALgBiAGwAcgAvADIAOQA5AEAAYgBhAHoAYQBhAHIALgBiAGUAYwBrAG4AcAByAG8AdABvAGMAbwBsAC4AaQBvAC4AaQB0AGUAbQAiACwAIgBkAGUAcwBjAHIAaQBwAHQAbwByACIAOgB7ACIAaQBtAGEAZwBlAHMAIgA6AFsAIgBoAHQAdABwAHMAOgAvAC8AYgBhAHoAYQBhAHIALgBiAGUAYwBrAG4AcAByAG8AdABvAGMAbwBsAC4AaQBvAC8AYQB0AHQAYQBjAGgAbQBlAG4AdABzAC8AdgBpAGUAdwAvADIANQA4AC4AagBwAGcAIgBdACwAIgBuAGEAbQBlACIAOgAiAEEAZAB1AGwAdAAgAEgAaQBrAGkAbgBnACAAUwB1AG4AZwBsAGEAcwBzAGUAcwAgAEMAYQB0ACAAMwAgAC0AIABNAEgAMQA0ADAAIABEAGEAcgBrACAARwByAGUAeQAgAC0AIABFAEEAQwBIACIALAAiAHMAaABvAHIAdABfAGQAZQBzAGMAIgA6ACIAUAByAG8AdABlAGMAdAAgAHkAbwB1ACAAZgByAG8AbQAgAHMAdQBuACAAcgBhAHkAcwAgAGEAbgBkACAAdwBpAG4AZAAiACwAIgBsAG8AbgBnAF8AZABlAHMAYwAiADoAIgA8AGQAaQB2AD4AIAA8AHUAbAA%2BACAAPABsAGkAPgBQAG8AbABhAHIAaQBzAGUAZAAtACAAUABvAGwAYQByAGkAcwBpAG4AZwAgAGwAZQBuAHMAOgAgAHIAZQBkAHUAYwBlAHMAIAByAGUAZgBsAGUAYwB0AGkAbwBuAHMAIABmAHIAbwBtACAAYgByAGkAZwBoAHQAIABzAHUAcgBmAGEAYwBlAHMAPAAvAGwAaQA%2BACAAPABsAGkAPgBTAHUAbgAgAFAAcgBvAHQAZQBjAHQAaQBvAG4ALQAgAEMAYQB0AGUAZwBvAHIAeQAgADMAIABsAGUAbgBzACAALQAgADEAMAAwACUAIABVAFYAIABmAGkAbAB0AGUAcgA6ACAAcABlAHIAZgBlAGMAdAAgAGYAbwByACAAcwB1AG4AbgB5ACAAdwBlAGEAdABoAGUAcgAuADwALwBsAGkAPgAgADwAbABpAD4ATABpAGcAaAB0AHcAZQBpAGcAaAB0AC0AIABPAG4AbAB5ACAAMgA2ACAAZwAuADwALwBsAGkAPgAgADwAbABpAD4AUwB0AGEAYgBpAGwAaQB0AHkALQAgAFIAdQBiAGIAZQByACAAbwBuACAAdABoAGUAIAB0AGUAbQBwAGwAZQAgAHQAaQBwAHMAOgAgAHAAcgBlAHYAZQBuAHQAcwAgAHQAaABlACAAZwBsAGEAcwBzAGUAcwAgAGYAcgBvAG0AIABzAGwAaQBwAHAAaQBuAGcALgA8AC8AbABpAD4AIAA8AGwAaQA%2BAEMAbwB2AGUAcgBhAGcAZQAtAFcAcgBhAHAAYQByAG8AdQBuAGQAIABzAGgAYQBwAGUAOgAgAHAAcgBvAHQAZQBjAHQAcwAgAHkAbwB1AHIAIABlAHkAZQBzACAAZgByAG8AbQAgAHcAaQBuAGQALAAgAHMAcAByAGEAeQAgAGEAbgBkACAAaQBuAGMAbABlAG0AZQBuAHQAIAB3AGUAYQB0AGgAZQByAC4APAAvAGwAaQA%2BACAAPABsAGkAPgBSAG8AYgB1AHMAdABuAGUAcwBzAC0AIABQAG8AbAB5AGMAYQByAGIAbwBuAGEAdABlACAAZwBsAGEAcwBzAGUAcwAgAG0AYQBkAGUAIABmAHIAbwBtACAAaABpAGcAaAAgAHIAZQBzAGkAcwB0AGEAbgBjAGUAIABwAGwAYQBzAHQAaQBjAC4AIAAyAC0AeQBlAGEAcgAgAGcAdQBhAHIAYQBuAHQAZQBlAC4APAAvAGwAaQA%2BACAAPABsAGkAPgBDAG8AbQBwAGEAdABpAGIAaQBsAGkAdAB5AC0AQwBvAG0AcABhAHQAaQBiAGwAZQAgAHcAaQB0AGgAIAB0AGgAZQAgAE0ASAAgAEEAQwBDACAAMQAwADAAIABMACAAKAA0ADEANAA1ADgANwA0ACkAIABhAG4AZAAgADUAMAAwACAATAAgACgANAAxADcANAA2ADgANAApACAAcgBlAHQAYQBpAG4AZQByACAAcwB0AHIAYQBwAHMAPAAvAGwAaQA%2BACAAPAAvAHUAbAA%2BACAAPABkAGkAdgA%2BACAAPABwAD4APABiAD4AUAByAG8AZAB1AGMAdAAgAEQAZQB0AGEAaQBsAHMAPAAvAGIAPgA8AC8AcAA%2BACAAPAB1AGwAPgAgADwAbABpAD4AVwByAGEAcABhAHIAbwB1AG4AZAAgAHMAaABhAHAAZQA6ACAAcAByAG8AdABlAGMAdABzACAAeQBvAHUAcgAgAGUAeQBlAHMAIABmAHIAbwBtACAAdwBpAG4AZAAsACAAcwBwAHIAYQB5ACAAYQBuAGQAIABpAG4AYwBsAGUAbQBlAG4AdAAgAHcAZQBhAHQAaABlAHIALgA8AC8AbABpAD4AIAA8AGwAaQA%2BAFAAbwBsAGEAcgBpAHMAaQBuAGcAIABsAGUAbgBzADoAIAByAGUAZAB1AGMAZQBzACAAcgBlAGYAbABlAGMAdABpAG8AbgBzACAAZgByAG8AbQAgAGIAcgBpAGcAaAB0ACAAcwB1AHIAZgBhAGMAZQBzADwALwBsAGkAPgAgADwAbABpAD4AQwBhAHQAZQBnAG8AcgB5ACAAMwAgAGwAZQBuAHMAIAAtACAAMQAwADAAJQAgAFUAVgAgAGYAaQBsAHQAZQByADoAIABwAGUAcgBmAGUAYwB0ACAAZgBvAHIAIABzAHUAbgBuAHkAIAB3AGUAYQB0AGgAZQByAC4APAAvAGwAaQA%2BACAAPABsAGkAPgBPAG4AbAB5ACAAMgA2ACAAZwAuADwALwBsAGkAPgAgADwAbABpAD4ATABhAHIAZwBlACAAbABlAG4AcwBlAHMAIABmAG8AcgAgAHMAdQBwAGUAcgBpAG8AcgAgAHAAZQByAGkAcABoAGUAcgBhAGwAIAB2AGkAcwBpAG8AbgAuADwALwBsAGkAPgAgADwAbABpAD4AUwBwAGUAYwBpAGEAbAAgAHMAaABhAHAAZQAgAG8AZgAgAHQAaABlACAAdABlAG0AcABsAGUAcwA6ACAAaABvAGwAZABzACAAdABoAGUAIABzAHUAbgBnAGwAYQBzAHMAZQBzACAAaQBuACAAcABsAGEAYwBlAC4APAAvAGwAaQA%2BACAAPABsAGkAPgBQAG8AbAB5AGMAYQByAGIAbwBuAGEAdABlACAAZwBsAGEAcwBzAGUAcwAgAG0AYQBkAGUAIABmAHIAbwBtACAAaABpAGcAaAAgAHIAZQBzAGkAcwB0AGEAbgBjAGUAIABwAGwAYQBzAHQAaQBjAC4APAAvAGwAaQA%2BACAAPABsAGkAPgBDAG8AbQBwAGEAdABpAGIAbABlACAAdwBpAHQAaAAgAE0ASAAgAEEAQwBDACAAMQAwADAAIABMACAAKAA0ADEANAA1ADgANwA0ACkAIABhAG4AZAAgADUAMAAwACAATAAgAHIAZQB0AGUAbgB0AGkAbwBuACAAcwB0AHIAYQBwAHMAIAAoADQAMQA3ADQANgA4ADQAKQAuADwALwBsAGkAPgAgADwAbABpAD4AIABPAHUAcgAgAGcAbABhAHMAcwBlAHMAIAB3AGkAbABsACAAagBvAGkAbgAgAHkAbwB1ACAAbwBuACAAeQBvAHUAcgAgAG0AbwB1AG4AdABhAGkAbgAgAHcAYQBsAGsAcwAuACAAWQBvAHUAcgAgAGwAZQBuAHMAZQBzACAAbQBhAHkAIABzAGMAcgBhAHQAYwBoACAAbwB2AGUAcgAgAHQAaQBtAGUALgAgAFQAbwAgAGgAZQBsAHAAIAB0AG8AIAByAGUAcABhAGkAcgAgAHQAaABlAG0ALAAgAG8AdQByACAAcABvAGwAYQByAGkAcwBlAGQAIABsAGUAbgBzAGUAcwAgACgAcgBlAGYAZQByAGUAbgBjAGUAIAA4ADYANQA1ADMAOAA2ACkAIABvAHIAIABuAG8AbgAtAHAAbwBsAGEAcgBpAHMAZQBkACAAKAByAGUAZgBlAHIAZQBuAGMAZQAgADgANgA1ADUAMwA4ADIAKQAgAGEAcgBlACAAYQB2AGEAaQBsAGEAYgBsAGUAIABzAG8AIAB5AG8AdQAgAGMAYQBuACAAcgBlAHAAbABhAGMAZQAgAHQAaABlAG0AIAB5AG8AdQByAHMAZQBsAGYAIABxAHUAaQBjAGsAbAB5ACAAYQBuAGQAIABlAGEAcwBpAGwAeQAuACAATwB1AHIAIABlAG4AdgBpAHIAbwBuAG0AZQBuAHQAYQBsACAAYQBwAHAAcgBvAGEAYwBoACAAYQB0ACAAUQB1AGUAYwBoAHUAYQAgAGEAbABzAG8AIABzAHUAcABwAG8AcgB0AHMAIABtAGEAawBpAG4AZwAgAHQAaABlAHMAZQAgAHAAYQByAHQAcwAgAGEAdgBhAGkAbABhAGIAbABlACAAdABvACAAeQBvAHUALgAgAEQAbwBuACcAdAAgAHQAaAByAG8AdwAgAGEAdwBhAHkALAAgAHIAZQBwAGEAaQByACEAPAAvAGwAaQA%2BACAAPABsAGkAPgAgAFMAaQB6AGUAOgAgAE4AbwAgAFMAaQB6AGUAPAAvAGwAaQA%2BACAAPABsAGkAPgAgAEkAbQBwAG8AcgB0AGUAZAAgAEIAeQAgAEQAZQBjAGEAdABoAGwAbwBuACAAUwBwAG8AcgB0AHMAIABJAG4AZABpAGEAIAA8AC8AbABpAD4AIAA8AC8AdQBsAD4AIAA8AC8AZABpAHYAPgAiAH0ALAAiAGwAbwBjAGEAdABpAG8AbgBfAGkAZAAiADoAIgAuAC8AcgBlAHQAYQBpAGwALgBrAGkAcgBhAG4AYQAvAGkAbgBkAC4AYgBsAHIALwAzADQAQABiAGEAegBhAGEAcgAuAGIAZQBjAGsAbgBwAHIAbwB0AG8AYwBvAGwALgBpAG8ALgBwAHIAbwB2AGkAZABlAHIAXwBsAG8AYwBhAHQAaQBvAG4AIgAsACIAcgBlAGMAbwBtAG0AZQBuAGQAZQBkACIAOgB0AHIAdQBlACwAIgB0AGEAZwBzACIAOgB7ACIAQwBhAHQAZQBnAG8AcgB5ACIAOgAiAFIAZQB0AGEAaQBsAEUAbgBnAGwAaQBzAGgAIgAsACIAVAByAGUAawBrAGkAbgBnACIAOgAiAFkAIgAsACIAUwBrAGkAaQBuAGcAIgA6ACIAWQAiACwAIgBSAGEAdABpAG4AZwAiADoAIgA0AC4AMwAiACwAIgBHAGwAYQBzAHMAZQBzACIAOgAiAFkAIgAsACIAUwB1AG4AIgA6ACIAWQAiACwAIgBTAGgAYQBkAGUAcwAiADoAIgBZACIALAAiAFMAdQBuAGcAbABhAHMAcwBlAHMAIgA6ACIAWQAiAH0ALAAiAHAAcgBvAHYAaQBkAGUAcgBJAGQAIgA6ACIALgAvAHIAZQB0AGEAaQBsAC4AawBpAHIAYQBuAGEALwBpAG4AZAAuAGIAbAByAC8AMwAzAEAAYgBhAHoAYQBhAHIALgBiAGUAYwBrAG4AcAByAG8AdABvAGMAbwBsAC4AaQBvAC4AcAByAG8AdgBpAGQAZQByACIALAAiAGwAbwBjAGEAdABpAG8AbgBzACIAOgBbAHsAIgBpAGQAIgA6ACIALgAvAHIAZQB0AGEAaQBsAC4AawBpAHIAYQBuAGEALwBpAG4AZAAuAGIAbAByAC8AMwA0AEAAYgBhAHoAYQBhAHIALgBiAGUAYwBrAG4AcAByAG8AdABvAGMAbwBsAC4AaQBvAC4AcAByAG8AdgBpAGQAZQByAF8AbABvAGMAYQB0AGkAbwBuACIALAAiAGcAcABzACIAOgAiADEAMgAuADgAMQAxADEANAAwACwANwA3AC4ANgA2ADMANAAwADIAIgB9AF0ALAAiAGIAcABwAE4AYQBtAGUAIgA6ACIASABCAE8AIgB9AA%3D%3D'

const getReviewLink = (review: string) => {
  const myUrlWithParams = new URL('http://localhost:3001/review')
  const queryParameters = {
    href: productURL,
    reference: {
      hello: 'world'
    },
    attributeSetType: 'dsnp://1#OndcProofOfPurchase',
    success_url: `${productURL}&reviewSubmitted=true`,
    error_url: `${productURL}&reviewSubmitted=false`
  }

  const text = `⭐⭐⭐⭐⭐\n\n${review}`

  myUrlWithParams.searchParams.append('href', queryParameters.href)
  myUrlWithParams.searchParams.append('reference', JSON.stringify(queryParameters.reference))
  myUrlWithParams.searchParams.append('attributeSetType', queryParameters.attributeSetType)
  myUrlWithParams.searchParams.append('text', text)
  myUrlWithParams.searchParams.append('success_url', queryParameters.success_url)
  myUrlWithParams.searchParams.append('error_url', queryParameters.error_url)

  return myUrlWithParams.href
}

const Feedback = () => {
  const { t } = useLanguage()
  const router = useRouter()
  const [ratingForStore, setRatingForStore] = useState(0)
  const [selectedProduct, setSelectedProduct] = useState('')
  const [review, setReview] = useState('')
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
          onChange={e => setReview(e.target.value)}
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
          if (window) window.location.href = getReviewLink(review)
          // router.push(`/homePage`)
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
