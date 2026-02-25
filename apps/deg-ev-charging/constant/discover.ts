export const DISCOVER_RESPONSE = {
  context: {
    domain: 'beckn.one:deg:ev-charging:*',
    action: 'on_discover',
    version: '2.0.0',
    bap_id: 'ev-charging.sandbox1.com',
    bap_uri: 'https://ref-apps-bap-onix.beckn.io',
    transaction_id: '44dc10b0-dabf-42fd-986a-ca3624b7ca8f',
    message_id: '96eab308-40a0-4a51-8169-10e0f9a6d7f0',
    timestamp: '2026-02-20T06:14:23.234Z',
    ttl: 'PT30S',
    location: {
      country: {
        name: 'India',
        code: 'IND'
      },
      city: {
        name: 'Bangalore',
        code: 'std:080'
      }
    }
  },
  message: {
    catalogs: [
      {
        '@context':
          'https://raw.githubusercontent.com/beckn/protocol-specifications-new/refs/heads/main/schema/core/v2/context.jsonld',
        '@type': 'beckn:Catalog',
        id: 'strapi-catalog-ev-charging-001',
        descriptor: {
          '@type': 'beckn:Descriptor',
          name: 'EV Charging Services Network',
          shortDesc: 'Comprehensive network of fast charging stations across Bengaluru'
        },
        providerId: 'ukhy2rkj4ye66a0lv6lu18if',
        bppId: 'bpp.example.com',
        bppUri: 'https://bpp.example.com',
        validity: {
          '@type': 'beckn:TimePeriod',
          startDate: '2026-01-01T00:00:00Z',
          endDate: '2030-12-31T23:59:59Z'
        },
        items: [
          {
            '@context':
              'https://raw.githubusercontent.com/beckn/protocol-specifications-new/refs/heads/main/schema/core/v2/context.jsonld',
            '@type': 'beckn:Item',
            id: 'cujq03g0kq2etsflckrrc0w0',
            descriptor: {
              '@type': 'beckn:Descriptor',
              name: 'DC Fast Charger - CCS2 (60kW)',
              shortDesc: 'High-speed DC charging station with CCS2 connector',
              longDesc:
                'Ultra-fast DC charging station supporting CCS2 connector type with 60kW maximum power output. Features advanced thermal management and smart charging capabilities.'
            },
            category: {
              '@type': 'schema:CategoryCode',
              codeValue: 'ev-charging',
              name: 'EV Charging'
            },
            availableAt: {
              '@type': '@type',
              geo: {
                type: 'Point',
                coordinates: [77.5946, 12.9716]
              },
              address: {
                streetAddress: 'EcoPower BTM Hub, 100 Ft Rd',
                addressLocality: 'Bengaluru',
                addressRegion: 'Karnataka',
                postalCode: '560076',
                addressCountry: 'IN'
              }
            },
            availabilityWindow: {
              '@type': '@type',
              startDate: 'schema:startDate',
              endDate: 'schema:endDate',
              startTime: 'schema:startTime',
              endTime: 'schema:endTime'
            },
            rateable: true,
            rating: {
              '@type': 'beckn:Rating',
              ratingValue: 4.5,
              ratingCount: 130
            },
            isActive: true,
            provider: {
              id: 'ukhy2rkj4ye66a0lv6lu18if',
              descriptor: {
                '@type': 'beckn:Descriptor',
                name: 'EcoPower Charging Pvt Ltd'
              }
            },
            itemAttributes: {
              '@context':
                'https://raw.githubusercontent.com/beckn/protocol-specifications-new/refs/heads/main/schema/EvChargingService/v1/context.jsonld',
              '@type': 'ChargingService',
              connectorType: 'CCS2',
              reservationSupported: true,
              maxPowerKW: 60,
              socketCount: 2,
              minPowerKW: 5
            }
          }
        ]
      }
    ]
  }
}
