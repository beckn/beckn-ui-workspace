export type OrderStatus = 'REQUEST_SHARED' | 'ORDER_RECEIVED'

export const statusResponse = (orderStatus: OrderStatus) => {
  return {
    data: [
      {
        context: {
          domain: 'dragon_foods',
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
          transaction_id: '6748d2cd-b5bc-43b4-b7e4-723df257bc33',
          message_id: '455617e3-070b-4652-92ee-4b6bdc8e3710',
          ttl: 'PT10M',
          timestamp: '2024-12-27T08:12:57.895Z'
        },
        message: {
          order: {
            id: '2650',
            status: 'ACTIVE',
            created_at: '2024-12-26T05:46:11.243Z',
            provider: {
              id: '809',
              name: 'Climatic',
              short_desc:
                'Founded in 2019, Climatic is a climate disaster modelling company based out of Dhaka, offering high resolution services for flood modelling.',
              long_desc: 'License: Proprietary | 5 years in operation',
              rating: '4.2',
              images: {
                url: 'https://abc.com',
                size_type: 'sm'
              },
              rateable: true
            },
            items: [
              {
                id: '333',
                name: 'Medium resolution integrated model flood prediction data',
                images: [
                  {
                    url: 'https://bpp-unified-strapi-dev.becknprotocol.io/uploads/climate_4e8c30a7f5.jpg',
                    size_type: 'sm'
                  }
                ],
                price: {
                  value: '10'
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
                    description: 'Confidence Levels',
                    display: true,
                    list: [
                      {
                        value: '90%',
                        display: true
                      }
                    ]
                  },
                  {
                    description: 'Confidence Levels',
                    display: true,
                    list: [
                      {
                        value: '85%',
                        display: true
                      }
                    ]
                  },
                  {
                    description: 'Flood Prediction Datapoint',
                    display: true,
                    list: [
                      {
                        value: 'Flood onset date',
                        display: true
                      }
                    ]
                  },
                  {
                    description: 'Flood Prediction Datapoint',
                    display: true,
                    list: [
                      {
                        value: 'Flood onset time',
                        display: true
                      }
                    ]
                  },
                  {
                    description: 'Flood Prediction Datapoint',
                    display: true,
                    list: [
                      {
                        value: 'Flood extent',
                        display: true
                      }
                    ]
                  },
                  {
                    description: 'Flood Prediction Datapoint',
                    display: true,
                    list: [
                      {
                        value: 'FLood runoff Volumes',
                        display: true
                      }
                    ]
                  },
                  {
                    description: 'Flood Prediction Datapoint',
                    display: true,
                    list: [
                      {
                        value: 'Return Periods',
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
                        value: '80 m',
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
                    description: 'Temporal Coverage',
                    display: true,
                    list: [
                      {
                        value: '5 days',
                        display: true
                      }
                    ]
                  },
                  {
                    description: 'Temporal Coverage',
                    display: true,
                    list: [
                      {
                        value: '10 days',
                        display: true
                      }
                    ]
                  },
                  {
                    description: 'Temporal Coverage',
                    display: true,
                    list: [
                      {
                        value: '20 days',
                        display: true
                      }
                    ]
                  },
                  {
                    description: 'Temporal Resolutions',
                    display: true,
                    list: [
                      {
                        value: '15 days',
                        display: true
                      }
                    ]
                  },
                  {
                    description: 'Temporal Resolutions',
                    display: true,
                    list: [
                      {
                        value: '30 days',
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
                    description: 'Subscription Durations',
                    display: true,
                    list: [
                      {
                        value: 'One time',
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
                  updated_at: '2024-12-26T05:46:11.302Z'
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
                value: '10'
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
