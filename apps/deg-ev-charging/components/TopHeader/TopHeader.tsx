import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

export interface TopHeaderProps {
  title?: string
  showBack?: boolean
}

const TopHeader: React.FC<TopHeaderProps> = ({ title = 'EV Charging', showBack = false }) => {
  const router = useRouter()

  return (
    <header
      className="sticky top-0 z-50 bg-[var(--ev-surface)] border-b border-[var(--ev-border)] shadow-sm shrink-0"
      style={{ paddingTop: 'var(--ev-safe-top)' }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-3 min-h-[2.75rem]">
        <Link
          href="/"
          className="flex items-center gap-2 no-underline text-[var(--ev-text)] min-h-[var(--ev-touch-min)]"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white border border-[var(--ev-border)] flex items-center justify-center shadow-sm shrink-0 overflow-hidden p-0.5">
            <img
              src="/images/ev_charging_logo.svg"
              alt=""
              className="w-full h-full object-contain"
            />
          </div>
          <span className="font-semibold text-base sm:text-lg text-[var(--ev-text)] truncate align-middle">
            {title}
          </span>
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
