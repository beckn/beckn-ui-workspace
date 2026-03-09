import React from 'react'

type TextAlignType = 'start' | 'center' | 'end'

interface BecknButtonProps {
  text?: string
  prefixIcon?: React.ReactNode
  postIcon?: React.ReactNode
  textStyle?: TextAlignType
  handleClick?: () => void
  dataTest?: string
  isLoading?: boolean
  loadingText?: string
  disabled?: boolean
  colorScheme?: string
  variant?: string
  id?: string
  className?: string
  sx?: Record<string, unknown>
}

const ShadowCardButton: React.FC<BecknButtonProps> = ({
  text,
  prefixIcon,
  postIcon,
  textStyle = 'start',
  handleClick,
  isLoading = false,
  disabled = false,
  id,
  className = '',
  dataTest,
  sx
}) => {
  const justifyMap = { start: 'flex-start', center: 'center', end: 'flex-end' } as const

  return (
    <button
      id={id}
      type="button"
      onClick={handleClick}
      disabled={disabled}
      data-test={dataTest}
      className={`rounded-xl flex items-center w-full min-h-[var(--ev-touch-min)] px-4 py-3 border border-[var(--ev-border)] bg-[var(--ev-surface)] hover:bg-[var(--ev-bg-card)] active:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
      style={sx as React.CSSProperties}
    >
      {isLoading ? (
        <span className="flex-1 flex justify-center">
          <span className="w-5 h-5 border-2 border-[var(--ev-border)] border-t-[var(--ev-primary)] rounded-full animate-spin" />
        </span>
      ) : (
        <>
          {prefixIcon && <div className="mr-3 text-lg flex items-center">{prefixIcon}</div>}
          <div
            className="flex-1 flex font-medium text-base text-black"
            style={{ justifyContent: justifyMap[textStyle] }}
          >
            {text}
          </div>
          {postIcon && <div className="ml-3 text-lg flex items-center">{postIcon}</div>}
        </>
      )}
    </button>
  )
}

export default ShadowCardButton
