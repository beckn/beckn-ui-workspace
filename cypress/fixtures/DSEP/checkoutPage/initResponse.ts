import { shippingDetails } from './userDetails'

export const initResponse = {
  data: [
    {
      context: {
        domain: 'dsep:courses',
        action: 'on_init',
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
        message_id: 'f04bd56f-38f6-44d8-bd50-8fc42d69997b',
        ttl: 'PT10M',
        timestamp: '2024-09-30T08:07:27.643Z'
      },
      message: {
        order: {
          type: 'DEFAULT',
          provider: {
            id: '1',
            name: 'Edureka',
            short_desc: 'Online course provider',
            long_desc: 'Online course provider',
            rating: '4.8',
            images: {
              url: 'https://miro.medium.com/v2/resize:fit:1200/0*CnvREDstX45u4ruk.png',
              size_type: 'sm'
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
            ]
          },
          items: [
            {
              id: '1',
              name: 'java springboot book One',
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
                  id: '8'
                },
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
    }
  ]
}
