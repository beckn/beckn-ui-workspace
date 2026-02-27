import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { catalogItemToParsedModel, catalogItemToSelectedCharger } from '@lib/catalogAdapter'
import type { DiscoverRootState } from '@beckn-ui/common'
import { cartActions } from '@store/cart-slice'
import { chargerSelectActions } from '@store/chargerSelect-slice'
import { checkoutBeckn20Actions } from '@beckn-ui/common'
import { DOMAIN } from '@lib/config'
import { findItemInCatalogs, getCatalogItemsAndOffers } from '@utils/discoverHelpers'
import {
  type FoundItem,
  type ItemRecord,
  getStr,
  getNum,
  getAddressLine,
  getSpecsList,
  getPills,
  SpecIcon,
  LocationIcon,
  StarIcon
} from '@utils/detailViewUtils'
import { getTemplate, getStylingHints, renderTemplate } from '@lib/templateProcessor'
import { fetchRendererConfigFromDiscoverCatalogs } from '@utils/rendererFromDiscover'
import { wrapTemplatePriceInBold } from '@utils/templateUtils'

const FALLBACK_RENDERER_URL = 'https://raw.githubusercontent.com/beckn/beckn-ui-workspace/refs/heads/main/renderer.json'

function getProductDetailsTemplate(config: Awaited<ReturnType<typeof fetchRendererConfigFromDiscoverCatalogs>>) {
  const detailView = getTemplate(config, 'detailView')
  if (detailView?.html) return detailView
  const templates = config.templates as Record<string, { html?: string } | undefined> | undefined
  return templates?.productDetails ?? null
}

const DEFAULT_IMAGE =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2U1ZTdlYiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4='

