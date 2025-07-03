import React, { useState } from 'react'
import { useRouter } from 'next/router'
import styles from '@styles/SignIn.module.css'
import { showToast } from '@components/Toast'
import { useRegisterMutation } from '@services/authServices'

interface FormData {
  email: string
  password: string
  confirmPassword: string
}

interface FormErrors {
  email?: string
  password?: string
  confirmPassword?: string
}

const SignUp: React.FC = () => {
  const router = useRouter()

  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const [register] = useRegisterMutation()

  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case 'email':
        if (!value) return 'Email is required'
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email address'
        return undefined
      case 'password':
        if (!value) return 'Password is required'
        if (value.length < 8) return 'Password must be at least 8 characters long'
        return undefined
      case 'confirmPassword':
        if (!value) return 'Please confirm your password'
        if (value !== formData.password) return 'Passwords do not match'
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

    // Special case: validate confirmPassword when password changes
    if (name === 'password' && formData.confirmPassword) {
      const confirmError = validateField('confirmPassword', formData.confirmPassword)
      setErrors(prev => ({
        ...prev,
        confirmPassword: confirmError
      }))
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
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
      await register({
        email: formData.email,
        password: formData.password,
        username: formData.email
      }).unwrap()
      showToast({
        message: 'Registration successful! Please check your email to verify your account.',
        type: 'success'
      })
      router.push('/signIn')
    } catch (error: any) {
      console.log('Error in sign up', error)
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
            type="text"
            name="email"
            placeholder="User"
            className={`${styles.input} ${errors.email ? styles.error : ''}`}
            value={formData.email}
            onChange={handleChange}
          />
          <div className={styles.errorContainer}>
            {errors.email && <p className={styles.errorMessage}>{errors.email}</p>}
          </div>
        </div>

        <div className={styles.inputContainer}>
          <div className={styles.passwordInputContainer}>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              className={`${styles.passwordInput} ${errors.password ? styles.error : ''}`}
              value={formData.password}
              onChange={handleChange}
            />
            <span
              className={styles.eyeIcon}
              onClick={togglePasswordVisibility}
            >
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </span>
          </div>
          <div className={styles.errorContainer}>
            {errors.password && <p className={styles.errorMessage}>{errors.password}</p>}
          </div>
        </div>

        <div className={styles.inputContainer}>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Re-enter Password"
            className={`${styles.input} ${errors.confirmPassword ? styles.error : ''}`}
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          <div className={styles.errorContainer}>
            {errors.confirmPassword && <p className={styles.errorMessage}>{errors.confirmPassword}</p>}
          </div>
        </div>

        <button
          type="submit"
          className={`${styles.button} ${isLoading ? styles.loading : ''}`}
          disabled={isLoading}
        >
          {isLoading ? 'Creating account...' : 'Register'}
        </button>
      </form>

      <div className={styles.links}>
        <a
          href="/forgotPassword"
          className={styles.link}
        >
          Forgot Password
        </a>
        <a
          href="/signIn"
          className={styles.link}
        >
          I&apos;m an Existing User
        </a>
      </div>
    </div>
  )
}

export default SignUp
