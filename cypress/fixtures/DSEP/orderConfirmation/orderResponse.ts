import { v4 as uuidv4 } from 'uuid'

export const orderResponse = {
  data: {
    id: 2015,
    attributes: {
      order_id: uuidv4().toString(),
      bpp_id: 'bpp-ps-network-strapi1-prod.becknprotocol.io',
      bpp_uri: 'https://bpp-ps-network-strapi1-prod.becknprotocol.io',
      currency: 'INR',
      delivery_status: null,
      descriptor: null,
      price: 1000,
      billing: {
        city: {
          name: 'New Delhi'
        },
        name: 'krushna gaikwad',
        email: 'krushna@gmail.com',
        phone: '8888888889',
        state: {
          name: 'Delhi'
        },
        address: '151-E, Janpath Road, New Delhi'
      },
      fulfillments: [
        {
          id: '8',
          state: {
            descriptor: {
              code: 'PAYMENT_RECEIVED',
              short_desc: 'PAYMENT_RECEIVED'
            },
            updated_at: '2024-10-01T05:53:59.307Z'
          },
          stops: [
            {
              type: 'end',
              contact: {
                phone: '8888888889'
              },
              location: {
                gps: '1.3806217468119772, 103.74636438437074',
                city: {
                  name: 'New Delhi'
                },
                state: {
                  name: 'Delhi'
                },
                address: '151-E, Janpath Road, New Delhi',
                area_code: '110001'
              }
            }
          ],
          tracking: false
        },
        {
          id: '8',
          type: 'RECORDED COURSE',
          state: {
            descriptor: {
              code: 'PAYMENT_RECEIVED',
              short_desc: 'PAYMENT_RECEIVED'
            },
            updated_at: '2024-10-01T05:53:59.307Z'
          },
          rating: '4.5',
          rateable: true,
          tracking: false
        }
      ],
      created_date: null,
      last_updated_date: null,
      quote: {
        price: {
          value: '1000',
          currency: 'INR'
        },
        breakup: [
          {
            price: {
              value: '1000',
              currency: 'INR'
            },
            title: 'Course Fee'
          },
          {
            price: {
              value: '-1000',
              currency: 'INR'
            },
            title: 'Course Discount'
          }
        ]
      },
      transaction_id: '4e839451-9985-4aed-9cb2-b766421c03d6',
      message_id: 'feae4156-4f55-447b-bc45-eb8c4b8d95bf',
      payments: [
        {
          type: 'PRE-ORDER',
          params: {
            price: '1000',
            currency: 'INR',
            bank_code: 'ISC0004497',
            bank_account: '1726350086',
            bank_account_name: 'Everyone Trust Bank'
          },
          status: 'PAID',
          collected_by: 'BPP'
        }
      ],
      items: [
        {
          id: '1',
          code: 'JSB',
          name: 'java springboot book',
          tags: [
            {
              list: [
                {
                  code: 'springboot',
                  value: 'springboot'
                }
              ],
              display: true
            },
            {
              list: [
                {
                  code: 'course-duration',
                  value: '30 days'
                }
              ],
              display: true
            },
            {
              list: [
                {
                  code: 'course-url',
                  value: 'https://www.edureka.co/spring-certification-course'
                }
              ],
              display: true
            }
          ],
          price: {
            value: '1000',
            currency: 'INR'
          },
          images: [
            {
              url: 'https://miro.medium.com/v2/resize:fit:1200/0*CnvREDstX45u4ruk.png',
              size_type: 'sm'
            }
          ],
          rating: '4.3',
          quantity: {
            available: {
              count: 100,
              measure: {
                unit: 'kWh',
                value: '100'
              }
            }
          },
          rateable: true,
          locations: [
            {
              id: '6',
              city: 'Bengaluru',
              state: 'Karnataka',
              country: 'India'
            }
          ],
          long_desc: 'java springboot book',
          categories: [
            {
              id: '1',
              name: 'IT'
            }
          ],
          short_desc: 'java springboot book',
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
      createdAt: '2024-10-01T05:53:59.781Z',
      updatedAt: '2024-10-01T05:53:59.781Z',
      publishedAt: '2024-10-01T05:53:59.775Z',
      domain: 'dsep:courses'
    }
  },
  meta: {}
}
