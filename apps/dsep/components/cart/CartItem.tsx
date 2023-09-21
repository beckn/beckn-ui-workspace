import { Box, Image, Text, Flex } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { HiMinusSm, HiOutlinePlusSm, HiOutlineTrash } from 'react-icons/hi'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { useLanguage } from '../../hooks/useLanguage'
import useRequest from '../../hooks/useRequest'
import { CartItemForRequest, DataPerBpp, ICartRootState, TransactionIdRootState } from '../../lib/types/cart'
import { RetailItem } from '../../lib/types/products'
import { cartActions } from '../../store/cart-slice'
import { getCartItemsPerBpp, getPayloadForQuoteRequest } from '../../utilities/cart-utils'
import AddBillingButton from '../detailsCard/AddBillingButton'
import DetailsCard from '../detailsCard/DetailsCard'
import ScholarshipAddButton from '../scholarship/scholarshipAddButton/ScholarshipAddButton'
import ProductPrice from '../UI/ProductPrice'
import addShippingBtn from '../../public/images/offer.svg'

interface Props {
  product: RetailItem
  setIsLoadingForCartCountChange: Function
}
const CartItem: React.FC<Props> = ({ product, setIsLoadingForCartCountChange }) => {
  const quoteRequest = useRequest()
  const cartItems = useSelector((state: ICartRootState) => state.cart.items)
  const transactionId = useSelector((state: { transactionId: TransactionIdRootState }) => state.transactionId)
  const cartItemsPerBppPerProvider: DataPerBpp = getCartItemsPerBpp(cartItems as CartItemForRequest[])
  const payLoadForQuoteRequest = getPayloadForQuoteRequest(cartItemsPerBppPerProvider, transactionId)
  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  const scholarshipId = useSelector((state: any) => state.scholarshipCart.scholarshipId)
  const scholarshipTitle = useSelector((state: any) => state.scholarshipCart.scholarshipTitle)

  const productQuantity = useSelector(
    (state: ICartRootState) => state.cart.items.find(item => item.id === product.id)?.quantity
  )
  const [counter, setCounter] = useState(productQuantity)
  const dispatch = useDispatch()
  const { t } = useLanguage()
  const router = useRouter()

  const fetchQuotes = () => {
    setIsLoadingForCartCountChange(true)
    quoteRequest
      .fetchData(`${apiUrl}/client/v2/get_quote`, 'POST', payLoadForQuoteRequest)
      .then(data => setIsLoadingForCartCountChange(false))
      .catch(e => console.error(e))
  }

  function increment(product: RetailItem) {
    setCounter(prev => ++prev!)
    dispatch(cartActions.addItemToCart({ product: product, quantity: 1 }))
    fetchQuotes()
  }

  function decrement(slug: string) {
    setCounter(prev => --prev!)
    dispatch(cartActions.removeItemFromCart(slug))
    fetchQuotes()
  }

  function onInputNumberChangeHandler(e: React.ChangeEvent<HTMLInputElement>) {
    if (+e.currentTarget.value >= 1 && +e.currentTarget.value <= 10) {
      setCounter(+e.currentTarget.value)
    }
  }

  return (
    <>
      <div className="flex items-center flex-wrap sm:my-4 sm:py-4 px-2 border-b-2 mb-4">
        <div style={{ width: '100%' }} className="lg:w-1/2 sm:min-w-[290px]">
          {/* <Link
          href={`/${product.category[0]}/${product.category[1]}/${product.category[2]}/${product.slug.current}`}
        > */}
          <a
            className="flex flex-wrap sm:flex-nowrap justify-center items-center flex-grow"
            style={{
              position: 'relative'
            }}
          >
            <div
              style={{
                width: '107px',
                height: '107px',
                marginBottom: '5px',
                position: 'relative'
              }}
            >
              <Image src={product.descriptor.images[0]} alt={product.descriptor.name} className="object-contain" />
            </div>
            {counter === 1 ? (
              <div
                onClick={() => decrement(product.id)}
                className="p-1"
                style={{
                  position: 'absolute',
                  top: '0',
                  right: '0'
                }}
              >
                <HiOutlineTrash style={{ fontSize: '1.3rem', color: 'black' }} />
              </div>
            ) : (
              <div
                onClick={() => decrement(product.id)}
                className="p-1"
                style={{
                  position: 'absolute',
                  top: '0',
                  right: '0'
                }}
              >
                <HiMinusSm style={{ fontSize: '1rem' }} />
              </div>
            )}

            <div
              className="flex-grow text-sm font-normal mb-2 sm:mb-0 mx-2 w-full text-center pt-1"
              style={{ direction: 'ltr', fontSize: '17px' }}
            >
              {product.descriptor.name}
            </div>
          </a>
          {/* </Link> */}
        </div>
        <div className="flex flex-wrap flex-grow md:items-center mb-4 sm:mb-0">
          <div
            className="flex flex-grow items-center justify-center font-normal rtl:mr-1 lrt:ml-1"
            style={{ fontSize: '15px' }}
          >
            <p style={{ marginRight: '10px' }}>{t.totalAmount}</p>

            <ProductPrice price={parseFloat(product.price.value) * counter!} isLargeSize />
          </div>
        </div>
      </div>
      <Box>
        <Text mb="10px" fontSize={'17px'}>
          {t.scholarship}
        </Text>
        {scholarshipId ? (
          <DetailsCard>
            <Flex alignItems={'center'}>
              <Image alt="shippingBtnImage" src={addShippingBtn} />
              <Text ml={'8px'}>
                <span style={{ fontWeight: 'bold' }}>
                  ‘{scholarshipId}-{scholarshipTitle}’
                </span>
              </Text>
            </Flex>
            <Text ml={'35px'}>{t.scholarshipApplied}</Text>
          </DetailsCard>
        ) : (
          <ScholarshipAddButton
            image={'+'}
            text={t.checkforScholarship}
            handleButtonClick={() => router.push('/myScholarship')}
          />
        )}
      </Box>
    </>
  )
}

export default CartItem
