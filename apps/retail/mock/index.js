export const importedOrderMockdata = {
  context: {},
  message: {
    order: {
      id: '765869',
      created_at: 'Apr 15 2024, 16:27:18',
      billing: {
        address: {
          street: '15 Rue du Soleil, Paris, France'
        }
      },
      provider: {
        extended_attributes: {},
        id: './retail.kirana/ind.blr/177@retail-bpp-infra2.becknprotocol.io.provider',
        descriptor: {
          name: 'TouringParis'
        }
      },
      item: [
        {
          descriptor: {
            name: 'Arctic Monkeys Music Concert',
            images: ['https://retail-bpp-infra2.becknprotocol.io/attachments/view/433.jpg']
          },
          price: {
            value: '57.0'
          },
          quantity: {
            count: 1
          },
          tags: {
            fulfillment_start_loc: '48.86176/2.38081',
            Festival: 'Y',
            Category: 'TourismEnglish',
            fulfillment_end_time: '15th-May-2023',
            Monkey: 'Y',
            Monkeys: 'Y',
            Concert: 'Y',
            Music: 'Y',
            imageUrl: 'https://humbhionline.in/dashboard/images/MandiLogo.svg',
            Country: 'France',
            Show: 'Y',
            Arctic: 'Y',
            Musical: 'Y',
            Paris: 'Y',
            fulfillment_start_time: '10th-May-2023',
            fulfillment_end_loc: '48.86176/2.38081'
          },
          fulfillment: {
            start: {
              location: {
                gps: '26.846694,80.946166'
              }
            },
            end: {
              location: {
                gps: '26.846694,80.946166'
              }
            }
          }
        }
      ]
    }
  }
}
