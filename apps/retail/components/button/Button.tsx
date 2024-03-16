import React, { ReactElement, useState } from 'react'
import { Button as ButtonComp, useTheme } from '@chakra-ui/react'

export interface ButtonPropsModel {
  buttonText: string | ReactElement
  background: string
  color: string
  handleOnClick?: () => void
  isDisabled: boolean
}

const Button: React.FC<ButtonPropsModel> = props => {
  const theme = useTheme()
  const isDisabled = props.isDisabled
  const bgColorOfSearchIcon = theme.colors.primary['100']

  return (
    <>
      <ButtonComp
        className="border_radius_all"
        isDisabled={isDisabled}
        fontSize={'15px'}
        borderRadius="12px"
        height={'48px'}
        backgroundColor={!isDisabled ? props.background : 'rgba(var(--disabled-btn-color))'}
        color={props.color}
        width={'100%'}
        border={!isDisabled ? bgColorOfSearchIcon : 'rgba(var(--disabled-btn-color))'}
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
