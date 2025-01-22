import { areObjectPropertiesEqual } from './general'
import { ShippingFormInitialValuesType } from '@beckn-ui/becknified-components'
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

export const getPaymentBreakDown = (initData: InitResponseModel[] | StatusResponseModel[]) => {
  const quote = initData[0].message.order.quote
  const breakUp = quote.breakup
  const totalPricewithCurrent = {
    currency: quote.price.currency,
    value: quote.price.value
  }

  const breakUpMap: Record<string, any> = {}

  breakUp.forEach(item => {
    const {
      title,
      price: { currency, value }
    } = item

    breakUpMap[title] = {
      currency: currency,
      value: value
    }
  })

  return { breakUpMap, totalPricewithCurrent }
}

export const getSubTotalAndDeliveryCharges = (initData: InitResponseModel[]) => {
  let subTotal: number = 0
  let currencySymbol

  if (initData && initData.length > 0) {
    initData.forEach(data => {
      subTotal =
        subTotal + Number(parseFloat((Number(data.message.order.quote.price.value) || 0).toString()).toFixed(2))

      currencySymbol = data.message.order.quote.price.currency
    })
  }

  return { subTotal, currencySymbol }
}

export const getTotalCartItems = (cartItems: CartRetailItem[]) => {
  let quantity = 0

  cartItems.forEach(item => {
    quantity += item.quantity
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
