import DetailsCard from '@beckn-ui/becknified-components/src/components/checkout/details-card'
import { Typography } from '@beckn-ui/molecules'
import { CardBody, Stack } from '@chakra-ui/react'
import React from 'react'

// Custom modules
import Styles from './cart-item.module.css'
import { CartItemProps } from './cart.types'
import { testIds } from '@shared/dataTestIds'

const CartItem: React.FC<CartItemProps> = ({ id, shortDesc, providerName, sourceText, className }) => {
  return (
    <div
      className={className}
      data-test="cart-list"
    >
      <div className={Styles.prouct_details_container}>
        <a>
          <DetailsCard key={id}>
            <CardBody padding={'unset'}>
              <Stack>
                <Typography
                  fontSize="15px"
                  fontWeight={'600'}
                  text={shortDesc}
                  dataTest={testIds.envirogrowth_shortDesc}
                />

                <Typography
                  fontSize="12px"
                  fontWeight={'400'}
                  text={`Provided by ${providerName}`}
                  dataTest={testIds.envirogrowth_provider}
                />
              </Stack>
            </CardBody>
          </DetailsCard>
        </a>
      </div>
    </div>
  )
}

export default CartItem
