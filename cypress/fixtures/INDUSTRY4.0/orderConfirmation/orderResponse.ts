import { v4 as uuidv4 } from 'uuid'

export const orderResponse = {
  data: {
    id: 1822,
    attributes: {
      order_id: uuidv4().toString(),
      bpp_id: 'bpp-ps-network-strapi-dev.becknprotocol.io',
      bpp_uri: 'http://bpp-ps-network-strapi-dev.becknprotocol.io',
      currency: 'EUR',
      delivery_status: null,
      descriptor: {
        name: 'Makerspace - S',
        short_desc: 'Makerspace'
      },
      price: 300,
      billing: null,
      fulfillments: null,
      created_date: null,
      last_updated_date: null,
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
            price: {
              value: '200',
              currency: 'EUR'
            },
            title: 'Base Price'
          },
          {
            item: {
              id: '61'
            },
            price: {
              value: '50',
              currency: 'EUR'
            },
            title: 'Shipping Cost'
          },
          {
            item: {
              id: '61'
            },
            price: {
              value: '50',
              currency: 'EUR'
            },
            title: 'Tax'
          }
        ]
      },
      transaction_id: 'de1578ee-9cad-45b1-9d3a-248c75a5d6ba',
      message_id: null,
      payments: [
        {
          type: 'PRE-ORDER',
          params: {
            price: '300',
            currency: 'EUR',
            bank_code: 'INB0004321',
            bank_account: '1234002341',
            bank_account_name: 'Makerspace Assembly Ltd'
          },
          status: 'PAID',
          collected_by: 'BPP'
        }
      ],
      items: [
        {
          id: '61',
          code: 'IAT',
          name: 'Intermittent assembly type',
          tags: [
            {
              list: [
                {
                  code: 'product-info',
                  value: 'Product Information'
                }
              ],
              display: true
            },
            {
              list: [
                {
                  code: 'assembly-info',
                  value: 'Assembly Information'
                }
              ],
              display: true
            },
            {
              list: [
                {
                  code: 'scale-info',
                  value: 'Scale Information'
                }
              ],
              display: true
            },
            {
              list: [
                {
                  code: 'printer-info',
                  value: 'Printer Information"'
                }
              ],
              display: true
            }
          ],
          price: {
            value: '300',
            currency: 'EUR'
          },
          images: [
            {
              url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJQbANiJKOddLqjBqk3Y-bws-pUxisbxvhrw&usqp=CAU',
              size_type: 'sm'
            }
          ],
          rating: '4.5',
          quantity: {
            available: {
              measure: {
                unit: 'kWh',
                value: '0'
              }
            }
          },
          rateable: true,
          locations: [
            {
              id: '59',
              city: 'Akola',
              state: 'Maharashtra',
              country: 'India'
            }
          ],
          long_desc:
            '<div>Intermittent Assembly Product - Enhanced Efficiency, Unmatched Performance!</h1><p>Welcome to the future of assembly technology! Revolutionize your workflow with unparalleled efficiency and precision.</p><p>Key Features:</p><ul><li>Precise Intermittent Assembly Technology.</li><li>Advanced automation for time and resource savings.</li><li>Durable materials for longevity and reliability.</li><li>Customizable settings for various assembly requirements.</li></ul><p>Invest in the future of assembly technology. Elevate your production capabilities today!</div>',
          categories: [
            {
              id: '65',
              name: 'Assembly'
            }
          ],
          short_desc: 'This is an intermittent assembly type.',
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
      createdAt: '2024-08-28T16:24:26.146Z',
      updatedAt: '2024-08-28T16:24:26.146Z',
      publishedAt: '2024-08-28T16:24:26.139Z',
      domain: null
    }
  },
  meta: {}
}
