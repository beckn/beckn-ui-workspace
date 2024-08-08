export const initResponse = {
  data: [
    {
      context: {
        domain: 'online-dispute-resolution:0.1.0',
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
        transaction_id: '1d02e7f9-e2e5-49c9-8380-7628c040dfc0',
        message_id: '6047cb93-d538-449f-a433-e18f8f6d241c',
        ttl: 'PT10M',
        timestamp: '2024-08-08T05:10:00.626Z'
      },
      message: {
        order: {
          type: 'DEFAULT',
          provider: {
            id: '35',
            name: 'Alpha',
            short_desc: 'Alpha Pvt Ltd., India.',
            long_desc:
              'Alpha Pvt Ltd., India. provides online dispute resolution services. Out platform facilitates easy access to high quality service providers which helps avoid hassles of court, saving time and money and relationships.',
            images: {
              url: 'https://odr-catalogue.becknprotocol.io/odr-catalogue/ODR-catalogue/Mediation.jpeg',
              size_type: 'sm'
            }
          },
          items: [
            {
              id: '50',
              name: 'Mediation Services',
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
              ],
              xinput: {
                url: 'https://bpp-unified-strapi-dev.becknprotocol.io/beckn-bpp-adapter/x-input/form?form_id=odrConsentForm',
                mime_type: 'text/html',
                html: '<html><head>\n    <title>XInput Form</title>\n</head>\n<body>\n    <div>\n        <h2>Terms and Conditions</h2>\n        <p>\n            I, $$name$$ confirm that l\'ve read and understand the terms of representation by $$companyName$$\n            <br><br>\n            I agree to be represented in the described\n            legal matter and acknowledge the fee\n            structure, billing terms, and potential costs.I\n            understand the attorney-client privilege and\n            agree to communicate promptly and\n            honestly. I\'m aware of the conditions for\n            terminating the relationship and its consequences.\n            <br><br>\n        </p>\n    </div>\n    <form id="xinputform">\n        <div>\n            <label for="name">Name</label>\n            <input type="text" id="name" name="name" required="">\n        </div>\n        <div>\n            <label for="place">Place</label>\n            <input type="text" id="place" name="place" required="">\n        </div>\n        <div>\n            <label>\n                <input type="checkbox" id="digitalSignature" name="digitalSignature">\n                Add Digital Signature\n            </label>\n        </div>\n        <div>\n            <button type="submit">Confirm</button>\n        </div>\n        <div>\n            <button type="button">Cancel</button>\n        </div>\n\n    <input type="hidden" value="https://bpp-unified-strapi-dev.becknprotocol.io/beckn-bpp-adapter/x-input/submit" id="action" name="action"><input type="hidden" value="POST" id="method" name="method"></form>\n\n</body></html>'
              }
            }
          ],
          fulfillments: [
            {
              id: '15',
              type: 'Mediation Services',
              rateable: true,
              tracking: false
            },
            {
              id: '15',
              type: 'Mediation Services',
              rating: '4',
              rateable: true,
              tracking: false
            },
            {
              id: '15',
              type: 'Mediation Services',
              rating: '4',
              rateable: true,
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
    }
  ]
}
