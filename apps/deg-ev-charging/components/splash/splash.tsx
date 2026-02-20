import React from 'react'
import Image from 'next/image'

const Splash = () => {
  return (
    <div
      className="ev-app flex flex-col items-center justify-center min-h-screen min-h-[100dvh] w-full bg-[var(--ev-bg)]"
      style={{ paddingTop: 'var(--ev-safe-top)', paddingBottom: 'var(--ev-safe-bottom)' }}
      role="presentation"
    >
      <main className="ev-splash-content flex flex-col items-center justify-center flex-1 w-full px-4">
        <div className="w-full max-w-[280px] sm:max-w-[320px] rounded-[100px] flex items-center justify-center shadow-md mb-5 sm:mb-6 p-2">
          <Image
            src="/images/deg-logo.svg"
            alt="EV Hub – EV Charging"
            width={320}
            height={213}
            className="w-full h-auto object-contain"
            priority
          />
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-[var(--ev-text)] tracking-tight">EV Charging</h1>
        <p className="text-sm text-[var(--ev-text-muted)] mt-2">Find charging stations near you</p>
      </main>
      <footer
        className="w-full py-4 px-4 border-t border-[var(--ev-border)] flex justify-center"
        aria-hidden="true"
      >
        <Image
          src="/images/deg-logo.svg"
          alt=""
          width={280}
          height={280}
          className="h-16 w-auto object-contain opacity-90 sm:h-20"
        />
      </footer>
    </div>
  )
}
export default Splash
