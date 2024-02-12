// Rial currency format
export const irrCurrencyFormat = (price: number | undefined) => {
    return price ? new Intl.NumberFormat('fa-IR').format(price) : null
}

//pound currency format
export const gbpCurrencyFormat = (price: number | undefined) => {
    return price ? new Intl.NumberFormat('en-GB').format(price) : null
}

export type CurrencyType = 'GBP' | 'EUR' | 'INR' | 'USD'

export const formatCurrency = (price: number, currencyType: CurrencyType) => {
    const currencyOptions = {
        GBP: { locale: 'en-GB', currency: 'GBP' },
        EUR: { locale: 'de-DE', currency: 'EUR' },
        INR: { locale: 'en-IN', currency: 'INR' },
        USD: { locale: 'en-US', currency: 'USD' },
    }

    const { locale, currency } = currencyOptions[currencyType]

    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
    }).format(price)
}
