import React from 'react'
import styles from '../styles/SignIn.module.css'
import { useRouter } from 'next/router'
import en from '../locales/en'

const ForgotPassword: React.FC = () => {
  const router = useRouter()

  const handleForgotPassword = (event: React.MouseEvent) => {
    event.preventDefault()
    console.log('Link clicked')
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
        <input
          type="text"
          placeholder={en.forgotPassword.userPlaceholder}
          className={styles.input}
        />
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
