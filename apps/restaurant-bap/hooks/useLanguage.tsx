import { useRouter } from 'next/router'
import en from '@locales/en'
import fa from '@locales/fa'

const useLanguage = () => {
  const router = useRouter()
  const { locale } = router
  const t = locale === 'fa' ? fa : en

  return { t, locale }
}

export { useLanguage }
