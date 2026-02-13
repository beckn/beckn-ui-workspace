import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { getTemplate, getStylingHints, renderTemplate } from '@lib/templateProcessor'
import { catalogItemToParsedModel, catalogItemToSelectedCharger } from '@lib/catalogAdapter'
import type { DiscoverRootState } from '@beckn-ui/common'
import { cartActions } from '@store/cart-slice'
import { chargerSelectActions } from '@store/chargerSelect-slice'
import { checkoutActions } from '@beckn-ui/common'
import { DOMAIN } from '@lib/config'
import { findItemInCatalogs, getCatalogItemsAndOffers } from '@utils/discoverHelpers'
import { fetchRendererConfigFromDiscoverCatalogs } from '@utils/rendererFromDiscover'
import { wrapTemplatePriceInBold } from '@utils/templateUtils'

const FALLBACK_RENDERER_URL = 'https://raw.githubusercontent.com/beckn/beckn-ui-workspace/refs/heads/main/renderer.json'

const DEFAULT_IMAGE =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2U1ZTdlYiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4='

/** Product details template: prefer detailView, then productDetails from renderer.json */
function getProductDetailsTemplate(config: Awaited<ReturnType<typeof fetchRendererConfigFromDiscoverCatalogs>>) {
  const detailView = getTemplate(config, 'detailView')
  if (detailView?.html) return detailView
  const templates = config.templates as Record<string, { html?: string } | undefined> | undefined
  return templates?.productDetails ?? null
}

const DetailView = () => {
  const router = useRouter()
  const { itemId } = router.query
  const dispatch = useDispatch()
  const discoverCatalogs = useSelector((state: DiscoverRootState) => state.discover.catalogs)
  const transactionId = useSelector((state: DiscoverRootState) => state.discover.transactionId)
  const [renderedHtml, setRenderedHtml] = useState<string>('')
  const [productImage, setProductImage] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!itemId || typeof itemId !== 'string') {
      setError('Invalid item')
      setLoading(false)
      return
    }
    if (!discoverCatalogs?.length) {
      setError('No discovery data. Please search from the home page first.')
      setLoading(false)
      return
    }

    const found = findItemInCatalogs(discoverCatalogs, itemId)
    if (!found) {
      setError(`Charging station "${itemId}" not found.`)
      setLoading(false)
      return
    }

    const { catalog, item } = found
    const descriptor = (item['beckn:descriptor'] ?? item['descriptor']) as Record<string, unknown> | undefined
    const images = (descriptor?.['schema:image'] ?? descriptor?.['image']) as string[] | undefined
    const imageUrl = images?.[0] || ''
    setProductImage(imageUrl || DEFAULT_IMAGE)

    const run = async () => {
      try {
        let config: Awaited<ReturnType<typeof fetchRendererConfigFromDiscoverCatalogs>>
        try {
          config = await fetchRendererConfigFromDiscoverCatalogs(discoverCatalogs)
        } catch {
          const r = await fetch(FALLBACK_RENDERER_URL)
          if (!r.ok) throw new Error('Failed to fetch renderer')
          config = await r.json()
        }

        const templateConfig = getProductDetailsTemplate(config)
        if (!templateConfig?.html) {
          setError('Product details template (detailView / productDetails) not found in renderer.json')
          setLoading(false)
          return
        }

        const stylingHints = getStylingHints(config)
        const { offers } = getCatalogItemsAndOffers(catalog)
        const templateHtml = wrapTemplatePriceInBold(templateConfig.html)
        const html = renderTemplate(templateHtml, item, offers, stylingHints)
        setRenderedHtml(html)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load details')
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [itemId, discoverCatalogs])

  const handleAddToCart = () => {
    if (!itemId || typeof itemId !== 'string' || !discoverCatalogs?.length) return
    const found = findItemInCatalogs(discoverCatalogs, itemId)
    if (!found) return
    const { catalog, item } = found
    const txId = transactionId || `txn-${Date.now()}`
    const parsed = catalogItemToParsedModel(catalog, item, txId, DOMAIN)
    const selected = catalogItemToSelectedCharger(catalog, item, parsed)
    dispatch(cartActions.clearCart())
    dispatch(checkoutActions.clearState())
    dispatch(chargerSelectActions.setSelectedCharger(selected))
    dispatch(
      cartActions.addItemToCart({
        product: parsed,
        quantity: 1,
        amountToPay: parsed.item?.price?.value ? parseFloat(String(parsed.item.price.value)) : 0
      })
    )
  }

  const handleProceedToCheckout = () => {
    handleAddToCart()
    router.push('/checkout')
  }

  return (
    <>
      <Head>
        <title>Charging station details – EV Charging</title>
        <meta
          name="description"
          content="Charging station detail"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
      </Head>
      <div className="ev-app min-h-full bg-[var(--ev-bg)] flex flex-col">
        <main
          data-ev-main
          className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-4 sm:py-8 pb-[calc(1rem+var(--ev-safe-bottom))]"
        >
          {loading && (
            <div className="flex flex-col items-center justify-center py-12 sm:py-16 text-[var(--ev-text-muted)]">
              <div className="w-10 h-10 border-4 border-[var(--ev-border)] border-t-[var(--ev-primary)] rounded-full animate-spin mb-4" />
              <p className="font-medium text-sm sm:text-base">Loading details…</p>
            </div>
          )}

          {error && !loading && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-800 mb-4 sm:mb-6 text-sm sm:text-base">
              <p className="font-semibold">Error</p>
              <p>{error}</p>
              <Link
                href="/discovery"
                className="inline-block mt-3 min-h-[var(--ev-touch-min)] flex items-center text-[var(--ev-primary)] font-medium hover:underline"
              >
                Back to list
              </Link>
            </div>
          )}

          {!loading && !error && renderedHtml && (
            <>
              <div className="bg-[var(--ev-surface)] rounded-xl sm:rounded-2xl border border-[var(--ev-border)] shadow-sm overflow-hidden mb-4 sm:mb-6">
                {productImage && (
                  <div className="aspect-video w-full bg-[var(--ev-bg)]">
                    <img
                      src={productImage}
                      alt="Charging station"
                      className="w-full h-full object-cover"
                      onError={e => {
                        if (e.currentTarget.src !== DEFAULT_IMAGE) e.currentTarget.src = DEFAULT_IMAGE
                      }}
                    />
                  </div>
                )}
                <div className="px-4 py-3 sm:px-5 sm:py-4 detail-view-content">
                  <div
                    className="text-sm sm:text-base [&_*]:max-w-full"
                    dangerouslySetInnerHTML={{ __html: renderedHtml }}
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={handleProceedToCheckout}
                  className="flex-1 min-h-[var(--ev-touch-min)] py-3.5 px-6 rounded-xl font-medium bg-[var(--ev-primary)] text-white hover:bg-[var(--ev-primary-hover)] active:opacity-90 transition text-base"
                >
                  Proceed to checkout
                </button>
              </div>
            </>
          )}
        </main>
      </div>
    </>
  )
}

export default DetailView
