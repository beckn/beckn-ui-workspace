import { CurrencyType } from '@beckn-ui/becknified-components'
import { InitResponseModel, StatusResponseModel } from '@beckn-ui/common'

export const getPaymentBreakDown = (
  initData: InitResponseModel[] | StatusResponseModel[],
  frequency?: number | Record<string, any>
) => {
  const selectedCount = Number(initData?.[0]?.message?.order?.items?.[0]?.quantity?.selected?.measure?.value) || 1
  const domain = initData?.[0]?.context?.domain
  const quote = initData?.[0]?.message?.order?.quote
  const breakUp = quote?.breakup
  const totalPricewithCurrent = {
    value:
      domain === 'deg:rental'
        ? getSubTotalAndDeliveryCharges(initData, selectedCount || 1).subTotal.toFixed(2)
        : getSubTotalAndDeliveryCharges(initData, frequency || 1).subTotal.toFixed(2),
    currency: getSubTotalAndDeliveryCharges(initData, frequency || 1).currencySymbol!
  }

  const breakUpMap: Record<string, any> = {}

  breakUp?.forEach(item => {
    const {
      title,
      price: { currency, value }
    } = item

    let quantity = 1
    if (typeof frequency !== 'number') {
      quantity = frequency?.[item.item?.id!]?.quantity || 1
    } else {
      quantity = frequency
    }
    console.log(Number(value), quantity)
    breakUpMap[title] = {
      currency: currency,
      value:
        domain === 'deg:rental'
          ? ((breakUpMap[title]?.value || 0) + Number(value) * selectedCount).toFixed(2)
          : ((breakUpMap[title]?.value || 0) + Number(value) * quantity).toFixed(2)
    }
  })

  return { breakUpMap, totalPricewithCurrent }
}

export const getSubTotalAndDeliveryCharges = (
  initData: InitResponseModel[] | StatusResponseModel[],
  frequency?: number | Record<string, any>
) => {
  console.log('frequency', frequency)
  let totalPriceWithCurrency: { value: number; currency: CurrencyType } = { value: 0, currency: 'INR' }
  let subTotal: number = 0
  let currencySymbol

  if (initData && initData.length > 0) {
    initData.forEach(data => {
      totalPriceWithCurrency = {
        value: totalPriceWithCurrency.value + Number(data.message.order.quote.price?.value) || 0,
        currency: data.message.order.quote.price?.currency || 'INR'
      }
      if (data.message.order.quote.breakup) {
        data.message.order.quote.breakup.forEach(breakup => {
          let quantity = 1
          if (typeof frequency !== 'number') {
            quantity = frequency?.[breakup.item?.id!]?.quantity || 1
          } else {
            quantity = frequency
          }
          const itemPrice = Number(breakup.price.value) || 0
          subTotal += itemPrice * quantity
        })
        currencySymbol = data.message.order.quote.breakup[0]?.price.currency
      }
    })
  }
  console.log('Final subtotal:', subTotal)
  const paymentBreakup = {
    subTotal: subTotal ? subTotal : totalPriceWithCurrency.value,
    currencySymbol: subTotal ? currencySymbol : totalPriceWithCurrency.currency
  }
  return paymentBreakup
}
