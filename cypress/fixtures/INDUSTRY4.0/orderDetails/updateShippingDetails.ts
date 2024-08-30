import { v4 as uuidv4 } from 'uuid'

export const updatedShippingDetailsResponse = {
  data: [
    {
      context: {
        domain: 'supply-chain-services:assembly',
        action: 'on_update',
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
        transaction_id: '84a898e0-ef80-45f8-9032-f479111b674c',
        message_id: '46d15cf7-c224-4b91-b0e7-e54929c0b0ec',
        ttl: 'PT10M',
        timestamp: '2024-08-30T09:19:31.932Z'
      },
      message: {
        orderId: uuidv4().toString(),
        provider: {
          id: '41',
          name: 'Makerspace - S',
          short_desc: 'Makerspace',
          long_desc: 'Makerspace, Hof',
          images: [
            {
              url: 'https://abc.com',
              size_type: 'sm'
            }
          ]
        },
        items: {
          id: '61',
          name: 'Intermittent assembly type',
          short_desc: 'This is an intermittent assembly type.',
          long_desc:
            '<div>Intermittent Assembly Product - Enhanced Efficiency, Unmatched Performance!</h1><p>Welcome to the future of assembly technology! Revolutionize your workflow with unparalleled efficiency and precision.</p><p>Key Features:</p><ul><li>Precise Intermittent Assembly Technology.</li><li>Advanced automation for time and resource savings.</li><li>Durable materials for longevity and reliability.</li><li>Customizable settings for various assembly requirements.</li></ul><p>Invest in the future of assembly technology. Elevate your production capabilities today!</div>',
          price: {
            value: '300',
            currency: 'EUR'
          },
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
          ]
        },
        fulfillments: [
          {
            id: '3',
            state: {
              descriptor: {
                code: 'ORDER_ACCEPTED',
                short_desc: 'ORDER ACCEPTED'
              }
            },
            customer: {
              contact: {
                email: 'santosh.k@gmail.com',
                phone: '6251423251'
              },
              person: {
                name: 'santosh'
              }
            },
            stops: [
              {
                type: 'end',
                location: {
                  gps: '1.3806217468119772, 103.74636438437074',
                  address: '151-e, janpath road, new delhi',
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
                  address: '151-e, janpath road, new delhi',
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
            value: '300',
            currency: 'EUR'
          },
          breakup: [
            {
              item: {
                id: '61'
              },
              title: 'Base Price',
              price: {
                currency: 'EUR',
                value: '200'
              }
            },
            {
              item: {
                id: '61'
              },
              title: 'Shipping Cost',
              price: {
                currency: 'EUR',
                value: '50'
              }
            },
            {
              item: {
                id: '61'
              },
              title: 'Tax',
              price: {
                currency: 'EUR',
                value: '50'
              }
            }
          ]
        },
        billing: {
          name: 'santosh kumar',
          address: '151-e, janpath road, new delhi',
          city: {
            name: 'New Delhi'
          },
          state: {
            name: 'Delhi'
          },
          email: 'santosh.k@gmail.com',
          phone: '6251423251'
        },
        payments: [
          {
            collected_by: 'BPP',
            params: {
              bank_account: '1234002341',
              bank_code: 'INB0004321',
              price: {
                value: 300,
                currency: 'EUR'
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
                  currency: 'EUR',
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
