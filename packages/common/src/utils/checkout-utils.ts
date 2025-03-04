import { areObjectPropertiesEqual } from './general'
import { CurrencyType, ShippingFormInitialValuesType } from '@beckn-ui/becknified-components'
import { CartRetailItem, InitResponseModel, StatusResponseModel } from '../../lib/types'

export const extractAddressComponents = (result: google.maps.GeocoderResult) => {
  let country = 'IN',
    state = 'Karnataka',
    city = 'Bengaluru'

  for (const component of result.address_components) {
    if (component.types.includes('country')) {
      country = component.short_name
    } else if (component.types.includes('administrative_area_level_1')) {
      state = component.long_name
    } else if (component.types.includes('locality')) {
      city = component.long_name
    }
  }
  return { country, state, city }
}

export const geocodeFromPincode = async (pincode: string) => {
  const geocoder = new window.google.maps.Geocoder()
  try {
    const response = await geocoder.geocode({ address: pincode })
    console.log('respnse from the map', response)
    if (response.results.length > 0) {
      const { country, state, city } = extractAddressComponents(
        response.results[1] ? response.results[1] : response.results[0]
      )
      const lat = response.results[1]
        ? response.results[1].geometry.location.lat()
        : response.results[0].geometry.location.lat()
      const lng = response.results[1]
        ? response.results[1].geometry.location.lng()
        : response.results[0].geometry.location.lng()
      return { country, state, city, lat, lng }
    } else {
      console.log('No results found')
      return { country: '', state: '', city: '' }
    }
  } catch (error) {
    console.error(error)
    return { country: '', state: '', city: '' }
  }
}

export const getPaymentBreakDown = (
  initData: InitResponseModel[] | StatusResponseModel[],
  frequency?: number | Record<string, any>
) => {
  const quote = initData[0].message.order.quote
  const breakUp = quote.breakup
  const totalPricewithCurrent = {
    value: getSubTotalAndDeliveryCharges(initData, frequency || 1).subTotal.toString(),
    currency: getSubTotalAndDeliveryCharges(initData, frequency || 1).currencySymbol!
  }

  const breakUpMap: Record<string, any> = {}

  breakUp.forEach(item => {
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

    breakUpMap[title] = {
      currency: currency,
      value: Number(value) * quantity
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

export const getTotalCartItems = (cartItems: CartRetailItem[]) => {
  let quantity = 0

  cartItems.forEach(item => {
    quantity += Number(item.quantity)
  })

  return quantity
}

export const areShippingAndBillingDetailsSame = (
  isBillingAddressComplete: boolean,
  formData: ShippingFormInitialValuesType,
  billingFormData: ShippingFormInitialValuesType
) => {
  if (isBillingAddressComplete) {
    return areObjectPropertiesEqual(formData, billingFormData)
  }
  return !isBillingAddressComplete
}

export const getOrderDetailsPaymentBreakDown = (statusData: StatusResponseModel[]) => {
  console.log('statusData', statusData)
  const quote = statusData[0]?.message?.order.quote // Ensure safe access
  if (!quote) return { breakUpMap: {}, totalPricewithCurrent: { value: '0', currency: 'INR' } }

  const breakUp = quote.breakup || []
  const totalPricewithCurrent: any = {
    value: quote.price?.value || '0',
    currency: quote.price?.currency || 'INR'
  }

  const breakUpMap: Record<string, { currency: string; value: string }> = {}

  breakUp.forEach(item => {
    const {
      title,
      price: { currency, value }
    } = item

    breakUpMap[title] = { currency, value }
  })

  return { breakUpMap, totalPricewithCurrent }
}
