export const initResponse = {
  data: [
    {
      context: {
        domain: 'envirogrowth',
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
        transaction_id: 'ee96612b-9f1d-4f20-8ad4-b56dd5ed1a74',
        message_id: '3b74e702-8be4-40a5-b970-b68a650206b3',
        ttl: 'PT10M',
        timestamp: '2025-01-05T18:10:57.605Z'
      },
      message: {
        order: {
          provider: {
            id: '818',
            name: 'Nationa Met Dept',
            short_desc:
              'National Metrological Department is responsible for maintaining the network of surface and upper air observatories, radar and satellite...',
            long_desc: 'License: CC BY-NC-SA  |  63 years in operation',
            images: {
              url: 'https://bpp-unified-strapi-dev.becknprotocol.io/uploads/Vector_1_013a42effa.png',
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
                  code: 'Climate Datapoints',
                  description: 'Climate Datapoints',
                  list: [
                    {
                      code: 'Temperature',
                      value: 'Temperature',
                      display: true
                    },
                    {
                      code: 'Precipitation',
                      value: 'Precipitation',
                      display: true
                    },
                    {
                      code: 'Snow cover days',
                      value: 'Snow cover days',
                      display: true
                    },
                    {
                      code: 'Total cloud cover',
                      value: 'Total cloud cover',
                      display: true
                    },
                    {
                      code: 'Vapor pressure deficit',
                      value: 'Vapor pressure deficit',
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
                  code: 'Spatial Resolutions',
                  description: 'Spatial Resolutions',
                  list: [
                    {
                      code: '10 km',
                      value: '10 km',
                      display: true
                    },
                    {
                      code: '50 km',
                      value: '50 km',
                      display: true
                    },
                    {
                      code: '100 km',
                      value: '100 km',
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
                  code: 'Temporal Coverage',
                  description: 'Temporal Coverage',
                  list: [
                    {
                      code: '5 year',
                      value: '5 year',
                      display: true
                    },
                    {
                      code: '10 year',
                      value: '10 year',
                      display: true
                    },
                    {
                      code: '50 year',
                      value: '50 year',
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
                    },
                    {
                      code: 'Rest API',
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
              value: '80'
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
