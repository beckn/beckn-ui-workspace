import React from 'react'
import Image from 'next/image'
import { ChargingSession } from '@lib/types/orderHistory'
import ActiveIcon from '@public/images/active_charging.svg'
import CompletedIcon from '@public/images/completed_charging.svg'
import { currencyMap } from '@lib/config'
import { getCountryCode } from '@utils/general'
import { useRouter } from 'next/router'

interface ChargingSessionCardProps {
  session: ChargingSession
}

const ChargingSessionCard = ({ session }: ChargingSessionCardProps) => {
  const router = useRouter()

  return (
    <div
      className="bg-white rounded-xl p-3 shadow-md mb-4 border border-gray-100 cursor-pointer transition-shadow hover:shadow-lg w-full"
      onClick={() => {
        if (session.id) {
          const orderObjectForStatusCall = {
            bppId: session.bppId,
            bppUri: session.bppUri,
            orderId: session.id
          }
          localStorage.setItem('selectedOrder', JSON.stringify(orderObjectForStatusCall))
          router.push('/orderDetails')
        }
      }}
      onKeyDown={e => {
        if (e.key === 'Enter' && session.id) {
          const orderObjectForStatusCall = {
            bppId: session.bppId,
            bppUri: session.bppUri,
            orderId: session.id
          }
          localStorage.setItem('selectedOrder', JSON.stringify(orderObjectForStatusCall))
          router.push('/orderDetails')
        }
      }}
      role="button"
      tabIndex={0}
    >
      <div className="flex justify-between items-start gap-3 flex-wrap">
        <div className="relative w-[70px] h-[70px] shrink-0">
          <Image
            src={session.status === 'In Progress' ? ActiveIcon : CompletedIcon}
            alt="charging_icon"
            fill
            className="object-contain"
          />
        </div>
        <div className="flex-1 min-w-0 w-full md:w-1/2">
          <div className="flex justify-between items-start mb-2 gap-2">
            <p className="text-sm font-normal text-[var(--ev-text)] line-clamp-2 flex-1 min-w-0">{session.name}</p>
            <span
              className={`shrink-0 px-1.5 py-1 rounded text-[10px] font-normal whitespace-nowrap ${
                session.status === 'In Progress' ? 'bg-[#FFF9CC] text-[#807000]' : 'bg-[#D2F9EA] text-[#11704C]'
              }`}
            >
              {session.status}
            </span>
          </div>
          {session.type && session.type !== '' && (
            <div className="flex justify-between mb-2 text-[var(--ev-text-muted)] text-sm">
              <span>Type</span>
              <span>{session.type}</span>
            </div>
          )}
          {session.duration && session.duration !== '' && (
            <div className="flex justify-between mb-2 text-[#858383] text-sm">
              <span>Duration</span>
              <span>{session.duration}</span>
            </div>
          )}
          <div className="flex justify-between mb-2 text-[#858383] text-sm">
            <span>Cost</span>
            <span>
              {currencyMap[getCountryCode().country.code as keyof typeof currencyMap]}
              {Number(session.cost).toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-[#858383] text-sm">
            <span>Date</span>
            <span>{session.date}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChargingSessionCard
