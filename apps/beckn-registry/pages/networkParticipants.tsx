import React, { useEffect, useState } from 'react'
import CustomTable, { Action, TableData } from '@components/CustomTable'
import styles from '@styles/NetworkParticipants.module.css'
import SearchInput from '@components/SearchInput'
import ActionHeaders from '@components/actionHeaders'
import en from '@locales/en'
import { faEye, faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useRouter } from 'next/router'
import {
  useGetNetworkParticipantsQuery,
  useDeleteNetworkParticipantMutation,
  NetworkParticipant as APINetworkParticipant
} from '@services/networkParticipantServices'
import { showToast } from '@components/Toast'
import AlertModal from '@components/AlertModal'
import { useDispatch } from 'react-redux'
import { setParticipants, setLoading, setError } from '@store/networkParticipant-slice'

const NetworkParticipants = () => {
  const router = useRouter()
  const dispatch = useDispatch()

  const {
    data: participants,
    isLoading,
    error: queryError,
    refetch
  } = useGetNetworkParticipantsQuery({
    page: 1,
    pageSize: 10
  })

  const [deleteNetworkParticipant] = useDeleteNetworkParticipantMutation()
  const [deleteModalState, setDeleteModalState] = useState<{
    isOpen: boolean
    subscriberId: string | null
  }>({
    isOpen: false,
    subscriberId: null
  })

  useEffect(() => {
    console.log('participants', participants)
    if (participants) {
      dispatch(setParticipants(participants.results))
      // dispatch(
      //   setPagination({
      //     page: participants.pagination.page,
      //     pageSize: participants.pagination.pageSize,
      //     total: participants.pagination.total
      //   })
      // )
    }
    dispatch(setLoading(isLoading))
    if (queryError) {
      dispatch(setError('Failed to fetch network participants'))
    }
  }, [participants, isLoading, queryError, dispatch])

  const columns = [
    { header: en.networkParticipants.subscriberId, accessor: 'subscriber_id' },
    { header: en.networkParticipants.subscriberUrl, accessor: 'subscriber_url' },
    { header: en.networkParticipants.keyId, accessor: 'unique_key_id' },
    { header: en.networkParticipants.type, accessor: 'type' },
    { header: en.networkParticipants.domain, accessor: 'domain' },
    { header: en.networkParticipants.signingPublicKey, accessor: 'signing_public_key' },
    { header: en.networkParticipants.encrPublicKey, accessor: 'encr_public_key' },
    { header: en.networkParticipants.validFrom, accessor: 'valid_from' },
    { header: en.networkParticipants.validUntil, accessor: 'valid_until' },
    { header: en.networkParticipants.status, accessor: 'status' },
    { header: en.networkParticipants.createdAt, accessor: 'created' },
    { header: en.networkParticipants.updatedAt, accessor: 'updated' }
  ]

  const handleSearch = () => {
    refetch()
  }

  // const handlePageChange = (newPage: number) => {
  //   // dispatch(setPagination({ ...pagination, page: newPage }))
  // }

  // const handlePageSizeChange = (newPageSize: number) => {
  //   // dispatch(setPagination({ ...pagination, pageSize: newPageSize, page: 1 }))
  // }

  const handleDelete = async (subscriberId: string) => {
    try {
      await deleteNetworkParticipant(subscriberId).unwrap()
      showToast({
        message: 'Network participant deleted successfully',
        type: 'success'
      })
    } catch (error) {
      showToast({
        message: 'Failed to delete network participant',
        type: 'error'
      })
    }
  }

  const handleDeleteClick = (subscriberId: string) => {
    setDeleteModalState({
      isOpen: true,
      subscriberId
    })
  }

  const handleDeleteConfirm = () => {
    if (deleteModalState.subscriberId) {
      handleDelete(deleteModalState.subscriberId)
    }
    setDeleteModalState({
      isOpen: false,
      subscriberId: null
    })
  }

  const handleDeleteCancel = () => {
    setDeleteModalState({
      isOpen: false,
      subscriberId: null
    })
  }

  const actions: Action<TableData>[] = [
    {
      icon: (
        <FontAwesomeIcon
          icon={faEye}
          color="#3056d3"
        />
      ),
      title: en.networkParticipants.view,
      onClick: (row: TableData) => handleViewParticipant(row as unknown as APINetworkParticipant)
    },
    {
      icon: (
        <FontAwesomeIcon
          icon={faEdit}
          color="#3056d3"
        />
      ),
      title: en.networkParticipants.edit,
      onClick: (row: TableData) => handleEditParticipant(row as unknown as APINetworkParticipant)
    },
    {
      icon: (
        <FontAwesomeIcon
          icon={faTrashAlt}
          color="#3056d3"
        />
      ),
      title: en.networkParticipants.delete,
      onClick: (row: TableData) => handleDeleteClick(row.subscriber_id as string)
    }
  ]

  const handleAddParticipant = () => {
    router.push({ pathname: '/manageNetworkParticipants', query: { mode: 'add' } })
  }

  const handleEditParticipant = (participant: APINetworkParticipant) => {
    router.push({
      pathname: '/manageNetworkParticipants',
      query: { mode: 'edit', documentId: participant.name }
    })
  }

  const handleViewParticipant = (participant: APINetworkParticipant) => {
    router.push({
      pathname: '/manageNetworkParticipants',
      query: { mode: 'view', documentId: participant.name }
    })
  }

  if (isLoading) {
    return (
      <div className={styles.networkParticipantsContainer}>
        <ActionHeaders
          onPlusClick={handleAddParticipant}
          onBackClick={() => router.back()}
          onHomeClick={() => router.push('/')}
        />
        <h2 className={styles.title}>{en.networkParticipants.title}</h2>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Loading network participants...</p>
        </div>
      </div>
    )
  }

  if (queryError) {
    return (
      <div className={styles.networkParticipantsContainer}>
        <ActionHeaders
          onPlusClick={handleAddParticipant}
          onBackClick={() => router.back()}
          onHomeClick={() => router.push('/')}
        />
        <h2 className={styles.title}>{en.networkParticipants.title}</h2>
        <div className={styles.errorContainer}>
          <p>Error loading network participants. Please try again later.</p>
          <button
            onClick={() => refetch()}
            className={styles.retryButton}
          >
            Retry
          </button>
        </div>
      </div>
    )
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
        onSearch={handleSearch}
      />
      <CustomTable
        columns={columns}
        data={participants as unknown as TableData[]}
        actions={actions}
        // pagination={{
        //   currentPage: participants?.pagination.page ?? 1,
        //   pageSize: participants?.pagination.pageSize ?? 10,
        //   total: participants?.pagination.total ?? 0,
        //   onPageChange: handlePageChange,
        //   onPageSizeChange: handlePageSizeChange
        // }}
      />
      <AlertModal
        isOpen={deleteModalState.isOpen}
        title="Delete Network Participant"
        message="Are you sure you want to delete this network participant? This action cannot be undone."
        onConfirm={handleDeleteConfirm}
        onClose={handleDeleteCancel}
      />
    </div>
  )
}

export default NetworkParticipants
