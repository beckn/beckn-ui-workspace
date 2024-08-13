import { v4 as uuidv4 } from 'uuid'
import { shippingDetails, billingDetails } from '../checkoutPage/userDetails'

export const confirmResponse = {
  data: [
    {
      context: {
        domain: 'retail:1.1.0',
        action: 'on_confirm',
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
        transaction_id: '12345',
        message_id: '0fc27d49-74ad-4c21-8401-d6d89cb6c0a9',
        ttl: 'PT10M',
        timestamp: '2024-07-22T13:30:41.240Z'
      },
      message: {
        orderId: uuidv4().toString(),
        provider: {
          id: 'provider1',
          name: 'Provider One',
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
            id: '9',
            type: 'standard',
            customer: {
              person: {
                name: shippingDetails.name
              },
              contact: {
                phone: shippingDetails.mobileNumber
              }
            },
            stops: [
              {
                location: {
                  gps: '12.898773,77.5764094',
                  address: shippingDetails.address,
                  city: {
                    name: 'Bengaluru'
                  },
                  state: {
                    name: 'Karnataka'
                  },
                  country: {
                    code: 'IND'
                  },
                  area_code: shippingDetails.pinCode
                },
                contact: {
                  phone: shippingDetails.mobileNumber,
                  email: shippingDetails.email
                }
              }
            ],
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
            id: '8',
            name: 'Standard',
            status: 'NOT-PAID',
            type: 'PRE-FULFILLMENT',
            params: {
              amount: '2160.00',
              currency: 'INR'
            }
          }
        ],
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
          }
        ]
      }
    }
  ]
}
