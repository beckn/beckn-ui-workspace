'use client'

import { useRouter } from '@/navigation'
import React from 'react'

export default function Header({ title }: any) {
  const router = useRouter()

  return (
    <div className="top-bar">
      <span className="icon_back">
        <button
          className="back-button"
          onClick={() => router.back()}
        >
          <span>&#60;</span> Back
        </button>
      </span>
      <span className="header-push text-white">{title}</span>
    </div>
  )
}
