import React, { useState, useEffect } from 'react'
import styles from '@styles/ManageUser.module.css'
import en from '@locales/en'
import { useRouter } from 'next/router'
import ActionHeaders from '@components/actionHeaders'
import { useAddUserMutation, useUpdateUserMutation, useGetUserByIdQuery } from '@services/userServices'
import { showToast } from '@components/Toast'
import UnauthorizedAccess from '@components/UnauthorizedAccess'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query'

interface UserFormData {
  username: string
  longName: string
  email: string
  // changePassword: string
  phoneNumber: string
  alternatePhoneNumber: string
  updaterUser: string
  creatorUser: string
  updatedAt: string
  createdAt: string
  admin: boolean
}

interface FormErrors {
  username?: string
  longName?: string
  email?: string
  // changePassword?: string
  phoneNumber?: string
  alternatePhoneNumber?: string
}

const ManageUser: React.FC = () => {
  const router = useRouter()
  const { query } = router
  const userId = query.id ? query.id : null
  const mode = query.mode as 'add' | 'edit' | 'view'

  const {
    data: userData,
    isLoading,
    error: queryError
  } = useGetUserByIdQuery(userId as string, { skip: !userId || mode === 'add' })
  const [addUser] = useAddUserMutation()
  const [updateUser, { error: updateError }] = useUpdateUserMutation()

  const [formData, setFormData] = useState<UserFormData>({
    username: '',
    longName: '',
    email: '',
    // changePassword: '',
    phoneNumber: '',
    alternatePhoneNumber: '',
    updaterUser: '',
    creatorUser: '',
    updatedAt: '',
    createdAt: '',
    admin: false
  })

  const [errors, setErrors] = useState<FormErrors>({})

  useEffect(() => {
    if (userData && mode !== 'add') {
      setFormData({
        username: userData.username,
        longName: userData.fullName,
        email: userData.email,
        phoneNumber: userData.phoneNumber,
        alternatePhoneNumber: userData.alternatePhoneNumber,
        updaterUser: userData.updaterUser || '',
        creatorUser: userData.creatorUser || '',
        updatedAt: userData.updatedAt ? new Date(userData.updatedAt).toISOString().split('T')[0] : '',
        createdAt: userData.createdAt ? new Date(userData.createdAt).toISOString().split('T')[0] : '',
        admin: userData.role.type === 'admin'
        // changePassword: ''
      })
    }
  }, [userData, mode])

  const validateField = (name: string, value: string): string | undefined => {
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    const phoneRegex = /^[0-9]{10}$/

    switch (name) {
      case 'username':
        if (!usernameRegex.test(value) && !emailRegex.test(value)) {
          return 'Username must be either 3-20 characters (letters, numbers, underscore) or a valid email address'
        }
        break
      case 'longName':
        if (value.length < 3) {
          return 'Name must be at least 3 characters long'
        }
        break
      case 'email':
        if (!emailRegex.test(value)) {
          return 'Please enter a valid email address'
        }
        break
      case 'phoneNumber':
        if (!phoneRegex.test(value)) {
          return 'Phone number must be 10 digits'
        }
        break
      case 'alternatePhoneNumber':
        if (value && !phoneRegex.test(value)) {
          return 'Alternate phone number must be 10 digits'
        }
        break
      // case 'changePassword':
      //   if (value && value.length < 6) {
      //     return 'Password must be at least 6 characters long'
      //   }
      //   break
    }
    return undefined
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

  const handleAdd = async () => {
    if (!validateForm()) return

    try {
      const userData = {
        username: formData.username,
        fullName: formData.longName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        alternatePhoneNumber: formData.alternatePhoneNumber,
        role: {
          id: 0,
          documentId: '',
          name: '',
          description: '',
          type: formData.admin ? 'admin' : 'user',
          createdAt: '',
          updatedAt: ''
        }
      }
      await addUser(userData).unwrap()
      showToast({
        message: 'User added successfully',
        type: 'success'
      })
      router.push('/users')
    } catch (error) {
      showToast({
        message: 'Failed to add user',
        type: 'error'
      })
    }
  }

  const handleSaveAndMore = async () => {
    if (!validateForm()) return

    try {
      const userData = {
        username: formData.username,
        fullName: formData.longName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        alternatePhoneNumber: formData.alternatePhoneNumber,
        role: {
          id: 0,
          documentId: '',
          name: '',
          description: '',
          type: formData.admin ? 'admin' : 'user',
          createdAt: '',
          updatedAt: ''
        }
      }
      await addUser(userData).unwrap()
      showToast({
        message: 'User added successfully',
        type: 'success'
      })
      setFormData({
        username: '',
        longName: '',
        email: '',
        // changePassword: '',
        phoneNumber: '',
        alternatePhoneNumber: '',
        updaterUser: '',
        creatorUser: '',
        updatedAt: '',
        createdAt: '',
        admin: false
      })
      setErrors({})
    } catch (error) {
      showToast({
        message: 'Failed to add user',
        type: 'error'
      })
    }
  }

  const handleEdit = async () => {
    if (!validateForm()) return

    try {
      const userData = {
        username: formData.username,
        fullName: formData.longName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        alternatePhoneNumber: formData.alternatePhoneNumber,
        role: {
          id: 0,
          documentId: '',
          name: '',
          description: '',
          type: formData.admin ? 'admin' : 'user',
          createdAt: '',
          updatedAt: ''
        }
      }
      await updateUser({ id: query.id as string, data: userData }).unwrap()
      showToast({
        message: 'User updated successfully',
        type: 'success'
      })
      router.push('/users')
    } catch (error) {
      showToast({
        message: 'Failed to update user',
        type: 'error'
      })
    }
  }

  const handleClose = () => {
    router.push('/users')
  }

  if (isLoading && mode !== 'add') {
    return (
      <div className={styles.manageUserContainer + ' ' + styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading...</p>
      </div>
    )
  }

  const error = (queryError as FetchBaseQueryError) || (updateError as FetchBaseQueryError)

  return (
    <div className={styles.manageUserContainer}>
      <ActionHeaders
        onBackClick={() => router.push('/users')}
        onHomeClick={() => router.push('/')}
      />
      <form
        className={styles.form}
        onSubmit={e => {
          e.preventDefault()
          if (mode === 'add') {
            handleAdd()
          } else if (mode === 'edit') {
            handleEdit()
          }
        }}
      >
        <div className={styles.row}>
          <div className={styles.row}>
            <label>{en.manageUser.username}</label>
            <div className={styles.inputContainer}>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                disabled={mode === 'view'}
                required
                className={errors.username ? styles.errorInput : ''}
              />
              <div className={styles.errorContainer}>
                {errors.username && <span className={styles.errorMessage}>{errors.username}</span>}
              </div>
            </div>
          </div>
          <div className={styles.row}>
            <label>{en.manageUser.longName}</label>
            <div className={styles.inputContainer}>
              <input
                type="text"
                name="longName"
                value={formData.longName}
                onChange={handleChange}
                disabled={mode === 'view'}
                required
                className={errors.longName ? styles.errorInput : ''}
              />
              <div className={styles.errorContainer}>
                {errors.longName && <span className={styles.errorMessage}>{errors.longName}</span>}
              </div>
            </div>
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.row}>
            <label>{en.manageUser.email}</label>
            <div className={styles.inputContainer}>
              <input
                type="text"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={mode === 'view'}
                required
                className={errors.email ? styles.errorInput : ''}
              />
              <div className={styles.errorContainer}>
                {errors.email && <span className={styles.errorMessage}>{errors.email}</span>}
              </div>
            </div>
          </div>
          {/* <div className={styles.row}>
            <label>{en.manageUser.changePassword}</label>
            <div className={styles.inputContainer}>
              <input
                type="password"
                name="changePassword"
                value={formData.changePassword}
                onChange={handleChange}
                disabled={mode === 'view'}
                className={errors.changePassword ? styles.errorInput : ''}
              />
              <div className={styles.errorContainer}>
                {errors.changePassword && <span className={styles.errorMessage}>{errors.changePassword}</span>}
              </div>
            </div>
          </div> */}
          <div className={styles.row}>
            <label>{en.manageUser.phoneNumber}</label>
            <div className={styles.inputContainer}>
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                disabled={mode === 'view'}
                required
                className={errors.phoneNumber ? styles.errorInput : ''}
              />
              <div className={styles.errorContainer}>
                {errors.phoneNumber && <span className={styles.errorMessage}>{errors.phoneNumber}</span>}
              </div>
            </div>
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.row}>
            <label>{en.manageUser.alternatePhoneNumber}</label>
            <div className={styles.inputContainer}>
              <input
                type="text"
                name="alternatePhoneNumber"
                value={formData.alternatePhoneNumber}
                onChange={handleChange}
                disabled={mode === 'view'}
                className={errors.alternatePhoneNumber ? styles.errorInput : ''}
              />
              <div className={styles.errorContainer}>
                {errors.alternatePhoneNumber && (
                  <span className={styles.errorMessage}>{errors.alternatePhoneNumber}</span>
                )}
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
              disabled={mode === 'view'}
            />
          </div>
        </div>
        {mode === 'view' && (
          <div className={styles.row}>
            <div className={styles.row}>
              <label>{en.manageUser.updaterUser}</label>
              <div className={styles.inputContainer}>
                <input
                  type="text"
                  name="updaterUser"
                  value={formData.updaterUser}
                  onChange={handleChange}
                  disabled={true}
                />
                <div className={styles.errorContainer}></div>
              </div>
            </div>
            <div className={styles.row}>
              <label>{en.manageUser.creatorUser}</label>
              <div className={styles.inputContainer}>
                <input
                  type="text"
                  name="creatorUser"
                  value={formData.creatorUser}
                  onChange={handleChange}
                  disabled={true}
                />
                <div className={styles.errorContainer}></div>
              </div>
            </div>
          </div>
        )}

        {mode === 'view' && (
          <div className={styles.row}>
            <div className={styles.row}>
              <label>{en.manageUser.updatedAt}</label>
              <div className={styles.inputContainer}>
                <input
                  type="text"
                  name="updatedAt"
                  value={formData.updatedAt}
                  onChange={handleChange}
                  disabled={true}
                />
                <div className={styles.errorContainer}></div>
              </div>
            </div>
            <div className={styles.row}>
              <label>{en.manageUser.createdAt}</label>
              <div className={styles.inputContainer}>
                <input
                  type="text"
                  name="createdAt"
                  value={formData.createdAt}
                  onChange={handleChange}
                  disabled={true}
                />
                <div className={styles.errorContainer}></div>
              </div>
            </div>
          </div>
        )}
        <div className={styles.submitButtonContainer}>
          {mode === 'add' && (
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
              >
                Done
              </button>
            </div>
          )}
          {mode === 'edit' && (
            <button
              type="submit"
              className={styles.doneButton}
            >
              Done
            </button>
          )}
          {mode === 'view' && (
            <button
              type="button"
              className={styles.doneButton}
              onClick={handleClose}
            >
              Close
            </button>
          )}
        </div>
      </form>
      {error?.status === 401 && (
        <UnauthorizedAccess
          onRetry={() => router.reload()}
          closeButton={true}
        />
      )}
    </div>
  )
}

export default ManageUser
