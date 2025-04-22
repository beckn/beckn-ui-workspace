import React, { useState, useEffect } from 'react'
import styles from '@styles/ManageNetworkDomain.module.css'
import { useRouter } from 'next/router'
import en from '@locales/en'
import ActionHeaders from '@components/actionHeaders'
import {
  useGetNetworkDomainByIdQuery,
  useCreateNetworkDomainMutation,
  useUpdateNetworkDomainMutation
} from '@services/networkDomainServices'
import { showToast } from '@components/Toast'

interface FormErrors {
  name?: string
  description?: string
  schemaUrl?: string
}

const ManageNetworkDomain: React.FC = () => {
  const router = useRouter()
  const { mode: queryMode, documentId } = router.query
  const { data: domainData, isLoading } = useGetNetworkDomainByIdQuery(documentId as string, {
    skip: !documentId || queryMode === 'add'
  })
  const [createNetworkDomain] = useCreateNetworkDomainMutation()
  const [updateNetworkDomain] = useUpdateNetworkDomainMutation()

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    schemaUrl: '',
    updaterUser: '',
    creatorUser: '',
    updatedAt: '',
    createdAt: ''
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [mode, setMode] = useState<'add' | 'edit' | 'view'>('add')

  useEffect(() => {
    if (domainData) {
      setFormData({
        name: domainData.name,
        description: domainData.description || '',
        schemaUrl: domainData.schema_url || '',
        updaterUser: domainData.updater_user || '',
        creatorUser: domainData.creator_user || '',
        updatedAt: domainData.updated_at || '',
        createdAt: domainData.created_at || ''
      })
    }
  }, [domainData])

  useEffect(() => {
    if (queryMode) {
      setMode(queryMode as 'add' | 'edit' | 'view')
    }
  }, [queryMode])

  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Name is required'
        return undefined
      case 'description':
        if (!value.trim()) return 'Description is required'
        return undefined
      case 'schemaUrl':
        if (!value.trim()) return 'Schema URL is required'
        if (!value.match(/^https?:\/\/.+/)) return 'Schema URL must be a valid URL'
        return undefined
      default:
        return undefined
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Validate field immediately
    const error = validateField(name, value)
    setErrors(prev => ({
      ...prev,
      [name]: error
    }))
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Validate all fields
    Object.keys(formData).forEach(key => {
      if (key !== 'updaterUser' && key !== 'creatorUser' && key !== 'updatedAt' && key !== 'createdAt') {
        const error = validateField(key, formData[key as keyof typeof formData])
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
      const domainData = {
        name: formData.name,
        description: formData.description,
        schema_url: formData.schemaUrl
      }
      await createNetworkDomain(domainData).unwrap()
      showToast({
        message: 'Network domain added successfully',
        type: 'success'
      })
      router.push('/networkDomains')
    } catch (error) {
      showToast({
        message: 'Failed to add network domain',
        type: 'error'
      })
    }
  }

  const handleSaveAndMore = async () => {
    if (!validateForm()) return

    try {
      const domainData = {
        name: formData.name,
        description: formData.description,
        schema_url: formData.schemaUrl
      }
      await createNetworkDomain(domainData).unwrap()
      showToast({
        message: 'Network domain added successfully',
        type: 'success'
      })
      setFormData({
        name: '',
        description: '',
        schemaUrl: '',
        updaterUser: '',
        creatorUser: '',
        updatedAt: '',
        createdAt: ''
      })
      setErrors({})
    } catch (error) {
      showToast({
        message: 'Failed to add network domain',
        type: 'error'
      })
    }
  }

  const handleEdit = async () => {
    if (!validateForm()) return

    try {
      const domainData = {
        name: formData.name,
        description: formData.description,
        schema_url: formData.schemaUrl
      }
      await updateNetworkDomain({ documentId: documentId as string, networkDomain: domainData }).unwrap()
      showToast({
        message: 'Network domain updated successfully',
        type: 'success'
      })
      router.push('/networkDomains')
    } catch (error) {
      showToast({
        message: 'Failed to update network domain',
        type: 'error'
      })
    }
  }

  const handleClose = () => {
    router.push('/networkDomains')
  }

  if (isLoading && mode !== 'add') {
    return <div>Loading...</div>
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
            <div className={styles.inputContainer}>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={mode === 'view'}
                className={errors.name ? styles.errorInput : ''}
              />
              <div className={styles.errorContainer}>
                {errors.name && <span className={styles.errorMessage}>{errors.name}</span>}
              </div>
            </div>
          </div>
          <div className={styles.row}>
            <label>{en.networkDomains.description}</label>
            <div className={styles.inputContainer}>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                disabled={mode === 'view'}
                className={errors.description ? styles.errorInput : ''}
              />
              <div className={styles.errorContainer}>
                {errors.description && <span className={styles.errorMessage}>{errors.description}</span>}
              </div>
            </div>
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.row}>
            <label>{en.networkDomains.schemaUrl}</label>
            <div className={styles.inputContainer}>
              <input
                type="text"
                name="schemaUrl"
                value={formData.schemaUrl}
                onChange={handleChange}
                disabled={mode === 'view'}
                className={errors.schemaUrl ? styles.errorInput : ''}
              />
              <div className={styles.errorContainer}>
                {errors.schemaUrl && <span className={styles.errorMessage}>{errors.schemaUrl}</span>}
              </div>
            </div>
          </div>
          <div className={styles.row}>
            {mode !== 'add' && (
              <>
                <label>{en.networkDomains.updaterUser}</label>
                <div className={styles.inputContainer}>
                  <input
                    type="text"
                    name="updaterUser"
                    value={formData.updaterUser}
                    disabled
                  />
                  <div className={styles.errorContainer}></div>
                </div>
              </>
            )}
          </div>
        </div>
        {mode !== 'add' && (
          <>
            <div className={styles.row}>
              <div className={styles.row}>
                <label>{en.networkDomains.creatorUser}</label>
                <div className={styles.inputContainer}>
                  <input
                    type="text"
                    name="creatorUser"
                    value={formData.creatorUser}
                    disabled
                  />
                  <div className={styles.errorContainer}></div>
                </div>
              </div>
              <div className={styles.row}>
                <label>{en.networkDomains.updatedAt}</label>
                <div className={styles.inputContainer}>
                  <input
                    type="text"
                    name="updatedAt"
                    value={formData.updatedAt}
                    disabled
                  />
                  <div className={styles.errorContainer}></div>
                </div>
              </div>
            </div>
            <div className={styles.row}>
              <div className={styles.row}>
                <label>{en.networkDomains.createdAt}</label>
                <div className={styles.inputContainer}>
                  <input
                    type="text"
                    name="createdAt"
                    value={formData.createdAt}
                    disabled
                  />
                  <div className={styles.errorContainer}></div>
                </div>
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