const DetailView = () => {
  const router = useRouter()
  const { itemId } = router.query
  const dispatch = useDispatch()
  const discoverCatalogs = useSelector((state: DiscoverRootState) => state.discover?.catalogs)
  const transactionId = useSelector((state: DiscoverRootState) => state.discover?.transactionId)
  const [foundItem, setFoundItem] = useState<FoundItem | null>(null)
  const [productImage, setProductImage] = useState<string>(DEFAULT_IMAGE)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- set by run(); available for template-based content if needed
  const [renderedHtml, setRenderedHtml] = useState<string>('')
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
      setError('Charging station not found.')
      setLoading(false)
      return
    }

    const { catalog, item } = found
    const descriptor = item['descriptor'] as Record<string, unknown> | undefined
    const images = descriptor?.['image'] as string[] | undefined
    const imageUrl = images?.[0]
    setProductImage(imageUrl || DEFAULT_IMAGE)
    setFoundItem(found)

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
    dispatch(checkoutBeckn20Actions.clearState())
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
            <div className="rounded-xl border border-[var(--ev-error)]/50 bg-[var(--ev-error)]/10 p-4 text-[var(--ev-text)] mb-4 sm:mb-6 text-sm sm:text-base">
              <p className="font-semibold text-[var(--ev-error)]">Error</p>
              <p>{error}</p>
              <Link
                href="/discovery"
                className="inline-flex mt-3 min-h-[var(--ev-touch-min)] items-center text-[var(--ev-primary)] font-medium hover:underline"
              >
                Back to list
              </Link>
            </div>
          )}

          {!loading &&
            !error &&
            foundItem &&
            (() => {
              const { item } = foundItem
              const descriptor = item['descriptor'] as ItemRecord | undefined
              const name = getStr(descriptor, 'name')
              const longDesc = getStr(descriptor, 'longDesc')
              const shortDesc = getStr(descriptor, 'shortDesc')
              const description = longDesc || shortDesc
              const rating = item['rating'] as ItemRecord | undefined
              const ratingValue = rating ? getNum(rating, 'ratingValue') : 0
              const ratingCount = rating ? Math.round(getNum(rating, 'ratingCount')) : 0
              const specs = getSpecsList(item)
              const pills = getPills(item)
              const addressLine = getAddressLine(item)

              return (
                <>
                  {/* Card 1: Product overview – always show image (item image or default) */}
                  <div className="bg-[var(--ev-surface)] rounded-xl sm:rounded-2xl border border-[var(--ev-border)] shadow-sm overflow-hidden mb-4">
                    <div className="aspect-video w-full bg-[var(--ev-bg-card)]">
                      <img
                        src={productImage}
                        alt={name || 'Charging station'}
                        className="w-full h-full object-cover"
                        onError={e => {
                          if (e.currentTarget.src !== DEFAULT_IMAGE) e.currentTarget.src = DEFAULT_IMAGE
                        }}
                      />
                    </div>
                    <div className="px-4 py-4 sm:px-5 sm:py-5">
                      {name ? (
                        <h1 className="text-lg sm:text-xl font-bold text-[var(--ev-text)] mb-2">{name}</h1>
                      ) : null}
                      {description ? (
                        <p className="text-sm sm:text-base text-[var(--ev-text-muted)] leading-relaxed mb-3">
                          {description}
                        </p>
                      ) : null}
                      {pills.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {pills.map(pill => (
                            <span
                              key={pill}
                              className="inline-flex items-center rounded-lg bg-[var(--ev-border)]/50 px-3 py-1 text-xs sm:text-sm font-medium text-[var(--ev-text)]"
                            >
                              {pill}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card 2: Specifications */}
                  {specs.length > 0 && (
                    <div className="bg-[var(--ev-surface)] rounded-xl sm:rounded-2xl border border-[var(--ev-border)] shadow-sm overflow-hidden mb-4">
                      <div className="px-4 py-3 sm:px-5 sm:py-4 border-b border-[var(--ev-border)]">
                        <h2 className="text-base font-semibold text-[var(--ev-text)]">Specifications</h2>
                      </div>
                      <ul className="px-4 py-3 sm:px-5 sm:py-4 space-y-2.5">
                        {specs.map(({ label, value }) => (
                          <li
                            key={label}
                            className="flex items-center gap-3 text-sm sm:text-base text-[var(--ev-text)]"
                          >
                            <SpecIcon />
                            <span>
                              <strong className="text-[var(--ev-text)]">{label}:</strong> {value}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Card 3: Location and reviews */}
                  <div className="bg-[var(--ev-surface)] rounded-xl sm:rounded-2xl border border-[var(--ev-border)] shadow-sm overflow-hidden mb-6">
                    <div className="px-4 py-3 sm:px-5 sm:py-4">
                      {addressLine ? (
                        <div className="flex items-start gap-3 mb-3">
                          <LocationIcon />
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--ev-text-muted)] mb-0.5">
                              Location
                            </p>
                            <p className="text-sm sm:text-base text-[var(--ev-text)]">{addressLine}</p>
                          </div>
                        </div>
                      ) : null}
                      {(ratingValue > 0 || ratingCount > 0) && (
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-[var(--ev-text)]">{ratingValue.toFixed(1)}</span>
                          <span
                            className="flex items-center gap-0.5"
                            aria-label={`${ratingValue} out of 5 stars`}
                          >
                            {[1, 2, 3, 4, 5].map(i => (
                              <StarIcon
                                key={i}
                                filled={i <= Math.round(ratingValue)}
                              />
                            ))}
                          </span>
                          {ratingCount > 0 && (
                            <span className="text-sm text-[var(--ev-text-muted)]">({ratingCount} reviews)</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      type="button"
                      onClick={handleProceedToCheckout}
                      className="w-full min-h-[var(--ev-touch-min)] py-3.5 px-6 rounded-xl font-semibold bg-[var(--ev-primary)] text-white hover:bg-[var(--ev-primary-hover)] active:opacity-90 transition text-base"
                    >
                      Proceed to checkout
                    </button>
                  </div>
                </>
              )
            })()}
        </main>
      </div>
    </>
  )
}

export default DetailView
