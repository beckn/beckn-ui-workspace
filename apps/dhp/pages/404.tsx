import React from 'react'
import { useRouter } from 'next/router'

const Custom404 = () => {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="max-w-md w-full text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-indigo-600 mb-4">404</h1>
          <div className="relative">
            <svg
              className="w-full h-48 mx-auto"
              viewBox="0 0 200 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Confused face illustration */}
              <circle
                cx="100"
                cy="100"
                r="80"
                fill="#E0E7FF"
              />
              <circle
                cx="75"
                cy="85"
                r="8"
                fill="#4F46E5"
              />
              <circle
                cx="125"
                cy="85"
                r="8"
                fill="#4F46E5"
              />
              <path
                d="M 70 130 Q 100 120 130 130"
                stroke="#4F46E5"
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
              />
              {/* Question marks floating around */}
              <text
                x="30"
                y="60"
                fontSize="24"
                fill="#818CF8"
                opacity="0.6"
              >
                ?
              </text>
              <text
                x="160"
                y="70"
                fontSize="20"
                fill="#818CF8"
                opacity="0.5"
              >
                ?
              </text>
              <text
                x="40"
                y="150"
                fontSize="18"
                fill="#818CF8"
                opacity="0.4"
              >
                ?
              </text>
            </svg>
          </div>
        </div>

        {/* Error Message */}
        <h2 className="text-3xl font-bold text-gray-800 mb-3">Page Not Found</h2>
        <p className="text-gray-600 mb-8 text-lg">
          Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-white text-indigo-600 border-2 border-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 transition-colors duration-200"
          >
            Go Back
          </button>
          <a
            href="/"
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors duration-200 inline-block"
          >
            Go to Homepage
          </a>
        </div>

        {/* Helpful Links */}
        <div className="mt-12">
          <p className="text-sm text-gray-500 mb-3">Need help? Try these:</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <a
              href="/"
              className="text-indigo-600 hover:text-indigo-800 hover:underline"
            >
              Home
            </a>
            <a
              href="/search"
              className="text-indigo-600 hover:text-indigo-800 hover:underline"
            >
              Search
            </a>
            <a
              href="/myAppointments"
              className="text-indigo-600 hover:text-indigo-800 hover:underline"
            >
              My Appointments
            </a>
            <a
              href="/cart"
              className="text-indigo-600 hover:text-indigo-800 hover:underline"
            >
              Cart
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Custom404
