import React, { useState, useEffect } from 'react'
import styles from '../styles/ManageUserRole.module.css'
import { useRouter } from 'next/router'
import en from '../locales/en'
import ActionHeaders from '../components/actionHeaders'

const ManageUserRole: React.FC = () => {
  const router = useRouter()
  const [formData, setFormData] = useState({
    user: '',
    role: '',
    updaterUser: '',
    creatorUser: '',
    updatedAt: '',
    createdAt: ''
  })

  const { mode: queryMode, ...userRoleDataQuery } = router.query

  useEffect(() => {
    if (userRoleDataQuery) {
      setFormData(userRoleDataQuery as typeof formData)
    }
  }, [])

  const [mode, setMode] = useState<'add' | 'edit' | 'view'>('add')

  useEffect(() => {
    if (queryMode) {
      setMode(queryMode as 'add' | 'edit' | 'view')
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleAdd = () => {
    console.log('Add UserRole:', formData)
    router.push('/userRoles')
  }

  const handleEdit = () => {
    console.log('Edit UserRole:', formData)
    router.push('/userRoles')
  }

  const handleClose = () => {
    router.push('/userRoles')
  }

  return (
    <div className={styles.manageUserRoleContainer}>
      <ActionHeaders
        onBackClick={() => router.push('/userRoles')}
        onHomeClick={() => router.push('/')}
      />
      <h2 className={styles.title}>{en.userRoles.detailsTitle}</h2>
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
            <label>{en.userRoles.user}</label>
            <input
              type="text"
              name="user"
              value={formData.user}
              onChange={handleChange}
              disabled={mode === 'view'}
            />
          </div>
          <div className={styles.row}>
            <label>{en.userRoles.role}</label>
            <input
              type="text"
              name="role"
              value={formData.role}
              onChange={handleChange}
              disabled={mode === 'view'}
            />
          </div>
        </div>
        {mode !== 'add' && (
          <>
            <div className={styles.row}>
              <div className={styles.row}>
                <label>{en.userRoles.updaterUser}</label>
                <input
                  type="text"
                  name="updaterUser"
                  value={formData.updaterUser}
                  disabled
                />
              </div>
              <div className={styles.row}>
                <label>{en.userRoles.creatorUser}</label>
                <input
                  type="text"
                  name="creatorUser"
                  value={formData.creatorUser}
                  disabled
                />
              </div>
            </div>
            <div className={styles.row}>
              <div className={styles.row}>
                <label>{en.userRoles.updatedAt}</label>
                <input
                  type="text"
                  name="updatedAt"
                  value={formData.updatedAt}
                  disabled
                />
              </div>
              <div className={styles.row}>
                <label>{en.userRoles.createdAt}</label>
                <input
                  type="text"
                  name="createdAt"
                  value={formData.createdAt}
                  disabled
                />
              </div>
            </div>
          </>
        )}
        {mode === 'add' && (
          <button
            type="submit"
            className={styles.doneButton}
            onClick={handleAdd}
          >
            Done
          </button>
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
      </form>
    </div>
  )
}

export default ManageUserRole
