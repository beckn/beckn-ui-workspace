import { v4 as uuidv4 } from 'uuid'
import { shippingDetails, billingDetails } from '../checkoutPage/userDetails'
import { StatusKey } from '@beckn-ui/common'

export const statusResponse = (orderStatus: 'ACTIVE' | 'COMPLETE', trackingStatus: StatusKey) => {
  return {
    data: [
      {
        context: {
          domain: 'tourism',
          action: 'on_status',
          version: '1.1.0',
          bpp_id: 'bpp-ps-network-vendure1-prod.example.io',
          bpp_uri: 'https://bpp-ps-network-vendure1-prod.example.io',
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
          bap_id: 'bap-ps-network-prod.example.io',
          bap_uri: 'https://bap-ps-network-prod.example.io',
          transaction_id: '99c2aa5d-7ffc-444c-8391-0c541426dec9',
          message_id: '7568ab17-1417-492d-9c83-46b757b7baf1',
          ttl: 'PT10M',
          timestamp: '2024-09-05T10:07:13.903Z'
        },
        message: {
          order: {
            Id: uuidv4().toString(),
            status: orderStatus,
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
                name: 'Hampta Pass Trek - Manali One',
                long_desc:
                  'It is called Moon Lake because of its crescent shape and is the origin of Chander River. <div>\r\n        <p><b>Chandratal Lake Trek Quick Facts</b></p>\r\n        <p>Start Point/End Point: Manali </p>\r\n        <p> Bhutan Cultural Trek Camp Trekking Duration: 6 Days & 5 Nights</p>\r\n        <p>Bhutan Cultural Trek Camp Altitude: 3100 ft</p>\r\n        <p>Bhutan Cultural Trek Trek Difficulty: Easy or Moderate</p>\r\n        <p>Approx Trekking Distance: 80 kms</p>\r\n   <div>\r\n      <p><b>Highlights:</b>\r\n      <p/> \r\n      <ul>\r\n         <li>Chandratal Lake trek is a beautiful trek in Spiti valley of Himachal Pradesh at an elevation of 4,300 m.</li>\r\n         <li>The Chandratal trek will be of 5 Days from Manali to Manali, includes travel</li>\r\n         <li>First of all, all the trekkers will have to book their flight and train bus according to our time table as our pick up is from 9:00 am to 10:00 am, you will have to reach Manali Bus Stand, Mall Road in the morning.</li>\r\n         <li>A taxi from Himalayan Hikers will link you to the Manali bus stand, near mall road.Himalayan Hikers organize transport to the Spiti valley for Chandratal trek from the Manali bus stand.</li>\r\n         <li>Our vehicles leave at 7:00 am to 8:00 am sharp from Manali. Sharing taxi costs include your package.</li>\r\n         <li>In the Manali bus stand, you will get our taxi staff that will arrange transport for you. The contacts no Transport coordinator or our office team will give you a week ago to your departure</li>\r\n         <li>Manali is a beautiful city in Himachal where public transport is available for all over State in India. Book your return bus tickets directly from Manali bus stand.</li>\r\n      </ul>\r\n   </div>\r\n</div>',
                images: [
                  {
                    url: 'http://bpp-unified-vendure1-prod.becknprotocol.io/assets/source/92/273__02.jpg'
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
                tracking: false,
                state: {
                  descriptor: {
                    code: trackingStatus
                  }
                }
              }
            ],
            quote: {
              price: {
                currency: 'INR',
                value: '222.00'
              },
              breakup: [
                {
                  title: 'base-price',
                  price: {
                    currency: 'INR',
                    value: '00.00'
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
                    value: '22.00'
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
                    value: trackingStatus
                  }
                ]
              }
            ]
          }
        }
      }
    ]
  }
}
