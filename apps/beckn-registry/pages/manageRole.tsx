import React, { useState, useEffect } from 'react'
import styles from '../styles/ManageRole.module.css'
import { useRouter } from 'next/router'
import ActionHeaders from '../components/actionHeaders'

const ManageRole = () => {
  const [formData, setFormData] = useState({
    name: '',
    // staff: false,
    creatorUser: '',
    updaterUser: '',
    createdAt: '',
    updatedAt: ''
  })

  const [mode, setMode] = useState<'add' | 'edit' | 'view'>('add')

  const router = useRouter()
  const { mode: queryMode, ...roleDataQuery } = router.query

  useEffect(() => {
    if (roleDataQuery) {
      setFormData(roleDataQuery as unknown as typeof formData)
    }
  }, [])

  useEffect(() => {
    if (queryMode) {
      setMode(queryMode as 'add' | 'edit' | 'view')
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const handleAdd = () => {
    console.log('Add Role:', formData)
    router.push('/roles')
  }

  const handleSaveAndMore = () => {
    console.log('Save & More:', formData)
    // Logic for saving and adding more
  }

  const handleEdit = () => {
    console.log('Edit Role:', formData)
    router.push('/roles')
  }

  const handleClose = () => {
    router.push('/roles')
  }

  return (
    <div className={styles.container}>
      <ActionHeaders
        onBackClick={() => router.push('/roles')}
        onHomeClick={() => router.push('/')}
      />
      <h2 className={styles.title}>Role Information</h2>
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
            <label className={styles.label}>Name</label>
            <input
              type="text"
              name="name"
              className={styles.input}
              value={formData.name}
              onChange={handleChange}
              disabled={mode === 'view'}
            />
          </div>
          {/* <div className={styles.row}>
            <label className={styles.label}>Staff</label>
            <input
              type="checkbox"
              name="staff"
              className={styles.checkbox}
              checked={formData.staff}
              onChange={handleChange}
              disabled={mode === 'view'}
            />
          </div> */}
          {mode !== 'add' && (
            <div className={styles.row}>
              <label className={styles.label}>Creator User</label>
              <input
                type="text"
                name="creatorUser"
                className={styles.input}
                value={formData.creatorUser}
                disabled
              />
            </div>
          )}
        </div>
        {mode !== 'add' && (
          <>
            <div className={styles.row}>
              <div className={styles.row}>
                <label className={styles.label}>Updater User</label>
                <input
                  type="text"
                  name="updaterUser"
                  className={styles.input}
                  value={formData.updaterUser}
                  disabled
                />
              </div>
              <div className={styles.row}>
                <label className={styles.label}>Created At</label>
                <input
                  type="text"
                  name="createdAt"
                  className={styles.input}
                  value={formData.createdAt}
                  disabled
                />
              </div>
            </div>
            <div className={styles.row}>
              <div className={styles.row}>
                <label className={styles.label}>Updated At</label>
                <input
                  type="text"
                  name="updatedAt"
                  className={styles.input}
                  value={formData.updatedAt}
                  disabled
                />
              </div>
            </div>
          </>
        )}
        <div className={styles.buttonRow}>
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

export default ManageRole
