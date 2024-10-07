import { v4 as uuidv4 } from 'uuid'

export const updatedShippingDetailsResponse = {
  data: [
    {
      context: {
        domain: 'dsep:courses',
        action: 'on_update',
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
        transaction_id: 'ce3d6238-d663-40a7-a035-67a801a741da',
        message_id: '8ab0ad14-d26c-49a0-816b-f19454aa6602',
        ttl: 'PT10M',
        timestamp: '2024-10-03T04:32:26.782Z'
      },
      message: {
        orderId: uuidv4().toString(),
        provider: {
          id: '1',
          name: 'Edureka',
          short_desc: 'Online course provider',
          long_desc: 'Online course provider',
          images: [
            {
              url: 'https://abc.com',
              size_type: 'sm'
            }
          ]
        },
        items: {
          id: '1',
          name: 'java springboot book One',
          short_desc: 'java springboot book One',
          long_desc: 'java springboot book One',
          price: {
            value: '1000',
            currency: 'INR'
          },
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
        },
        fulfillments: [
          {
            id: '8',
            state: {
              descriptor: {
                code: 'PAYMENT_RECEIVED',
                short_desc: 'PAYMENT_RECEIVED'
              }
            },
            customer: {
              contact: {
                email: 'krushna@gmail.com',
                phone: '8888888889'
              },
              person: {
                name: 'krushna'
              }
            },
            stops: [
              {
                type: 'end',
                location: {
                  gps: '1.3806217468119772, 103.74636438437074',
                  address: '151-E, Janpath Road, New Delhi',
                  city: {
                    name: 'New Delhi'
                  },
                  state: {
                    code: 'Delhi'
                  },
                  area_code: '110001'
                }
              },
              {
                type: 'end',
                location: {
                  gps: '1.3806217468119772, 103.74636438437074',
                  address: '151-E, Janpath Road, New Delhi',
                  city: {
                    name: 'New Delhi'
                  },
                  state: {
                    code: 'Delhi'
                  },
                  area_code: '110001'
                }
              }
            ],
            tracking: false
          }
        ],
        quote: {
          price: {
            value: '1000',
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
          name: 'krushna gaikwad',
          address: '151-E, Janpath Road, New Delhi',
          city: {
            name: 'New Delhi'
          },
          state: {
            name: 'Delhi'
          },
          email: 'krushna@gmail.com',
          phone: '8888888889'
        },
        payments: [
          {
            collected_by: 'BPP',
            params: {
              bank_account: '1726350086',
              bank_code: 'ISC0004497',
              price: {
                value: 1000,
                currency: 'INR'
              }
            },
            type: 'PRE-ORDER'
          }
        ],
        cancellation_terms: [
          {
            cancellation_fee: {
              cancellation_fee: {
                amount: {
                  currency: 'INR',
                  value: '30%'
                }
              }
            }
          }
        ]
      }
    }
  ]
}
