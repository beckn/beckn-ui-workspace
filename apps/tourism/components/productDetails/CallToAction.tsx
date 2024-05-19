import React, { useEffect, useState } from 'react'
import { useLanguage } from '../../hooks/useLanguage'
import { useDispatch } from 'react-redux'
import { cartActions } from '../../store/cart-slice'
import { RetailItem } from '../../lib/types/products'
import { Box, useTheme, Button } from '@chakra-ui/react'

interface Props {
  product: RetailItem
}
const CallToAction: React.FC<Props> = ({ product }) => {
  const [counter, setCounter] = useState(1)
  const { t } = useLanguage()
  const theme = useTheme()
  const bgColorOfSearchIcon = theme.colors.primary['100']

  useEffect(() => {
    return () => {
      setCounter(1)
    }
  }, [product])

  const dispatch = useDispatch()

  function addToCartHandler() {
    dispatch(
      cartActions.addItemToCart({
        product: product,
        quantity: counter
      })
    )
  }
  return (
    <Box mt={5}>
      <Button
        width="335px"
        height="48px"
        onClick={addToCartHandler}
        background={bgColorOfSearchIcon}
        color={'rgba(var(--text-color))'}
        padding={'20px'}
      >
        {t.book}
      </Button>
    </Box>
  )
}

export default CallToAction
