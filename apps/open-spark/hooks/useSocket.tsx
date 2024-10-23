// Example: `hooks/useSocket.ts`
import { useEffect, useRef } from 'react'
import io, { ManagerOptions, Socket, SocketOptions } from 'socket.io-client'

interface UseSocketOptions {
  transports?: string[]
  reconnection?: boolean
  [key: string]: any
}

const useSocket = (url: string, options?: Partial<ManagerOptions & SocketOptions> | undefined): Socket | undefined => {
  const socketRef = useRef<Socket | undefined>(undefined)

  useEffect(() => {
    socketRef.current = io(url, options)

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
      }
    }
  }, [])

  return socketRef.current
}

export default useSocket
