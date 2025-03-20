import React, { useState, useEffect } from 'react'
import styles from '../styles/ManageNetworkParticipants.module.css'
import { useRouter } from 'next/router'
import en from '../locales/en'
import ActionHeaders from '../components/actionHeaders'

const ManageNetworkParticipants: React.FC = () => {
  const router = useRouter()
  const [formData, setFormData] = useState({
    participantId: '',
    kycComplete: false
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
            <label>{en.networkParticipants.participantId}</label>
            <input
              type="text"
              name="participantId"
              value={formData.participantId}
              onChange={handleChange}
              disabled={mode === 'view'}
            />
          </div>
          <div className={styles.row}>
            <label>{en.networkParticipants.kycComplete}</label>
            <input
              type="checkbox"
              name="kycComplete"
              checked={formData.kycComplete}
              onChange={handleChange}
              disabled={mode === 'view'}
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
