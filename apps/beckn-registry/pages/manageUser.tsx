import React, { useState, useEffect } from 'react'
import styles from '../styles/ManageUser.module.css'
import en from '../locales/en'
import { useRouter } from 'next/router'
import ActionHeaders from '../components/actionHeaders'
const ManageUser: React.FC = () => {
  const router = useRouter()
  const { query } = router

  const [formData, setFormData] = useState({
    name: '',
    changePassword: '',
    numMinutesToKeyExpiration: '',
    firstName: '',
    lastName: '',
    longName: '',
    admin: false,
    passwordEncrypted: false,
    staff: false,
    currentLat: '',
    currentLng: '',
    accountClosureInitiated: false,
    accountClosed: false,
    notificationEnabled: false,
    emailNotificationEnabled: false,
    whatsAppNotificationEnabled: false,
    phoneNumber: '',
    updatedAt: '',
    createdAt: '',
    updaterUser: '',
    creatorUser: '',
    company: '',
    lat: '',
    lng: '',
    addressLine1: '',
    addressLine2: '',
    addressLine3: '',
    addressLine4: '',
    city: '',
    state: '',
    country: '',
    pinCode: '',
    email: '',
    alternatePhoneNumber: ''
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
              <label>{en.manageUser.name}</label>
              <input
                type="text"
                name="name"
                value={formData.name}
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
              <label>{en.manageUser.numMinutesToKeyExpiration}</label>
              <input
                type="text"
                name="numMinutesToKeyExpiration"
                value={formData.numMinutesToKeyExpiration}
                onChange={handleChange}
                disabled={mode === 'view'}
              />
            </div>
            <div className={styles.row}>
              <label>{en.manageUser.firstName}</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                disabled={mode === 'view'}
              />
            </div>
            <div className={styles.row}>
              <label>{en.manageUser.currentLat}</label>
              <input
                type="text"
                name="currentLat"
                value={formData.currentLat}
                onChange={handleChange}
                disabled={mode === 'view'}
              />
            </div>

            <div className={styles.row}>
              <label>{en.manageUser.accountClosureInitiated}</label>
              <input
                type="checkbox"
                name="accountClosureInitiated"
                checked={formData.accountClosureInitiated}
                onChange={handleChange}
                disabled={mode === 'view'}
              />
            </div>
            <div className={styles.row}>
              <label>{en.manageUser.notificationEnabled}</label>
              <input
                type="checkbox"
                name="notificationEnabled"
                checked={formData.notificationEnabled}
                onChange={handleChange}
                disabled={mode === 'view'}
              />
            </div>

            <div className={styles.row}>
              <label>{en.manageUser.whatsAppNotificationEnabled}</label>
              <input
                type="checkbox"
                name="whatsAppNotificationEnabled"
                checked={formData.whatsAppNotificationEnabled}
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
                disabled={mode === 'view'}
              />
            </div>
            <div className={styles.row}>
              <label>{en.manageUser.creatorUser}</label>
              <input
                type="text"
                name="creatorUser"
                value={formData.creatorUser}
                onChange={handleChange}
                disabled={mode === 'view'}
              />
            </div>
            <div className={styles.row}>
              <label>{en.manageUser.company}</label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                disabled={mode === 'view'}
              />
            </div>
            <div className={styles.row}>
              <label>{en.manageUser.lng}</label>
              <input
                type="text"
                name="lng"
                value={formData.lng}
                onChange={handleChange}
                disabled={mode === 'view'}
              />
            </div>
            <div className={styles.row}>
              <label>{en.manageUser.addressLine2}</label>
              <input
                type="text"
                name="addressLine2"
                value={formData.addressLine2}
                onChange={handleChange}
                disabled={mode === 'view'}
              />
            </div>

            <div className={styles.row}>
              <label>{en.manageUser.addressLine4}</label>
              <input
                type="text"
                name="addressLine4"
                value={formData.addressLine4}
                onChange={handleChange}
                disabled={mode === 'view'}
              />
            </div>

            <div className={styles.row}>
              <label>{en.manageUser.state}</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                disabled={mode === 'view'}
              />
            </div>

            <div className={styles.row}>
              <label>{en.manageUser.pinCode}</label>
              <input
                type="text"
                name="pinCode"
                value={formData.pinCode}
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
              <label>{en.manageUser.admin}</label>
              <input
                type="checkbox"
                name="admin"
                checked={formData.admin}
                onChange={handleChange}
                disabled={mode === 'view'}
              />
            </div>
            <div className={styles.row}>
              <label>{en.manageUser.passwordEncrypted}</label>
              <input
                type="checkbox"
                name="passwordEncrypted"
                checked={formData.passwordEncrypted}
                onChange={handleChange}
                disabled={mode === 'view'}
              />
            </div>

            <div className={styles.row}>
              <label>{en.manageUser.lastName}</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                disabled={mode === 'view'}
              />
            </div>
            <div className={styles.row}>
              <label>{en.manageUser.currentLng}</label>
              <input
                type="text"
                name="currentLng"
                value={formData.currentLng}
                onChange={handleChange}
                disabled={mode === 'view'}
              />
            </div>
            <div className={styles.row}>
              <label>{en.manageUser.accountClosed}</label>
              <input
                type="checkbox"
                name="accountClosed"
                checked={formData.accountClosed}
                onChange={handleChange}
                disabled={mode === 'view'}
              />
            </div>

            <div className={styles.row}>
              <label>{en.manageUser.emailNotificationEnabled}</label>
              <input
                type="checkbox"
                name="emailNotificationEnabled"
                checked={formData.emailNotificationEnabled}
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
              <label>{en.manageUser.updatedAt}</label>
              <input
                type="text"
                name="updatedAt"
                value={formData.updatedAt}
                onChange={handleChange}
                disabled={mode === 'view'}
              />
            </div>
            <div className={styles.row}>
              <label>{en.manageUser.createdAt}</label>
              <input
                type="text"
                name="createdAt"
                value={formData.createdAt}
                onChange={handleChange}
                disabled={mode === 'view'}
              />
            </div>
            <div className={styles.row}>
              <label>{en.manageUser.lat}</label>
              <input
                type="text"
                name="lat"
                value={formData.lat}
                onChange={handleChange}
                disabled={mode === 'view'}
              />
            </div>
            <div className={styles.row}>
              <label>{en.manageUser.addressLine1}</label>
              <input
                type="text"
                name="addressLine1"
                value={formData.addressLine1}
                onChange={handleChange}
                disabled={mode === 'view'}
              />
            </div>
            <div className={styles.row}>
              <label>{en.manageUser.addressLine3}</label>
              <input
                type="text"
                name="addressLine3"
                value={formData.addressLine3}
                onChange={handleChange}
                disabled={mode === 'view'}
              />
            </div>
            <div className={styles.row}>
              <label>{en.manageUser.city}</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                disabled={mode === 'view'}
              />
            </div>
            <div className={styles.row}>
              <label>{en.manageUser.country}</label>
              <input
                type="text"
                name="country"
                value={formData.country}
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
              <label>{en.manageUser.staff}</label>
              <input
                type="checkbox"
                name="staff"
                checked={formData.staff}
                onChange={handleChange}
                disabled={mode === 'view'}
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
