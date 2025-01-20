export const initResponse = {
  data: [
    {
      context: {
        domain: 'earth_support_initiative',
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
        transaction_id: '266eb047-a5b0-4dc8-b582-1527998493b7',
        message_id: '41d671f8-ba24-4545-8dc9-51681347e9fa',
        ttl: 'PT10M',
        timestamp: '2025-01-09T09:21:34.482Z'
      },
      message: {
        order: {
          provider: {
            id: '816',
            name: 'Enviogrowth',
            short_desc:
              'The Envirogrowth Foundation is a non-profit organization specializing in environmental restoration efforts using science-based approaches.',
            long_desc: 'License: CC BY-NC-SA  |  7 years in operation',
            images: {
              url: 'https://bpp-unified-strapi-dev.becknprotocol.io/uploads/Group_1000003530_af48d6930c.png',
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
              id: '340',
              name: 'On-field data of restoration project',
              images: [
                {
                  url: 'https://bpp-unified-strapi-dev.becknprotocol.io/uploads/Group_1000003530_af48d6930c.png',
                  size_type: 'sm'
                }
              ],
              price: {
                value: '15'
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
                  code: 'Forest Datapoints',
                  description: 'Forest Datapoints',
                  list: [
                    {
                      code: 'Number of trees',
                      value: 'Number of trees',
                      display: true
                    },
                    {
                      code: 'Survival Rate',
                      value: 'Survival Rate',
                      display: true
                    },
                    {
                      code: 'Growth Rate',
                      value: 'Growth Rate',
                      display: true
                    },
                    {
                      code: 'Pest and disease incidence',
                      value: 'Pest and disease incidence',
                      display: true
                    },
                    {
                      code: 'Tree height',
                      value: 'Tree height',
                      display: true
                    },
                    {
                      code: 'Crown diameter',
                      value: 'Crown diameter',
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
                      code: '3 month',
                      value: '3 month',
                      display: true
                    },
                    {
                      code: '1 year',
                      value: '1 year',
                      display: true
                    },
                    {
                      code: '5 year',
                      value: '5 year',
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
                      code: 'Rest API',
                      value: 'Rest API',
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
                  code: 'Frequency',
                  description: 'Frequency',
                  list: [
                    {
                      code: 'Quarterly',
                      value: 'Quarterly',
                      display: true
                    },
                    {
                      code: 'Half-yearly',
                      value: 'Half-yearly',
                      display: true
                    },
                    {
                      code: 'Annually',
                      value: 'Annually',
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
              value: '15'
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
