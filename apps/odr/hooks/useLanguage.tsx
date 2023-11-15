import { useRouter } from 'next/router'
import en from '../locales/en'
import fa from '../locales/fa'

export const useLanguage = () => {
  const t = en

  return { t, locale: 'en' }
}
