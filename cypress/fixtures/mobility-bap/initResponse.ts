import { userDetails } from './userDetails'

export const initResponse = {
  data: [
    {
      context: {
        domain: 'mobility:1.1.0',
        action: 'on_init',
        version: '1.1.0',
        bpp_id: 'bpp-ps-network-strapi2-staging.example.io',
        bpp_uri: 'http://bpp-ps-network-strapi2-staging.example.io',
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
        transaction_id: '047342f7-c583-4e61-b720-559bb90bbfb8',
        message_id: 'd87092f9-512c-4d27-8106-87b4a8232b1e',
        ttl: 'PT10M',
        timestamp: '2024-10-14T09:19:16.180Z'
      },
      message: {
        order: {
          type: 'DEFAULT',
          provider: {
            id: '629',
            name: 'Beckn Cabs',
            short_desc:
              'Backn Cab: Your reliable ride-sharing solution, offering efficient transportation with a focus on safety and convenience.',
            long_desc:
              'Welcome to Backn Cab, your premier choice for hassle-free transportation! With our fleet of modern vehicles and professional drivers, we ensure prompt and comfortable rides to your destination. Enjoy convenient booking, competitive prices, and reliable service every time you ride with us.',
            rating: '4.3',
            fulfillments: [
              {
                type: 'start',
                stops: [
                  {
                    type: 'start',
                    location: {
                      gps: '18.6087413, 73.75189209999999'
                    }
                  },
                  {
                    type: 'end',
                    location: {
                      gps: '18.6744633, 73.7065161'
                    }
                  }
                ],
                tracking: false
              },
              {
                id: '21',
                type: 'SUV On-Location Cab Pickup',
                rating: '4.0',
                rateable: true,
                agent: {
                  person: {
                    id: '7',
                    name: 'Manoj Kumar'
                  },
                  contact: {
                    phone: '+919988769876'
                  }
                },
                vehicle: {
                  make: 'Maruti',
                  model: 'Ertiga',
                  registration: 'MH12 MH 1234'
                },
                tracking: false
              },
              {
                id: '21',
                type: 'SUV On-Location Cab Pickup',
                rating: '4.0',
                rateable: true,
                agent: {
                  person: {
                    id: '7',
                    name: 'Manoj Kumar'
                  },
                  contact: {
                    phone: '+919988769876'
                  }
                },
                vehicle: {
                  make: 'Maruti',
                  model: 'Ertiga',
                  registration: 'MH12 MH 1234'
                },
                tracking: false
              }
            ]
          },
          items: [
            {
              id: '184',
              name: 'Beckn Cab SUV',
              short_desc:
                'Beckn Cabs SUV: Premium rides, spacious comfort. Travel in style with our top-tier SUV service.',
              long_desc:
                "Beckn Cabs SUV offers a luxurious and comfortable ride experience tailored for those who appreciate extra space and style. Whether you're heading to an important meeting, picking up clients, or simply enjoying a night out, our fleet of well-maintained SUVs provides the perfect blend of elegance and practicality. With XYZCabs SUV, you'll travel in comfort, knowing you're in the hands of professional drivers who prioritize your safety and satisfaction. Experience the difference of premium cab service with XYZCabs SUV, where every ride is a first-class journey.",
              price: {
                value: '20'
              },
              rating: 'null',
              rateable: true,
              quantity: {
                available: {
                  count: 1000,
                  measure: {
                    value: '1000',
                    unit: 'kWh'
                  }
                }
              },
              fulfillments: [
                {
                  id: '21',
                  type: 'SUV On-Location Cab Pickup',
                  rating: '4.0'
                },
                {
                  id: '21',
                  type: 'SUV On-Location Cab Pickup',
                  rating: '4.0'
                }
              ]
            }
          ],
          fulfillments: [
            {
              type: 'start',
              stops: [
                {
                  type: 'start',
                  location: {
                    gps: '18.6087413, 73.75189209999999'
                  }
                },
                {
                  type: 'end',
                  location: {
                    gps: '18.6744633, 73.7065161'
                  }
                }
              ],
              tracking: false
            },
            {
              id: '21',
              type: 'SUV On-Location Cab Pickup',
              rating: '4.0',
              rateable: true,
              agent: {
                person: {
                  id: '7',
                  name: 'Manoj Kumar'
                },
                contact: {
                  phone: '+919988769876'
                }
              },
              vehicle: {
                make: 'Maruti',
                model: 'Ertiga',
                registration: 'MH12 MH 1234'
              },
              tracking: false
            }
          ],
          quote: {
            price: {
              value: '20'
            },
            breakup: [
              {
                title: 'Base Price',
                price: {
                  currency: 'INR',
                  value: '100'
                }
              }
            ]
          },
          billing: {
            name: userDetails.name,
            phone: userDetails.mobileNumber,
            email: 'Rajubhau@example.com'
          },
          payments: [
            {
              collected_by: 'BPP',
              params: {
                bank_account_name: 'NA',
                bank_account: '1224555666',
                price: '20'
              },
              status: 'PAID',
              type: 'PRE-ORDER'
            }
          ]
        }
      }
    }
  ]
}
