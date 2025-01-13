export type OrderStatus = 'REQUEST_SHARED' | 'ORDER_RECEIVED'

export const statusResponse = (orderStatus: OrderStatus) => {
  return {
    data: [
      {
        context: {
          domain: 'skyanalytics_flow',
          action: 'on_status',
          version: '1.1.0',
          bpp_id: 'bpp-ps-network-strapi-dev.example.io',
          bpp_uri: 'http://bpp-ps-network-strapi-dev.example.io',
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
          bap_id: 'bap-ps-network-dev.example.io',
          bap_uri: 'https://bap-ps-network-dev.example.io',
          transaction_id: 'b2a2459d-55b9-4330-aed0-bff1edc039df',
          message_id: '1dbea410-92d6-4554-adb6-3553074d5212',
          ttl: 'PT10M',
          timestamp: '2025-01-09T05:55:59.126Z'
        },
        message: {
          order: {
            id: '2653',
            status: 'ACTIVE',
            created_at: '2025-01-09T05:45:34.422Z',
            provider: {
              id: '810',
              name: 'National Meterological Department',
              short_desc:
                'The National Meteorological Department is the national meteorological organization of the country, under Ministry of Defense.',
              long_desc: 'License: CC BY-NC-SA  |  53 years in operation',
              rating: '4.2',
              images: {
                url: 'https://abc.com',
                size_type: 'sm'
              },
              rateable: true
            },
            items: [
              {
                id: '334',
                name: 'Surface and space based high resolution weather historical and forecast data',
                short_desc: 'Weather Forecast',
                images: [
                  {
                    url: 'https://bpp-unified-strapi-dev.example.io/uploads/Group_1000003468_4b1c0ac8b3.png',
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
                    description: 'Confidence Levels',
                    display: true,
                    list: [
                      {
                        value: '70%',
                        display: true
                      }
                    ]
                  },
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
                    description: 'Weather datapoints',
                    display: true,
                    list: [
                      {
                        value: 'Temperature',
                        display: true
                      }
                    ]
                  },
                  {
                    description: 'Weather datapoints',
                    display: true,
                    list: [
                      {
                        value: 'Vertical wind speed',
                        display: true
                      }
                    ]
                  },
                  {
                    description: 'Weather datapoints',
                    display: true,
                    list: [
                      {
                        value: 'Horizontal wind velocity',
                        display: true
                      }
                    ]
                  },
                  {
                    description: 'Weather datapoints',
                    display: true,
                    list: [
                      {
                        value: 'Relative Humidity',
                        display: true
                      }
                    ]
                  },
                  {
                    description: 'Weather datapoints',
                    display: true,
                    list: [
                      {
                        value: 'Precipitation',
                        display: true
                      }
                    ]
                  },
                  {
                    description: 'Weather datapoints',
                    display: true,
                    list: [
                      {
                        value: 'Surface pressure',
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
                        value: '2.5 km',
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
                    description: 'Temporal Coverage Historial',
                    display: true,
                    list: [
                      {
                        value: '3 months',
                        display: true
                      }
                    ]
                  },
                  {
                    description: 'Temporal Coverage Historial',
                    display: true,
                    list: [
                      {
                        value: '6 months',
                        display: true
                      }
                    ]
                  },
                  {
                    description: 'Temporal Coverage Historial',
                    display: true,
                    list: [
                      {
                        value: '1 year',
                        display: true
                      }
                    ]
                  },
                  {
                    description: 'Temporal Coverage Forecast',
                    display: true,
                    list: [
                      {
                        value: '2 days',
                        display: true
                      }
                    ]
                  },
                  {
                    description: 'Temporal Coverage Forecast',
                    display: true,
                    list: [
                      {
                        value: '15 days',
                        display: true
                      }
                    ]
                  },
                  {
                    description: 'Temporal Coverage Forecast',
                    display: true,
                    list: [
                      {
                        value: '3 months',
                        display: true
                      }
                    ]
                  },
                  {
                    description: 'Forecast Temporal Resolutions',
                    display: true,
                    list: [
                      {
                        value: '3 hours',
                        display: true
                      }
                    ]
                  },
                  {
                    description: 'Forecast Temporal Resolutions',
                    display: true,
                    list: [
                      {
                        value: '6 hours',
                        display: true
                      }
                    ]
                  },
                  {
                    description: 'Forecast Temporal Resolutions',
                    display: true,
                    list: [
                      {
                        value: '12 hours',
                        display: true
                      }
                    ]
                  },
                  {
                    description: 'Forecast Temporal Resolutions',
                    display: true,
                    list: [
                      {
                        value: '24 hours',
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
                    short_desc: orderStatus
                  },
                  updated_at: '2025-01-09T05:45:34.458Z'
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
                value: '30'
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
