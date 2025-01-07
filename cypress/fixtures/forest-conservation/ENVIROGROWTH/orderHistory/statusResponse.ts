export type OrderStatus = 'REQUEST_SHARED' | 'ORDER_RECEIVED'

export const statusResponse = (orderStatus: OrderStatus) => {
  return {
    data: [
      {
        context: {
          domain: 'envirogrowth',
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
          transaction_id: 'ef2a7b24-4cff-45be-a64e-2458e21d10fb',
          message_id: '34307036-e181-4131-86b2-3a70cc8fc56b',
          ttl: 'PT10M',
          timestamp: '2025-01-05T18:24:30.408Z'
        },
        message: {
          order: {
            id: '2667',
            status: 'ACTIVE',
            created_at: '2025-01-05T18:20:15.907Z',
            provider: {
              id: '818',
              name: 'Nationa Met Dept',
              short_desc:
                'National Metrological Department is responsible for maintaining the network of surface and upper air observatories, radar and satellite...',
              long_desc: 'License: CC BY-NC-SA  |  63 years in operation',
              images: {
                url: 'https://abc.com',
                size_type: 'sm'
              },
              rateable: true
            },
            items: [
              {
                id: '342',
                name: 'Archive of climate and weather data',
                images: [
                  {
                    url: 'https://bpp-unified-strapi-dev.becknprotocol.io/uploads/Vector_1_013a42effa.png',
                    size_type: 'sm'
                  }
                ],
                price: {
                  value: '80'
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
                    description: 'Climate Datapoints',
                    display: true,
                    list: [
                      {
                        value: 'Temperature',
                        display: true
                      }
                    ]
                  },
                  {
                    description: 'Climate Datapoints',
                    display: true,
                    list: [
                      {
                        value: 'Precipitation',
                        display: true
                      }
                    ]
                  },
                  {
                    description: 'Climate Datapoints',
                    display: true,
                    list: [
                      {
                        value: 'Snow cover days',
                        display: true
                      }
                    ]
                  },
                  {
                    description: 'Climate Datapoints',
                    display: true,
                    list: [
                      {
                        value: 'Total cloud cover',
                        display: true
                      }
                    ]
                  },
                  {
                    description: 'Climate Datapoints',
                    display: true,
                    list: [
                      {
                        value: 'Vapor pressure deficit',
                        display: true
                      }
                    ]
                  },
                  {
                    description: 'Spatial Representation',
                    display: true,
                    list: [
                      {
                        value: 'Vector',
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
                    description: 'Spatial Resolutions',
                    display: true,
                    list: [
                      {
                        value: '10 km',
                        display: true
                      }
                    ]
                  },
                  {
                    description: 'Spatial Resolutions',
                    display: true,
                    list: [
                      {
                        value: '50 km',
                        display: true
                      }
                    ]
                  },
                  {
                    description: 'Spatial Resolutions',
                    display: true,
                    list: [
                      {
                        value: '100 km',
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
                    description: 'Temporal Coverage',
                    display: true,
                    list: [
                      {
                        value: '50 year',
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
                  updated_at: '2025-01-05T18:20:15.937Z'
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
                value: '80'
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
