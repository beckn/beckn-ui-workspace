import React, { useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'

const HomePage = () => {
  const router = useRouter()
  const [searchKeyword, setSearchKeyword] = useState('')
  const [error, setError] = useState('')

  const handleSearch = () => {
    const q = searchKeyword.trim()
    setError('')
    if (!q) {
      setError('Please enter a search term')
      return
    }
    router.push({ pathname: '/discovery', query: { search: q } })
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch()
  }

  return (
    <>
      <Head>
        <title>EV Charging – Find charging stations</title>
        <meta
          name="description"
          content="Search and discover EV charging stations near you"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
      </Head>
      <div className="ev-app bg-[var(--ev-bg)] flex flex-col min-h-full">
        {/* Hero + Search – mobile-first, EV imagery */}
        <main className="flex-1 flex flex-col w-full relative pb-[calc(1.5rem+var(--ev-safe-bottom))]">
          <section className="relative w-full min-h-[280px] sm:min-h-[320px] flex items-end justify-center overflow-hidden bg-[var(--ev-bg-card)]">
            <img
              src="https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=1200&q=80"
              alt="EV charging station"
              className="absolute inset-0 w-full h-full object-cover object-center"
              onError={e => {
                e.currentTarget.style.display = 'none'
              }}
            />
            <div
              className="absolute inset-0 pointer-events-none bg-gradient-to-t from-white via-white/50 to-transparent"
              aria-hidden
            />
            <div className="relative z-10 w-full max-w-2xl px-4 pb-6 sm:pb-8 text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white border border-[var(--ev-border)] shadow-lg mb-3 sm:mb-4 overflow-hidden">
                <img
                  src="/images/ev_charging_logo.svg"
                  alt=""
                  className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
                />
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[var(--ev-text)] mb-1 sm:mb-2 tracking-tight">
                EV Charging
              </h1>
              <p className="text-sm sm:text-base text-[var(--ev-text-muted)] px-1">Find charging stations near you</p>
            </div>
          </section>
          <div className="w-full max-w-2xl mx-auto px-4 -mt-2 sm:mt-0 text-center">
            {/* Search – full width, touch-friendly on mobile */}
            <div className="relative w-full">
              <div className="flex flex-row items-stretch bg-[var(--ev-surface)] rounded-2xl shadow-lg border border-[var(--ev-border)] overflow-hidden focus-within:ring-2 focus-within:ring-[var(--ev-primary)] focus-within:border-[var(--ev-primary)]">
                <input
                  type="search"
                  placeholder="e.g. CCS2, fast charger, Bengaluru..."
                  value={searchKeyword}
                  onChange={e => setSearchKeyword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 min-w-0 px-4 sm:px-5 py-3.5 sm:py-4 text-base text-[var(--ev-text)] border-0 bg-transparent outline-none placeholder:text-[var(--ev-text-muted)] min-h-[var(--ev-touch-min)]"
                  aria-label="Search for charging stations"
                />
                <button
                  type="button"
                  onClick={handleSearch}
                  disabled={!searchKeyword.trim()}
                  className="min-h-[var(--ev-touch-min)] min-w-[var(--ev-touch-min)] px-4 py-3.5 sm:py-4 rounded-none rounded-r-2xl font-medium text-white bg-[var(--ev-primary)] hover:bg-[var(--ev-primary-hover)] active:bg-[var(--ev-primary-hover)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[var(--ev-primary)] transition-colors flex items-center justify-center shrink-0"
                  aria-label="Search"
                >
                  <svg
                    className="w-5 h-5 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              </div>
              {error && <p className="mt-2 text-sm text-[var(--ev-error)]">{error}</p>}
            </div>

            <p className="mt-4 sm:mt-6 text-sm text-[var(--ev-text-muted)] px-2">
              Results are powered by the Beckn network.
            </p>
          </div>
        </main>

        <footer
          className="py-3 sm:py-4 text-center text-xs sm:text-sm text-[var(--ev-text-muted)] border-t border-[var(--ev-border)]"
          style={{ paddingBottom: 'calc(0.75rem + var(--ev-safe-bottom))' }}
        >
          EV Charging · Beckn-powered discovery
        </footer>
      </div>
    </>
  )
}

export default HomePage
