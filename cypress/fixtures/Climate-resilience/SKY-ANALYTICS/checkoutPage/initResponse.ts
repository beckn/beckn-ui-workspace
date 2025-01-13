export const initResponse = {
  data: [
    {
      context: {
        domain: 'skyanalytics_flow',
        action: 'on_init',
        version: '1.1.0',
        bpp_id: 'bpp-ps-network-strapi1-prod.example.io',
        bpp_uri: 'http://bpp-ps-network-strapi1-prod.example.io',
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
        bap_id: 'bap-ps-network-prod.example.io',
        bap_uri: 'https://bap-ps-network-prod.example.io',
        transaction_id: '78232be3-8bd2-4976-8050-1eedf6aa73c1',
        message_id: '20e18a08-f9d3-45a1-98bc-f12af48d21bc',
        ttl: 'PT10M',
        timestamp: '2025-01-08T04:49:36.248Z'
      },
      message: {
        order: {
          provider: {
            id: '810',
            name: 'National Meterological Department',
            short_desc:
              'The National Meteorological Department is the national meteorological organization of the country, under Ministry of Defense.',
            long_desc: 'License: CC BY-NC-SA  |  53 years in operation',
            rating: '4.2',
            images: {
              url: 'https://bpp-unified-strapi-dev.example.io/uploads/Group_1000003468_4b1c0ac8b3.png',
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
              id: '334',
              name: 'Surface and space based high resolution weather forecast and historical data',
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
                  code: 'Confidence Levels',
                  description: 'Confidence Levels',
                  list: [
                    {
                      code: '70%',
                      value: '70%',
                      display: true
                    },
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
                  code: 'Weather datapoints',
                  description: 'Weather datapoints',
                  list: [
                    {
                      code: 'Temperature',
                      value: 'Temperature',
                      display: true
                    },
                    {
                      code: 'Vertical wind speed',
                      value: 'Vertical wind speed',
                      display: true
                    },
                    {
                      code: 'Horizontal wind velocity',
                      value: 'Horizontal wind velocity',
                      display: true
                    },
                    {
                      code: 'Relative Humidity',
                      value: 'Relative Humidity',
                      display: true
                    },
                    {
                      code: 'Precipitation',
                      value: 'Precipitation',
                      display: true
                    },
                    {
                      code: 'Surface pressure',
                      value: 'Surface pressure',
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
                      code: '1 km',
                      value: '1 km',
                      display: true
                    },
                    {
                      code: '2.5 km',
                      value: '2.5 km',
                      display: true
                    },
                    {
                      code: '5 km',
                      value: '5 km',
                      display: true
                    },
                    {
                      code: '10 km',
                      value: '10 km',
                      display: true
                    },
                    {
                      code: '50 km',
                      value: '50 km',
                      display: true
                    }
                  ]
                },
                {
                  code: '1 year',
                  description: 'Temporal Coverage Historial',
                  list: [
                    {
                      code: '3 months',
                      value: '3 months',
                      display: true
                    },
                    {
                      code: '6 months',
                      value: '6 months',
                      display: true
                    },
                    {
                      code: '1 year',
                      value: '1 year',
                      display: true
                    }
                  ]
                },
                {
                  code: 'Temporal Coverage Forecast',
                  description: 'Temporal Coverage Forecast',
                  list: [
                    {
                      code: '2 days',
                      value: '2 days',
                      display: true
                    },
                    {
                      code: '15 days',
                      value: '15 days',
                      display: true
                    },
                    {
                      code: '3 months',
                      value: '3 months',
                      display: true
                    }
                  ]
                },
                {
                  code: 'Forecast Temporal Resolutions',
                  description: 'Forecast Temporal Resolutions',
                  list: [
                    {
                      code: '3 hours',
                      value: '3 hours',
                      display: true
                    },
                    {
                      code: '6 hours',
                      value: '6 hours',
                      display: true
                    },
                    {
                      code: '12 hours',
                      value: '12 hours',
                      display: true
                    },
                    {
                      code: '24 hours',
                      value: '24 hours',
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
                    },
                    {
                      code: 'Rest API',
                      value: 'Rest API',
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
              value: '30'
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
