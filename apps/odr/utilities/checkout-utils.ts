import { ShippingFormData } from '../pages/checkoutPage'
import { areObjectPropertiesEqual } from './common-utils'

export const getPayloadForInitRequest = (
  selectData: any,
  formData: ShippingFormData,
  billingFormData: ShippingFormData
) => {
  const payload: any = {}

  payload.context = {
    transactionId: selectData?.context?.transactionId,
    bppId: selectData?.context?.bppId,
    bppUri: selectData?.context?.bppUri
  }

  payload.scholarshipProvider = {
    id: selectData?.scholarshipProviders[0]?.id,
    name: selectData?.scholarshipProviders[0]?.name,
    tags: [
      {
        descriptor: {
          name: 'dispute-details'
        }
      }
    ],
    scholarships: [
      {
        id: selectData?.scholarshipProviders[0]?.scholarships[0]?.id,
        name: selectData?.scholarshipProviders[0]?.scholarships[0]?.name,
        description: selectData?.scholarshipProviders[0]?.scholarships[0]?.longDesc,
        amount: {
          amount: 30000,
          currency: 'INR'
        },
        categoryId: '',
        scholarshipDetails: {
          id: selectData?.scholarshipProviders[0]?.scholarships[0]?.id,
          supportContact: {
            name: formData.name,
            phone: formData.mobileNumber,
            email: formData.email
          },
          scholarshipRequestor: {
            name: billingFormData.name,
            phone: billingFormData.mobileNumber,
            address: billingFormData.address
          }
        }
      }
    ]
  }

  return payload
}

export const areShippingAndBillingDetailsSame = (
  isBillingAddressComplete: boolean,
  formData: ShippingFormData,
  billingFormData: ShippingFormData
) => {
  if (isBillingAddressComplete) {
    return areObjectPropertiesEqual(formData, billingFormData)
  }
  return !isBillingAddressComplete
}
