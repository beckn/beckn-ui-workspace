import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { FaLock, FaArrowLeft, FaRedo, FaTimes } from 'react-icons/fa'
import styles from '@styles/UnauthorizedAccess.module.css'

interface UnauthorizedAccessProps {
  message?: string
  onRetry?: () => void
  closeButton?: boolean
  onClose?: () => void
}

const UnauthorizedAccess: React.FC<UnauthorizedAccessProps> = ({
  message = 'You are not authorized to access this resource',
  onRetry,
  closeButton = false,
  onClose
}) => {
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(true)

  const handleBackToHome = () => {
    router.back()
  }

  const handleClose = () => {
    setIsVisible(false)
    if (onClose) {
      onClose()
    }
  }

  const handleRetry = () => {
    if (onRetry) {
      onRetry()
    } else {
      router.reload()
    }
  }

  useEffect(() => {
    // Prevent scrolling when modal is open
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  if (!isVisible) return null

  return (
    <>
      <div className={styles.modalOverlay}></div>
      <div className={styles.modalContainer}>
        <div className={styles.modalContent}>
          <div className={styles.iconContainer}>
            <FaLock className={styles.lockIcon} />
          </div>

          <div className={styles.textContainer}>
            <h1 className={styles.title}>Unauthorized Access</h1>
            <p className={styles.message}>{message}</p>
          </div>

          <div className={styles.buttonContainer}>
            {closeButton ? (
              <button
                className={`${styles.button} ${styles.primary}`}
                onClick={handleClose}
              >
                <FaTimes className={styles.buttonIcon} />
                Close
              </button>
            ) : (
              <button
                className={`${styles.button} ${styles.primary}`}
                onClick={handleBackToHome}
              >
                <FaArrowLeft className={styles.buttonIcon} />
                Go Back
              </button>
            )}
            <button
              className={`${styles.button} ${styles.secondary}`}
              onClick={handleRetry}
            >
              <FaRedo className={styles.buttonIcon} />
              Retry
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default UnauthorizedAccess
