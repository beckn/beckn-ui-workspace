import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import discoverData from '../constant/discover.json'
import { fetchRendererConfig, getTemplate, getStylingHints, renderTemplate } from '../lib/templateProcessor'

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

        // Extract @context URL from the first catalog in discover.json
        const firstCatalog = discoverData.message?.catalogs?.[0]
        if (!firstCatalog || !firstCatalog['@context']) {
          throw new Error('No @context found in catalog')
        }

        const contextUrl = firstCatalog['@context'] as string

        // Fetch renderer config
        const config = await fetchRendererConfig(contextUrl)

        // Get detailView template
        const templateConfig = getTemplate(config, 'detailView')
        if (!templateConfig || !templateConfig.html) {
          throw new Error('detailView template not found in renderer.json')
        }

        // Get styling hints
        const stylingHints = getStylingHints(config)

        // Find the item by ID
        const items = firstCatalog['beckn:items'] || []
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
        const offers = firstCatalog['beckn:offers'] || []

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
        <title>Product Details - Beckn Test App</title>
        <meta
          name="description"
          content="Product detail view"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
      </Head>
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: 'var(--color-bg)'
        }}
      >
        {/* Header */}
        <header
          style={{
            background: 'white',
            borderBottom: '1px solid var(--color-border)',
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
                border: '1px solid var(--color-border)',
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
                e.currentTarget.style.borderColor = '#A71B4A'
                e.currentTarget.style.color = '#A71B4A'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'white'
                e.currentTarget.style.borderColor = 'var(--color-border)'
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
              Product Details
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
                  borderTopColor: '#A71B4A',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite',
                  marginBottom: '1rem'
                }}
              />
              <p style={{ fontSize: '1rem', fontWeight: '500' }}>Loading product details...</p>
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
                border: '1px solid var(--color-border)'
              }}
            >
              {productImage && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <img
                    src={productImage}
                    alt="Product image"
                    style={{
                      width: '100%',
                      maxHeight: '380px',
                      objectFit: 'cover',
                      borderRadius: '12px',
                      border: '1px solid var(--color-border)',
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
      <style jsx>{`
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
