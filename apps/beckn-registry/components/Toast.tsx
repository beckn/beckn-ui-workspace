import React from 'react'
import { ToastContainer, toast, ToastOptions } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import styles from '../styles/Toast.module.css'

interface ToastProps {
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
  options?: ToastOptions
  description?: string
}

// Default toast options
const defaultOptions: ToastOptions = {
  position: 'top-right',
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true
}

export const CustomToast: React.FC<ToastProps & { onClose: () => void }> = ({ message, type, onClose }) => {
  return (
    <div className={`${styles.toast} ${styles[`toast-${type}`]}`}>
      <div className={styles.header}>
        <div className={styles.titleContainer}>
          <div className={`${styles.icon} ${styles[`icon-${type}`]}`}>
            {type === 'success' && (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20 6L9 17L4 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
            {type === 'error' && (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 6L6 18M6 6L18 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
            {type === 'warning' && (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            )}
            {type === 'info' && (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 16V12M12 8H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </div>
          <div className={styles.title}>{message}</div>
        </div>
        <button
          className={styles.closeButton}
          onClick={onClose}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18 6L6 18M6 6L18 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  )
}

export const showToast = ({ message, type, options = {} }: ToastProps) => {
  const toastOptions = {
    ...defaultOptions,
    ...options
  }

  switch (type) {
    case 'success':
      toast.success(message, toastOptions)
      break
    case 'error':
      toast.error(message, toastOptions)
      break
    case 'info':
      toast.info(message, toastOptions)
      break
    case 'warning':
      toast.warning(message, toastOptions)
      break
    default:
      toast(message, toastOptions)
  }
}

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      {children}
      <ToastContainer />
    </>
  )
}
