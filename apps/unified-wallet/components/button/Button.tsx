import React, { ReactElement, useState } from 'react'
import { Button as ButtonComp } from '@chakra-ui/react'

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
    <>
      <ButtonComp
        className="border_radius_all"
        isDisabled={isDisabled}
        fontSize={'15px'}
        height={'48px'}
        backgroundColor={!isDisabled ? props.background : 'rgba(var(--disabled-btn-color))'}
        color={props.color}
        width={'100%'}
        border={!isDisabled ? '1px solid rgba(var(--color-primary))' : 'rgba(var(--disabled-btn-color))'}
        marginBottom={'12px'}
        __css={{ '&:active': {} }}
        onClick={props.handleOnClick}
      >
        {props.buttonText}
      </ButtonComp>
    </>
  )
}

export default Button
