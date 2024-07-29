import { shippingDetails, billingDetails } from '../checkoutPage/userDetails'

export const orderResponse = {
  data: {
    id: 1574,
    attributes: {
      order_Id: 'avh_654_yuy123',
      bpp_id: 'bpp123',
      bpp_uri: 'https://bpp.example.com',
      currency: 'INR',
      delivery_status: null,
      descriptor: {
        name: 'Provider One',
        short_desc: ''
      },
      price: 2160,
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
        },
        country: {
          code: 'IND'
        },
        pinCode: billingDetails.pinCode
      },
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
      created_date: '2024-07-24T08:02:48.578Z',
      last_updated_date: '2024-07-24T08:02:48.578Z',
      quote: {
        price: {
          value: '2160.00',
          currency: 'INR'
        },
        breakup: [
          {
            price: {
              value: '100.00',
              currency: 'INR'
            },
            title: 'base-price'
          },
          {
            price: {
              value: '200.00',
              currency: 'INR'
            },
            title: 'base-price'
          },
          {
            price: {
              value: '360.00',
              currency: 'INR'
            },
            title: 'taxes'
          }
        ]
      },
      transaction_id: '12345',
      message_id: null,
      payments: [
        {
          id: '8',
          name: 'Standard',
          type: 'PRE-FULFILLMENT',
          params: {
            amount: '2160.00',
            currency: 'INR'
          },
          status: 'NOT-PAID'
        }
      ],
      items: [
        {
          id: 'item1',
          name: 'sunglass One',
          price: {
            value: '100.00',
            currency: 'INR',
            listed_value: '100.00'
          },
          images: [
            {
              url: 'http://bpp-unified-vendure1-prod.becknprotocol.io/assets/preview/69/250__preview.jpeg'
            }
          ],
          quantity: {
            selected: {
              count: 1
            }
          },
          long_desc:
            'Protect you from sun rays and wind Polarised- Polarising lens: reduces reflections from bright surfaces Sun Protection- Category 3 lens - 100% UV filter: perfect for sunny weather.'
        },
        {
          id: 'item2',
          name: 'sunglass Two',
          price: {
            value: '200.00',
            currency: 'INR',
            listed_value: '200.00'
          },
          images: [
            {
              url: 'http://bpp-unified-vendure1-prod.becknprotocol.io/assets/preview/69/250__preview.jpeg'
            }
          ],
          quantity: {
            selected: {
              count: 1
            }
          },
          long_desc:
            'Protect you from sun rays and wind Polarised- Polarising lens: reduces reflections from bright surfaces Sun Protection- Category 3 lens - 100% UV filter: perfect for sunny weather.'
        }
      ],
      createdAt: '2024-07-24T08:02:48.578Z',
      updatedAt: '2024-07-24T08:02:48.578Z',
      publishedAt: '2024-07-24T08:02:48.570Z',
      domain: null
    }
  },
  meta: {}
}
