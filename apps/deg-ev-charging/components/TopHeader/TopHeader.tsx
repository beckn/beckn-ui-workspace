import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

export interface TopHeaderProps {
  title?: string
  showBack?: boolean
  centerTitle?: boolean
}

const TopHeader: React.FC<TopHeaderProps> = ({ title = 'EV Charging', showBack = false, centerTitle = false }) => {
  const router = useRouter()

  const logoAndTitle = (
    <div className="flex items-center gap-2">
      <div className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center shadow-sm shrink-0 overflow-hidden p-0.5">
        <img
          src="/images/deg_icon_logo.svg"
          alt="header_logo"
          className="w-full h-full object-contain rounded-[100px]"
        />
      </div>
      <span className="font-semibold text-base sm:text-lg text-[var(--ev-text)] truncate align-middle">{title}</span>
    </div>
  )

  return (
    <header
      className="sticky top-0 z-50 bg-[var(--ev-surface)] border-b border-[var(--ev-border)] shadow-sm shrink-0"
      style={{ paddingTop: 'var(--ev-safe-top)' }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-3 min-h-[2.75rem]">
        {centerTitle ? (
          <>
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
          </>
        ) : (
          <>
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
          </>
        )}
      </div>
    </header>
  )
}

export default TopHeader
