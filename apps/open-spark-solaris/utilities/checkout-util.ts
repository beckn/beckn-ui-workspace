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

export function calculateDuration(from: string, to: string): number {
  // if (!from || !to) return 'Not available' // Handle null values

  const parseTime = (timeStr: string): number => {
    if (!timeStr.includes(' ')) return 0 // Ensure valid format
    const [time, period] = timeStr.split(' ')
    let [hours, minutes] = time.split(':').map(Number)

    if (period === 'PM' && hours !== 12) hours += 12
    if (period === 'AM' && hours === 12) hours = 0

    return hours * 60 + minutes // Convert to total minutes
  }

  const fromMinutes = parseTime(from)
  const toMinutes = parseTime(to)

  const totalMinutes = toMinutes - fromMinutes
  // if (totalMinutes < 0) return 'Invalid time range' // Handle overnight cases

  // Convert to hours and minutes format
  const hours = Math.floor(totalMinutes / 60)

  return hours
}
