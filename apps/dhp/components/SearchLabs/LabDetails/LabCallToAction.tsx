import React from 'react'

import { useLanguage } from '../../../hooks/useLanguage'

import { RetailItem } from '../../../lib/types/products'
import ProductPrice from '../../UI/ProductPrice'

import Button from '../../button/Button'
import { Flex, Text } from '@chakra-ui/react'
import Router from 'next/router'

interface Props {
  product: RetailItem
}
const LabCallToAction: React.FC<Props> = ({ product }) => {
  const { t } = useLanguage()

  return (
    <div className="flex flex-col items-center flex-grow sticky top-10 md:top-36 mt-8 rtl:mr-auto ltr:ml-auto xl:rtl:ml-2 px-6 py-4 sm:p-4 xl:p-6 border-2 shadow-lg border_radius_all">
      <div className="w-full  items-center ">
        <Text fontSize={'12px'} fontWeight={600} fontFamily={'Poppins'} pb={'10px'}>
          {t.priceText}
        </Text>
        <ProductPrice price={parseFloat(product.price.value)} isLargeSize={false} />
      </div>

      <br />
      <Button
        buttonText={
          <Flex justifyContent={'center'} alignItems={'center'}>
            {t.bookAppointmentText}
          </Flex>
        }
        background={'rgba(var(--color-primary))'}
        color={'rgba(var(--text-color))'}
        isDisabled={false}
        handleOnClick={() => {
          Router.push('/bookLabAppointment')
        }}
      />
    </div>
  )
}

export default LabCallToAction
