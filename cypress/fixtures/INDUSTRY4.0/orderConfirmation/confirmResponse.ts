import { v4 as uuidv4 } from 'uuid'

export const confirmResponse = {
  data: [
    {
      context: {
        domain: 'supply-chain-services:assembly',
        action: 'on_confirm',
        version: '1.1.0',
        bpp_id: 'bpp-ps-network-strapi-dev.becknprotocol.io',
        bpp_uri: 'http://bpp-ps-network-strapi-dev.becknprotocol.io',
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
        bap_id: 'bap-ps-network-dev.becknprotocol.io',
        bap_uri: 'https://bap-ps-network-dev.becknprotocol.io',
        transaction_id: 'de1578ee-9cad-45b1-9d3a-248c75a5d6ba',
        message_id: '1642b94c-9fff-4489-9fa3-e84c708bb234',
        ttl: 'PT10M',
        timestamp: '2024-08-28T16:24:25.802Z'
      },
      message: {
        orderId: uuidv4().toString(),
        provider: {
          id: '41',
          name: 'Makerspace - S',
          short_desc: 'Makerspace',
          long_desc: 'Makerspace, Hof',
          rating: '4.7',
          images: [
            {
              url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJQbANiJKOddLqjBqk3Y-bws-pUxisbxvhrw&usqp=CAU',
              size_type: 'sm'
            }
          ],
          fulfillments: [
            {
              id: '3',
              type: 'HOME-DELIVERY',
              rating: '5',
              state: {
                description: 'ORDER ACCEPTED',
                descriptor: {
                  code: 'ORDER_ACCEPTED',
                  name: 'ORDER ACCEPTED'
                }
              },
              tracking: false
            },
            {
              id: '3',
              type: 'HOME-DELIVERY',
              rating: '5',
              tracking: false
            }
          ]
        },
        items: [
          {
            id: '61',
            name: 'Intermittent assembly type',
            code: 'IAT',
            short_desc: 'This is an intermittent assembly type.',
            long_desc:
              '<div>Intermittent Assembly Product - Enhanced Efficiency, Unmatched Performance!</h1><p>Welcome to the future of assembly technology! Revolutionize your workflow with unparalleled efficiency and precision.</p><p>Key Features:</p><ul><li>Precise Intermittent Assembly Technology.</li><li>Advanced automation for time and resource savings.</li><li>Durable materials for longevity and reliability.</li><li>Customizable settings for various assembly requirements.</li></ul><p>Invest in the future of assembly technology. Elevate your production capabilities today!</div>',
            images: [
              {
                url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJQbANiJKOddLqjBqk3Y-bws-pUxisbxvhrw&usqp=CAU',
                size_type: 'sm'
              }
            ],
            price: {
              value: '300',
              currency: 'EUR'
            },
            rating: '4.5',
            rateable: true,
            quantity: {
              available: {
                measure: {
                  value: '0',
                  unit: 'kWh'
                }
              }
            },
            categories: [
              {
                id: '65',
                name: 'Assembly'
              }
            ],
            locations: [
              {
                id: '59',
                city: 'Akola',
                state: 'Maharashtra',
                country: 'India'
              }
            ],
            tags: [
              {
                display: true,
                list: [
                  {
                    code: 'product-info',
                    value: 'Product Information'
                  }
                ]
              },
              {
                display: true,
                list: [
                  {
                    code: 'assembly-info',
                    value: 'Assembly Information'
                  }
                ]
              },
              {
                display: true,
                list: [
                  {
                    code: 'scale-info',
                    value: 'Scale Information'
                  }
                ]
              },
              {
                display: true,
                list: [
                  {
                    code: 'printer-info',
                    value: 'Printer Information"'
                  }
                ]
              }
            ],
            fulfillments: [
              {
                id: '3',
                type: 'HOME-DELIVERY',
                rating: '5'
              },
              {
                id: '3',
                type: 'HOME-DELIVERY',
                rating: '5'
              }
            ]
          }
        ],
        fulfillments: [
          {
            id: '3',
            stops: [
              {
                type: 'end',
                location: {
                  gps: '1.3806217468119772, 103.74636438437074',
                  address: '151-e, janpath road, new delhi',
                  city: {
                    name: 'New Delhi'
                  },
                  area_code: '110001',
                  state: {
                    name: 'Delhi'
                  }
                },
                contact: {
                  phone: '6251423251'
                }
              }
            ],
            state: {
              descriptor: {
                code: 'ORDER_ACCEPTED',
                short_desc: 'ORDER ACCEPTED'
              },
              updated_at: '2024-08-28T16:24:25.723Z'
            },
            tracking: false
          },
          {
            id: '3',
            type: 'HOME-DELIVERY',
            rating: '5',
            state: {
              descriptor: {
                code: 'ORDER_ACCEPTED',
                short_desc: 'ORDER ACCEPTED'
              },
              updated_at: '2024-08-28T16:24:25.723Z'
            },
            tracking: false
          }
        ],
        quote: {
          price: {
            value: '300',
            currency: 'EUR'
          },
          breakup: [
            {
              title: 'Base Price',
              price: {
                currency: 'EUR',
                value: '200'
              },
              item: {
                id: '61'
              }
            },
            {
              title: 'Shipping Cost',
              price: {
                currency: 'EUR',
                value: '50'
              },
              item: {
                id: '61'
              }
            },
            {
              title: 'Tax',
              price: {
                currency: 'EUR',
                value: '50'
              },
              item: {
                id: '61'
              }
            }
          ]
        },
        billing: {
          name: 'santosh kumar',
          address: '151-e, janpath road, new delhi',
          state: {
            name: 'Delhi'
          },
          city: {
            name: 'New Delhi'
          },
          email: 'santosh.k@gmail.com',
          phone: '6251423251'
        },
        payments: [
          {
            collected_by: 'BPP',
            params: {
              bank_account_name: 'Makerspace Assembly Ltd',
              bank_account: '1234002341',
              bank_code: 'INB0004321',
              price: '300',
              currency: 'EUR'
            },
            status: 'PAID',
            type: 'PRE-ORDER'
          }
        ],
        cancellation_terms: [
          {
            state: 'in progress',
            cancellation_fee: {
              amount: {
                currency: 'EUR',
                value: '30%'
              }
            }
          }
        ]
      }
    }
  ]
}
