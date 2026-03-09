import React, { useEffect, useState } from 'react'
import ChargingSessionCard from '../components/card/ChargingSessionCard'
import { ChargingHistoryResponse } from '@lib/types/orderHistory'
import { Loader } from '@beckn-ui/molecules'
import Cookies from 'js-cookie'
import { ORDER_CATEGORY_ID } from '@lib/config'
import { formatDate } from '@beckn-ui/common'
import EmptyScreenTemplate from '@components/EmptyTemplates/EmptyScreenTemplate'
import EmptyIcon from '@public/images/empty_cred.svg'

const OrderHistory = () => {
  const [data, setData] = useState<ChargingHistoryResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const bearerToken = Cookies.get('authToken')
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL

  useEffect(() => {
    localStorage.setItem('selectedRoute', '/orderHistory')
    const myHeaders = new Headers()
    myHeaders.append('Authorization', `Bearer ${bearerToken}`)
    const requestOptions: RequestInit = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    }
    fetch(`${strapiUrl}/unified-beckn-energy/order-history/get?filters[category]=${ORDER_CATEGORY_ID}`, requestOptions)
      .then(response => response.json())
      .then(result => {
        const parsedData: ChargingHistoryResponse = { activeSession: [], history: [] }
        result.forEach(
          (
            item: Record<string, unknown> & {
              items: Array<Record<string, unknown>>
              delivery_status?: string
              bpp_id?: string
              bpp_uri?: string
              order_id?: string
            }
          ) => {
            if (item.items.length > 0) {
              const details = item.items[0]
              if (item.delivery_status === '100') {
                parsedData.history.push({
                  bppId: item.bpp_id,
                  bppUri: item.bpp_uri,
                  id: item.order_id,
                  name: details.name,
                  type: details.type || '',
                  duration: `${details.duration ? details.duration + ' min' : ''}`,
                  cost: Number(details.price.value) * Number(details?.quantity?.selected?.measure?.value || 0),
                  date: formatDate(item.publishedAt, 'dd/MM/yyyy; hh:mm a'),
                  status: 'Completed'
                })
              } else {
                parsedData.activeSession.push({
                  bppId: item.bpp_id,
                  bppUri: item.bpp_uri,
                  id: item.order_id,
                  name: details.name,
                  type: details.type || '',
                  duration: `${details.duration ? details.duration + ' min' : ''}`,
                  cost: Number(details.price.value || 0) * Number(details?.quantity?.selected?.measure?.value || 0),
                  date: formatDate(item.publishedAt, 'dd/MM/yyyy; hh:mm a'),
                  status: 'In Progress'
                })
              }
            }
          }
        )
        setData(parsedData)
        setIsLoading(false)
        if (result.error) {
          return setError(result.error.message)
        }
      })
      .catch(() => {
        setIsLoading(false)
      })
      .finally(() => setIsLoading(false))
  }, [])

  if (isLoading) {
    return (
      <div className="grid h-[calc(100vh-340px)] content-center">
        <Loader />
      </div>
    )
  }

  if (error || (data?.activeSession.length === 0 && data?.history.length === 0)) {
    return (
      <EmptyScreenTemplate
        text={'No Chargers to show'}
        description="No chargers are shown in your history. Book one to see it here!"
        src={EmptyIcon}
      />
    )
  }

  return (
    <div className="hideScroll max-h-[calc(100vh-100px)] overflow-y-auto w-full md:w-[70%] lg:w-[62%] mx-auto p-2.5 min-h-[calc(100vh-12rem)]">
      {data?.activeSession && data?.activeSession.length > 0 && (
        <>
          <p className="text-base font-semibold mb-4">Active Session</p>
          {data.activeSession.map(session => (
            <ChargingSessionCard
              key={session.id}
              session={session}
            />
          ))}
        </>
      )}

      {data?.history && data.history.length > 0 && (
        <>
          <p className="text-base font-semibold mt-8 mb-4">History</p>
          {data.history.map(session => (
            <ChargingSessionCard
              key={session.id}
              session={session}
            />
          ))}
        </>
      )}
    </div>
  )
}

export default OrderHistory
