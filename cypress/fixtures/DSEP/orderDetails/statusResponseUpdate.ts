import { v4 as uuidv4 } from 'uuid'
import { shippingDetails } from '../../DSEP/checkoutPage/userDetails'

export const statusResponseUpdate = orderStatus => {
  return {
    data: [
      {
        context: {
          domain: 'dsep:courses',
          action: 'on_status',
          version: '1.1.0',
          bpp_id: 'bpp-ps-network-strapi1-prod.becknprotocol.io',
          bpp_uri: 'https://bpp-ps-network-strapi1-prod.becknprotocol.io',
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
          bap_id: 'bap-ps-network-prod.becknprotocol.io',
          bap_uri: 'https://bap-ps-network-prod.becknprotocol.io',
          transaction_id: 'd2aa1c7e-1866-49d5-a86f-6076b9b03c6c',
          message_id: '3ddd89d8-e483-4554-be2b-d655cba67b13',
          ttl: 'PT10M',
          timestamp: '2024-10-03T04:25:29.998Z'
        },
        message: {
          order: {
            id: uuidv4().toString(),
            created_at: '2024-10-03T04:22:51.877Z',
            provider: {
              id: '1',
              name: 'Edureka',
              short_desc: 'Online course provider',
              long_desc: 'Online course provider',
              rating: '4.8',
              images: {
                url: 'http://abc.com/providerlogo',
                size_type: 'sm'
              },
              rateable: true
            },
            items: [
              {
                id: '1',
                name: 'java springboot book One ',
                short_desc: 'java springboot book One',
                long_desc: 'java springboot book One',
                images: [
                  {
                    url: 'https://miro.medium.com/v2/resize:fit:1200/0*CnvREDstX45u4ruk.png',
                    size_type: 'sm'
                  }
                ],
                price: {
                  value: '2000',
                  currency: 'INR'
                },
                rating: '4.3',
                rateable: true,
                quantity: {
                  available: {
                    count: 100,
                    measure: {
                      value: '100',
                      unit: 'kWh'
                    }
                  }
                },
                locations: [
                  {
                    id: '6',
                    city: 'Bengaluru',
                    state: 'Karnataka',
                    country: 'India'
                  }
                ],
                tags: [
                  {
                    display: true,
                    list: [
                      {
                        code: 'springboot',
                        value: 'springboot'
                      }
                    ]
                  },
                  {
                    display: true,
                    list: [
                      {
                        code: 'course-duration',
                        value: '30 days'
                      }
                    ]
                  },
                  {
                    display: true,
                    list: [
                      {
                        code: 'course-url',
                        value: 'https://www.edureka.co/spring-certification-course'
                      }
                    ]
                  }
                ]
              }
            ],
            fulfillments: [
              {
                id: '8',
                state: {
                  descriptor: {
                    code: orderStatus,
                    short_desc: orderStatus
                  },
                  updated_at: '2024-10-03T04:22:51.910Z'
                },
                customer: {
                  contact: {
                    email: shippingDetails.email,
                    phone: shippingDetails.mobileNumber
                  },
                  person: {
                    name: shippingDetails.name
                  }
                },
                stops: [
                  {
                    type: 'end',
                    location: {
                      gps: '1.3806217468119772, 103.74636438437074',
                      address: shippingDetails.address,
                      city: {
                        name: 'New Delhi'
                      },
                      area_code: '110001',
                      state: {
                        name: 'Delhi'
                      }
                    }
                  },
                  {
                    type: 'end',
                    location: {
                      gps: '1.3806217468119772, 103.74636438437074',
                      address: shippingDetails.address,
                      city: {
                        name: 'New Delhi'
                      },
                      area_code: '110001',
                      state: {
                        name: 'Delhi'
                      }
                    }
                  }
                ],
                tracking: false
              }
            ],
            quote: {
              price: {
                value: '2000',
                currency: 'INR'
              },
              breakup: [
                {
                  title: 'Course Fee',
                  price: {
                    currency: 'INR',
                    value: '2000'
                  }
                },
                {
                  title: 'Course Discount',
                  price: {
                    currency: 'INR',
                    value: '-2000'
                  }
                }
              ]
            },
            billing: {
              name: shippingDetails.name,
              address: shippingDetails.address,
              state: {
                name: 'Delhi'
              },
              city: {
                name: 'New Delhi'
              },
              email: shippingDetails.email,
              phone: shippingDetails.mobileNumber
            },
            payments: [
              {
                collected_by: 'BPP',
                params: {
                  bank_account_number: '1726350086',
                  bank_code: 'ISC0004497',
                  bank_account_name: 'Everyone Trust Bank'
                },
                status: 'PAID',
                type: 'PRE-ORDER'
              }
            ],
            cancellation_terms: [
              {
                state: 'ORDERED',
                cancellation_fee: {
                  amount: {
                    currency: 'INR',
                    value: '30%'
                  }
                }
              }
            ],
            type: 'DEFAULT'
          }
        }
      }
    ]
  }
}
