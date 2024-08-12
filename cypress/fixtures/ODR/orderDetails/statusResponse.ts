export const statusResponse = orderStatus => {
  return {
    data: [
      {
        context: {
          domain: 'online-dispute-resolution:0.1.0',
          action: 'on_status',
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
          transaction_id: '1dacf0e5-a79e-425a-9056-0ae37e996a5d',
          message_id: 'b42c7d93-fe7d-4729-8250-f35f339369ed',
          ttl: 'PT10M',
          timestamp: '2024-08-12T06:27:30.992Z'
        },
        message: {
          order: {
            id: '987',
            created_at: '2024-08-12T05:21:00.787Z',
            provider: {
              id: '35',
              name: 'Alpha',
              short_desc: 'Alpha Pvt Ltd., India.',
              long_desc:
                'Alpha Pvt Ltd., India. provides online dispute resolution services. Out platform facilitates easy access to high quality service providers which helps avoid hassles of court, saving time and money and relationships.',
              images: {
                url: 'https://upload.wikimedia.org/wikipedia/commons/9/93/Justdial_logo.png',
                size_type: 'sm'
              },
              rateable: true
            },
            items: [
              {
                id: '49',
                name: 'Conciliation Services',
                short_desc:
                  'HarmonyArbitrators offers expert conciliation services, fostering amicable resolutions for disputes. Trust us for a harmonious legal experience',
                long_desc:
                  '<html><body><p>Alpha excels in conciliation services, promoting amicable resolutions for :&nbsp;</p><ol><li>civil,</li><li>family,</li><li>employment,</li><li>commercial, and</li><li>financial disputes.</li></ol><p>Our skilled conciliators facilitate constructive dialogue, guiding parties toward mutually beneficial outcomes with a commitment to fairness, transparency, and client satisfaction. Choose HarmonyArbitrators for dedicated, effective, and harmonious dispute resolution.</p></body></html>',
                images: [
                  {
                    url: 'https://odr-catalogue.becknprotocol.io/odr-catalogue/ODR-catalogue/concilation.jpg',
                    size_type: 'sm'
                  }
                ],
                price: {
                  value: '3200'
                },
                rating: '4',
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
                id: '1',
                state: {
                  descriptor: {
                    code: orderStatus,
                    short_desc: orderStatus
                  },
                  updated_at: '2024-08-12T05:51:31.930Z'
                },
                customer: {
                  person: {
                    name: 'Santosh Kumar'
                  },
                  contact: {
                    phone: '9811259151',
                    email: 'santosh.k@gmail.com'
                  }
                },
                stops: [
                  {
                    type: 'end',
                    location: {
                      address: '23, east end , sector 10, pritampura, delhi',
                      city: {
                        name: 'New Delhi'
                      },
                      state: {
                        name: 'Delhi'
                      }
                    }
                  }
                ],
                tracking: false
              }
            ],
            quote: {
              price: {
                value: '3200'
              }
            },
            billing: {
              name: 'jay d',
              address: '23, east end , sector 10, pritampura, delhi',
              state: {
                name: 'Delhi'
              },
              city: {
                name: 'New Delhi'
              },
              email: 'jay.d@gmail.com',
              phone: '9871432309'
            },
            payments: [
              {
                collected_by: 'BPP',
                status: 'PAID',
                type: 'PRE-ORDER'
              }
            ],
            type: 'DEFAULT'
          }
        }
      }
    ]
  }
}
