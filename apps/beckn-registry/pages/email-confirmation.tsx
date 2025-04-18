import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import styles from '@styles/EmailConfirmation.module.css'
import { showToast } from '@components/Toast'
import { useAppDispatch } from '@store/hooks'
import { verifyEmail } from '@store/slices/authSlice'

const EmailVerification: React.FC = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [isVerifying, setIsVerifying] = useState(true)
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'success' | 'error'>('pending')

  useEffect(() => {
    const { token } = router.query

    const verifyToken = async () => {
      if (!token) return

      try {
        await dispatch(verifyEmail(token as string)).unwrap()
        setVerificationStatus('success')
        showToast({ message: 'Email verified successfully!', type: 'success' })
        // Redirect to login page after 3 seconds
        setTimeout(() => {
          router.push('/signIn')
        }, 3000)
      } catch (error) {
        setVerificationStatus('error')
        showToast({ message: 'Email verification failed. Please try again.', type: 'error' })
      } finally {
        setIsVerifying(false)
      }
    }

    if (token) {
      verifyToken()
    }
  }, [router.query, dispatch, router])

  return (
    <div className={styles.container}>
      <img
        src="https://registry-dev.becknprotocol.io/resources/web_manifest/512x512.png?v=1.0"
        alt="Logo"
        className={styles.logo}
      />
      <div className={styles.content}>
        {isVerifying ? (
          <div className={styles.verifying}>
            <h2>Verifying your email...</h2>
            <div className={styles.spinner}></div>
          </div>
        ) : (
          <div className={styles.result}>
            {verificationStatus === 'success' ? (
              <>
                <h2>Email Verified!</h2>
                <p>Your email has been successfully verified. Redirecting to login page...</p>
              </>
            ) : (
              <>
                <h2>Verification Failed</h2>
                <p>Sorry, we couldn&apos;t verify your email. Please try again or contact support.</p>
                <button
                  className={styles.button}
                  onClick={() => router.push('/signIn')}
                >
                  Go to Login
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default EmailVerification
