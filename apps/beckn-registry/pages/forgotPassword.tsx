import React, { useState } from 'react'
import styles from '@styles/SignIn.module.css'
import { useRouter } from 'next/router'
import en from '@locales/en'

interface FormErrors {
  email?: string
}

interface FormData {
  email: string
}

const ForgotPassword: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    email: ''
  })
  const [errors, setErrors] = useState<FormErrors>({})
  // const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()

  const handleForgotPassword = (event: React.MouseEvent) => {
    event.preventDefault()
    router.push('/')
  }

  return (
    <div className={styles.container}>
      <img
        src="https://registry-dev.becknprotocol.io/resources/web_manifest/512x512.png?v=1.0"
        alt="Logo"
        className={styles.logo}
      />
      <form className={styles.form}>
        <div className={styles.inputContainer}>
          <input
            type="text"
            placeholder={en.forgotPassword.userPlaceholder}
            className={styles.input}
          />
          <div className={styles.errorContainer}>
            {errors.email && <p className={styles.errorMessage}>{errors.email}</p>}
          </div>
        </div>
        <button
          type="submit"
          className={styles.button}
          onClick={handleForgotPassword}
        >
          {en.forgotPassword.resetPasswordButton}
        </button>
      </form>
      <div className={styles.links}>
        <a
          href="/signIn"
          className={styles.link}
        >
          {en.forgotPassword.rememberLink}
        </a>
        <a
          href="/signUp"
          className={styles.link}
        >
          {en.forgotPassword.newUserLink}
        </a>
      </div>
    </div>
  )
}

export default ForgotPassword
