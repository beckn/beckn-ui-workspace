import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { getTemplate, getStylingHints, renderTemplate } from '../lib/templateProcessor'

interface DiscoverResponse {
  context: {
    schema_context?: string[]
    [key: string]: unknown
  }
  message: {
    catalogs?: Array<{
      '@context'?: string
      'beckn:items'?: unknown[]
      'beckn:offers'?: unknown[]
      [key: string]: unknown
    }>
    [key: string]: unknown
  }
  [key: string]: unknown
}

const Discovery = () => {
  const router = useRouter()
  const [renderedHtml, setRenderedHtml] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAndRender = async () => {
      try {
        // Use the provided mock response data directly (no API call to avoid CORS)
        const data: DiscoverResponse = {
          context: {
            message_id: '42bbc400-c3cd-47ee-b2bb-d811ebf0932f',
            bap_id: 'ev-charging.sandbox1.com',
            transaction_id: 'ef4d941e-f27d-4d27-999b-1b2a8e37223e',
            timestamp: '2026-02-12T09:57:25.35Z',
            action: 'on_discover',
            version: '2.0.0',
            ttl: 'PT30S',
            bap_uri: 'http://onix-adapter:8081/bap/receiver',
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
              }
            ]
          }
        }

        // Use the specific renderer.json URL provided
        const rendererUrl = 'https://raw.githubusercontent.com/beckn/beckn-ui-workspace/refs/heads/main/renderer.json'

        // Fetch renderer config directly from the provided URL
        const response = await fetch(rendererUrl)
        if (!response.ok) {
          throw new Error(`Failed to fetch renderer config: ${response.statusText}`)
        }
        const config = await response.json()

        // Get discoveryCard template
        const templateConfig = getTemplate(config, 'discoveryCard')
        if (!templateConfig || !templateConfig.html) {
          throw new Error('discoveryCard template not found in renderer.json')
        }

        // Get styling hints
        const stylingHints = getStylingHints(config)

        // Find the catalog with id "strapi-catalog-ev-charging-001" only
        const catalogs = data.message?.catalogs || []
        const targetCatalog = catalogs.find(
          (catalog: unknown) => (catalog as Record<string, unknown>)['beckn:id'] === 'strapi-catalog-ev-charging-001'
        )

        if (!targetCatalog) {
          throw new Error('Catalog with id "strapi-catalog-ev-charging-001" not found')
        }

        // Get items and offers from the target catalog
        const items = ((targetCatalog as Record<string, unknown>)['beckn:items'] as unknown[]) || []
        const offers = ((targetCatalog as Record<string, unknown>)['beckn:offers'] as unknown[]) || []

        // Process each item with the template and ensure data-item-id attribute is present
        const renderedItems = items
          .map((item: unknown) => {
            const itemId = (item as Record<string, unknown>)['beckn:id'] as string
            const rendered = renderTemplate(templateConfig.html!, item, offers, stylingHints)
            // Ensure the rendered HTML has data-item-id attribute for click handling
            // If the template doesn't include it, wrap it in a div with the attribute
            if (rendered && !rendered.includes('data-item-id')) {
              return `<div data-item-id="${itemId}">${rendered}</div>`
            }
            return rendered
          })
          .join('')

        setRenderedHtml(renderedItems)
        setLoading(false)
      } catch (err) {
        console.error('Error fetching/rendering template:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
        setLoading(false)
      }
    }

    fetchAndRender()
  }, [])

  const handleItemClick = (itemId: string) => {
    router.push(`/detailView?itemId=${itemId}`)
  }

  useEffect(() => {
    // Use event delegation on the parent container for more reliable click handling
    if (renderedHtml) {
      let clickHandler: ((e: Event) => void) | null = null
      let container: Element | null = null
      let timeoutId: NodeJS.Timeout

      // Wait for next tick to ensure DOM is updated
      timeoutId = setTimeout(() => {
        container = document.querySelector('[data-discovery-container]')
        if (!container) return

        // Add event listener to container (event delegation)
        clickHandler = (e: Event) => {
          const target = e.target as HTMLElement
          // Find the closest element with data-item-id
          const card = target.closest('[data-item-id]')
          if (card) {
            const itemId = card.getAttribute('data-item-id')
            if (itemId) {
              e.preventDefault()
              e.stopPropagation()
              handleItemClick(itemId)
            }
          }
        }

        container.addEventListener('click', clickHandler)

        // Set cursor pointer on all cards
        const cards = container.querySelectorAll('[data-item-id]')
        cards.forEach(card => {
          if (card instanceof HTMLElement) {
            card.style.cursor = 'pointer'
          }
        })
      }, 100)

      return () => {
        clearTimeout(timeoutId)
        // Cleanup event listener
        if (clickHandler && container) {
          container.removeEventListener('click', clickHandler)
        }
      }
    }
  }, [renderedHtml, router])

  return (
    <>
      <Head>
        <title>EV Charging Discovery - Beckn</title>
        <meta
          name="description"
          content="Browse EV charging stations using Beckn protocol"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
      </Head>
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#f5f5f5'
        }}
      >
        {/* Header */}
        <header
          style={{
            background: 'white',
            borderBottom: '1px solid #e5e7eb',
            padding: '1rem 0',
            position: 'sticky',
            top: 0,
            zIndex: 100,
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
          }}
        >
          <div
            style={{
              maxWidth: '1200px',
              margin: '0 auto',
              padding: '0 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem'
            }}
          >
            <Link
              href="/"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                textDecoration: 'none',
                color: 'inherit'
              }}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '1.25rem',
                  fontWeight: 'bold'
                }}
              >
                EV
              </div>
              <span style={{ fontSize: '1.25rem', fontWeight: '700', color: '#424750' }}>EV Charging</span>
            </Link>
            <h1
              style={{
                fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
                fontWeight: '600',
                color: '#424750',
                margin: 0
              }}
            >
              Charging Station Discovery
            </h1>
          </div>
        </header>

        {/* Main Content */}
        <main
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '2rem 20px'
          }}
        >
          {loading && (
            <div
              style={{
                textAlign: 'center',
                padding: '4rem 2rem',
                color: '#6b7280'
              }}
            >
              <div
                style={{
                  display: 'inline-block',
                  width: '40px',
                  height: '40px',
                  border: '4px solid #e5e7eb',
                  borderTopColor: '#2563eb',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite',
                  marginBottom: '1rem'
                }}
              />
              <p style={{ fontSize: '1rem', fontWeight: '500' }}>Loading charging stations...</p>
            </div>
          )}

          {error && (
            <div
              style={{
                backgroundColor: '#fee2e2',
                border: '1px solid #fca5a5',
                borderRadius: '12px',
                padding: '1.5rem',
                marginBottom: '2rem',
                color: '#991b1b'
              }}
            >
              <div style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Error</div>
              <div>{error}</div>
            </div>
          )}

          {!loading && !error && renderedHtml && (
            <div
              data-discovery-container
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))',
                gap: '1.5rem'
              }}
              dangerouslySetInnerHTML={{ __html: renderedHtml }}
            />
          )}

          {!loading && !error && !renderedHtml && (
            <div
              style={{
                textAlign: 'center',
                padding: '4rem 2rem',
                color: '#6b7280'
              }}
            >
              <p style={{ fontSize: '1rem' }}>No charging stations found</p>
            </div>
          )}
        </main>
      </div>
      <style>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </>
  )
}

export default Discovery
