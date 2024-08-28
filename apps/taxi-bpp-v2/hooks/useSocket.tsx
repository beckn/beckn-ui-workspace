// Example: `hooks/useSocket.ts`
import { useEffect, useRef } from 'react'
import io, { Socket } from 'socket.io-client'

interface UseSocketOptions {
  transports?: string[]
  reconnection?: boolean
  [key: string]: any
}

const useSocket = (url: string, options?: UseSocketOptions): Socket | undefined => {
  const socketRef = useRef<Socket | undefined>(undefined)

  useEffect(() => {
    socketRef.current = io(url, options)

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
      }
    }
  }, [url, options])

  return socketRef.current
}

export default useSocket
