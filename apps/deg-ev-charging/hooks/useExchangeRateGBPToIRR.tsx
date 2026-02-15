import { useEffect, useState } from 'react'
import { irrCurrencyFormat } from '../utilities/currencyFormat'

const API_KEY = '230967b967bfa5f86ca99d6c'
const URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/pair/GBP/IRR`

export const useExchangeRateGBPToIRR = (price: number) => {
  const [exchangePrice, setExchangePrice] = useState<number>(0)
  const hardRateExchange = 52230.27 // each Pound into Rial
  useEffect(() => {
    if (price > 0) {
      const priceWithHardRateExchange = price * hardRateExchange
      const irToman = Math.ceil(priceWithHardRateExchange / 1000) * 1000
      setExchangePrice(irToman)
    }
  }, [price])

  return irrCurrencyFormat(exchangePrice)
}
