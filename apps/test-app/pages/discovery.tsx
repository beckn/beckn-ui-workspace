import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import discoverData from '../constant/discover.json'
import { fetchRendererConfig, getTemplate, getStylingHints, renderTemplate } from '../lib/templateProcessor'

const Discovery = () => {
  const router = useRouter()
  const [renderedHtml, setRenderedHtml] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAndRender = async () => {
      try {
        // Extract @context URL from the first catalog in discover.json
        const firstCatalog = discoverData.message?.catalogs?.[0]
        if (!firstCatalog || !firstCatalog['@context']) {
          throw new Error('No @context found in catalog')
        }

        const contextUrl = firstCatalog['@context'] as string

        // Fetch renderer config
        const config = await fetchRendererConfig(contextUrl)

        // Get discoveryCard template
        const templateConfig = getTemplate(config, 'discoveryCard')
        if (!templateConfig || !templateConfig.html) {
          throw new Error('discoveryCard template not found in renderer.json')
        }

        // Get styling hints
        const stylingHints = getStylingHints(config)

        // Get items and offers from catalog
        const items = firstCatalog['beckn:items'] || []
        const offers = firstCatalog['beckn:offers'] || []

        // Process each item with the template
        const renderedItems = items
          .map((item: unknown) => renderTemplate(templateConfig.html!, item, offers, stylingHints))
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
    // Add click handlers to rendered items after they're inserted
    if (renderedHtml) {
      const cards = document.querySelectorAll('[data-item-id]')
      const handlers: Array<{ element: HTMLElement; handler: () => void }> = []

      cards.forEach(card => {
        const itemId = card.getAttribute('data-item-id')
        if (itemId && card instanceof HTMLElement) {
          card.style.cursor = 'pointer'
          const clickHandler = () => handleItemClick(itemId)
          card.addEventListener('click', clickHandler)
          handlers.push({ element: card, handler: clickHandler })
        }
      })

      return () => {
        handlers.forEach(({ element, handler }) => {
          element.removeEventListener('click', handler)
        })
      }
    }
  }, [renderedHtml])

  return (
    <>
      <Head>
        <title>Product Discovery - Beckn Test App</title>
        <meta
          name="description"
          content="Browse products using Beckn protocol"
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
                  background: 'linear-gradient(135deg, #A71B4A 0%, #C91F5A 100%)',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '1.25rem',
                  fontWeight: 'bold'
                }}
              >
                B
              </div>
              <span style={{ fontSize: '1.25rem', fontWeight: '700', color: '#424750' }}>Beckn</span>
            </Link>
            <h1
              style={{
                fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
                fontWeight: '600',
                color: '#424750',
                margin: 0
              }}
            >
              Product Discovery
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
                  borderTopColor: '#A71B4A',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite',
                  marginBottom: '1rem'
                }}
              />
              <p style={{ fontSize: '1rem', fontWeight: '500' }}>Loading products...</p>
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
              <p style={{ fontSize: '1rem' }}>No products found</p>
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

export default Discovery
