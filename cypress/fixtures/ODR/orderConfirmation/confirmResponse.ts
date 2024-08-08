export const confirmResponse = {
  data: [
    {
      context: {
        domain: 'online-dispute-resolution:0.1.0',
        action: 'on_confirm',
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
        transaction_id: '1d02e7f9-e2e5-49c9-8380-7628c040dfc0',
        message_id: '7627f99a-d429-419d-8754-23a7aaaffcb4',
        ttl: 'PT10M',
        timestamp: '2024-08-08T09:38:35.946Z'
      },
      message: {
        orderId: '1001',
        provider: {
          id: '35',
          name: 'Alpha',
          short_desc: 'Alpha Pvt Ltd., India.',
          long_desc:
            'Alpha Pvt Ltd., India. provides online dispute resolution services. Out platform facilitates easy access to high quality service providers which helps avoid hassles of court, saving time and money and relationships.',
          images: [
            {
              url: 'https://odr-catalogue.becknprotocol.io/odr-catalogue/ODR-catalogue/Mediation.jpeg',
              size_type: 'sm'
            }
          ]
        },
        items: [
          {
            id: '50',
            name: 'Mediation Services',
            code: 'mediation-service',
            short_desc:
              'Your trusted partner for mediation services. Navigate disputes with our expert mediators for a harmonious legal resolution.',
            long_desc:
              '<html><body><p>At HarmonyArbitrators, our mediation services are designed to guide you through civil, family, employment, commercial, and financial disputes with skill and compassion. Our experienced mediators foster open communication, facilitating collaborative solutions that prioritize fairness and client satisfaction.</p><p>Trust HarmonyArbitrators for a dedicated, transparent, and effective approach to achieving harmonious resolutions in complex legal matters.</p></body></html>',
            images: [
              {
                url: 'https://odr-catalogue.becknprotocol.io/odr-catalogue/ODR-catalogue/Mediation.jpeg',
                size_type: 'sm'
              }
            ],
            price: {
              value: '3000'
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
            categories: [
              {
                id: '62',
                name: 'Family Dispute'
              },
              {
                id: '61',
                name: 'Financial Dispute'
              },
              {
                id: '63',
                name: 'Employment Dispute'
              },
              {
                id: '60',
                name: 'Civil Dispute'
              },
              {
                id: '64',
                name: 'Commercial Dispute'
              }
            ],
            tags: [
              {
                display: true,
                list: [
                  {
                    code: 'provider-info',
                    value: 'provider-info'
                  }
                ]
              },
              {
                display: true,
                list: [
                  {
                    code: 'area-of-expertise',
                    value: 'Financial Disputes, Commercial Disputes'
                  }
                ]
              },
              {
                display: true,
                list: [
                  {
                    code: 'service-language',
                    value: 'English'
                  }
                ]
              }
            ]
          }
        ],
        fulfillments: [
          {
            id: '15',
            type: 'Mediation Services',
            rateable: true,
            customer: {
              person: {
                name: 'santosh kumar'
              },
              contact: {
                phone: '6251423251',
                email: 'santosh.k@gmail.com'
              }
            },
            state: {
              descriptor: {
                code: 'REQUEST_RECEIVED',
                short_desc: 'REQUEST RECEIVED'
              },
              updated_at: '2024-08-08T09:38:35.754Z'
            },
            tracking: false
          }
        ],
        quote: {
          price: {
            value: '3000'
          }
        }
      }
    }
  ]
}
