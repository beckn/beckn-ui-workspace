import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { getTemplate, getStylingHints } from '@lib/templateProcessor'
import { useDiscoverMutation } from '@beckn-ui/common/src/services/beckn-2.0/discover'
import { discoverActions } from '@beckn-ui/common'
import type { DiscoverRootState } from '@beckn-ui/common'
import type { DiscoverCatalogStored } from '@beckn-ui/common/lib/types/beckn-2.0/discover'
import { getCatalogsFromResponse, buildDiscoverRequest, getTransactionIdFromResponse } from '@utils/discoverHelpers'
import { fetchRendererConfigFromDiscoverCatalogs } from '@utils/rendererFromDiscover'
import { renderDiscoveryItems } from '@utils/renderDiscoveryItems'
import { wrapTemplatePriceInBold } from '@utils/templateUtils'
import { MOCK_DISCOVER_RESPONSE } from '../mock/discoverResponse'

const FALLBACK_RENDERER_URL = 'https://raw.githubusercontent.com/beckn/beckn-ui-workspace/refs/heads/main/renderer.json'

const Discovery = () => {
  const router = useRouter()
  const { search } = router.query
  const searchTerm = typeof search === 'string' ? search : ''
  const dispatch = useDispatch()
  const [discover] = useDiscoverMutation()
  const storedCatalogs = useSelector((state: DiscoverRootState) => state.discover?.catalogs ?? [])
  const [renderedHtml, setRenderedHtml] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = (e.target as HTMLElement).closest('[data-item-id]')
    if (card) {
      e.preventDefault()
      e.stopPropagation()
      const id = card.getAttribute('data-item-id')
      if (id) router.push(`/detailView?itemId=${encodeURIComponent(id)}`)
    }
  }

  useEffect(() => {
    let cancelled = false
    const run = async () => {
      setLoading(true)
      setError(null)
      try {
        const payload = buildDiscoverRequest(searchTerm)
        let res: unknown
        try {
          res = await discover(payload).unwrap()
        } catch (apiErr) {
          res = MOCK_DISCOVER_RESPONSE
        }

        if (cancelled) return
        const allCatalogs = getCatalogsFromResponse(res)
        const transactionId = getTransactionIdFromResponse(res)
        if (transactionId) {
          dispatch(discoverActions.setTransactionId({ transactionId }))
        }
        dispatch(discoverActions.setDiscoverCatalogs({ catalogs: allCatalogs as DiscoverCatalogStored[] }))
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Something went wrong')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    run()
    return () => {
      cancelled = true
    }
  }, [searchTerm, dispatch, discover])

  useEffect(() => {
    if (!storedCatalogs?.length) {
      setRenderedHtml('')
      return
    }
    let cancelled = false
    const run = async () => {
      try {
        let config: Awaited<ReturnType<typeof fetchRendererConfigFromDiscoverCatalogs>>
        try {
          config = await fetchRendererConfigFromDiscoverCatalogs(storedCatalogs)
        } catch {
          const r = await fetch(FALLBACK_RENDERER_URL)
          if (!r.ok) throw new Error('Failed to fetch renderer config')
          config = await r.json()
        }

        if (cancelled) return
        const templateConfig = getTemplate(config, 'discoveryCard')
        if (!templateConfig?.html) {
          setError('discoveryCard template not found in renderer.json')
          return
        }

        const stylingHints = getStylingHints(config)
        const templateHtml = wrapTemplatePriceInBold(templateConfig.html)
        const html = renderDiscoveryItems(storedCatalogs, templateHtml, stylingHints)
        if (!cancelled) setRenderedHtml(html)
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Something went wrong')
      }
    }
    run()
    return () => {
      cancelled = true
    }
  }, [storedCatalogs])

  return (
    <>
      <Head>
        <title>Charging stations – EV Charging</title>
        <meta
          name="description"
          content="Browse EV charging stations"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
      </Head>
      <div className="ev-app min-h-full bg-[var(--ev-bg)]">
        <main
          data-ev-main
          className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-4 sm:py-8 pb-[calc(var(--ev-bottom-nav-h)+var(--ev-safe-bottom)+1rem)]"
        >
          {searchTerm && (
            <p className="text-[var(--ev-text-muted)] text-sm sm:text-base mb-4 sm:mb-6">
              Results for <strong className="text-[var(--ev-text)]">&quot;{searchTerm}&quot;</strong>
            </p>
          )}

          {loading && (
            <div className="flex flex-col items-center justify-center py-12 sm:py-16 text-[var(--ev-text-muted)]">
              <div className="w-10 h-10 border-4 border-[var(--ev-border)] border-t-[var(--ev-primary)] rounded-full animate-spin mb-4" />
              <p className="font-medium text-sm sm:text-base">Loading charging stations…</p>
            </div>
          )}

          {error && !loading && (
            <div className="rounded-xl border border-[var(--ev-error)]/50 bg-[var(--ev-error)]/10 p-4 text-[var(--ev-text)] mb-4 sm:mb-6 text-sm sm:text-base">
              <p className="font-semibold text-[var(--ev-error)]">Error</p>
              <p className="text-[var(--ev-text-muted)]">{error}</p>
            </div>
          )}

          {!loading && !error && renderedHtml && (
            <div
              role="list"
              data-discovery-container
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 discovery-cards-container"
              dangerouslySetInnerHTML={{ __html: renderedHtml }}
              onClick={handleCardClick}
            />
          )}

          {!loading && !error && !renderedHtml && (
            <div className="text-center py-12 sm:py-16 text-[var(--ev-text-muted)] text-sm sm:text-base">
              <p>No charging stations found. Try another search.</p>
              <Link
                href="/"
                className="inline-block mt-4 min-h-[var(--ev-touch-min)] flex items-center justify-center text-[var(--ev-primary)] font-medium hover:underline"
              >
                Back to search
              </Link>
            </div>
          )}
        </main>
      </div>
    </>
  )
}

export default Discovery
