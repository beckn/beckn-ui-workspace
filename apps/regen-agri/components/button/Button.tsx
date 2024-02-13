import React, { ReactElement } from 'react'
import { Button as ButtonComp } from '@chakra-ui/react'

export interface ButtonPropsModel {
    buttonText: string | ReactElement

    handleOnClick?: () => void
    isDisabled: boolean
    type: 'solid' | 'outline'
}

const Button: React.FC<ButtonPropsModel> = ({
    buttonText,
    handleOnClick,
    isDisabled,
    type,
}) => {
    const StyleTypes = {
        solid: {
            backgroundColor: 'rgba(var(--color-primary))',

            color: 'rgba(var(--text-color))',
        },
        outline: {
            border: '1px solid rgba(var(--color-primary))',
            color: 'rgba(var(--color-primary))',
            backgroundColor: '',
        },
    }

    const disabledStyleTypes = {
        solid: {
            backgroundColor: 'rgba(var(--disabled-btn-color))',
            color: 'rgba(var(--text-color))',
        },
        outline: {
            border: '1px solid rgba(var(--disabled-btn-color))',
            color: 'rgba(var(--disabled-btn-color))',
            backgroundColor: '',
        },
    }

    return (
        <>
            <ButtonComp
                className="border_radius_all"
                isDisabled={isDisabled}
                fontSize={'15px'}
                height={'48px'}
                backgroundColor={StyleTypes[type].backgroundColor}
                color={StyleTypes[type].color}
                width={'100%'}
                border={
                    !isDisabled
                        ? '1px solid rgba(var(--color-primary))'
                        : 'rgba(var(--disabled-btn-color))'
                }
                marginBottom={'12px'}
                __css={{ '&:active': {} }}
                _disabled={disabledStyleTypes[type]}
                disabled={isDisabled}
                onClick={handleOnClick}
            >
                {buttonText}
            </ButtonComp>
        </>
    )
}

export default Button
