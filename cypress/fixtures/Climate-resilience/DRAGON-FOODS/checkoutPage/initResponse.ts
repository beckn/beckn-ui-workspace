export const initResponse = {
  data: [
    {
      context: {
        domain: 'dragon_foods',
        action: 'on_init',
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
        transaction_id: '155d73bd-c042-41af-aaa2-bc5fff03d3b2',
        message_id: 'e8567422-dae0-4263-8cd4-fd5e3743e5e6',
        ttl: 'PT10M',
        timestamp: '2024-12-27T13:54:56.266Z'
      },
      message: {
        order: {
          provider: {
            id: '809',
            name: 'Climatic',
            short_desc:
              'Founded in 2019, Climatic is a climate disaster modelling company based out of Dhaka, offering high resolution services for flood modelling.',
            long_desc: 'License: Proprietary | 5 years in operation',
            rating: '4.2',
            images: {
              url: 'https://bpp-unified-strapi-dev.becknprotocol.io/uploads/climate_4e8c30a7f5.jpg',
              size_type: 'sm'
            },
            fulfillments: [
              {
                id: '3',
                type: 'Standard-shipping',
                stops: [
                  {
                    location: {
                      gps: '12.898773,77.5764094',
                      address: '1202 b2, Bengaluru urban, Bengaluru, Karnataka',
                      city: {
                        name: 'Bengaluru'
                      },
                      state: {
                        name: 'Karnataka'
                      },
                      country: {
                        code: 'IND'
                      },
                      area_code: '560078'
                    },
                    contact: {
                      phone: '9811259151',
                      email: 'lisa.k@gmail.com'
                    }
                  }
                ]
              }
            ]
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
                  code: 'Confidence Levels',
                  description: 'Confidence Levels',
                  list: [
                    {
                      code: '90%',
                      value: '90%',
                      display: true
                    },
                    {
                      code: '85%',
                      value: '85%',
                      display: true
                    }
                  ]
                },
                {
                  code: 'Flood Prediction Datapoint',
                  description: 'Flood Prediction Datapoint',
                  list: [
                    {
                      code: 'Flood onset date',
                      value: 'Flood onset date',
                      display: true
                    },
                    {
                      code: 'Flood onset time',
                      value: 'Flood onset time',
                      display: true
                    },
                    {
                      code: 'Flood extent',
                      value: 'Flood extent',
                      display: true
                    },
                    {
                      code: 'FLood runoff Volumes',
                      value: 'FLood runoff Volumes',
                      display: true
                    },
                    {
                      code: 'Return Periods',
                      value: 'Return Periods',
                      display: true
                    }
                  ]
                },
                {
                  code: 'Spatial Representation',
                  description: 'Spatial Representation',
                  list: [
                    {
                      code: 'Vector',
                      value: 'Vector',
                      display: true
                    },
                    {
                      code: 'Raster',
                      value: 'Raster',
                      display: true
                    }
                  ]
                },
                {
                  code: 'Spatial Coverage',
                  description: 'Spatial Coverage',
                  list: [
                    {
                      code: 'Beanibazar',
                      value: 'Beanibazar',
                      display: true
                    },
                    {
                      code: 'Gopalganj',
                      value: 'Gopalganj',
                      display: true
                    },
                    {
                      code: 'Balaganj',
                      value: 'Balaganj',
                      display: true
                    },
                    {
                      code: 'Biswanath',
                      value: 'Biswanath',
                      display: true
                    },
                    {
                      code: 'Kanaigath',
                      value: 'Kanaigath',
                      display: true
                    }
                  ]
                },
                {
                  code: 'Spatial Resolutions',
                  description: 'Spatial Resolutions',
                  list: [
                    {
                      code: '80 m',
                      value: '80 m',
                      display: true
                    },
                    {
                      code: '5 km',
                      value: '5 km',
                      display: true
                    }
                  ]
                },
                {
                  code: 'Temporal Coverage',
                  description: 'Temporal Coverage',
                  list: [
                    {
                      code: '5 days',
                      value: '5 days',
                      display: true
                    },
                    {
                      code: '10 days',
                      value: '10 days',
                      display: true
                    },
                    {
                      code: '20 days',
                      value: '20 days',
                      display: true
                    }
                  ]
                },
                {
                  code: 'Temporal Resolutions',
                  description: 'Temporal Resolutions',
                  list: [
                    {
                      code: '15 days',
                      value: '15 days',
                      display: true
                    },
                    {
                      code: '30 days',
                      value: '30 days',
                      display: true
                    }
                  ]
                },
                {
                  code: 'Data Formats',
                  description: 'Data Formats',
                  list: [
                    {
                      code: 'XML',
                      value: 'XML',
                      display: true
                    },
                    {
                      code: 'CSV',
                      value: 'CSV',
                      display: true
                    },
                    {
                      code: 'NetCDF',
                      value: 'NetCDF',
                      display: true
                    },
                    {
                      code: 'HDF',
                      value: 'HDF',
                      display: true
                    }
                  ]
                },
                {
                  code: 'Data Sharing Modes',
                  description: 'Data Sharing Modes',
                  list: [
                    {
                      code: 'FTP',
                      value: 'FTP',
                      display: true
                    },
                    {
                      code: 'SOAP_API',
                      value: 'SOAP_API',
                      display: true
                    },
                    {
                      code: 'Email',
                      value: 'Email',
                      display: true
                    }
                  ]
                },
                {
                  code: 'Subscription Durations',
                  description: 'Subscription Durations',
                  list: [
                    {
                      code: 'One time',
                      value: 'One time',
                      display: true
                    },
                    {
                      code: '3 months',
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
              type: 'Standard-shipping',
              stops: [
                {
                  location: {
                    gps: '12.898773,77.5764094',
                    address: '1202 b2, Bengaluru urban, Bengaluru, Karnataka',
                    city: {
                      name: 'Bengaluru'
                    },
                    state: {
                      name: 'Karnataka'
                    },
                    country: {
                      code: 'IND'
                    },
                    area_code: '560078'
                  },
                  contact: {
                    phone: '9811259151',
                    email: 'lisa.k@gmail.com'
                  }
                }
              ]
            }
          ],
          quote: {
            price: {
              value: '10'
            }
          },
          billing: {
            city: {
              name: 'Bengaluru'
            },
            state: {
              name: 'Karnataka'
            }
          }
        }
      }
    }
  ]
}
