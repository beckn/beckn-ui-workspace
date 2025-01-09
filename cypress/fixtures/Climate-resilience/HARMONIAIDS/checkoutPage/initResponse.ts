export const initResponse = {
  data: [
    {
      context: {
        domain: 'harmoniaid',
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
        transaction_id: '7277911e-65a7-4660-9f79-0ad2b5c3ab29',
        message_id: 'e41a81c7-0d60-4d85-9c88-6994bcbf972e',
        ttl: 'PT10M',
        timestamp: '2025-01-06T08:46:43.814Z'
      },
      message: {
        order: {
          provider: {
            id: '805',
            name: 'Ministry of Health',
            short_desc:
              'The Ministry of Health is the primary governmental body responsible for all public health and healthcare services in the country. ',
            long_desc: 'License: CC BY-NC-SA  |  26 years in operation',
            rating: '4.2',
            images: {
              url: 'https://bpp-unified-strapi-dev.becknprotocol.io/uploads/Group_1000003473_4adefabc52.png',
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
                  code: 'Population Exposure Datapoints',
                  description: 'Population Exposure Datapoints',
                  list: [
                    {
                      code: 'Distribution of population dependent on life-sustaining equipment',
                      value: 'Distribution of population dependent on life-sustaining equipment',
                      display: true
                    },
                    {
                      code: 'Distribution of population dependent on critical medicines',
                      value: 'Distribution of population dependent on critical medicines',
                      display: true
                    },
                    {
                      code: 'Distribution of population within reach of healthcare facilities',
                      value: 'Distribution of population within reach of healthcare facilities',
                      display: true
                    },
                    {
                      code: 'Distribution of population dependent on life-sustaining equipment',
                      value: 'Distribution of population dependent on life-sustaining equipment',
                      display: true
                    },
                    {
                      code: 'Distribution of population dependent on critical medicines',
                      value: 'Distribution of population dependent on critical medicines',
                      display: true
                    },
                    {
                      code: 'Distribution of population within reach of healthcare facilities',
                      value: 'Distribution of population within reach of healthcare facilities',
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
              value: '40'
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
