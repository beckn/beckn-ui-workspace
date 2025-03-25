import React, { useState, useEffect } from 'react'
import styles from '../styles/ManageNetworkParticipants.module.css'
import { useRouter } from 'next/router'
import en from '../locales/en'
import ActionHeaders from '../components/actionHeaders'

const ManageNetworkParticipants: React.FC = () => {
  const router = useRouter()
  const [formData, setFormData] = useState({
    subscriberId: '',
    keyId: '',
    type: '',
    domain: '',
    signingPublicKey: '',
    encrPublicKey: '',
    validFrom: '',
    validUntil: '',
    status: '',
    createdAt: '',
    updatedAt: ''
  })

  const { mode: queryMode, ...participantDataQuery } = router.query

  useEffect(() => {
    if (participantDataQuery) {
      setFormData(participantDataQuery as unknown as typeof formData)
    }
  }, [])

  useEffect(() => {
    if (queryMode) {
      setMode(queryMode as 'add' | 'edit' | 'view')
    }
  }, [])

  const [mode, setMode] = useState<'add' | 'edit' | 'view'>('add')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const handleAdd = () => {
    console.log('Add Participant:', formData)
    router.push('/networkParticipants')
  }

  const handleSaveAndMore = () => {
    console.log('Save & More:', formData)
    // Logic for saving and adding more
  }

  const handleEdit = () => {
    console.log('Edit Participant:', formData)
    router.push('/networkParticipants')
  }

  const handleClose = () => {
    router.push('/networkParticipants')
  }

  return (
    <div className={styles.manageNetworkParticipantsContainer}>
      <ActionHeaders
        onBackClick={() => router.push('/networkParticipants')}
        onHomeClick={() => router.push('/')}
      />
      <h2>{en.networkParticipants.title}</h2>
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
            <label>{en.networkParticipants.subscriberId}</label>
            <input
              type="text"
              name="subscriberId"
              value={formData.subscriberId}
              onChange={handleChange}
              disabled={true}
            />
          </div>
          <div className={styles.row}>
            <label>{en.networkParticipants.keyId}</label>
            <input
              type="text"
              name="keyId"
              value={formData.keyId}
              onChange={handleChange}
              disabled={true}
            />
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.row}>
            <label>{en.networkParticipants.type}</label>
            <input
              type="text"
              name="type"
              value={formData.type}
              onChange={handleChange}
              disabled={mode === 'view'}
            />
          </div>
          <div className={styles.row}>
            <label>{en.networkParticipants.domain}</label>
            <input
              type="text"
              name="domain"
              value={formData.domain}
              onChange={handleChange}
              disabled={mode === 'view'}
            />
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.row}>
            <label>{en.networkParticipants.signingPublicKey}</label>
            <input
              type="text"
              name="signingPublicKey"
              value={formData.signingPublicKey}
              onChange={handleChange}
              disabled={mode === 'view'}
            />
          </div>
          <div className={styles.row}>
            <label>{en.networkParticipants.encrPublicKey}</label>
            <input
              type="text"
              name="encrPublicKey"
              value={formData.encrPublicKey}
              onChange={handleChange}
              disabled={mode === 'view'}
            />
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.row}>
            <label>{en.networkParticipants.validFrom}</label>
            <input
              type="text"
              name="validFrom"
              value={formData.validFrom}
              onChange={handleChange}
              disabled={mode === 'view'}
            />
          </div>
          <div className={styles.row}>
            <label>{en.networkParticipants.validUntil}</label>
            <input
              type="text"
              name="validUntil"
              value={formData.validUntil}
              onChange={handleChange}
              disabled={mode === 'view'}
            />
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.row}>
            <label>{en.networkParticipants.status}</label>
            <input
              type="text"
              name="status"
              value={formData.status}
              onChange={handleChange}
              disabled={mode === 'view'}
            />
          </div>
          <div className={styles.row}>
            <label>{en.networkParticipants.createdAt}</label>
            <input
              type="text"
              name="createdAt"
              value={formData.createdAt}
              onChange={handleChange}
              disabled={true}
            />
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.row}>
            <label>{en.networkParticipants.updatedAt}</label>
            <input
              type="text"
              name="updatedAt"
              value={formData.updatedAt}
              onChange={handleChange}
              disabled={true}
            />
          </div>
        </div>

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

export default ManageNetworkParticipants
