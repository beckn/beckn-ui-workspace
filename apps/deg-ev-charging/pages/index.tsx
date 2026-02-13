import React, { useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'

const HomePage = () => {
  const router = useRouter()
  const [searchKeyword, setSearchKeyword] = useState('')

  const handleSearch = () => {
    if (searchKeyword.trim()) {
      router.push({
        pathname: '/discovery',
        query: { search: searchKeyword.trim() }
      })
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchKeyword.trim()) {
      handleSearch()
    }
  }

  return (
    <>
      <Head>
        <title>EV Charging - Find Charging Stations</title>
        <meta
          name="description"
          content="Search and discover EV charging stations near you"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
      </Head>
      <div
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '700px',
            textAlign: 'center'
          }}
        >
          {/* Main Heading */}
          <div style={{ marginBottom: '40px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '80px',
                height: '80px',
                backgroundColor: 'white',
                borderRadius: '20px',
                marginBottom: '24px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
              }}
            >
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18.92 2.01C18.72 1.42 18.16 1 17.5 1H6.5C5.84 1 5.28 1.42 5.08 2.01L3 8V16C3 16.55 3.45 17 4 17H5C5.55 17 6 16.55 6 16V15H18V16C18 16.55 18.45 17 19 17H20C20.55 17 21 16.55 21 16V8L18.92 2.01ZM6.5 12C5.67 12 5 11.33 5 10.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12ZM17.5 12C16.67 12 16 11.33 16 10.5S16.67 9 17.5 9 19 9.67 19 10.5 18.33 12 17.5 12ZM5 7L6.5 3H17.5L19 7H5Z"
                  fill="#2563eb"
                />
                <path
                  d="M7 13H17V11H7V13Z"
                  fill="#2563eb"
                />
                <path
                  d="M12 5L10 9H14L12 5Z"
                  fill="#2563eb"
                />
              </svg>
            </div>
            <h1
              style={{
                fontSize: 'clamp(32px, 6vw, 56px)',
                fontWeight: '800',
                color: 'white',
                marginBottom: '16px',
                textShadow: '0 2px 8px rgba(0,0,0,0.2)'
              }}
            >
              EV Charging
            </h1>
            <p
              style={{
                fontSize: 'clamp(16px, 2.5vw, 20px)',
                color: 'white',
                opacity: 0.95,
                margin: 0
              }}
            >
              Discover charging stations near you
            </p>
          </div>

          {/* Search Bar */}
          <div
            style={{
              display: 'flex',
              backgroundColor: 'white',
              borderRadius: '50px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
              overflow: 'hidden',
              height: '60px',
              alignItems: 'center',
              paddingLeft: '24px',
              paddingRight: '6px'
            }}
          >
            <input
              type="text"
              placeholder="Search for charging stations..."
              value={searchKeyword}
              onChange={e => setSearchKeyword(e.target.value)}
              onKeyPress={handleKeyPress}
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                fontSize: '16px',
                height: '100%',
                padding: 0
              }}
            />
            <button
              onClick={handleSearch}
              disabled={!searchKeyword.trim()}
              style={{
                minWidth: '48px',
                height: '48px',
                borderRadius: '50%',
                border: 'none',
                backgroundColor: searchKeyword.trim() ? '#2563eb' : '#E2E8F0',
                color: searchKeyword.trim() ? 'white' : '#9CA3AF',
                cursor: searchKeyword.trim() ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
                opacity: searchKeyword.trim() ? 1 : 0.6
              }}
              onMouseEnter={e => {
                if (searchKeyword.trim()) {
                  e.currentTarget.style.backgroundColor = '#1e40af'
                }
              }}
              onMouseLeave={e => {
                if (searchKeyword.trim()) {
                  e.currentTarget.style.backgroundColor = '#2563eb'
                }
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle
                  cx="11"
                  cy="11"
                  r="8"
                />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default HomePage
