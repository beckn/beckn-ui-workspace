export type OrderStatus = 'REQUEST_SHARED' | 'ORDER_RECEIVED'

export const statusResponse = (orderStatus: OrderStatus) => {
  return {
    data: [
      {
        context: {
          domain: 'harmoniaid',
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
          transaction_id: 'c7cde38d-8f22-4671-b91b-b138ac865bcd',
          message_id: '861fc584-a076-4462-bd37-f22ecf8e3233',
          ttl: 'PT10M',
          timestamp: '2025-01-06T08:52:53.844Z'
        },
        message: {
          order: {
            id: '2668',
            status: 'ACTIVE',
            created_at: '2025-01-06T08:52:00.624Z',
            provider: {
              id: '805',
              name: 'Ministry of Health',
              short_desc:
                'The Ministry of Health is the primary governmental body responsible for all public health and healthcare services in the country. ',
              long_desc: 'License: CC BY-NC-SA  |  26 years in operation',
              rating: '4.2',
              images: {
                url: 'https://abc.com',
                size_type: 'sm'
              },
              rateable: true
            },
            items: [
              {
                id: '329',
                name: 'Health related population exposure and vulnerability data in Sylhet',
                images: [
                  {
                    url: 'https://bpp-unified-strapi-dev.becknprotocol.io/uploads/Group_1000003473_4adefabc52.png',
                    size_type: 'sm'
                  }
                ],
                price: {
                  value: '40'
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
                    description: 'Population Exposure Datapoints',
                    display: true,
                    list: [
                      {
                        value: 'Distribution of population dependent on life-sustaining equipment',
                        display: true
                      }
                    ]
                  },
                  {
                    description: 'Population Exposure Datapoints',
                    display: true,
                    list: [
                      {
                        value: 'Distribution of population dependent on critical medicines',
                        display: true
                      }
                    ]
                  },
                  {
                    description: 'Population Exposure Datapoints',
                    display: true,
                    list: [
                      {
                        value: 'Distribution of population within reach of healthcare facilities',
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
                    description: 'Population Exposure Datapoints',
                    display: true,
                    list: [
                      {
                        value: 'Distribution of population dependent on life-sustaining equipment',
                        display: true
                      }
                    ]
                  },
                  {
                    description: 'Population Exposure Datapoints',
                    display: true,
                    list: [
                      {
                        value: 'Distribution of population dependent on critical medicines',
                        display: true
                      }
                    ]
                  },
                  {
                    description: 'Population Exposure Datapoints',
                    display: true,
                    list: [
                      {
                        value: 'Distribution of population within reach of healthcare facilities',
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
                    code: 'ORDER_RECEIVED',
                    short_desc: 'ORDER RECEIVED'
                  },
                  updated_at: '2025-01-06T08:52:00.673Z'
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
                value: '40'
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
