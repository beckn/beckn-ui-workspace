'use client'
// TODO :- To enable translations after proper implementation of components
// TODO :- To uncomment the eslint ignoreDuringBuilds falsy value flag
// import { useTranslations } from 'next-intl'
import { redirect } from '@/navigation'
import SignInWithEmail from '@/components/auth/signInWithEmail/sign-in-with-email'
import { getCookie } from '@/lib/CookiesHandler'
import { LocalKey } from '@/lib/constant'

export default function Home() {
  const isApiKeyPresent = getCookie(LocalKey.saveApi)
  if (isApiKeyPresent) {
    redirect('/dashboard')
  }

  return (
    <>
      <SignInWithEmail />
    </>
  )
}
