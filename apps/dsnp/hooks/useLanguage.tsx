import { useRouter } from 'next/router'
import en from '../locales/en'
import fa from '../locales/fa'

const translationFunction = (to: any) => {
  return (key: string) => {
    return to[key]
  }
}

export const useLanguage = () => {
  const { locale } = useRouter()
  const to = locale === 'en' ? en : fa
  const t = translationFunction(to)
  return { t, locale }
}
