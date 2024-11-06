import { v4 as uuidv4 } from 'uuid'

export const confirmResponse = {
  data: [
    {
      context: {
        domain: 'mobility:1.1.0',
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
        transaction_id: '511cfcc2-4863-49d5-b77e-f9357a75d893',
        message_id: 'c0d75327-496a-4b7b-8ef9-1ca6279428b6',
        ttl: 'PT10M',
        timestamp: '2024-10-24T06:24:12.802Z'
      },
      message: {
        orderId: uuidv4().toString(),
        provider: {
          id: '629',
          name: 'XYZ Cab Services',
          short_desc:
            'XYZ Cab: Your reliable ride-sharing solution, offering efficient transportation with a focus on safety and convenience.',
          long_desc:
            'Welcome to XYZ Cab, your premier choice for hassle-free transportation! With our fleet of modern vehicles and professional drivers, we ensure prompt and comfortable rides to your destination. Enjoy convenient booking, competitive prices, and reliable service every time you ride with us.',
          rating: '4.3',
          fulfillments: [
            {
              state: {
                description: 'AWAITING_DRIVER_APPROVAL',
                descriptor: {
                  code: 'RIDE_STATUS',
                  name: 'AWAITING_DRIVER_APPROVAL'
                }
              }
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
              }
            }
          ]
        },
        items: [
          {
            id: '184',
            name: 'XYZ SUV',
            code: 'XYZSUV',
            short_desc: 'XYZCabs SUV: Premium rides, spacious comfort. Travel in style with our top-tier SUV service.',
            long_desc:
              "XYZCabs SUV offers a luxurious and comfortable ride experience tailored for those who appreciate extra space and style. Whether you're heading to an important meeting, picking up clients, or simply enjoying a night out, our fleet of well-maintained SUVs provides the perfect blend of elegance and practicality. With XYZCabs SUV, you'll travel in comfort, knowing you're in the hands of professional drivers who prioritize your safety and satisfaction. Experience the difference of premium cab service with XYZCabs SUV, where every ride is a first-class journey.",
            price: {
              value: '20'
            },
            rating: 'null',
            rateable: true,
            quantity: {
              available: {
                measure: {
                  value: '0',
                  unit: 'kWh'
                }
              }
            },
            fulfillments: [
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
                  gps: '12.9752736, 77.6205002'
                }
              },
              {
                type: 'end',
                location: {
                  gps: '13.198909, 77.7068926'
                }
              }
            ],
            state: {
              descriptor: {
                code: 'RIDE_STATUS',
                short_desc: 'AWAITING_DRIVER_APPROVAL'
              },
              updated_at: '2024-10-24T06:24:12.753Z'
            }
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
            state: {
              descriptor: {
                code: 'RIDE_STATUS',
                short_desc: 'AWAITING_DRIVER_APPROVAL'
              },
              updated_at: '2024-10-24T06:24:12.753Z'
            }
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
          name: 'krushna',
          phone: '2342434445',
          email: 'krushna@example.com'
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
  ]
}
