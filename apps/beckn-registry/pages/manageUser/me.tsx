import React, { useState, useEffect } from 'react'
import styles from '@styles/ManageUser.module.css'
import en from '@locales/en'
import { useRouter } from 'next/router'
import ActionHeaders from '@components/actionHeaders'
import { useGetCurrentUserQuery, useUpdateCurrentUserMutation } from '@services/userServices'
import { showToast } from '@components/Toast'

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const handleSave = async () => {
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
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                disabled={false}
              />
            </div>
            <div className={styles.row}>
              <label>{en.manageUser.email}</label>
              <input
                type="text"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={false}
              />
            </div>
            <div className={styles.row}>
              <label>{en.manageUser.phoneNumber}</label>
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                disabled={false}
              />
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
              <input
                type="text"
                name="longName"
                value={formData.longName}
                onChange={handleChange}
                disabled={false}
              />
            </div>
            <div className={styles.row}>
              <label>{en.manageUser.changePassword}</label>
              <input
                type="password"
                name="changePassword"
                value={formData.changePassword}
                onChange={handleChange}
                disabled={false}
              />
            </div>
            <div className={styles.row}>
              <label>{en.manageUser.alternatePhoneNumber}</label>
              <input
                type="text"
                name="alternatePhoneNumber"
                value={formData.alternatePhoneNumber}
                onChange={handleChange}
                disabled={false}
              />
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
