export const statusResponse = (orderStatus: string) => {
  return {
    data: [
      {
        context: {
          domain: 'mobility:1.1.0',
          action: 'on_status',
          version: '1.1.0',
          bpp_id: 'bpp-ps-network-strapi1-prod.example.io',
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
          bap_id: 'bap-ps-network-prod.example.io',
          bap_uri: 'https://bap-ps-network-prod.example.io',
          transaction_id: '89fc13f5-2bf2-4bff-8a3e-a4baf829762e',
          message_id: '02dc403c-fe39-4464-9758-b296301c07b9',
          ttl: 'PT10M',
          timestamp: '2024-10-24T06:11:01.916Z'
        },
        message: {
          order: {
            id: '2090',
            created_at: '2024-10-24T06:10:21.194Z',
            provider: {
              id: '629',
              name: 'XYZ Cab Services',
              short_desc:
                'XYZ Cab: Your reliable ride-sharing solution, offering efficient transportation with a focus on safety and convenience.',
              long_desc:
                'Welcome to XYZ Cab, your premier choice for hassle-free transportation! With our fleet of modern vehicles and professional drivers, we ensure prompt and comfortable rides to your destination. Enjoy convenient booking, competitive prices, and reliable service every time you ride with us.',
              rating: '4.3',
              images: {
                url: 'https://abc.com',
                size_type: 'sm'
              },
              rateable: true
            },
            items: [
              {
                id: '184',
                name: 'XYZ SUV',
                short_desc:
                  'XYZCabs SUV: Premium rides, spacious comfort. Travel in style with our top-tier SUV service.',
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
                }
              }
            ],
            fulfillments: [
              {
                id: '21',
                state: {
                  descriptor: {
                    code: 'RIDE_STATUS',
                    short_desc: orderStatus
                  },
                  updated_at: '2024-10-24T06:10:56.877Z'
                },
                customer: {
                  contact: {
                    email: 'KundansinghkumarSing@example.com',
                    phone: '2342434445'
                  },
                  person: {
                    name: 'Kundan'
                  }
                },
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
                rating: '4.0',
                rateable: true
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
              name: 'Kundan singh kumar Sing',
              email: 'KundansinghkumarSing@example.com',
              phone: '2342434445'
            },
            payments: [
              {
                collected_by: 'BPP',
                params: {
                  bank_account_number: '1224555666',
                  bank_account_name: 'NA'
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
}
