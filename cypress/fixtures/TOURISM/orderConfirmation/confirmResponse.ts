import { v4 as uuidv4 } from 'uuid'

export const confirmResponse = {
  data: [
    {
      context: {
        domain: 'tourism',
        action: 'on_confirm',
        version: '1.1.0',
        bpp_id: 'bpp-ps-network-vendure1-prod.becknprotocol.io',
        bpp_uri: 'https://bpp-ps-network-vendure1-prod.becknprotocol.io',
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
        bap_id: 'bap-ps-network-prod.becknprotocol.io',
        bap_uri: 'https://bap-ps-network-prod.becknprotocol.io',
        transaction_id: '310f53a8-ee93-48c6-8f30-8c2edb6c94bc',
        message_id: '49d55216-396a-4a94-b266-0a637571be6f',
        ttl: 'PT10M',
        timestamp: '2024-09-05T09:37:32.057Z'
      },
      message: {
        orderId: uuidv4().toString(),
        provider: {
          id: 'worldhikes',
          name: 'World Hikes',
          short_desc: '',
          long_desc: ''
        },
        items: [
          {
            id: '105',
            name: 'Hampta Pass Trek - Manali One',
            long_desc:
              'It is called Moon Lake because of its crescent shape and is the origin of Chander River. <div>\r\n        <p><b>Chandratal Lake Trek Quick Facts</b></p>\r\n        <p>Start Point/End Point: Manali </p>\r\n        <p> Bhutan Cultural Trek Camp Trekking Duration: 6 Days & 5 Nights</p>\r\n        <p>Bhutan Cultural Trek Camp Altitude: 3100 ft</p>\r\n        <p>Bhutan Cultural Trek Trek Difficulty: Easy or Moderate</p>\r\n        <p>Approx Trekking Distance: 80 kms</p>\r\n   <div>\r\n      <p><b>Highlights:</b>\r\n      <p/> \r\n      <ul>\r\n         <li>Chandratal Lake trek is a beautiful trek in Spiti valley of Himachal Pradesh at an elevation of 4,300 m.</li>\r\n         <li>The Chandratal trek will be of 5 Days from Manali to Manali, includes travel</li>\r\n         <li>First of all, all the trekkers will have to book their flight and train bus according to our time table as our pick up is from 9:00 am to 10:00 am, you will have to reach Manali Bus Stand, Mall Road in the morning.</li>\r\n         <li>A taxi from Himalayan Hikers will link you to the Manali bus stand, near mall road.Himalayan Hikers organize transport to the Spiti valley for Chandratal trek from the Manali bus stand.</li>\r\n         <li>Our vehicles leave at 7:00 am to 8:00 am sharp from Manali. Sharing taxi costs include your package.</li>\r\n         <li>In the Manali bus stand, you will get our taxi staff that will arrange transport for you. The contacts no Transport coordinator or our office team will give you a week ago to your departure</li>\r\n         <li>Manali is a beautiful city in Himachal where public transport is available for all over State in India. Book your return bus tickets directly from Manali bus stand.</li>\r\n      </ul>\r\n   </div>\r\n</div>',
            images: [
              {
                url: 'http://bpp-unified-vendure1-prod.becknprotocol.io/assets/source/92/273__02.jpg'
              }
            ],
            price: {
              listed_value: '14500.00',
              currency: 'INR',
              value: '14500.00'
            },
            quantity: {
              selected: {
                count: 1
              }
            },
            tags: [
              {
                code: 'facets',
                name: 'Facets',
                display: true,
                list: [
                  {
                    code: 'category',
                    name: 'category',
                    value: 'Tourism'
                  },
                  {
                    code: 'trekking',
                    name: 'Trekking',
                    value: 'Y'
                  },
                  {
                    code: 'himalayas',
                    name: 'Himalayas',
                    value: 'Y'
                  },
                  {
                    code: 'country',
                    name: 'Country',
                    value: 'India'
                  },
                  {
                    code: 'treks',
                    name: 'Treks',
                    value: 'Y'
                  },
                  {
                    code: 'package',
                    name: 'Package',
                    value: 'Trek'
                  }
                ]
              }
            ]
          },
          {
            id: '107',
            name: 'Hampta Pass Trek - Manali',
            long_desc:
              'One of the Most Dramatic Crossover Treks in the Himalayas. <div> <p><b>Hampta Pass Trek - Manali Quick Facts</b></p> <p>Start Point/End Point: Manali </p> <p>Hampta Pass Trekking Duration: 5 Days & 4 Nights</p> <p>Hampta Pass Trek Camp Altitude: 4,280 ft</p> <p>Hampta Pass Trek Difficulty: Easy or Moderate</p> <p>Approx Trekking Distance: 35 kms</p> <div> <p><b>Highlights:</b><p/> <ul> <li>DAY 1 :Arrive at Manali. Drive to Jobra Roadhead, and Trek to Jobra Drive Distance: 15 km|Drive Duration: 2 hours|Pick-up point for India hikes trekkers: Shuru Homestay, Manali Trek Distance: 1.5 km|Trek Duration: 2 hours</li> <li>DAY 2 : Trek from Jobra to Jwara.Trek Distance: 4.50 km|Trek Duration: 4 hours|Altitude Gain: 8965 ft to 11005 ft .</li> <li>DAY 3 :Trek from Jwara to Balu Ka Ghera.Trek Distance: 5 km|Trek Duration: 4 hours|Altitude Gain: 11005 ft to 12220 ft</li> <li>DAY 4: Trek from Balu ka Ghera to Shea Goru via Hampta Pass.Trek Distance: 8 km|Trek Duration: 9 hours|Altitude Gain and Loss: 12220 ft to 12695 ft via 14,065 ft</li> <li>DAY 5 : Trek from Shea Goru to Chhatru.Trek Distance: 7 km|Trek Duration: 4.5 hours|Altitude Loss: 12695 ft to 10785 ft</li> </ul> </div> </div>',
            images: [
              {
                url: 'http://bpp-unified-vendure1-prod.becknprotocol.io/assets/source/82/274__02.jpeg'
              }
            ],
            price: {
              listed_value: '11450.00',
              currency: 'INR',
              value: '11450.00'
            },
            quantity: {
              selected: {
                count: 1
              }
            },
            tags: [
              {
                code: 'facets',
                name: 'Facets',
                display: true,
                list: [
                  {
                    code: 'category',
                    name: 'category',
                    value: 'Tourism'
                  },
                  {
                    code: 'trekking',
                    name: 'Trekking',
                    value: 'Y'
                  },
                  {
                    code: 'himalayas',
                    name: 'Himalayas',
                    value: 'Y'
                  },
                  {
                    code: 'country',
                    name: 'Country',
                    value: 'India'
                  },
                  {
                    code: 'trek',
                    name: 'Trek',
                    value: 'Y'
                  },
                  {
                    code: 'package',
                    name: 'Package',
                    value: 'Treks'
                  }
                ]
              }
            ]
          }
        ],
        fulfillments: [
          {
            id: '3',
            type: 'standard',
            customer: {
              contact: {
                email: 'lisa.k@gmail.com',
                mobileNumber: '9999999999'
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
                  phone: '9999999999',
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
            value: '31140.00'
          },
          breakup: [
            {
              title: 'base-price',
              price: {
                currency: 'INR',
                value: '25950.00'
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
                value: '5190.00'
              }
            }
          ]
        },
        billing: {
          name: 'Lisa',
          phone: '9999999999',
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
            status: 'PAID',
            type: 'PRE-FULFILLMENT',
            params: {
              amount: '31140.00',
              currency: 'INR',
              transaction_id: ''
            },
            time: {
              label: 'Transaction timestamp',
              timestamp: '2024-09-05T09:37:32.040Z'
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
          },
          {
            code: 'AdditionalStatus',
            name: 'Additional status',
            display: true,
            list: [
              {
                code: 'detailedOrderStatus',
                name: 'Detailed Order Status',
                value: 'ArrangingPayment'
              }
            ]
          }
        ]
      },
      rawResponse: {
        context: {
          domain: 'tourism',
          action: 'on_confirm',
          version: '1.1.0',
          bpp_id: 'bpp-ps-network-vendure1-prod.becknprotocol.io',
          bpp_uri: 'https://bpp-ps-network-vendure1-prod.becknprotocol.io',
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
          bap_id: 'bap-ps-network-prod.becknprotocol.io',
          bap_uri: 'https://bap-ps-network-prod.becknprotocol.io',
          transaction_id: '310f53a8-ee93-48c6-8f30-8c2edb6c94bc',
          message_id: '49d55216-396a-4a94-b266-0a637571be6f',
          ttl: 'PT10M',
          timestamp: '2024-09-05T09:37:32.057Z'
        },
        message: {
          order: {
            id: '8fc21a189c389c251139b2ef3198c1580e776ab84265852479ed864389c971f3',
            status: 'ACTIVE',
            provider: {
              id: 'worldhikes',
              descriptor: {
                name: 'World Hikes',
                short_desc: '',
                long_desc: ''
              },
              tags: [
                {
                  display: true,
                  descriptor: {
                    name: 'Additional Details',
                    code: 'additional_details',
                    short_desc: 'Additional details about seller'
                  }
                }
              ]
            },
            items: [
              {
                id: '105',
                descriptor: {
                  name: 'Chandra Tal Trek - Manali',
                  long_desc:
                    'It is called Moon Lake because of its crescent shape and is the origin of Chander River. <div>\r\n        <p><b>Chandratal Lake Trek Quick Facts</b></p>\r\n        <p>Start Point/End Point: Manali </p>\r\n        <p> Bhutan Cultural Trek Camp Trekking Duration: 6 Days & 5 Nights</p>\r\n        <p>Bhutan Cultural Trek Camp Altitude: 3100 ft</p>\r\n        <p>Bhutan Cultural Trek Trek Difficulty: Easy or Moderate</p>\r\n        <p>Approx Trekking Distance: 80 kms</p>\r\n   <div>\r\n      <p><b>Highlights:</b>\r\n      <p/> \r\n      <ul>\r\n         <li>Chandratal Lake trek is a beautiful trek in Spiti valley of Himachal Pradesh at an elevation of 4,300 m.</li>\r\n         <li>The Chandratal trek will be of 5 Days from Manali to Manali, includes travel</li>\r\n         <li>First of all, all the trekkers will have to book their flight and train bus according to our time table as our pick up is from 9:00 am to 10:00 am, you will have to reach Manali Bus Stand, Mall Road in the morning.</li>\r\n         <li>A taxi from Himalayan Hikers will link you to the Manali bus stand, near mall road.Himalayan Hikers organize transport to the Spiti valley for Chandratal trek from the Manali bus stand.</li>\r\n         <li>Our vehicles leave at 7:00 am to 8:00 am sharp from Manali. Sharing taxi costs include your package.</li>\r\n         <li>In the Manali bus stand, you will get our taxi staff that will arrange transport for you. The contacts no Transport coordinator or our office team will give you a week ago to your departure</li>\r\n         <li>Manali is a beautiful city in Himachal where public transport is available for all over State in India. Book your return bus tickets directly from Manali bus stand.</li>\r\n      </ul>\r\n   </div>\r\n</div>',
                  images: [
                    {
                      url: 'http://bpp-unified-vendure1-prod.becknprotocol.io/assets/source/92/273__02.jpg'
                    }
                  ]
                },
                price: {
                  listed_value: '14500.00',
                  currency: 'INR',
                  value: '14500.00'
                },
                quantity: {
                  selected: {
                    count: 1
                  }
                },
                fulfillment_ids: ['3'],
                tags: [
                  {
                    display: true,
                    descriptor: {
                      name: 'Facets',
                      code: 'facets',
                      short_desc: 'Tags in common language, facets within Vendure'
                    },
                    list: [
                      {
                        display: true,
                        descriptor: {
                          name: 'category',
                          code: 'category'
                        },
                        value: 'Tourism'
                      },
                      {
                        display: true,
                        descriptor: {
                          name: 'Trekking',
                          code: 'trekking'
                        },
                        value: 'Y'
                      },
                      {
                        display: true,
                        descriptor: {
                          name: 'Himalayas',
                          code: 'himalayas'
                        },
                        value: 'Y'
                      },
                      {
                        display: true,
                        descriptor: {
                          name: 'Country',
                          code: 'country'
                        },
                        value: 'India'
                      },
                      {
                        display: true,
                        descriptor: {
                          name: 'Treks',
                          code: 'treks'
                        },
                        value: 'Y'
                      },
                      {
                        display: true,
                        descriptor: {
                          name: 'Package',
                          code: 'package'
                        },
                        value: 'Trek'
                      }
                    ]
                  }
                ]
              },
              {
                id: '107',
                descriptor: {
                  name: 'Hampta Pass Trek - Manali',
                  long_desc:
                    'One of the Most Dramatic Crossover Treks in the Himalayas. <div> <p><b>Hampta Pass Trek - Manali Quick Facts</b></p> <p>Start Point/End Point: Manali </p> <p>Hampta Pass Trekking Duration: 5 Days & 4 Nights</p> <p>Hampta Pass Trek Camp Altitude: 4,280 ft</p> <p>Hampta Pass Trek Difficulty: Easy or Moderate</p> <p>Approx Trekking Distance: 35 kms</p> <div> <p><b>Highlights:</b><p/> <ul> <li>DAY 1 :Arrive at Manali. Drive to Jobra Roadhead, and Trek to Jobra Drive Distance: 15 km|Drive Duration: 2 hours|Pick-up point for India hikes trekkers: Shuru Homestay, Manali Trek Distance: 1.5 km|Trek Duration: 2 hours</li> <li>DAY 2 : Trek from Jobra to Jwara.Trek Distance: 4.50 km|Trek Duration: 4 hours|Altitude Gain: 8965 ft to 11005 ft .</li> <li>DAY 3 :Trek from Jwara to Balu Ka Ghera.Trek Distance: 5 km|Trek Duration: 4 hours|Altitude Gain: 11005 ft to 12220 ft</li> <li>DAY 4: Trek from Balu ka Ghera to Shea Goru via Hampta Pass.Trek Distance: 8 km|Trek Duration: 9 hours|Altitude Gain and Loss: 12220 ft to 12695 ft via 14,065 ft</li> <li>DAY 5 : Trek from Shea Goru to Chhatru.Trek Distance: 7 km|Trek Duration: 4.5 hours|Altitude Loss: 12695 ft to 10785 ft</li> </ul> </div> </div>',
                  images: [
                    {
                      url: 'http://bpp-unified-vendure1-prod.becknprotocol.io/assets/source/82/274__02.jpeg'
                    }
                  ]
                },
                price: {
                  listed_value: '11450.00',
                  currency: 'INR',
                  value: '11450.00'
                },
                quantity: {
                  selected: {
                    count: 1
                  }
                },
                fulfillment_ids: ['3'],
                tags: [
                  {
                    display: true,
                    descriptor: {
                      name: 'Facets',
                      code: 'facets',
                      short_desc: 'Tags in common language, facets within Vendure'
                    },
                    list: [
                      {
                        display: true,
                        descriptor: {
                          name: 'category',
                          code: 'category'
                        },
                        value: 'Tourism'
                      },
                      {
                        display: true,
                        descriptor: {
                          name: 'Trekking',
                          code: 'trekking'
                        },
                        value: 'Y'
                      },
                      {
                        display: true,
                        descriptor: {
                          name: 'Himalayas',
                          code: 'himalayas'
                        },
                        value: 'Y'
                      },
                      {
                        display: true,
                        descriptor: {
                          name: 'Country',
                          code: 'country'
                        },
                        value: 'India'
                      },
                      {
                        display: true,
                        descriptor: {
                          name: 'Trek',
                          code: 'trek'
                        },
                        value: 'Y'
                      },
                      {
                        display: true,
                        descriptor: {
                          name: 'Package',
                          code: 'package'
                        },
                        value: 'Treks'
                      }
                    ]
                  }
                ]
              }
            ],
            fulfillments: [
              {
                id: '3',
                type: 'standard',
                customer: {
                  contact: {
                    email: 'lisa.k@gmail.com',
                    mobileNumber: '9999999999'
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
                      phone: '9999999999',
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
                value: '31140.00'
              },
              breakup: [
                {
                  title: 'base-price',
                  price: {
                    currency: 'INR',
                    value: '25950.00'
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
                    value: '5190.00'
                  }
                }
              ]
            },
            billing: {
              name: 'Lisa',
              phone: '9999999999',
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
                status: 'PAID',
                type: 'PRE-FULFILLMENT',
                params: {
                  amount: '31140.00',
                  currency: 'INR',
                  transaction_id: ''
                },
                time: {
                  label: 'Transaction timestamp',
                  timestamp: '2024-09-05T09:37:32.040Z'
                }
              }
            ],
            tags: [
              {
                descriptor: {
                  name: 'Shipping method details',
                  code: 'ShippingMethodDetails'
                },
                list: [
                  {
                    descriptor: {
                      name: 'Standard',
                      code: 'standard'
                    },
                    value: 'standard'
                  }
                ],
                display: true
              },
              {
                descriptor: {
                  name: 'Additional status',
                  code: 'AdditionalStatus'
                },
                list: [
                  {
                    descriptor: {
                      name: 'Detailed Order Status',
                      code: 'detailedOrderStatus'
                    },
                    value: 'ArrangingPayment'
                  }
                ],
                display: true
              }
            ],
            type: 'DEFAULT'
          }
        }
      }
    }
  ]
}
