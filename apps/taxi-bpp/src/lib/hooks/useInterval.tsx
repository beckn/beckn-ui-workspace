'use client'

import { useEffect, useRef } from 'react'

export const useInterval = (callback: any, delay: any) => {
  const cachedCallback = useRef<any>()
  useEffect(() => {
    cachedCallback.current = callback
  }, [callback])

  useEffect(() => {
    if (delay !== null) {
      const id = setInterval(() => cachedCallback?.current?.(), delay)
      return () => clearInterval(id)
    }
  }, [delay])
}
