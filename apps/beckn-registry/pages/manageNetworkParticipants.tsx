import React, { useState, useEffect } from 'react'
import styles from '../styles/ManageNetworkParticipants.module.css'
import { useRouter } from 'next/router'
import en from '../locales/en'
import ActionHeaders from '../components/actionHeaders'
import {
  useGetNetworkParticipantByIdQuery,
  useAddNetworkParticipantMutation,
  useUpdateNetworkParticipantMutation
} from '../services/networkParticipantServices'
import { showToast } from '../components/Toast'

interface FormErrors {
  subscriberId?: string
  subscriberUrl?: string
  keyId?: string
  type?: string
  domain?: string
  signingPublicKey?: string
  encrPublicKey?: string
  validFrom?: string
  validUntil?: string
  status?: string
}

const ManageNetworkParticipants: React.FC = () => {
  const router = useRouter()
  const { mode: queryMode, subscriber_id } = router.query

  const { data: participantData, isLoading } = useGetNetworkParticipantByIdQuery(subscriber_id as string, {
    skip: !subscriber_id || queryMode === 'add'
  })
  const [addNetworkParticipant] = useAddNetworkParticipantMutation()
  const [updateNetworkParticipant] = useUpdateNetworkParticipantMutation()

  const [formData, setFormData] = useState({
    subscriberId: '',
    subscriberUrl: '',
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

  const [errors, setErrors] = useState<FormErrors>({})
  const [dateError, setDateError] = useState('')

  const typeOptions = [
    { value: 'BAP', label: 'BAP' },
    { value: 'BPP', label: 'BPP' }
  ]

  const domainOptions = [
    { value: 'retail', label: 'Retail' },
    { value: 'mobility', label: 'Mobility' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'education', label: 'Education' }
  ]

  const statusOptions = [
    { value: 'SUBSCRIBED', label: 'SUBSCRIBED' },
    { value: 'UNSUBSCRIBED', label: 'UNSUBSCRIBED' }
  ]

  useEffect(() => {
    if (participantData) {
      setFormData({
        subscriberId: participantData.subscriber_id,
        subscriberUrl: participantData.subscriber_url || '',
        keyId: participantData.unique_key_id || '',
        type: participantData.type,
        domain: participantData.domain,
        signingPublicKey: participantData.signing_public_key,
        encrPublicKey: participantData.encr_public_key,
        validFrom: participantData.valid_from || '',
        validUntil: participantData.valid_until || '',
        status: participantData.status,
        createdAt: participantData.created,
        updatedAt: participantData.updated
      })
    }
  }, [participantData])

  useEffect(() => {
    if (queryMode) {
      setMode(queryMode as 'add' | 'edit' | 'view')
    }
  }, [queryMode])

  const [mode, setMode] = useState<'add' | 'edit' | 'view'>('add')

  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case 'subscriberId':
        if (!value.trim()) return 'Subscriber ID is required'
        return undefined
      case 'subscriberUrl':
        if (!value.trim()) return 'Subscriber URL is required'
        return undefined
      case 'keyId':
        if (!value.trim()) return 'Key ID is required'
        return undefined
      case 'type':
        if (!value.trim()) return 'Type is required'
        return undefined
      case 'domain':
        if (!value.trim()) return 'Domain is required'
        return undefined
      case 'signingPublicKey':
        if (!value.trim()) return 'Signing Public Key is required'
        return undefined
      case 'encrPublicKey':
        if (!value.trim()) return 'Encryption Public Key is required'
        return undefined
      case 'validFrom':
        if (!value.trim()) return 'Valid From date is required'
        return undefined
      case 'validUntil':
        if (!value.trim()) return 'Valid Until date is required'
        return undefined
      case 'status':
        if (!value.trim()) return 'Status is required'
        return undefined
      default:
        return undefined
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'validFrom' && { validUntil: '' })
    }))

    // Validate field immediately
    const error = validateField(name, value)
    setErrors(prev => ({
      ...prev,
      [name]: error
    }))

    // Validate dates when either validFrom or validUntil changes
    if (name === 'validFrom' || name === 'validUntil') {
      const fromDate = name === 'validFrom' ? value : formData.validFrom
      const untilDate = name === 'validUntil' ? value : formData.validUntil

      if (fromDate && untilDate) {
        const from = new Date(fromDate)
        const until = new Date(untilDate)
        if (from > until) {
          setDateError('Valid From date must be less than or equal to Valid Until date')
        } else {
          setDateError('')
        }
      } else {
        setDateError('')
      }
    }
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Validate all fields
    Object.keys(formData).forEach(key => {
      if (key !== 'createdAt' && key !== 'updatedAt') {
        const error = validateField(key, formData[key as keyof typeof formData])
        if (error) {
          newErrors[key as keyof FormErrors] = error
        }
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0 && !dateError
  }

  const handleAdd = async () => {
    if (!validateForm()) return

    try {
      const participantData = {
        subscriber_id: formData.subscriberId,
        url: formData.subscriberUrl,
        key_id: formData.keyId,
        type: formData.type,
        domain: formData.domain,
        signing_public_key: formData.signingPublicKey,
        encr_public_key: formData.encrPublicKey,
        valid_from: formData.validFrom,
        valid_until: formData.validUntil,
        status: formData.status
      }
      await addNetworkParticipant(participantData).unwrap()
      showToast({
        message: 'Network participant added successfully',
        type: 'success'
      })
      router.push('/networkParticipants')
    } catch (error) {
      showToast({
        message: 'Failed to add network participant',
        type: 'error'
      })
    }
  }

  const handleSaveAndMore = async () => {
    if (!validateForm()) return

    try {
      const participantData = {
        subscriber_id: formData.subscriberId,
        url: formData.subscriberUrl,
        key_id: formData.keyId,
        type: formData.type,
        domain: formData.domain,
        signing_public_key: formData.signingPublicKey,
        encr_public_key: formData.encrPublicKey,
        valid_from: formData.validFrom,
        valid_until: formData.validUntil,
        status: formData.status
      }
      await addNetworkParticipant(participantData).unwrap()
      showToast({
        message: 'Network participant added successfully',
        type: 'success'
      })
      setFormData({
        subscriberId: '',
        subscriberUrl: '',
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
      setErrors({})
    } catch (error) {
      showToast({
        message: 'Failed to add network participant',
        type: 'error'
      })
    }
  }

  const handleEdit = async () => {
    if (!validateForm()) return

    try {
      const participantData = {
        subscriber_id: formData.subscriberId,
        url: formData.subscriberUrl,
        key_id: formData.keyId,
        type: formData.type,
        domain: formData.domain,
        signing_public_key: formData.signingPublicKey,
        encr_public_key: formData.encrPublicKey,
        valid_from: formData.validFrom,
        valid_until: formData.validUntil,
        status: formData.status
      }
      await updateNetworkParticipant({ subscriberId: subscriber_id as string, data: participantData }).unwrap()
      showToast({
        message: 'Network participant updated successfully',
        type: 'success'
      })
      router.push('/networkParticipants')
    } catch (error) {
      showToast({
        message: 'Failed to update network participant',
        type: 'error'
      })
    }
  }

  const handleClose = () => {
    router.push('/networkParticipants')
  }

  if (isLoading && mode !== 'add') {
    return <div>Loading...</div>
  }

  return (
    <div className={styles.manageNetworkParticipantsContainer}>
      <ActionHeaders
        onBackClick={() => router.push('/networkParticipants')}
        onHomeClick={() => router.push('/')}
      />
      <h2 className={styles.title}>{en.networkParticipants.title}</h2>
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
            <div className={styles.inputContainer}>
              <input
                type="text"
                name="subscriberId"
                value={formData.subscriberId}
                onChange={handleChange}
                disabled={mode === 'view'}
                className={errors.subscriberId ? styles.errorInput : ''}
              />
              <div className={styles.errorContainer}>
                {errors.subscriberId && <span className={styles.errorMessage}>{errors.subscriberId}</span>}
              </div>
            </div>
          </div>
          <div className={styles.row}>
            <label>{en.networkParticipants.subscriberUrl}</label>
            <div className={styles.inputContainer}>
              <input
                type="text"
                name="subscriberUrl"
                value={formData.subscriberUrl}
                onChange={handleChange}
                disabled={mode === 'view'}
                className={errors.subscriberUrl ? styles.errorInput : ''}
              />
              <div className={styles.errorContainer}>
                {errors.subscriberUrl && <span className={styles.errorMessage}>{errors.subscriberUrl}</span>}
              </div>
            </div>
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.row}>
            <label>{en.networkParticipants.keyId}</label>
            <div className={styles.inputContainer}>
              <input
                type="text"
                name="keyId"
                value={formData.keyId}
                onChange={handleChange}
                disabled={mode === 'view'}
                className={errors.keyId ? styles.errorInput : ''}
              />
              <div className={styles.errorContainer}>
                {errors.keyId && <span className={styles.errorMessage}>{errors.keyId}</span>}
              </div>
            </div>
          </div>
          <div className={styles.row}>
            <label>{en.networkParticipants.type}</label>
            <div className={styles.inputContainer}>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                disabled={mode === 'view'}
                className={`${styles.select} ${errors.type ? styles.errorInput : ''}`}
              >
                <option
                  value=""
                  disabled
                >
                  Select Type
                </option>
                {typeOptions.map(option => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ))}
              </select>
              <div className={styles.errorContainer}>
                {errors.type && <span className={styles.errorMessage}>{errors.type}</span>}
              </div>
            </div>
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.row}>
            <label>{en.networkParticipants.domain}</label>
            <div className={styles.inputContainer}>
              <select
                name="domain"
                value={formData.domain}
                onChange={handleChange}
                disabled={mode === 'view'}
                className={`${styles.select} ${errors.domain ? styles.errorInput : ''}`}
              >
                <option
                  value=""
                  disabled
                >
                  Select Domain
                </option>
                {domainOptions.map(option => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ))}
              </select>
              <div className={styles.errorContainer}>
                {errors.domain && <span className={styles.errorMessage}>{errors.domain}</span>}
              </div>
            </div>
          </div>
          <div className={styles.row}>
            <label>{en.networkParticipants.signingPublicKey}</label>
            <div className={styles.inputContainer}>
              <input
                type="text"
                name="signingPublicKey"
                value={formData.signingPublicKey}
                onChange={handleChange}
                disabled={mode === 'view'}
                className={errors.signingPublicKey ? styles.errorInput : ''}
              />
              <div className={styles.errorContainer}>
                {errors.signingPublicKey && <span className={styles.errorMessage}>{errors.signingPublicKey}</span>}
              </div>
            </div>
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.row}>
            <label>{en.networkParticipants.encrPublicKey}</label>
            <div className={styles.inputContainer}>
              <input
                type="text"
                name="encrPublicKey"
                value={formData.encrPublicKey}
                onChange={handleChange}
                disabled={mode === 'view'}
                className={errors.encrPublicKey ? styles.errorInput : ''}
              />
              <div className={styles.errorContainer}>
                {errors.encrPublicKey && <span className={styles.errorMessage}>{errors.encrPublicKey}</span>}
              </div>
            </div>
          </div>
          <div className={styles.row}>
            <label>{en.networkParticipants.validFrom}</label>
            <div className={styles.inputContainer}>
              <input
                type="date"
                name="validFrom"
                value={formData.validFrom}
                onChange={handleChange}
                disabled={mode === 'view'}
                min={new Date().toISOString().split('T')[0]}
                className={errors.validFrom ? styles.errorInput : ''}
              />
              <div className={styles.errorContainer}>
                {errors.validFrom && <span className={styles.errorMessage}>{errors.validFrom}</span>}
              </div>
            </div>
          </div>
        </div>
        {dateError && <div className={styles.error}>{dateError}</div>}
        <div className={styles.row}>
          <div className={styles.row}>
            <label>{en.networkParticipants.validUntil}</label>
            <div className={styles.inputContainer}>
              <input
                type="date"
                name="validUntil"
                value={formData.validUntil}
                onChange={handleChange}
                disabled={mode === 'view'}
                min={formData.validFrom || new Date().toISOString().split('T')[0]}
                className={errors.validUntil ? styles.errorInput : ''}
              />
              <div className={styles.errorContainer}>
                {errors.validUntil && <span className={styles.errorMessage}>{errors.validUntil}</span>}
              </div>
            </div>
          </div>
          <div className={styles.row}>
            <label>{en.networkParticipants.status}</label>
            <div className={styles.inputContainer}>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                disabled={mode === 'view'}
                className={`${styles.select} ${errors.status ? styles.errorInput : ''}`}
              >
                <option
                  value=""
                  disabled
                >
                  Select Status
                </option>
                {statusOptions.map(option => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ))}
              </select>
              <div className={styles.errorContainer}>
                {errors.status && <span className={styles.errorMessage}>{errors.status}</span>}
              </div>
            </div>
          </div>
        </div>
        {mode === 'view' && (
          <div className={styles.row}>
            <div className={styles.row}>
              <label>{en.networkParticipants.createdAt}</label>
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
            <div className={styles.row}>
              <label>{en.networkParticipants.updatedAt}</label>
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
          </div>
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
      </form>
    </div>
  )
}

export default ManageNetworkParticipants
