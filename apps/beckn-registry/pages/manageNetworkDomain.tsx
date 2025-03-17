import React, { useState, useEffect } from 'react'
import styles from '../styles/ManageNetworkDomain.module.css'
import { useRouter } from 'next/router'
import en from '../locales/en'
import ActionHeaders from '../components/actionHeaders'

const ManageNetworkDomain: React.FC = () => {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    schemaUrl: '',
    updaterUser: '',
    creatorUser: '',
    updatedAt: '',
    createdAt: ''
  })

  const { mode: queryMode, ...networkDomainDataQuery } = router.query

  const [mode, setMode] = useState<'add' | 'edit' | 'view'>('add')

  useEffect(() => {
    if (networkDomainDataQuery) {
      setFormData(networkDomainDataQuery as typeof formData)
    }
  }, [])

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
    console.log('Add NetworkDomain:', formData)
    router.push('/networkDomains')
  }

  const handleSaveAndMore = () => {
    console.log('Save & More:', formData)
    // Logic for saving and adding more
  }

  const handleEdit = () => {
    console.log('Edit NetworkDomain:', formData)
    router.push('/networkDomains')
  }

  const handleClose = () => {
    router.push('/networkDomains')
  }

  return (
    <div className={styles.manageNetworkDomainContainer}>
      <ActionHeaders
        onBackClick={() => router.push('/networkDomains')}
        onHomeClick={() => router.push('/')}
      />
      <h2 className={styles.title}>{en.networkDomains.title}</h2>
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
            <label>{en.networkDomains.name}</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={mode === 'view'}
            />
          </div>
          <div className={styles.row}>
            <label>{en.networkDomains.description}</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              disabled={mode === 'view'}
            />
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.row}>
            <label>{en.networkDomains.schemaUrl}</label>
            <input
              type="text"
              name="schemaUrl"
              value={formData.schemaUrl}
              onChange={handleChange}
              disabled={mode === 'view'}
            />
          </div>
          <div className={styles.row}>
            {mode !== 'add' && (
              <>
                <label>{en.networkDomains.updaterUser}</label>
                <input
                  type="text"
                  name="updaterUser"
                  value={formData.updaterUser}
                  disabled
                />
              </>
            )}
          </div>
        </div>
        {mode !== 'add' && (
          <>
            <div className={styles.row}>
              <div className={styles.row}>
                <label>{en.networkDomains.creatorUser}</label>
                <input
                  type="text"
                  name="creatorUser"
                  value={formData.creatorUser}
                  disabled
                />
              </div>
              <div className={styles.row}>
                <label>{en.networkDomains.updatedAt}</label>
                <input
                  type="text"
                  name="updatedAt"
                  value={formData.updatedAt}
                  disabled
                />
              </div>
            </div>
            <div className={styles.row}>
              <div className={styles.row}>
                <label>{en.networkDomains.createdAt}</label>
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
      </form>
    </div>
  )
}

export default ManageNetworkDomain
