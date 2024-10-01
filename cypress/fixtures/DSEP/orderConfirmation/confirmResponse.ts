import { v4 as uuidv4 } from 'uuid'

export const confirmResponse = {
  data: [
    {
      context: {
        domain: 'dsep:courses',
        action: 'on_confirm',
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
        transaction_id: '4e839451-9985-4aed-9cb2-b766421c03d6',
        message_id: 'feae4156-4f55-447b-bc45-eb8c4b8d95bf',
        ttl: 'PT10M',
        timestamp: '2024-10-01T05:53:59.378Z'
      },
      message: {
        orderId: uuidv4().toString(),
        provider: {
          id: '1',
          name: 'Edureka',
          short_desc: 'Online course provider',
          long_desc: 'Online course provider',
          rating: '4.8',
          images: [
            {
              url: 'https://miro.medium.com/v2/resize:fit:1200/0*CnvREDstX45u4ruk.png',
              size_type: 'sm'
            }
          ],
          fulfillments: [
            {
              id: '8',
              type: 'RECORDED COURSE',
              rating: '4.5',
              rateable: true,
              state: {
                description: 'PAYMENT_RECEIVED',
                descriptor: {
                  code: 'PAYMENT_RECEIVED',
                  name: 'PAYMENT_RECEIVED'
                }
              },
              tracking: false
            },
            {
              id: '8',
              type: 'RECORDED COURSE',
              rating: '4.5',
              rateable: true,
              tracking: false
            }
          ]
        },
        items: [
          {
            id: '1',
            name: 'java springboot book',
            code: 'JSB',
            short_desc: 'java springboot book One',
            long_desc: 'java springboot book',
            images: [
              {
                url: 'https://miro.medium.com/v2/resize:fit:1200/0*CnvREDstX45u4ruk.png',
                size_type: 'sm'
              }
            ],
            price: {
              value: '1000',
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
            categories: [
              {
                id: '1',
                name: 'IT'
              }
            ],
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
            ],
            fulfillments: [
              {
                id: '8',
                type: 'RECORDED COURSE',
                rating: '4.5'
              },
              {
                id: '8',
                type: 'RECORDED COURSE',
                rating: '4.5'
              }
            ]
          }
        ],
        fulfillments: [
          {
            id: '8',
            stops: [
              {
                type: 'end',
                location: {
                  gps: '1.3806217468119772, 103.74636438437074',
                  address: '151-E, Janpath Road, New Delhi',
                  city: {
                    name: 'New Delhi'
                  },
                  area_code: '110001',
                  state: {
                    name: 'Delhi'
                  }
                },
                contact: {
                  phone: '8888888889'
                }
              }
            ],
            state: {
              descriptor: {
                code: 'PAYMENT_RECEIVED',
                short_desc: 'PAYMENT_RECEIVED'
              },
              updated_at: '2024-10-01T05:53:59.307Z'
            },
            tracking: false
          },
          {
            id: '8',
            type: 'RECORDED COURSE',
            rating: '4.5',
            rateable: true,
            state: {
              descriptor: {
                code: 'PAYMENT_RECEIVED',
                short_desc: 'PAYMENT_RECEIVED'
              },
              updated_at: '2024-10-01T05:53:59.307Z'
            },
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
                value: '1000'
              }
            },
            {
              title: 'Course Discount',
              price: {
                currency: 'INR',
                value: '-1000'
              }
            }
          ]
        },
        billing: {
          name: 'krushna gaikwad',
          address: '151-E, Janpath Road, New Delhi',
          state: {
            name: 'Delhi'
          },
          city: {
            name: 'New Delhi'
          },
          email: 'krushna@gmail.com',
          phone: '8888888889'
        },
        payments: [
          {
            collected_by: 'BPP',
            params: {
              bank_account_name: 'Everyone Trust Bank',
              bank_account: '1726350086',
              bank_code: 'ISC0004497',
              price: '1000',
              currency: 'INR'
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
        ]
      }
    }
  ]
}
