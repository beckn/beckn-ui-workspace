import { v4 as uuidv4 } from 'uuid'

export const orderResponse = {
  data: [
    {
      id: uuidv4().toString(),
      attributes: {
        updatedAt: '2025-01-08T05:17:13.188Z',
        order_id: '2647',
        bpp_id: 'bpp-ps-network-strapi1-prod.becknprotocol.io',
        bpp_uri: 'http://bpp-ps-network-strapi1-prod.becknprotocol.io',
        currency: null,
        delivery_status: null,
        descriptor: {
          name: 'National Meterological Department',
          short_desc:
            'The National Meteorological Department is the national meteorological organization of the country, under Ministry of Defense.'
        },
        price: 30,
        billing: null,
        fulfillments: null,
        created_date: null,
        last_updated_date: null,
        quote: {
          price: {
            value: '30'
          }
        },
        transaction_id: '78232be3-8bd2-4976-8050-1eedf6aa73c1',
        message_id: null,
        payments: null,
        items: [
          {
            id: '334',
            name: 'Surface and space based high resolution weather forecast and historical data',
            tags: [
              {
                list: [
                  {
                    value: '70%',
                    display: true
                  }
                ],
                display: true,
                description: 'Confidence Levels'
              },
              {
                list: [
                  {
                    value: '90%',
                    display: true
                  }
                ],
                display: true,
                description: 'Confidence Levels'
              },
              {
                list: [
                  {
                    value: '85%',
                    display: true
                  }
                ],
                display: true,
                description: 'Confidence Levels'
              },
              {
                list: [
                  {
                    value: 'Temperature',
                    display: true
                  }
                ],
                display: true,
                description: 'Weather datapoints'
              },
              {
                list: [
                  {
                    value: 'Vertical wind speed',
                    display: true
                  }
                ],
                display: true,
                description: 'Weather datapoints'
              },
              {
                list: [
                  {
                    value: 'Horizontal wind velocity',
                    display: true
                  }
                ],
                display: true,
                description: 'Weather datapoints'
              },
              {
                list: [
                  {
                    value: 'Relative Humidity',
                    display: true
                  }
                ],
                display: true,
                description: 'Weather datapoints'
              },
              {
                list: [
                  {
                    value: 'Precipitation',
                    display: true
                  }
                ],
                display: true,
                description: 'Weather datapoints'
              },
              {
                list: [
                  {
                    value: 'Surface pressure',
                    display: true
                  }
                ],
                display: true,
                description: 'Weather datapoints'
              },
              {
                list: [
                  {
                    value: 'Vector',
                    display: true
                  }
                ],
                display: true,
                description: 'Spatial Representation'
              },
              {
                list: [
                  {
                    value: 'Raster',
                    display: true
                  }
                ],
                display: true,
                description: 'Spatial Representation'
              },
              {
                list: [
                  {
                    value: 'Beanibazar',
                    display: true
                  }
                ],
                display: true,
                description: 'Spatial Coverage'
              },
              {
                list: [
                  {
                    value: 'Gopalganj',
                    display: true
                  }
                ],
                display: true,
                description: 'Spatial Coverage'
              },
              {
                list: [
                  {
                    value: 'Balaganj',
                    display: true
                  }
                ],
                display: true,
                description: 'Spatial Coverage'
              },
              {
                list: [
                  {
                    value: 'Biswanath',
                    display: true
                  }
                ],
                display: true,
                description: 'Spatial Coverage'
              },
              {
                list: [
                  {
                    value: 'Kanaigath',
                    display: true
                  }
                ],
                display: true,
                description: 'Spatial Coverage'
              },
              {
                list: [
                  {
                    value: '1 km',
                    display: true
                  }
                ],
                display: true,
                description: 'Spatial Resolutions'
              },
              {
                list: [
                  {
                    value: '2.5 km',
                    display: true
                  }
                ],
                display: true,
                description: 'Spatial Resolutions'
              },
              {
                list: [
                  {
                    value: '5 km',
                    display: true
                  }
                ],
                display: true,
                description: 'Spatial Resolutions'
              },
              {
                list: [
                  {
                    value: '10 km',
                    display: true
                  }
                ],
                display: true,
                description: 'Spatial Resolutions'
              },
              {
                list: [
                  {
                    value: '50 km',
                    display: true
                  }
                ],
                display: true,
                description: 'Spatial Resolutions'
              },
              {
                list: [
                  {
                    value: '3 months',
                    display: true
                  }
                ],
                display: true,
                description: 'Temporal Coverage Historial'
              },
              {
                list: [
                  {
                    value: '6 months',
                    display: true
                  }
                ],
                display: true,
                description: 'Temporal Coverage Historial'
              },
              {
                list: [
                  {
                    value: '1 year',
                    display: true
                  }
                ],
                display: true,
                description: 'Temporal Coverage Historial'
              },
              {
                list: [
                  {
                    value: '2 days',
                    display: true
                  }
                ],
                display: true,
                description: 'Temporal Coverage Forecast'
              },
              {
                list: [
                  {
                    value: '15 days',
                    display: true
                  }
                ],
                display: true,
                description: 'Temporal Coverage Forecast'
              },
              {
                list: [
                  {
                    value: '3 months',
                    display: true
                  }
                ],
                display: true,
                description: 'Temporal Coverage Forecast'
              },
              {
                list: [
                  {
                    value: '3 hours',
                    display: true
                  }
                ],
                display: true,
                description: 'Forecast Temporal Resolutions'
              },
              {
                list: [
                  {
                    value: '6 hours',
                    display: true
                  }
                ],
                display: true,
                description: 'Forecast Temporal Resolutions'
              },
              {
                list: [
                  {
                    value: '12 hours',
                    display: true
                  }
                ],
                display: true,
                description: 'Forecast Temporal Resolutions'
              },
              {
                list: [
                  {
                    value: '24 hours',
                    display: true
                  }
                ],
                display: true,
                description: 'Forecast Temporal Resolutions'
              },
              {
                list: [
                  {
                    value: 'XML',
                    display: true
                  }
                ],
                display: true,
                description: 'Data Formats'
              },
              {
                list: [
                  {
                    value: 'CSV',
                    display: true
                  }
                ],
                display: true,
                description: 'Data Formats'
              },
              {
                list: [
                  {
                    value: 'NetCDF',
                    display: true
                  }
                ],
                display: true,
                description: 'Data Formats'
              },
              {
                list: [
                  {
                    value: 'HDF',
                    display: true
                  }
                ],
                display: true,
                description: 'Data Formats'
              },
              {
                list: [
                  {
                    value: 'FTP',
                    display: true
                  }
                ],
                display: true,
                description: 'Data Sharing Modes'
              },
              {
                list: [
                  {
                    value: 'SOAP_API',
                    display: true
                  }
                ],
                display: true,
                description: 'Data Sharing Modes'
              },
              {
                list: [
                  {
                    value: 'Email',
                    display: true
                  }
                ],
                display: true,
                description: 'Data Sharing Modes'
              },
              {
                list: [
                  {
                    value: 'Rest API',
                    display: true
                  }
                ],
                display: true,
                description: 'Data Sharing Modes'
              },
              {
                list: [
                  {
                    value: 'One time',
                    display: true
                  }
                ],
                display: true,
                description: 'Subscription Durations'
              },
              {
                list: [
                  {
                    value: '3 months',
                    display: true
                  }
                ],
                display: true,
                description: 'Subscription Durations'
              }
            ],
            price: {
              value: '30'
            },
            images: [
              {
                url: 'https://bpp-unified-strapi-dev.becknprotocol.io/uploads/Group_1000003468_4b1c0ac8b3.png',
                size_type: 'sm'
              }
            ],
            rating: 'null',
            quantity: {
              available: {
                measure: {
                  unit: 'kWh',
                  value: '0'
                }
              }
            },
            rateable: true
          }
        ],
        createdAt: '2025-01-08T05:17:13.188Z',
        publishedAt: '2025-01-08T05:17:13.177Z',
        domain: null
      }
    }
  ],
  meta: {
    pagination: {
      page: 1,
      pageSize: 25,
      pageCount: 1,
      total: 1
    }
  }
}
