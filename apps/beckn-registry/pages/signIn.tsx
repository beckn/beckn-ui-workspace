import React from 'react'
import { useRouter } from 'next/router'
import styles from '../styles/SignIn.module.css'
import en from '../locales/en'

const SignIn: React.FC = () => {
  const router = useRouter()

  const handleSignIn = (event: React.MouseEvent<HTMLAnchorElement>) => {
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
        <input
          type="text"
          placeholder={en.signIn.userPlaceholder}
          className={styles.input}
        />
        <input
          type="password"
          placeholder={en.signIn.passwordPlaceholder}
          className={styles.input}
        />
        <button
          type="submit"
          className={styles.button}
          onClick={handleSignIn}
        >
          {en.signIn.loginButton}
        </button>
      </form>
      <div className={styles.links}>
        <a
          href="/forgotPassword"
          className={styles.link}
        >
          {en.signIn.forgotPasswordLink}
        </a>
        <a
          href="/signUp"
          className={styles.link}
        >
          {en.signIn.newUserLink}
        </a>
      </div>
    </div>
  )
}

export default SignIn
