export const initResponse = {
  data: [
    {
      context: {
        domain: 'tourism',
        action: 'on_init',
        version: '1.1.0',
        bpp_id: 'bpp-ps-network-vendure1-prod.example.com',
        bpp_uri: 'https://bpp-ps-network-vendure1-prod.example.com',
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
        bap_id: 'bap-ps-network-prod.example.com',
        bap_uri: 'https://bap-ps-network-prod.example.com',
        transaction_id: '66aef03f-9691-4d01-b201-c65b881d5229',
        message_id: 'bd5e54dd-364b-406d-992e-bed56c76bd1b',
        ttl: 'PT10M',
        timestamp: '2024-09-04T03:41:27.728Z'
      },
      message: {
        order: {
          type: 'DEFAULT',
          provider: {
            id: 'worldhikes',
            name: 'World Hikes',
            short_desc: '',
            long_desc: ''
          },
          items: [
            {
              id: '107',
              name: 'Hampta Pass Trek - Manali One',
              long_desc:
                'One of the Most Dramatic Crossover Treks in the Himalayas. <div> <p><b>Hampta Pass Trek - Manali Quick Facts</b></p> <p>Start Point/End Point: Manali </p> <p>Hampta Pass Trekking Duration: 5 Days & 4 Nights</p> <p>Hampta Pass Trek Camp Altitude: 4,280 ft</p> <p>Hampta Pass Trek Difficulty: Easy or Moderate</p> <p>Approx Trekking Distance: 35 kms</p> <div> <p><b>Highlights:</b><p/> <ul> <li>DAY 1 :Arrive at Manali. Drive to Jobra Roadhead, and Trek to Jobra Drive Distance: 15 km|Drive Duration: 2 hours|Pick-up point for India hikes trekkers: Shuru Homestay, Manali Trek Distance: 1.5 km|Trek Duration: 2 hours</li> <li>DAY 2 : Trek from Jobra to Jwara.Trek Distance: 4.50 km|Trek Duration: 4 hours|Altitude Gain: 8965 ft to 11005 ft .</li> <li>DAY 3 :Trek from Jwara to Balu Ka Ghera.Trek Distance: 5 km|Trek Duration: 4 hours|Altitude Gain: 11005 ft to 12220 ft</li> <li>DAY 4: Trek from Balu ka Ghera to Shea Goru via Hampta Pass.Trek Distance: 8 km|Trek Duration: 9 hours|Altitude Gain and Loss: 12220 ft to 12695 ft via 14,065 ft</li> <li>DAY 5 : Trek from Shea Goru to Chhatru.Trek Distance: 7 km|Trek Duration: 4.5 hours|Altitude Loss: 12695 ft to 10785 ft</li> </ul> </div> </div>',
              images: [
                {
                  url: 'http://bpp-unified-vendure1-prod.becknprotocol.io/assets/source/82/274__02.jpeg'
                }
              ],
              price: {
                listed_value: '1000.00',
                currency: 'INR',
                value: '100.00'
              },
              quantity: {
                selected: {
                  count: 1
                }
              }
            }
          ],
          fulfillments: [
            {
              id: '3',
              type: 'standard',
              customer: {
                contact: {
                  email: 'lisa.k@gmail.com',
                  mobileNumber: '9811259151'
                },
                person: {
                  name: 'Lisa'
                }
              },
              stops: [
                {
                  location: {
                    gps: '12.898773,77.5764094',
                    address: '1202 B2, Bengaluru urban, Bengaluru, Karnataka',
                    city: {
                      name: 'Bengaluru'
                    },
                    state: {
                      name: 'Karnataka'
                    },
                    country: {
                      code: 'IN'
                    },
                    area_code: '560078'
                  },
                  contact: {
                    phone: '9811259151',
                    email: 'lisa.k@gmail.com'
                  }
                }
              ],
              tracking: false
            }
          ],
          quote: {
            price: {
              currency: 'INR',
              value: '122.00'
            },
            breakup: [
              {
                title: 'base-price',
                price: {
                  currency: 'INR',
                  value: '100.00'
                }
              },
              {
                title: 'shipping',
                price: {
                  currency: 'INR',
                  value: '0.00'
                }
              },
              {
                title: 'taxes',
                price: {
                  currency: 'INR',
                  value: '22.00'
                }
              }
            ]
          },
          billing: {
            name: 'Lisa',
            phone: '9811259151',
            email: 'lisa.k@gmail.com',
            address: '1202 B2, Bengaluru urban, Bengaluru, Karnataka',
            city: {
              name: 'Bengaluru'
            },
            state: {
              name: 'Karnataka'
            }
          },
          payments: [
            {
              id: '2',
              name: 'Standard',
              status: 'NOT-PAID',
              type: 'PRE-FULFILLMENT',
              params: {
                amount: '13740.00',
                currency: 'INR'
              }
            }
          ],
          tags: [
            {
              code: 'ShippingMethodDetails',
              name: 'Shipping method details',
              display: true,
              list: [
                {
                  code: 'standard',
                  name: 'Standard',
                  value: 'standard'
                }
              ]
            }
          ]
        }
      }
    }
  ]
}
