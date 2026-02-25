/** Discover API response used for now (on_discover with 2 catalogs) */
export const MOCK_DISCOVER_RESPONSE = {
  context: {
    message_id: '711c8190-2217-4155-a2a8-9a3aece6c095',
    bap_id: 'ev-charging.sandbox1.com',
    transaction_id: '2dee2912-c242-4e8f-98c3-afe5997ca54b',
    timestamp: '2026-02-13T16:39:27.183Z',
    action: 'on_discover',
    version: '2.0.0',
    ttl: 'PT30S',
    bap_uri: 'https://ref-apps-bap-onix.beckn.io',
    schema_context: [
      'https://raw.githubusercontent.com/beckn/protocol-specifications-new/refs/heads/main/schema/EvChargingService/v1/context.jsonld'
    ]
  },
  message: {
    catalogs: [
      {
        '@context':
          'https://raw.githubusercontent.com/beckn/protocol-specifications-new/refs/heads/main/schema/core/v2/context.jsonld',
        '@type': 'beckn:Catalog',
        'beckn:id': 'catalog-ev-charging-001',
        'beckn:descriptor': {
          '@type': 'beckn:Descriptor',
          'schema:name': 'EV Charging Services Network'
        },
        'beckn:providerId': 'ecopower-charging',
        'beckn:bppId': 'ev-charging.sandbox2.com',
        'beckn:bppUri': 'https://hayes-directories-particle-elizabeth.trycloudflare.com/bpp/receiver',
        'beckn:items': [
          {
            '@context':
              'https://raw.githubusercontent.com/beckn/protocol-specifications-new/refs/heads/main/schema/core/v2/context.jsonld',
            '@type': 'beckn:Item',
            'beckn:id': 'ev-charger-ccs2-001',
            'beckn:descriptor': {
              '@type': 'beckn:Descriptor',
              'schema:name': 'DC Fast Charger - CCS2 (60kW)',
              'beckn:shortDesc': 'High-speed DC charging station with CCS2 connector',
              'beckn:longDesc':
                'Ultra-fast DC charging station supporting CCS2 connector type with 60kW maximum power output. Features advanced thermal management and smart charging capabilities.'
            },
            'beckn:category': {
              '@type': 'schema:CategoryCode',
              'schema:codeValue': 'ev-charging',
              'schema:name': 'EV Charging'
            },
            'beckn:availableAt': [
              {
                '@type': 'beckn:Location',
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
              }
            ],
            'beckn:availabilityWindow': [
              {
                '@type': 'beckn:TimePeriod',
                'schema:startTime': '22:00:00Z',
                'schema:endTime': '22:00:00Z'
              }
            ],
            'beckn:rateable': true,
            'beckn:rating': {
              '@type': 'beckn:Rating',
              'beckn:ratingValue': 4.5,
              'beckn:ratingCount': 128
            },
            'beckn:isActive': true,
            'beckn:networkId': ['bap.net/ev-charging'],
            'beckn:provider': {
              'beckn:id': 'ecopower-charging',
              'beckn:descriptor': {
                '@type': 'beckn:Descriptor',
                'schema:name': 'EcoPower Charging Pvt Ltd'
              }
            },
            'beckn:itemAttributes': {
              '@context':
                'https://raw.githubusercontent.com/beckn/protocol-specifications-new/refs/heads/main/schema/EvChargingService/v1/context.jsonld',
              '@type': 'beckn:Item',
              evseId: 'IN*ECO*BTM*01*CCS2*A',
              connectorType: 'CCS2',
              reservationSupported: 'true',
              parkingType: 'Mall',
              connectorFormat: 'CABLE',
              maxPowerKW: 60,
              amenityFeature: ['RESTAURANT', 'RESTROOM', 'WI-FI'],
              name: 'surabhi',
              roamingNetwork: 'GreenRoam',
              chargingSpeed: 'FAST',
              minPowerKW: 5,
              powerType: 'DC'
            }
          }
        ]
      },
      {
        '@context':
          'https://raw.githubusercontent.com/beckn/protocol-specifications-new/refs/heads/main/schema/core/v2/context.jsonld',
        '@type': 'beckn:Catalog',
        'beckn:id': 'strapi-catalog-ev-charging-001',
        'beckn:descriptor': {
          '@type': 'beckn:Descriptor',
          'schema:name': 'EV Charging Services Network',
          'beckn:shortDesc': 'Comprehensive network of fast charging stations across Bengaluru'
        },
        'beckn:providerId': 'ukhy2rkj4ye66a0lv6lu18if',
        'beckn:bppId': 'bpp.example.com',
        'beckn:bppUri': 'https://bpp.example.com',
        'beckn:validity': {
          '@type': 'beckn:TimePeriod',
          'schema:startDate': '2026-01-01T00:00:00Z',
          'schema:endDate': '2030-12-31T23:59:59Z'
        },
        'beckn:items': [
          {
            '@context':
              'https://raw.githubusercontent.com/beckn/protocol-specifications-new/refs/heads/main/schema/core/v2/context.jsonld',
            '@type': 'beckn:Item',
            'beckn:id': 'cujq03g0kq2etsflckrrc0w0',
            'beckn:descriptor': {
              '@type': 'beckn:Descriptor',
              'schema:name': 'DC Fast Charger - CCS2 (60kW)',
              'beckn:shortDesc': 'High-speed DC charging station with CCS2 connector',
              'beckn:longDesc':
                'Ultra-fast DC charging station supporting CCS2 connector type with 60kW maximum power output. Features advanced thermal management and smart charging capabilities.'
            },
            'beckn:category': {
              '@type': 'schema:CategoryCode',
              'schema:codeValue': 'ev-charging',
              'schema:name': 'EV Charging'
            },
            'beckn:availableAt': [
              {
                '@type': 'beckn:Location',
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
              }
            ],
            'beckn:availabilityWindow': [
              {
                '@type': 'beckn:TimePeriod',
                'schema:startTime': '06:00:00Z',
                'schema:endTime': '22:00:00Z'
              }
            ],
            'beckn:rateable': true,
            'beckn:rating': {
              '@type': 'beckn:Rating',
              'beckn:ratingValue': 4.5,
              'beckn:ratingCount': 130
            },
            'beckn:isActive': true,
            'beckn:provider': {
              'beckn:id': 'ukhy2rkj4ye66a0lv6lu18if',
              'beckn:descriptor': {
                '@type': 'beckn:Descriptor',
                'schema:name': 'EcoPower Charging Pvt Ltd'
              }
            },
            'beckn:itemAttributes': {
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
        ],
        'beckn:offers': []
      },
      {
        '@context':
          'https://raw.githubusercontent.com/beckn/protocol-specifications-new/refs/heads/main/schema/core/v2/context.jsonld',
        '@type': 'beckn:Catalog',
        'beckn:id': 'catalog-ev-charging-001',
        'beckn:descriptor': {
          '@type': 'beckn:Descriptor',
          'schema:name': 'EV Charging Services Network',
          'beckn:shortDesc': 'Comprehensive network of fast charging stations across Bengaluru'
        },
        'beckn:providerId': 'greencharge-koramangala',
        'beckn:bppId': 'bpp.example.com',
        'beckn:bppUri': 'https://bpp.example.com',
        'beckn:validity': {
          '@type': 'beckn:TimePeriod',
          'schema:startDate': '2024-10-01T00:00:00Z',
          'schema:endDate': '2025-01-15T23:59:59Z'
        },
        'beckn:items': [
          {
            '@context':
              'https://raw.githubusercontent.com/beckn/protocol-specifications-new/refs/heads/main/schema/core/v2/context.jsonld',
            '@type': 'beckn:Item',
            'beckn:id': 'ev-charger-ccs2-002',
            'beckn:descriptor': {
              '@type': 'beckn:Descriptor',
              'schema:name': 'DC Fast Charger - CCS2 (120kW)',
              'beckn:shortDesc': 'Ultra-fast DC charging station with CCS2 connector',
              'beckn:longDesc':
                'Ultra-fast DC charging station supporting CCS2 connector type with 120kW maximum power output. Features liquid cooling and advanced power management.'
            },
            'beckn:category': {
              '@type': 'schema:CategoryCode',
              'schema:codeValue': 'ev-charging',
              'schema:name': 'EV Charging'
            },
            'beckn:availableAt': [
              {
                '@type': 'beckn:Location',
                geo: {
                  type: 'Point',
                  coordinates: [77.6104, 12.9153]
                },
                address: {
                  streetAddress: 'GreenCharge Koramangala, 80 Ft Rd',
                  addressLocality: 'Bengaluru',
                  addressRegion: 'Karnataka',
                  postalCode: '560034',
                  addressCountry: 'IN'
                }
              }
            ],
            'beckn:availabilityWindow': [
              {
                '@type': 'beckn:TimePeriod',
                'schema:startTime': '00:00:00Z',
                'schema:endTime': '23:59:59Z'
              }
            ],
            'beckn:rateable': true,
            'beckn:rating': {
              '@type': 'beckn:Rating',
              'beckn:ratingValue': 4.7,
              'beckn:ratingCount': 89
            },
            'beckn:isActive': true,
            'beckn:networkId': ['bap.net/ev-charging'],
            'beckn:provider': {
              'beckn:id': 'greencharge-koramangala',
              'beckn:descriptor': {
                '@type': 'beckn:Descriptor',
                'schema:name': 'GreenCharge Energy Solutions'
              }
            },
            'beckn:itemAttributes': {
              '@context':
                'https://raw.githubusercontent.com/beckn/protocol-specifications-new/refs/heads/main/schema/EvChargingService/v1/context.jsonld',
              '@type': 'ChargingService',
              serviceLocation: {
                geo: {
                  type: 'Point',
                  coordinates: [77.6104, 12.9153]
                },
                '@type': 'beckn:Location',
                address: {
                  postalCode: '560034',
                  addressRegion: 'Karnataka',
                  streetAddress: 'GreenCharge Koramangala, 80 Ft Rd',
                  addressCountry: 'IN',
                  addressLocality: 'Bengaluru'
                }
              },
              parkingType: 'OffStreet',
              connectorType: 'CCS2',
              amenityFeature: ['RESTAURANT', 'RESTROOM', 'WI-FI', 'PARKING'],
              connectorId: 'CCS2-B',
              socketCount: 1,
              roamingNetwork: 'GreenRoam',
              minPowerKW: 10,
              evseId: 'IN*GC*KOR*01*CCS2*A',
              reservationSupported: true,
              connectorFormat: 'CABLE',
              maxPowerKW: 120,
              stationStatus: 'Available',
              chargingSpeed: 'ULTRAFAST',
              ocppId: 'IN-GC-KOR-01',
              powerType: 'DC'
            }
          }
        ],
        'beckn:offers': [
          {
            '@context':
              'https://raw.githubusercontent.com/beckn/protocol-specifications-new/refs/heads/main/schema/core/v2/context.jsonld',
            '@type': 'beckn:Offer',
            'beckn:id': 'offer-ccs2-120kw-kwh',
            'beckn:descriptor': {
              '@type': 'beckn:Descriptor',
              'schema:name': 'Per-kWh Tariff - CCS2 120kW'
            },
            'beckn:items': ['ev-charger-ccs2-002'],
            'beckn:price': {
              currency: 'INR',
              value: 22,
              applicableQuantity: {
                unitText: 'Kilowatt Hour',
                unitCode: 'KWH',
                unitQuantity: 1
              }
            },
            'beckn:validity': {
              '@type': 'beckn:TimePeriod',
              'schema:startDate': '2025-10-15T00:00:00Z',
              'schema:endDate': '2026-04-15T23:59:59Z'
            },
            'beckn:acceptedPaymentMethod': ['UPI', 'CREDIT_CARD', 'WALLET', 'BANK_TRANSFER'],
            'beckn:offerAttributes': {
              '@context':
                'https://raw.githubusercontent.com/beckn/protocol-specifications-new/refs/heads/main/schema/EvChargingOffer/v1/context.jsonld',
              '@type': 'ChargingOffer',
              buyerFinderFee: {
                feeType: 'PERCENTAGE',
                feeValue: 2
              },
              idleFeePolicy: '₹3/min after 15 min post-charge'
            },
            'beckn:provider': 'greencharge-koramangala'
          }
        ]
      }
    ]
  }
}
