/**
 * Beckn Hub – placeholder home.
 * UI can be built later; scaffold provides services, payloads, store, template processor, data mapping.
 */
import type { NextPage } from 'next'
import Head from 'next/head'

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Beckn Hub</title>
        <meta
          name="description"
          content="Beckn 2.0 production-ready scaffold"
        />
        <link
          rel="icon"
          href="/favicon.ico"
        />
      </Head>
      <main style={{ padding: '2rem', fontFamily: 'system-ui' }}>
        <h1>Beckn Hub</h1>
        <p>Production-ready scaffold: Beckn 2.0 services, payload builders, Redux, template processor, data mapping.</p>
        <p>
          Configure <code>NEXT_PUBLIC_BECKN_API_URL</code> in .env and build UI on top of this setup.
        </p>
      </main>
    </>
  )
}

export default Home
