// Mock API responses for POC - Comment out when using real APIs
import { MOCK_MENU_ITEMS } from './product'
import { MOCK_RESTAURANTS } from './restaurants'
import { ParsedItemModel } from '@beckn-ui/common/lib/types'

// Convert MOCK_MENU_ITEMS to ParsedItemModel format
export const convertToParsedItem = (item: (typeof MOCK_MENU_ITEMS)[0]): ParsedItemModel => {
  const restaurant = MOCK_RESTAURANTS.find(r => r.name.includes(item.restaurant.split(' ')[0])) || MOCK_RESTAURANTS[0]
  return {
    item: {
      id: item.id.toString(),
      name: item.name,
      price: {
        value: item.price.toString(),
        currency: 'INR'
      },
      images: [{ url: item.image }],
      short_desc: item.description,
      long_desc: item.description,
      rating: item.rating.toString()
    },
    providerId: restaurant.id,
    providerName: item.restaurant,
    providerUri: '',
    bppId: 'bpp-1',
    bppUri: '',
    providerCoordinates: []
  } as ParsedItemModel
}

// Get product by ID from MOCK_MENU_ITEMS
export const getProductById = (itemId: string | number): ParsedItemModel | null => {
  const item = MOCK_MENU_ITEMS.find(i => i.id === Number(itemId))
  if (!item) return null
  return convertToParsedItem(item)
}

// Mock select response
export const getMockSelectResponse = (items: any[]) => {
  const total = items.reduce((sum, item) => {
    return sum + Number(item.price?.value || item.price) * (item.quantity || 1)
  }, 0)

  return [
    {
      context: {
        transaction_id: 'mock-transaction-' + Date.now(),
        bpp_id: 'bpp-1',
        bpp_uri: 'https://mock-bpp.com'
      },
      message: {
        order: {
          items: items.map(item => ({
            id: item.id || item.item?.id,
            quantity: { count: item.quantity || 1 }
          })),
          quote: {
            price: {
              value: total.toString(),
              currency: 'INR'
            },
            breakup: [
              {
                title: 'Item Total',
                price: {
                  value: total.toFixed(2),
                  currency: 'INR'
                }
              },
              {
                title: 'Delivery Charges',
                price: {
                  value: '30.00',
                  currency: 'INR'
                }
              },
              {
                title: 'Tax',
                price: {
                  value: (total * 0.05).toFixed(2),
                  currency: 'INR'
                }
              }
            ]
          }
        }
      }
    }
  ]
}

// Mock init response
export const getMockInitResponse = (items: any[], shippingData: any, billingData: any) => {
  const itemTotal = items.reduce((sum, item) => {
    return sum + Number(item.price?.value || item.price) * (item.quantity || 1)
  }, 0)
  const deliveryCharges = 30
  const tax = itemTotal * 0.05
  const total = itemTotal + deliveryCharges + tax

  return [
    {
      context: {
        transaction_id: 'mock-transaction-' + Date.now(),
        bpp_id: 'bpp-1',
        bpp_uri: 'https://mock-bpp.com'
      },
      message: {
        order: {
          items: items.map(item => ({
            id: item.id || item.item?.id,
            quantity: { count: item.quantity || 1 },
            price: {
              value: (Number(item.price?.value || item.price) * (item.quantity || 1)).toString(),
              currency: 'INR'
            }
          })),
          quote: {
            price: {
              value: total.toString(),
              currency: 'INR'
            },
            breakup: [
              {
                title: 'Item Total',
                price: {
                  value: itemTotal.toFixed(2),
                  currency: 'INR'
                }
              },
              {
                title: 'Delivery Charges',
                price: {
                  value: deliveryCharges.toFixed(2),
                  currency: 'INR'
                }
              },
              {
                title: 'Tax (5%)',
                price: {
                  value: tax.toFixed(2),
                  currency: 'INR'
                }
              },
              {
                title: 'Total',
                price: {
                  value: total.toFixed(2),
                  currency: 'INR'
                }
              }
            ]
          },
          fulfillment: {
            customer: {
              person: {
                name: shippingData.name
              },
              contact: {
                phone: shippingData.mobileNumber,
                email: shippingData.email
              }
            },
            end: {
              location: {
                address: {
                  full: shippingData.address,
                  pinCode: shippingData.pinCode
                }
              }
            }
          },
          billing: {
            name: billingData.name,
            address: billingData.address,
            phone: billingData.mobileNumber,
            email: billingData.email
          }
        }
      }
    }
  ]
}

// Mock confirm response
export const getMockConfirmResponse = (initResponse: any[]) => {
  return initResponse.map((response, idx) => ({
    ...response,
    message: {
      ...response.message,
      orderId: 'ORDER-' + Date.now() + '-' + idx,
      order: {
        ...response.message.order,
        state: 'CONFIRMED'
      }
    }
  }))
}

// Mock order history data
export const getMockOrderHistory = () => {
  // This will be populated when orders are placed
  const orders = JSON.parse(localStorage.getItem('mockOrders') || '[]')
  return orders
}

// Save order to mock history
export const saveMockOrder = (orderData: any) => {
  const orders = JSON.parse(localStorage.getItem('mockOrders') || '[]')
  orders.unshift({
    id: `order-${Date.now()}`,
    attributes: {
      order_id: orderData.orderId,
      bpp_id: orderData.bppId || 'bpp-1',
      bpp_uri: orderData.bppUri || 'https://mock-bpp.com',
      delivery_status: 'ORDER_RECEIVED',
      quote: {
        price: {
          value: orderData.total || '0',
          currency: 'INR'
        }
      },
      items: orderData.items || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  })
  localStorage.setItem('mockOrders', JSON.stringify(orders))
}
