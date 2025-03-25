import React from 'react'
import CustomTable, { Action } from '../components/CustomTable'
import styles from '../styles/NetworkParticipants.module.css'
import SearchInput from '../components/SearchInput'
import ActionHeaders from '../components/actionHeaders'
import en from '../locales/en'
import { faEye, faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useRouter } from 'next/router'

type NetworkParticipant =
  | {
      participantId: string
      kycComplete: string
    }
  | { [key: string]: string | number | boolean }

const NetworkParticipants = () => {
  const router = useRouter()

  const columns = [
    { header: en.networkParticipants.subscriberId, accessor: 'subscriberId' },
    { header: en.networkParticipants.keyId, accessor: 'keyId' },
    { header: en.networkParticipants.type, accessor: 'type' },
    { header: en.networkParticipants.domain, accessor: 'domain' },
    { header: en.networkParticipants.signingPublicKey, accessor: 'signingPublicKey' },
    { header: en.networkParticipants.encrPublicKey, accessor: 'encrPublicKey' },
    { header: en.networkParticipants.validFrom, accessor: 'validFrom' },
    { header: en.networkParticipants.validUntil, accessor: 'validUntil' },
    { header: en.networkParticipants.status, accessor: 'status' },
    { header: en.networkParticipants.createdAt, accessor: 'createdAt' },
    { header: en.networkParticipants.updatedAt, accessor: 'updatedAt' }
  ]

  const data = [
    {
      subscriberId: 'sub-001',
      keyId: 'key-001',
      type: 'BAP',
      domain: 'example.com',
      signingPublicKey: 'signingKey123',
      encrPublicKey: 'encryptionKey123',
      validFrom: '2023-01-01',
      validUntil: '2024-01-01',
      status: 'active',
      createdAt: '2023-01-01',
      updatedAt: '2023-06-01'
    },
    {
      subscriberId: 'sub-002',
      keyId: 'key-002',
      type: 'BPP',
      domain: 'anotherexample.com',
      signingPublicKey: 'signingKey456',
      encrPublicKey: 'encryptionKey456',
      validFrom: '2023-02-01',
      validUntil: '2024-02-01',
      status: 'inactive',
      createdAt: '2023-02-01',
      updatedAt: '2023-07-01'
    },
    {
      subscriberId: 'sub-003',
      keyId: 'key-003',
      type: 'BAP',
      domain: 'yetanotherexample.com',
      signingPublicKey: 'signingKey789',
      encrPublicKey: 'encryptionKey789',
      validFrom: '2023-03-01',
      validUntil: '2024-03-01',
      status: 'active',
      createdAt: '2023-03-01',
      updatedAt: '2023-08-01'
    }
    // Add more data as needed
  ]

  const actions: Action[] = [
    {
      icon: (
        <FontAwesomeIcon
          icon={faEye}
          color="#3056d3"
        />
      ),
      title: en.networkParticipants.view,
      onClick: (row: NetworkParticipant) => handleViewParticipant(row)
    },
    {
      icon: (
        <FontAwesomeIcon
          icon={faEdit}
          color="#3056d3"
        />
      ),
      title: en.networkParticipants.edit,
      onClick: (row: NetworkParticipant) => handleEditParticipant(row)
    },
    {
      icon: (
        <FontAwesomeIcon
          icon={faTrashAlt}
          color="#3056d3"
        />
      ),
      title: en.networkParticipants.delete,
      onClick: (row: NetworkParticipant) => {
        console.log('Delete', row)
        // Implement delete logic here
      }
    }
  ]

  const handleAddParticipant = () => {
    router.push({ pathname: '/manageNetworkParticipants', query: { mode: 'add' } })
  }

  const handleEditParticipant = (participant: NetworkParticipant) => {
    router.push({ pathname: '/manageNetworkParticipants', query: { mode: 'edit', ...participant } })
  }

  const handleViewParticipant = (participant: NetworkParticipant) => {
    router.push({ pathname: '/manageNetworkParticipants', query: { mode: 'view', ...participant } })
  }

  return (
    <div className={styles.networkParticipantsContainer}>
      <ActionHeaders
        onPlusClick={handleAddParticipant}
        onBackClick={() => router.back()}
        onHomeClick={() => router.push('/')}
      />
      <h2 className={styles.title}>{en.networkParticipants.title}</h2>
      <SearchInput
        placeholder={en.networkParticipants.searchPlaceholder}
        onSearch={() => console.log('Search clicked')}
      />
      <CustomTable
        columns={columns}
        data={data}
        actions={actions}
      />
    </div>
  )
}

export default NetworkParticipants
