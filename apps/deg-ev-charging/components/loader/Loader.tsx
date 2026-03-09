import React from 'react'

interface LoaderPropsModel {
  loadingText?: string
  subLoadingText?: string
  stylesForLoadingText?: React.CSSProperties
}

const Loader: React.FC<LoaderPropsModel> = props => {
  return (
    <div className="flex flex-col justify-center items-center h-[60vh]">
      <div
        className="w-10 h-10 border-4 border-gray-200 border-t-[var(--ev-primary)] rounded-full animate-spin"
        aria-hidden
      />
      {props.loadingText && (
        <p
          className="mt-5 text-center text-sm text-[var(--ev-text)]"
          style={props.stylesForLoadingText}
        >
          {props.loadingText}
        </p>
      )}
      {props.subLoadingText && (
        <p className="text-center text-sm text-[var(--ev-text-muted)] mt-1">{props.subLoadingText}</p>
      )}
    </div>
  )
}

export default React.memo(Loader)
