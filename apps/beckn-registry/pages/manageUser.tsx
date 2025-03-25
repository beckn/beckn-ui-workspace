import React, { useState, useEffect } from 'react'
import styles from '../styles/ManageUser.module.css'
import en from '../locales/en'
import { useRouter } from 'next/router'
import ActionHeaders from '../components/actionHeaders'
const ManageUser: React.FC = () => {
  const router = useRouter()
  const { query } = router

  const [formData, setFormData] = useState({
    username: '',
    longName: '',
    email: '',
    changePassword: '',
    phoneNumber: '',
    alternatePhoneNumber: '',
    updaterUser: '',
    creatorUser: '',
    updatedAt: '',
    createdAt: '',
    admin: false
  })

  const [mode, setMode] = useState<'add' | 'edit' | 'view'>('add')

  useEffect(() => {
    if (query) {
      setFormData(prevState => ({
        ...prevState,
        ...query
      }))
      if (query.mode) {
        setMode(query.mode as 'add' | 'edit' | 'view')
      }
    }
  }, [query])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const handleAdd = () => {
    console.log('Add User:', formData)
    router.push('/users')
  }

  const handleSaveAndMore = () => {
    console.log('Save & More:', formData)
    // Logic for saving and adding more
  }

  const handleEdit = () => {
    console.log('Edit User:', formData)
    router.push('/users')
  }

  const handleClose = () => {
    router.push('/users')
  }

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
        <div className={styles.column + ' ' + styles.flex}>
          <div className={styles.column + ' ' + styles.flex + ' ' + styles.flexColumn + ' ' + styles.gap10}>
            <div className={styles.row}>
              <label>{en.manageUser.username}</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                disabled={mode === 'view'}
              />
            </div>
            <div className={styles.row}>
              <label>{en.manageUser.email}</label>
              <input
                type="text"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={mode === 'view'}
              />
            </div>
            <div className={styles.row}>
              <label>{en.manageUser.phoneNumber}</label>
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                disabled={mode === 'view'}
              />
            </div>
            <div className={styles.row}>
              <label>{en.manageUser.updaterUser}</label>
              <input
                type="text"
                name="updaterUser"
                value={formData.updaterUser}
                onChange={handleChange}
                disabled={true}
              />
            </div>
            <div className={styles.row}>
              <label>{en.manageUser.creatorUser}</label>
              <input
                type="text"
                name="creatorUser"
                value={formData.creatorUser}
                onChange={handleChange}
                disabled={true}
              />
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

          <div className={styles.column + ' ' + styles.flex + ' ' + styles.flexColumn + ' ' + styles.gap10}>
            <div className={styles.row}>
              <label>{en.manageUser.longName}</label>
              <input
                type="text"
                name="longName"
                value={formData.longName}
                onChange={handleChange}
                disabled={mode === 'view'}
              />
            </div>
            <div className={styles.row}>
              <label>{en.manageUser.changePassword}</label>
              <input
                type="password"
                name="changePassword"
                value={formData.changePassword}
                onChange={handleChange}
                disabled={mode === 'view'}
              />
            </div>
            <div className={styles.row}>
              <label>{en.manageUser.alternatePhoneNumber}</label>
              <input
                type="text"
                name="alternatePhoneNumber"
                value={formData.alternatePhoneNumber}
                onChange={handleChange}
                disabled={mode === 'view'}
              />
            </div>

            <div className={styles.row}>
              <label>{en.manageUser.updatedAt}</label>
              <input
                type="text"
                name="updatedAt"
                value={formData.updatedAt}
                onChange={handleChange}
                disabled={true}
              />
            </div>
            <div className={styles.row}>
              <label>{en.manageUser.createdAt}</label>
              <input
                type="text"
                name="createdAt"
                value={formData.createdAt}
                onChange={handleChange}
                disabled={true}
              />
            </div>
          </div>
        </div>
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
                onClick={handleAdd}
              >
                Done
              </button>
            </div>
          )}
          {mode === 'edit' && (
            <button
              type="submit"
              className={styles.doneButton}
              onClick={handleEdit}
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
    </div>
  )
}

export default ManageUser
