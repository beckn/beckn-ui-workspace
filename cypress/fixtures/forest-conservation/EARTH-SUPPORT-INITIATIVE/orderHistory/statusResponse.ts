export type OrderStatus = 'REQUEST_SHARED' | 'ORDER_RECEIVED'

export const statusResponse = (orderStatus: OrderStatus) => {
  return {
    data: [
      {
        context: {
          domain: 'earth_support_initiative',
          action: 'on_status',
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
          transaction_id: '67e244d5-c8c0-4973-9eca-3d45df45ad87',
          message_id: 'cbf183dd-e2a9-441e-b63a-17970f600548',
          ttl: 'PT10M',
          timestamp: '2025-01-09T09:26:49.079Z'
        },
        message: {
          order: {
            id: '2676',
            status: 'ACTIVE',
            created_at: '2025-01-09T09:23:56.024Z',
            provider: {
              id: '816',
              name: 'Enviogrowth',
              short_desc:
                'The Envirogrowth Foundation is a non-profit organization specializing in environmental restoration efforts using science-based approaches.',
              long_desc: 'License: CC BY-NC-SA  |  7 years in operation',
              images: {
                url: 'https://abc.com',
                size_type: 'sm'
              },
              rateable: true
            },
            items: [
              {
                id: '340',
                name: 'On-field data of restoration project',
                images: [
                  {
                    url: 'https://bpp-unified-strapi-dev.becknprotocol.io/uploads/Group_1000003530_af48d6930c.png',
                    size_type: 'sm'
                  }
                ],
                price: {
                  value: '15'
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
                tags: [
                  {
                    description: 'Forest Datapoints',
                    display: true,
                    list: [
                      {
                        value: 'Number of trees',
                        display: true
                      }
                    ]
                  },
                  {
                    description: 'Forest Datapoints',
                    display: true,
                    list: [
                      {
                        value: 'Survival Rate',
                        display: true
                      }
                    ]
                  },
                  {
                    description: 'Forest Datapoints',
                    display: true,
                    list: [
                      {
                        value: 'Growth Rate',
                        display: true
                      }
                    ]
                  },
                  {
                    description: 'Forest Datapoints',
                    display: true,
                    list: [
                      {
                        value: 'Pest and disease incidence',
                        display: true
                      }
                    ]
                  },
                  {
                    description: 'Forest Datapoints',
                    display: true,
                    list: [
                      {
                        value: 'Tree height',
                        display: true
                      }
                    ]
                  },
                  {
                    description: 'Forest Datapoints',
                    display: true,
                    list: [
                      {
                        value: 'Crown diameter',
                        display: true
                      }
                    ]
                  },
                  {
                    description: 'Data Formats',
                    display: true,
                    list: [
                      {
                        value: 'XML',
                        display: true
                      }
                    ]
                  },
                  {
                    description: 'Data Formats',
                    display: true,
                    list: [
                      {
                        value: 'CSV',
                        display: true
                      }
                    ]
                  },
                  {
                    description: 'Data Formats',
                    display: true,
                    list: [
                      {
                        value: 'HDF',
                        display: true
                      }
                    ]
                  },
                  {
                    description: 'Temporal Coverage',
                    display: true,
                    list: [
                      {
                        value: '1 month',
                        display: true
                      }
                    ]
                  },
                  {
                    description: 'Temporal Coverage',
                    display: true,
                    list: [
                      {
                        value: '3 month',
                        display: true
                      }
                    ]
                  },
                  {
                    description: 'Temporal Coverage',
                    display: true,
                    list: [
                      {
                        value: '1 year',
                        display: true
                      }
                    ]
                  },
                  {
                    description: 'Temporal Coverage',
                    display: true,
                    list: [
                      {
                        value: '5year',
                        display: true
                      }
                    ]
                  },
                  {
                    description: 'Data Sharing Modes',
                    display: true,
                    list: [
                      {
                        value: 'FTP',
                        display: true
                      }
                    ]
                  },
                  {
                    description: 'Data Sharing Modes',
                    display: true,
                    list: [
                      {
                        value: 'SOAP_API',
                        display: true
                      }
                    ]
                  },
                  {
                    description: 'Data Sharing Modes',
                    display: true,
                    list: [
                      {
                        value: 'Rest API',
                        display: true
                      }
                    ]
                  },
                  {
                    description: 'Data Sharing Modes',
                    display: true,
                    list: [
                      {
                        value: 'Email',
                        display: true
                      }
                    ]
                  },
                  {
                    description: 'Subscription Durations',
                    display: true,
                    list: [
                      {
                        value: '3 months',
                        display: true
                      }
                    ]
                  },
                  {
                    description: 'Subscription Durations',
                    display: true,
                    list: [
                      {
                        value: '6 months',
                        display: true
                      }
                    ]
                  },
                  {
                    description: 'Subscription Durations',
                    display: true,
                    list: [
                      {
                        value: '1 year',
                        display: true
                      }
                    ]
                  },
                  {
                    description: 'Frequency',
                    display: true,
                    list: [
                      {
                        value: 'Quarterly',
                        display: true
                      }
                    ]
                  },
                  {
                    description: 'Frequency',
                    display: true,
                    list: [
                      {
                        value: 'Half-yearly',
                        display: true
                      }
                    ]
                  },
                  {
                    description: 'Frequency',
                    display: true,
                    list: [
                      {
                        value: 'Annually',
                        display: true
                      }
                    ]
                  }
                ]
              }
            ],
            fulfillments: [
              {
                id: '3',
                state: {
                  descriptor: {
                    code: orderStatus,
                    short_desc: 'ORDER RECEIVED'
                  },
                  updated_at: '2025-01-09T09:23:56.056Z'
                },
                stops: [
                  {
                    type: 'start',
                    location: {
                      gps: '12.898773,77.5764094',
                      address: '1202 b2, Bengaluru urban, Bengaluru, Karnataka',
                      city: {
                        name: 'Bengaluru'
                      },
                      country: {
                        code: 'IND'
                      },
                      area_code: '560078',
                      state: {
                        name: 'Karnataka'
                      }
                    }
                  }
                ],
                agent: {
                  person: {
                    name: ' '
                  }
                },
                rating: '5'
              }
            ],
            quote: {
              price: {
                value: '15'
              }
            },
            billing: {
              state: {
                name: 'Karnataka'
              },
              city: {
                name: 'Bengaluru'
              }
            },
            payments: [
              {
                collected_by: 'BPP',
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
