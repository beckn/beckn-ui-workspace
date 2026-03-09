import React, { ReactElement } from 'react'

export interface ButtonPropsModel {
  buttonText: string | ReactElement
  background: string
  color: string
  handleOnClick?: () => void
  isDisabled: boolean
}

const Button: React.FC<ButtonPropsModel> = props => {
  const isDisabled = props.isDisabled

  return (
    <button
      type="button"
      className="rounded-xl text-[15px] h-12 w-full mb-3 border transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      style={{
        backgroundColor: !isDisabled ? props.background : 'rgba(var(--disabled-btn-color))',
        color: props.color,
        borderColor: !isDisabled ? 'rgba(var(--color-primary))' : 'rgba(var(--disabled-btn-color))',
        borderWidth: '1px'
      }}
      onClick={props.handleOnClick}
      disabled={isDisabled}
    >
      {props.buttonText}
    </button>
  )
}

export default Button
