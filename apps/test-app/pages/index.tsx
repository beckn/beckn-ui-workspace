import React, { useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'

const Home = () => {
  const router = useRouter()

  useEffect(() => {
    router.replace('/discovery')
  }, [router])

  return (
    <>
      <Head>
        <title>Beckn Test App - Home</title>
        <meta
          name="description"
          content="Test App for Beckn UI Workspace"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
      </Head>
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        Redirecting to discovery…
      </div>
    </>
  )
}

export default Home
