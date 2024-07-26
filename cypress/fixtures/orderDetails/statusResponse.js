import { shippingDetails, billingDetails } from '../checkoutPage/userDetails'

export const statusResponse = {
  data: [
    {
      context: {
        domain: 'retail:1.1.0',
        action: 'on_status',
        version: '1.1.0',
        bpp_id: 'bpp123',
        bpp_uri: 'https://bpp.example.com',
        country: 'IND',
        city: 'std:080',
        location: {
          country: {
            name: 'India',
            code: 'IND'
          },
          city: {
            name: 'Bangalore',
            code: 'std:080'
          }
        },
        bap_id: 'bap-ps-network-staging.example.io',
        bap_uri: 'https://bap-ps-network-staging.example.io',
        transaction_id: '30c447ac-74fc-4bc6-80a3-30ee857e47a2',
        message_id: 'ec8832e1-b2c3-4afa-8a0d-ccaa385f8f62',
        ttl: 'PT10M',
        timestamp: '2024-07-24T08:20:55.778Z'
      },
      message: {
        order: {
          Id: 'avh_654_yuy123',
          status: 'ACTIVE',
          created_at: new Date().toISOString(),
          provider: {
            id: 'instakart',
            name: 'InstaKart',
            short_desc: '',
            long_desc: ''
          },
          items: [
            {
              id: 'item1',
              name: 'sunglass One',
              long_desc:
                'Protect you from sun rays and wind Polarised- Polarising lens: reduces reflections from bright surfaces Sun Protection- Category 3 lens - 100% UV filter: perfect for sunny weather.',
              images: [
                {
                  url: 'http://bpp-unified-vendure1-prod.becknprotocol.io/assets/preview/69/250__preview.jpeg'
                }
              ],
              price: {
                listed_value: '100.00',
                currency: 'INR',
                value: '100.00'
              },
              quantity: {
                selected: {
                  count: 1
                }
              }
            },
            {
              id: 'item2',
              name: 'sunglass Two',
              long_desc:
                'Protect you from sun rays and wind Polarised- Polarising lens: reduces reflections from bright surfaces Sun Protection- Category 3 lens - 100% UV filter: perfect for sunny weather.',
              images: [
                {
                  url: 'http://bpp-unified-vendure1-prod.becknprotocol.io/assets/preview/69/250__preview.jpeg'
                }
              ],
              price: {
                listed_value: '200.00',
                currency: 'INR',
                value: '200.00'
              },
              quantity: {
                selected: {
                  count: 1
                }
              }
            }
          ],
          fulfillments: [
            {
              id: '11',
              type: 'standard',
              stops: [
                {
                  location: {
                    address: shippingDetails.address,
                    city: {
                      name: 'Bengaluru'
                    },
                    state: {
                      name: 'Karnataka'
                    },
                    country: {
                      code: 'IN'
                    },
                    area_code: shippingDetails.pinCode
                  },
                  person: {
                    name: shippingDetails.name
                  },
                  contact: {
                    phone: shippingDetails.mobileNumber,
                    email: shippingDetails.email
                  }
                }
              ],
              customer: {
                person: {
                  name: shippingDetails.name
                },
                contact: {
                  phone: shippingDetails.mobileNumber,
                  email: shippingDetails.email
                }
              },
              tracking: false
            }
          ],
          quote: {
            price: {
              currency: 'INR',
              value: '2160.00'
            },
            breakup: [
              {
                title: 'base-price',
                price: {
                  currency: 'INR',
                  value: '100.00'
                }
              },
              {
                title: 'base-price',
                price: {
                  currency: 'INR',
                  value: '200.00'
                }
              },
              {
                title: 'taxes',
                price: {
                  currency: 'INR',
                  value: '360.00'
                }
              }
            ]
          },
          billing: {
            name: billingDetails.name,
            phone: billingDetails.mobileNumber,
            email: billingDetails.email,
            address: billingDetails.address,
            city: {
              name: 'Bengaluru'
            },
            state: {
              name: 'Karnataka'
            }
          },
          payments: [
            {
              type: 'PRE-FULFILLMENT',
              params: {
                amount: '2160.00',
                currency: 'INR',
                transaction_id: '12345'
              },
              time: {
                label: 'Transaction timestamp',
                timestamp: '2024-07-24T08:20:55.758Z'
              }
            }
          ],
          type: 'DEFAULT',
          tags: [
            {
              code: 'ShippingMethodDetails',
              name: 'Shipping method details',
              display: true,
              list: [
                {
                  code: 'standard',
                  name: 'Standard',
                  value: 'standard'
                }
              ]
            },
            {
              code: 'AdditionalStatus',
              name: 'Additional status',
              display: true,
              list: [
                {
                  code: 'detailedOrderStatus',
                  name: 'Detailed Order Status',
                  value: 'ArrangingPayment'
                }
              ]
            }
          ]
        }
      }
    }
  ]
}
