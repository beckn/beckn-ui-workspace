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
    { header: en.networkParticipants.participantId, accessor: 'participantId' },
    { header: en.networkParticipants.kycComplete, accessor: 'kycComplete' }
  ]

  const data = [
    { participantId: 'alex-nounce-bap', kycComplete: 'Y' },
    { participantId: 'prasad-test', kycComplete: 'Y' },
    { participantId: 'onix-bpp.becknprotocol.io', kycComplete: 'Y' }
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
