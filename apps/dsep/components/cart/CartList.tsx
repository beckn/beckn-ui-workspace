import { Flex, Image, Box } from '@chakra-ui/react'
import React from 'react'
import { useSelector } from 'react-redux'
import { ICartRootState } from '../../lib/types/cart'
import { Item } from '../../lib/types/select.types'
import DetailsCard from '@beckn-ui/becknified-components/src/components/checkout/details-card'
import CartItem from './CartItem'
import addShippingBtn from '../../public/images/offer.svg'
import ScholarshipAddButton from '../scholarship/scholarshipAddButton/ScholarshipAddButton'
import { useRouter } from 'next/router'
import { useLanguage } from '../../hooks/useLanguage'
import { Typography } from '@beckn-ui/molecules'
import { testIds } from '@shared/dataTestIds'

interface CartListPropsModel {
  setIsLoadingForCartCountChange: Function
  cartItemsFromSelect: Item[]
}

const CartList: React.FC<CartListPropsModel> = ({ setIsLoadingForCartCountChange, cartItemsFromSelect }) => {
  const router = useRouter()
  const { t } = useLanguage()
  const cartItems = useSelector((state: ICartRootState) => state.cart.items)
  const scholarshipId = useSelector((state: any) => state.scholarshipCart.scholarshipId)
  const scholarshipTitle = useSelector((state: any) => state.scholarshipCart.scholarshipTitle)

  return (
    <div className="w-full xl:max-w-[2100px] mx-auto">
      {cartItems.length
        ? cartItems.map((cartItem: any) => {
            return (
              <CartItem
                setIsLoadingForCartCountChange={setIsLoadingForCartCountChange}
                key={cartItem.id}
                product={cartItem.item}
              />
            )
          })
        : null}
      <Box>
        <Box mb={'10px'}>
          <Typography
            text={t.scholarship}
            fontSize={'17px'}
          />
        </Box>
        {scholarshipId ? (
          <DetailsCard>
            <Flex alignItems={'center'}>
              <Image
                alt="shippingBtnImage"
                src={addShippingBtn}
              />

              <Box ml={'8px'}>
                <Typography
                  variant="subTextSemibold"
                  text={`${scholarshipId}-${scholarshipTitle}`}
                />
              </Box>
            </Flex>

            <Box ml={'35px'}>
              <Typography text={t.scholarshipApplied} />
            </Box>
          </DetailsCard>
        ) : (
          <ScholarshipAddButton
            image={'+'}
            text={t.checkforScholarship}
            dataTest={testIds.myScholarship_button}
            handleButtonClick={() => router.push('/myScholarship')}
          />
        )}
      </Box>
    </div>
  )
}

export default CartList
