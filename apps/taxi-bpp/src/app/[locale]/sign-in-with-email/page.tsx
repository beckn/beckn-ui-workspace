import SignInWithEmail from '@/components/auth/signInWithEmail/sign-in-with-email'
import { useTranslations } from 'next-intl'

export default function SignInWithMail() {
  const t = useTranslations('SignInWithPhone')
  return (
    <>
      <SignInWithEmail />
    </>
  )
}
