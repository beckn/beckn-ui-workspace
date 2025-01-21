export type OrderStatus = 'REQUEST_SHARED' | 'ORDER_RECEIVED'

export const statusResponse = (orderStatus: OrderStatus) => {
  return {
    data: [
      {
        context: {
          domain: 'state_forest_department',
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
          transaction_id: '577f556e-5904-4c55-ac37-65a0b84ed2f3',
          message_id: 'b7dc675f-e7cd-41f3-a85b-c3c3ca96f486',
          ttl: 'PT10M',
          timestamp: '2025-01-08T16:10:11.092Z'
        },
        message: {
          order: {
            id: '2278',
            status: 'ACTIVE',
            created_at: '2024-11-20T05:19:34.544Z',
            provider: {
              id: '813',
              name: 'Ministry of Agriculture',
              short_desc:
                'Ministry of Agriculture is engaged in conducting soil survey of different intensities in order to provide scientific database for developmental programmes.',
              long_desc: 'License: CC BY-NC-SA  |  75 years in operation',
              rating: '4.2',
              images: {
                url: 'https://abc.com',
                size_type: 'sm'
              },
              rateable: true
            },
            items: [
              {
                id: '337',
                name: 'Soil Survey data',
                short_desc:
                  'Ministry of Agriculture is engaged in conducting soil survey of different intensities in order to provide scientific database for developmental programmes.',
                long_desc: 'License: CC BY-NC-SA  |  75 years in operation',
                images: [
                  {
                    url: 'https://bpp-unified-strapi-dev.becknprotocol.io/uploads/Vector_d4979cbfc5.png',
                    size_type: 'sm'
                  }
                ],
                price: {
                  value: '30'
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
                    description: 'Soil Hydrology',
                    display: true,
                    list: [
                      {
                        value: 'Soil moisture',
                        display: true
                      }
                    ]
                  },
                  {
                    description: 'Spatial Representation',
                    display: true,
                    list: [
                      {
                        value: 'Raster',
                        display: true
                      }
                    ]
                  },
                  {
                    description: 'Spatial Coverage',
                    display: true,
                    list: [
                      {
                        value: 'Beanibazar',
                        display: true
                      }
                    ]
                  },
                  {
                    description: 'Spatial Coverage',
                    display: true,
                    list: [
                      {
                        value: 'Gopalganj',
                        display: true
                      }
                    ]
                  },
                  {
                    description: 'Spatial Coverage',
                    display: true,
                    list: [
                      {
                        value: 'Balaganj',
                        display: true
                      }
                    ]
                  },
                  {
                    description: 'Spatial Coverage',
                    display: true,
                    list: [
                      {
                        value: 'Biswanath',
                        display: true
                      }
                    ]
                  },
                  {
                    description: 'Spatial Coverage',
                    display: true,
                    list: [
                      {
                        value: 'Kanaigath',
                        display: true
                      }
                    ]
                  },
                  {
                    description: 'Spatial Resolutions',
                    display: true,
                    list: [
                      {
                        value: '1 km',
                        display: true
                      }
                    ]
                  },
                  {
                    description: 'Spatial Resolutions',
                    display: true,
                    list: [
                      {
                        value: '5 km',
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
                        value: 'NetCDF',
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
                    description: 'Temporal Coverage',
                    display: true,
                    list: [
                      {
                        value: '10 year',
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
                        value: 'Email',
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
                  updated_at: '2024-11-20T05:19:34.581Z'
                },
                stops: [
                  {
                    type: 'start',
                    location: {
                      gps: '28.6436082,77.08698369999999',
                      address: 'Flat 208, A Block, Janakpuri West, New Delhi',
                      city: {
                        name: 'New Delhi'
                      },
                      country: {
                        code: 'IND'
                      },
                      area_code: '110018',
                      state: {
                        name: 'Delhi'
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
                value: '30'
              }
            },
            billing: {
              state: {
                name: 'Delhi'
              },
              city: {
                name: 'New Delhi'
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
