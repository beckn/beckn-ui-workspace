import React, { useState } from 'react'
import { useRouter } from 'next/router'
import styles from '@styles/SignIn.module.css'
import en from '@locales/en'
import { useAppDispatch } from '@store/hooks'
import { login } from '@store/slices/authSlice'
import { showToast } from '@components/Toast'

interface FormData {
  email: string
  password: string
}

interface FormErrors {
  email?: string
  password?: string
}

const SignIn: React.FC = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)

  // Validation regex patterns
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/

  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case 'email':
        if (!value) return 'Email is required'
        if (!emailRegex.test(value)) return 'Please enter a valid email address'
        return undefined
      case 'password':
        if (!value) return 'Password is required'
        if (!passwordRegex.test(value))
          return 'Password must be at least 8 characters long and contain at least one letter and one number'
        return undefined
      default:
        return undefined
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Validate the field as user types
    const error = validateField(name, value)
    setErrors(prev => ({
      ...prev,
      [name]: error
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate all fields before submission
    const newErrors: FormErrors = {}
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key as keyof FormData])
      if (error) {
        newErrors[key as keyof FormErrors] = error
      }
    })

    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) {
      return
    }

    setIsLoading(true)
    try {
      await dispatch(login({ identifier: formData.email, password: formData.password })).unwrap()
      showToast({ message: 'Login successful!', type: 'success' })
      router.push('/')
    } catch (error) {
      // Error is handled by the auth slice
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <img
        src="https://registry-dev.becknprotocol.io/resources/web_manifest/512x512.png?v=1.0"
        alt="Logo"
        className={styles.logo}
      />
      <form
        className={styles.form}
        onSubmit={handleSubmit}
      >
        <div className={styles.inputContainer}>
          <input
            type="email"
            name="email"
            placeholder={en.signIn.userPlaceholder}
            className={`${styles.input} ${errors.email ? styles.error : ''}`}
            value={formData.email}
            onChange={handleChange}
          />
          <div className={styles.errorContainer}>
            {errors.email && <p className={styles.errorMessage}>{errors.email}</p>}
          </div>
        </div>
        <div className={styles.inputContainer}>
          <input
            type="password"
            name="password"
            placeholder={en.signIn.passwordPlaceholder}
            className={`${styles.input} ${errors.password ? styles.error : ''}`}
            value={formData.password}
            onChange={handleChange}
          />
          <div className={styles.errorContainer}>
            {errors.password && <p className={styles.errorMessage}>{errors.password}</p>}
          </div>
        </div>
        <button
          type="submit"
          className={styles.button}
          disabled={isLoading}
        >
          {isLoading ? 'Signing in...' : en.signIn.loginButton}
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
