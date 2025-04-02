import { ShippingFormInitialValuesType } from '@beckn-ui/becknified-components'

export const generateRentalInitPayload = async (
  selectedRentalResponse: any,
  shippingFormData: ShippingFormInitialValuesType | Record<string, any>,
  domain: string
) => {
  return {
    data: [
      {
        context: {
          transaction_id: selectedRentalResponse?.context?.transaction_id,
          bpp_id: selectedRentalResponse?.context?.bpp_id,
          bpp_uri: selectedRentalResponse?.context?.bpp_uri,
          domain: domain
        },
        message: {
          orders: [
            {
              provider: {
                id: selectedRentalResponse?.message?.order?.provider?.id
              },
              items:
                selectedRentalResponse?.message?.order?.items?.map(item => ({
                  id: item.id,
                  quantity: {
                    selected: {
                      count: item.quantity || 1
                    }
                  },
                  fulfillment_ids: item.fulfillments?.map(f => f.id) || []
                })) || [],
              fulfillments:
                selectedRentalResponse?.message?.order?.fulfillments?.map(f => ({
                  id: f.id,
                  type: f.type,
                  customer: {
                    person: {
                      name: shippingFormData?.name
                    },
                    contact: {
                      phone: shippingFormData?.mobileNumber
                    }
                  },
                  stops: [
                    {
                      location: {
                        address: shippingFormData?.address,
                        city: {
                          name: 'Bengaluru'
                        },
                        state: {
                          name: 'Karnataka'
                        },
                        country: {
                          code: 'IND'
                        }
                      },
                      contact: {
                        phone: shippingFormData?.mobileNumber,
                        email: shippingFormData?.email
                      }
                    }
                  ]
                })) || [],
              billing: {
                name: shippingFormData?.name,
                phone: shippingFormData?.mobileNumber,
                address: shippingFormData?.address,
                email: shippingFormData?.email,
                city: {
                  name: 'Bengaluru'
                },
                state: {
                  name: 'Karnataka'
                }
              }
            }
          ]
        }
      }
    ]
  }
}

export function calculateDuration(from: number, to: number): number {
  if (!from || !to) return 0 // Handle invalid inputs

  // Convert milliseconds to hours
  const diffInMs = to - from
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))

  return diffInHours
}
