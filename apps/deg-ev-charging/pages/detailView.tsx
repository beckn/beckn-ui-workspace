import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { getTemplate, getStylingHints, renderTemplate } from '../lib/templateProcessor'

const DetailView = () => {
  const router = useRouter()
  const { itemId } = router.query
  const [renderedHtml, setRenderedHtml] = useState<string>('')
  const [productImage, setProductImage] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const DEFAULT_IMAGE =
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2U1ZTdlYiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4='

  useEffect(() => {
    const fetchAndRender = async () => {
      try {
        if (!itemId || typeof itemId !== 'string') {
          throw new Error('Item ID is required')
        }

        // Use the same mock data as discovery page
        const data = {
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

        // Use the specific renderer.json URL
        const rendererUrl = 'https://raw.githubusercontent.com/beckn/beckn-ui-workspace/refs/heads/main/renderer.json'

        // Fetch renderer config
        const response = await fetch(rendererUrl)
        if (!response.ok) {
          throw new Error(`Failed to fetch renderer config: ${response.statusText}`)
        }
        const config = await response.json()

        // Get detailView template
        const templateConfig = getTemplate(config, 'detailView')
        if (!templateConfig || !templateConfig.html) {
          throw new Error('detailView template not found in renderer.json')
        }

        // Get styling hints
        const stylingHints = getStylingHints(config)

        // Find the catalog with id "strapi-catalog-ev-charging-001"
        const catalogs = data.message?.catalogs || []
        const targetCatalog = catalogs.find(
          (catalog: unknown) => (catalog as Record<string, unknown>)['beckn:id'] === 'strapi-catalog-ev-charging-001'
        )

        if (!targetCatalog) {
          throw new Error('Catalog with id "strapi-catalog-ev-charging-001" not found')
        }

        // Find the item by ID in the target catalog
        const items = ((targetCatalog as Record<string, unknown>)['beckn:items'] as unknown[]) || []
        const item = items.find((item: unknown) => {
          const id = (item as Record<string, unknown>)['beckn:id']
          return id === itemId
        })

        if (!item) {
          throw new Error(`Item with ID ${itemId} not found`)
        }

        // Extract product image (schema:image[0]) with fallback
        const descriptor = (item as Record<string, unknown>)['beckn:descriptor'] as Record<string, unknown> | undefined
        const images = (descriptor?.['schema:image'] as string[] | undefined) || []
        const imageUrl = images[0] || ''
        setProductImage(imageUrl || DEFAULT_IMAGE)

        // Get offers from catalog
        const offers = ((targetCatalog as Record<string, unknown>)['beckn:offers'] as unknown[]) || []

        // Render the template with the item data
        const rendered = renderTemplate(templateConfig.html, item, offers, stylingHints)

        setRenderedHtml(rendered)
        setLoading(false)
      } catch (err) {
        console.error('Error fetching/rendering template:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
        setLoading(false)
      }
    }

    if (itemId) {
      fetchAndRender()
    }
  }, [itemId])

  return (
    <>
      <Head>
        <title>Charging Station Details - EV Charging</title>
        <meta
          name="description"
          content="Charging station detail view"
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
              gap: '1rem',
              flexWrap: 'wrap'
            }}
          >
            <button
              onClick={() => router.back()}
              style={{
                padding: '0.625rem 1.25rem',
                background: 'white',
                color: '#424750',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.9375rem',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#f9fafb'
                e.currentTarget.style.borderColor = '#2563eb'
                e.currentTarget.style.color = '#2563eb'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'white'
                e.currentTarget.style.borderColor = '#e5e7eb'
                e.currentTarget.style.color = '#424750'
              }}
            >
              <span>←</span>
              <span>Back</span>
            </button>
            <div
              style={{
                fontSize: 'clamp(1rem, 2.5vw, 1.125rem)',
                fontWeight: '600',
                color: '#424750'
              }}
            >
              Charging Station Details
            </div>
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
              <p style={{ fontSize: '1rem', fontWeight: '500' }}>Loading charging station details...</p>
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
              style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: 'clamp(1.5rem, 4vw, 2.5rem)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                border: '1px solid #e5e7eb'
              }}
            >
              {productImage && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <img
                    src={productImage}
                    alt="Charging station image"
                    style={{
                      width: '100%',
                      maxHeight: '380px',
                      objectFit: 'cover',
                      borderRadius: '12px',
                      border: '1px solid #e5e7eb',
                      backgroundColor: '#f3f4f5'
                    }}
                    onError={e => {
                      const target = e.currentTarget
                      if (target.src !== DEFAULT_IMAGE) target.src = DEFAULT_IMAGE
                    }}
                  />
                </div>
              )}
              <div dangerouslySetInnerHTML={{ __html: renderedHtml }} />
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

export default DetailView
