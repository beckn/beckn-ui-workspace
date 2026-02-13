import React from 'react'

const Splash = () => {
  return (
    <div
      className="ev-app flex flex-col items-center justify-center min-h-screen min-h-[100dvh] w-full bg-[var(--ev-bg)]"
      style={{ paddingTop: 'var(--ev-safe-top)', paddingBottom: 'var(--ev-safe-bottom)' }}
    >
      <div className="flex flex-col items-center justify-center flex-1 w-full px-4">
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white border border-[var(--ev-border)] flex items-center justify-center shadow-md mb-5 sm:mb-6 p-2">
          <img
            src="/images/ev_charging_logo.svg"
            alt="EV Charging"
            className="w-full h-full object-contain"
          />
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-[var(--ev-text)] tracking-tight">EV Charging</h1>
        <p className="text-sm text-[var(--ev-text-muted)] mt-2">Find charging stations near you</p>
      </div>
      <footer className="w-full py-4 px-4 border-t border-[var(--ev-border)] flex justify-center">
        <img
          src="/images/ev_charging_logo.svg"
          alt=""
          className="h-7 object-contain opacity-90"
        />
      </footer>
    </div>
  )
}
export default Splash
