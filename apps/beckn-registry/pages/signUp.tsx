import React from 'react'
import styles from '../styles/SignIn.module.css'
import { useRouter } from 'next/router'
import en from '../locales/en'

const SignUp: React.FC = () => {
  const router = useRouter()

  const handleSignUp = (event: React.MouseEvent<HTMLAnchorElement>) => {
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
          placeholder={en.signUp.userPlaceholder}
          className={styles.input}
        />
        <input
          type="password"
          placeholder={en.signUp.passwordPlaceholder}
          className={styles.input}
        />
        <input
          type="password"
          placeholder={en.signUp.reenterPasswordPlaceholder}
          className={styles.input}
        />
        <button
          type="submit"
          className={styles.button}
          onClick={handleSignUp}
        >
          {en.signUp.registerButton}
        </button>
      </form>
      <div className={styles.links}>
        <a
          href="/forgotPassword"
          className={styles.link}
        >
          {en.signUp.forgotPasswordLink}
        </a>
        <a
          href="/signIn"
          className={styles.link}
        >
          {en.signUp.existingUserLink}
        </a>
      </div>
    </div>
  )
}

export default SignUp
