export const initResponse = {
  data: [
    {
      context: {
        domain: 'state_forest_department',
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
        transaction_id: 'd2c29d8e-e614-4538-b168-4a56a7b2337d',
        message_id: 'cf8e96d7-4696-47c3-8217-6102fe15bc10',
        ttl: 'PT10M',
        timestamp: '2025-01-08T16:05:04.713Z'
      },
      message: {
        order: {
          provider: {
            id: '814',
            name: 'Open Data Platform',
            short_desc: 'Terragaze specializes in data collection and analysis using LiDAR technology.',
            long_desc: 'License: Proprietary  |  7 years in operation',
            rating: '4.2',
            images: {
              url: 'https://bpp-unified-strapi-dev.becknprotocol.io/uploads/Group_1000003567_785094e798.png',
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
              id: '338',
              name: 'Aerial LiDAR survey on Vanapur-Girivat belt data',
              short_desc: 'Terragaze specializes in data collection and analysis using LiDAR technology.',
              long_desc: 'License: Proprietary  |  7 years in operation',
              images: [
                {
                  url: 'https://bpp-unified-strapi-dev.becknprotocol.io/uploads/Group_1000003567_785094e798.png',
                  size_type: 'sm'
                }
              ],
              price: {
                value: '50'
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
                  code: 'Soil Hydrology',
                  description: 'Soil Hydrology',
                  list: [
                    {
                      code: 'Tree height',
                      value: 'Tree height',
                      display: true
                    },
                    {
                      code: 'Canopy',
                      value: 'Canopy',
                      display: true
                    },
                    {
                      code: 'Species',
                      value: 'Species',
                      display: true
                    },
                    {
                      code: 'Leaf Area Index',
                      value: 'Leaf Area Index',
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
                      code: '25 cm',
                      value: '25 cm',
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
                      code: '1 month',
                      value: '1 month',
                      display: true
                    },
                    {
                      code: '2 month',
                      value: '2 month',
                      display: true
                    },
                    {
                      code: '3 month',
                      value: '3 month',
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
              value: '50'
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
