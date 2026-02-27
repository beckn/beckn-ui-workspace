import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

export interface TopHeaderProps {
  /** Page title shown in the second row (or in single-row when not using two-row layout) */
  title?: string
  showBack?: boolean
  centerTitle?: boolean
  /** App name for top bar (when useTwoRowHeader). When set, first row shows app name + home button */
  appName?: string
  /** Show home button in top bar (when useTwoRowHeader). Default true when appName is set */
  showHomeButton?: boolean
  /** Use two-row layout: row 1 = app name + home, row 2 = back + page title */
  useTwoRowHeader?: boolean
  /** When useTwoRowHeader is true: if false, only show row 1 (logo + home), hide the title row. Default true. */
  showTitleRow?: boolean
}

const HomeIcon = () => (
  <svg
    className="w-7 h-7 shrink-0"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-hidden
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
    />
  </svg>
)

const BackIcon = () => (
  <svg
    className="w-5 h-5 shrink-0"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-hidden
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 19l-7-7 7-7"
    />
  </svg>
)

const headerShadow = '0 -4px 12px -2px rgba(0,0,0,0.1), 0 4px 12px -2px rgba(0,0,0,0.1)'

const TopHeader: React.FC<TopHeaderProps> = ({
  title = 'EV Charging',
  showBack = false,
  centerTitle = false,
  appName,
  showHomeButton = true,
  useTwoRowHeader = false,
  showTitleRow = true
}) => {
  const router = useRouter()
  const useTwoRow = useTwoRowHeader && appName != null && appName !== ''
  const headerStyle = { paddingTop: 'var(--ev-safe-top)', boxShadow: headerShadow }

  const logoAndTitle = (
    <div className="flex items-center ">
      <div className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center shadow-sm shrink-0 overflow-hidden">
        <img
          src="/images/deg_icon_logo.svg"
          alt="header_logo"
          className="w-full h-full object-contain rounded-[100px]"
        />
      </div>
      <span className="font-semibold text-base sm:text-lg text-[var(--ev-text)] truncate align-middle">{title}</span>
    </div>
  )

  if (centerTitle) {
    return (
      <header
        className="sticky top-0 z-50 bg-[var(--ev-surface)] border-b border-[var(--ev-border)] shrink-0"
        style={headerStyle}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-3 min-h-[2.75rem]">
          {showBack ? (
            <button
              type="button"
              onClick={() => router.back()}
              className="min-h-[var(--ev-touch-min)] min-w-[var(--ev-touch-min)] flex items-center justify-center text-sm font-medium text-[var(--ev-text-muted)] hover:text-[var(--ev-primary)] active:opacity-80 transition shrink-0"
            >
              ← Back
            </button>
          ) : (
            <div className="min-w-[var(--ev-touch-min)]" />
          )}
          <div className="flex-1 flex justify-center min-w-0">
            <div className="flex items-center gap-2 pointer-events-none">{logoAndTitle}</div>
          </div>
          {showBack ? (
            <div
              className="min-w-[var(--ev-touch-min)]"
              aria-hidden
            />
          ) : null}
        </div>
      </header>
    )
  }

  if (useTwoRow) {
    return (
      <header
        className="sticky top-0 z-50 bg-[var(--ev-surface)] border-b border-[var(--ev-border)] shrink-0"
        style={headerStyle}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* Row 1: Logo (left) + Home button (right) */}
          <div
            className={`flex items-center justify-between gap-3 ${showTitleRow ? 'min-h-[2.5rem]' : 'min-h-[2.5rem] py-2 pb-3'}`}
          >
            <Link
              href="/"
              className="flex items-center min-h-[var(--ev-touch-min)] shrink-0 no-underline"
              aria-label={appName ?? 'Home'}
            >
              <div className="w-19 h-16  sm:w-20 sm:h-14 flex items-center justify-center shrink-0 overflow-hidden">
                <img
                  src="/images/deg-logo.svg"
                  alt=""
                  className="w-full h-full object-contain object-left"
                />
              </div>
            </Link>
            {showHomeButton && (
              <Link
                href="/"
                className="min-h-11 min-w-11 flex items-center justify-center text-[var(--ev-text-muted)] hover:text-[var(--ev-primary)] active:opacity-80 transition shrink-0"
                aria-label="Home"
              >
                <HomeIcon />
              </Link>
            )}
          </div>
        </div>
        {showTitleRow && (
          <>
            {/* Full-width divider between row 1 and row 2 */}
            <div className="w-full border-t border-[var(--ev-border)]" />
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
              {/* Row 2: Back button (left) + Page title (center) */}
              <div className="flex items-center justify-between gap-3 py-2 pb-3 min-h-[2.5rem]">
                {showBack ? (
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="min-h-[var(--ev-touch-min)] min-w-[var(--ev-touch-min)] flex items-center justify-center text-[var(--ev-text-muted)] hover:text-[var(--ev-primary)] active:opacity-80 transition shrink-0"
                    aria-label="Back"
                  >
                    <BackIcon />
                  </button>
                ) : (
                  <div className="min-w-[var(--ev-touch-min)] shrink-0" />
                )}
                <h1 className="flex-1 text-center font-semibold text-base sm:text-lg text-[var(--ev-text)] truncate min-w-0 mx-2">
                  {title}
                </h1>
                <div
                  className="min-w-[var(--ev-touch-min)] shrink-0"
                  aria-hidden
                />
              </div>
            </div>
          </>
        )}
      </header>
    )
  }

  return (
    <header
      className="sticky top-0 z-50 bg-[var(--ev-surface)] border-b border-[var(--ev-border)] shrink-0"
      style={headerStyle}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-3 min-h-[2.75rem]">
        <Link
          href="/"
          className="flex items-center gap-2 no-underline text-[var(--ev-text)] min-h-[var(--ev-touch-min)]"
        >
          {logoAndTitle}
        </Link>
        {showBack && (
          <button
            type="button"
            onClick={() => router.back()}
            className="min-h-[var(--ev-touch-min)] min-w-[var(--ev-touch-min)] flex items-center justify-center text-sm font-medium text-[var(--ev-text-muted)] hover:text-[var(--ev-primary)] active:opacity-80 transition shrink-0"
          >
            ← Back
          </button>
        )}
      </div>
    </header>
  )
}

export default TopHeader
