import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Box, Flex, Text, useDisclosure, Image } from '@chakra-ui/react'
import { BottomModal, Form, Typography } from '@beckn-ui/molecules'
import DetailsCard from './details-card'
import ItemDetails from './checkout-item-details'
import ShippingSection from './shipping-section'
import { CartItemForRequest, DataPerBpp, ICartRootState, TransactionIdRootState } from '../../lib/types/cart'

import { useRouter } from 'next/router'

export type ShippingFormData = {
  name: string
  mobileNumber: string
  email: string
  address: string
  zipCode: string
}

const CheckoutPage = () => {
  const [formData, setFormData] = useState<ShippingFormData>({
    name: 'Antoine Dubois',
    mobileNumber: '0612345678',
    email: 'antoine.dubois@gmail.com',
    address: '15 Rue du Soleil, Paris, France',
    zipCode: '75001'
  })

  const [billingFormData, setBillingFormData] = useState<ShippingFormData>({
    name: 'Antoine Dubois',
    mobileNumber: '0612345678',
    email: 'antoine.dubois@gmail.com',
    address: '15 Rue du Soleil, Paris, France',
    zipCode: '75001'
  })

  // const initRequest = useRequest()
  const cartItems = useSelector((state: ICartRootState) => state.cart.items)

  useEffect(() => {
    if (localStorage) {
      if (localStorage.getItem('userPhone')) {
        const copiedFormData = structuredClone(formData)
        const copiedBillingFormData = structuredClone(billingFormData)

        copiedFormData.mobileNumber = localStorage.getItem('userPhone') as string
        copiedBillingFormData.mobileNumber = localStorage.getItem('userPhone') as string

        setFormData(copiedFormData)
        setBillingFormData(copiedBillingFormData)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (localStorage.getItem('shippingAdress')) {
        setFormData(JSON.parse(localStorage.getItem('shippingAdress') as string))
      }
      if (localStorage.getItem('billingAddress')) {
        setBillingFormData(JSON.parse(localStorage.getItem('billingAddress') as string))
      }
    }
  }, [])

  return (
    <>
      {/* start Item Details */}
      <Box>
        <Box pb={'10px'}>
          <Text fontSize={'17px'}>Items</Text>
        </Box>

        <DetailsCard>
          {cartItems.map(item => {
            return (
              <>
                <ItemDetails
                  title={item.descriptor.name}
                  description={item.descriptor.short_desc}
                  quantity={item.quantity}
                  price={`$${item.totalPrice}`}
                />
              </>
            )
          })}
        </DetailsCard>
        {/* <ShippingSection shippingForm={{onSubmit}} /> */}
      </Box>
    </>
  )
}
export default CheckoutPage
