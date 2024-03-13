import { cookies } from 'next/headers'
// TODO :- To enable translations after proper implementation of components
// import { useTranslations } from 'next-intl'
import { redirect } from '@/navigation'
import Dashboard from '@/components/dashboard/dashboard'

export default function Home() {
  // const t = useTranslations('Home')
  const authToken = cookies().get('accessToken')?.value

  if (!authToken) {
    redirect('/sign-in-with-email')
  }

  return (
    <>
      <Dashboard />
    </>
  )
}
