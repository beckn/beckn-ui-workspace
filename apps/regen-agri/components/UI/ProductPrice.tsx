import { Box } from '@chakra-ui/react'
import React from 'react'
import { useLanguage } from '../../hooks/useLanguage'
import { CurrencyType, formatCurrency } from '../../utilities/currencyFormat'

interface Props {
    price: number
    currency: CurrencyType
    discount?: number
    isLargeSize?: boolean
    isInSlider?: boolean
}
const ProductPrice: React.FC<Props> = ({
    price,
    isLargeSize = false,
    isInSlider,
    currency,
}) => {
    const { t, locale } = useLanguage()

    //style base on component position
    const textMainPriceSize = isLargeSize ? ' md:text-3xl' : ' md:text-lg'
    const textDiscountPriceSize = isLargeSize ? ' md:text-xl' : ' md:text-md'
    const justifyContent = isInSlider && locale === 'fa' ? 'flex-start' : ''
    const flexDirection = 'row'

    const formattedCurreny = formatCurrency(price, currency)

    return (
        <div>
            <div
                className={`flex rtl:justify-end rtl:self-end ltr:self-start text-left `}
                style={{ justifyContent }}
            >
                <div>
                    {/* ☝slider cards (.slick-slide=>Slider component) are float and because of that, they don't accept height so, for making cards the same height, I have to do this hack*/}
                    <Box
                        color={'rgba(var(--color-primary))'}
                        className={`flex items-center ${textMainPriceSize} font-semibold no-underline`}
                        style={{ flexDirection }}
                    >
                        {/* <span className="mr-1 rtl:block">
                            {t.currencySymbol}
                        </span>
                        <span>{price.toFixed(2)}</span> */}
                        <span>{formattedCurreny}</span>
                    </Box>
                </div>
            </div>
        </div>
    )
}

export default ProductPrice
