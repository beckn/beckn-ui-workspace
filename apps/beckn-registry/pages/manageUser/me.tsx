import React, { useState, useEffect } from 'react'
import styles from '@styles/ManageUser.module.css'
import en from '@locales/en'
import { useRouter } from 'next/router'
import ActionHeaders from '@components/actionHeaders'
import { useGetCurrentUserQuery, useUpdateCurrentUserMutation } from '@services/userServices'
import { showToast } from '@components/Toast'

interface UserFormData {
  username: string
  longName: string
  email: string
  phoneNumber: string
  alternatePhoneNumber: string
  admin: boolean
}

interface FormErrors {
  username?: string
  longName?: string
  email?: string
  phoneNumber?: string
  alternatePhoneNumber?: string
  changePassword?: string
}

const ManageMe: React.FC = () => {
  const router = useRouter()
  const { query } = router

  const [formData, setFormData] = useState({
    username: '',
    longName: '',
    email: '',
    changePassword: '',
    phoneNumber: '',
    alternatePhoneNumber: '',
    admin: false
  })
  const [errors, setErrors] = useState<FormErrors>({})

  const { data: currentUser } = useGetCurrentUserQuery()
  const [updateProfile] = useUpdateCurrentUserMutation()

  useEffect(() => {
    if (currentUser) {
      setFormData(prevState => ({
        ...prevState,
        username: currentUser.username,
        longName: currentUser.fullName,
        email: currentUser.email,
        phoneNumber: currentUser.phoneNumber,
        alternatePhoneNumber: currentUser.alternatePhoneNumber,
        admin: currentUser.role?.type.toLowerCase() === 'admin'
      }))
    }
  }, [currentUser, query])

  const validateField = (name: string, value: string): string | undefined => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const phoneRegex = /^\+?[1-9]\d{9,14}$/
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/

    switch (name) {
      case 'username':
        if (!value.trim()) return 'Username is required'
        if (!usernameRegex.test(value))
          return 'Username must be 3-20 characters and can only contain letters, numbers, and underscores'
        return undefined
      case 'longName':
        if (!value.trim()) return 'Full name is required'
        return undefined
      case 'email':
        if (!value.trim()) return 'Email is required'
        if (!emailRegex.test(value)) return 'Please enter a valid email address'
        return undefined
      case 'phoneNumber':
        if (!value.trim()) return 'Phone number is required'
        if (!phoneRegex.test(value)) return 'Please enter a valid phone number'
        return undefined
      case 'alternatePhoneNumber':
        if (value && !phoneRegex.test(value)) return 'Please enter a valid phone number'
        return undefined
      case 'changePassword':
        if (value && !passwordRegex.test(value))
          return 'Password must be at least 8 characters long and contain at least one letter and one number'
        return undefined
      default:
        return undefined
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    const newValue = type === 'checkbox' ? checked : value

    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }))

    // Validate field immediately
    if (type !== 'checkbox') {
      const error = validateField(name, value)
      setErrors(prev => ({
        ...prev,
        [name]: error
      }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Validate all fields
    Object.keys(formData).forEach(key => {
      if (
        key !== 'admin' &&
        key !== 'updaterUser' &&
        key !== 'creatorUser' &&
        key !== 'updatedAt' &&
        key !== 'createdAt'
      ) {
        const error = validateField(key, formData[key as keyof UserFormData] as string)
        if (error) {
          newErrors[key as keyof FormErrors] = error
        }
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!validateForm()) return

    try {
      await updateProfile({
        ...formData
      })
      showToast({
        message: 'Profile updated successfully',
        type: 'success'
      })
    } catch (error) {
      console.error('Error updating profile:', error)
      showToast({
        message: 'Failed to update profile',
        type: 'error'
      })
    }
  }

  return (
    <div className={styles.manageUserContainer}>
      <ActionHeaders
        onBackClick={() => router.push('/')}
        onHomeClick={() => router.push('/')}
      />
      <form
        className={styles.form}
        onSubmit={e => {
          e.preventDefault()
          handleSave()
        }}
      >
        <div className={styles.column + ' ' + styles.flex}>
          <div className={styles.column + ' ' + styles.flex + ' ' + styles.flexColumn + ' ' + styles.gap10}>
            <div className={styles.row}>
              <label>{en.manageUser.username}</label>
              <div className={styles.inputContainer}>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  disabled={false}
                />
                <div className={styles.errorContainer}>
                  {errors.username && <span className={styles.errorMessage}>{errors.username}</span>}
                </div>
              </div>
            </div>
            <div className={styles.row}>
              <label>{en.manageUser.email}</label>
              <div className={styles.inputContainer}>
                <input
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={false}
                />
                <div className={styles.errorContainer}>
                  {errors.email && <span className={styles.errorMessage}>{errors.email}</span>}
                </div>
              </div>
            </div>
            <div className={styles.row}>
              <label>{en.manageUser.phoneNumber}</label>
              <div className={styles.inputContainer}>
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  disabled={false}
                />
                <div className={styles.errorContainer}>
                  {errors.phoneNumber && <span className={styles.errorMessage}>{errors.phoneNumber}</span>}
                </div>
              </div>
            </div>

            <div className={styles.row}>
              <label>{en.manageUser.admin}</label>
              <input
                type="checkbox"
                name="admin"
                checked={formData.admin}
                onChange={handleChange}
                disabled={false}
              />
            </div>
          </div>

          <div className={styles.column + ' ' + styles.flex + ' ' + styles.flexColumn + ' ' + styles.gap10}>
            <div className={styles.row}>
              <label>{en.manageUser.longName}</label>
              <div className={styles.inputContainer}>
                <input
                  type="text"
                  name="longName"
                  value={formData.longName}
                  onChange={handleChange}
                  disabled={false}
                />
                <div className={styles.errorContainer}>
                  {errors.longName && <span className={styles.errorMessage}>{errors.longName}</span>}
                </div>
              </div>
            </div>
            <div className={styles.row}>
              <label>{en.manageUser.changePassword}</label>
              <div className={styles.inputContainer}>
                <input
                  type="password"
                  name="changePassword"
                  value={formData.changePassword}
                  onChange={handleChange}
                  disabled={false}
                />
                <div className={styles.errorContainer}>
                  {errors.changePassword && <span className={styles.errorMessage}>{errors.changePassword}</span>}
                </div>
              </div>
            </div>
            <div className={styles.row}>
              <label>{en.manageUser.alternatePhoneNumber}</label>
              <div className={styles.inputContainer}>
                <input
                  type="text"
                  name="alternatePhoneNumber"
                  value={formData.alternatePhoneNumber}
                  onChange={handleChange}
                  disabled={false}
                />
                <div className={styles.errorContainer}>
                  {errors.alternatePhoneNumber && (
                    <span className={styles.errorMessage}>{errors.alternatePhoneNumber}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.submitButtonContainer}>
          {/* {mode === 'add' && (
            <div className={styles.row}>
              <button
                type="button"
                className={styles.submitButton}
                onClick={handleSaveAndMore}
              >
                Save & More
              </button>
              <button
                type="submit"
                className={styles.doneButton}
                onClick={handleAdd}
              >
                Done
              </button>
            </div>
          )} */}
          {/* {mode === 'edit' && ( */}
          <button
            type="submit"
            className={styles.doneButton}
          >
            Done
          </button>
          {/* )} */}
          {/* {mode === 'view' && (
            <button
              type="button"
              className={styles.doneButton}
              onClick={handleClose}
            >
              Close
            </button>
          )} */}
        </div>
      </form>
    </div>
  )
}

export default ManageMe
