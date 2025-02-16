import { ConfirmResponseModel } from '@beckn-ui/common'
import { ItemMetaData } from '@components/credLayoutRenderer/ItemRenderer'
import { useDecodeStreamMutation } from '@services/walletService'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

export default function OrderDetails() {
  const [orderDetails, setOrderDetails] = useState<ConfirmResponseModel[]>()

  const router = useRouter()
  const [decodeStream, { isLoading }] = useDecodeStreamMutation()
  const getDecodedStreamData = async (data: ItemMetaData) => {
    const decodedRes: any = await decodeStream({ subjectId: data.data.did })
    console.log('Decoded:', decodedRes)
    setOrderDetails(decodedRes.data)
  }

  useEffect(() => {
    if (router?.query?.data) {
      const data: ItemMetaData = JSON.parse(router?.query?.data as string)
      console.log('Data:', data)
      getDecodedStreamData(data)
    }
  }, [])

  return <div>OrderDetails</div>
}
