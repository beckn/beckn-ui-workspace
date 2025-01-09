import { v4 as uuidv4 } from 'uuid'
import { billingDetails } from '../checkoutPage/userDetails'

export const confirmResponse = {
  data: [
    {
      context: {
        domain: 'skyanalytics_flow',
        action: 'on_confirm',
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
        message_id: 'f73f92a7-d920-4e47-9582-ab1c4ee3a099',
        ttl: 'PT10M',
        timestamp: '2025-01-08T05:17:08.640Z'
      },
      message: {
        orderId: uuidv4().toString(),
        provider: {
          id: '810',
          name: 'National Meterological Department',
          short_desc:
            'The National Meteorological Department is the national meteorological organization of the country, under Ministry of Defense.',
          long_desc: 'License: CC BY-NC-SA  |  53 years in operation',
          rating: '4.2',
          images: [
            {
              url: 'https://bpp-unified-strapi-dev.example.io/uploads/Group_1000003468_4b1c0ac8b3.png',
              size_type: 'sm'
            }
          ],
          fulfillments: [
            {
              id: '3',
              type: 'HOME-DELIVERY',
              rating: '5',
              state: {
                description: 'ORDER RECEIVED',
                descriptor: {
                  code: 'ORDER_RECEIVED',
                  name: 'ORDER RECEIVED'
                }
              }
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
            type: 'Standard-shipping',
            stops: [
              {
                location: {
                  gps: '12.898773,77.5764094',
                  address: billingDetails.address,
                  city: {
                    name: 'Bengaluru'
                  },
                  state: {
                    name: 'Karnataka'
                  },
                  country: {
                    code: 'IND'
                  },
                  area_code: billingDetails.pinCode
                },
                contact: {
                  phone: billingDetails.mobileNumber,
                  email: billingDetails.email
                }
              }
            ],
            state: {
              descriptor: {
                code: 'ORDER_RECEIVED',
                short_desc: 'ORDER RECEIVED'
              },
              updated_at: '2025-01-08T05:17:08.245Z'
            }
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
  ]
}
