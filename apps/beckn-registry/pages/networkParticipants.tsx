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
import { useDispatch, useSelector } from 'react-redux'
import { setParticipants, setLoading, setError, setPagination } from '@store/networkParticipant-slice'
import { RootState } from '@store/index'
import UnauthorizedAccess from '@components/UnauthorizedAccess'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query'

// Format date in a consistent way that works on both server and client
const formatDate = (dateString: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toISOString().split('T')[0] // YYYY-MM-DD format
}

const NetworkParticipants = () => {
  const [tableData, setTableData] = useState<TableData[]>([])
  const [deleteModalState, setDeleteModalState] = useState<{
    isOpen: boolean
    subscriberId: string | null
  }>({
    isOpen: false,
    subscriberId: null
  })

  const router = useRouter()
  const dispatch = useDispatch()
  const { pagination } = useSelector((state: RootState) => state.networkParticipants)
  // const { user } = useSelector((state: RootState) => state.auth)
  // const isAdmin = user?.role?.type.toLowerCase() === 'admin'
  const [currentPage, setCurrentPage] = useState(pagination?.page || 1)
  const [currentPageSize, setCurrentPageSize] = useState(pagination?.pageSize || 10)
  const [searchQuery, setSearchQuery] = useState('')
  const {
    data: participants,
    isLoading,
    error: queryError,
    refetch
  } = useGetNetworkParticipantsQuery({
    page: currentPage,
    pageSize: currentPageSize,
    searchQuery: searchQuery.trim() || undefined
  })

  const [deleteNetworkParticipant, { error: deleteError }] = useDeleteNetworkParticipantMutation()

  useEffect(() => {
    if (participants && participants?.results && participants?.results.length > 0) {
      dispatch(setParticipants(participants.results))
      dispatch(
        setPagination({
          page: participants.pagination.page,
          pageSize: participants.pagination.pageSize,
          total: participants.pagination.total
        })
      )

      setTableData(
        participants?.results.map(participant => ({
          subscriber_id: participant.subscriber_id,
          subscriber_url: participant.subscriber_url,
          unique_key_id: participant.unique_key_id,
          type: participant.type,
          domain: participant.domain,
          signing_public_key: participant.signing_public_key,
          encr_public_key: participant.encr_public_key,
          valid_from: formatDate(participant.valid_from),
          valid_until: formatDate(participant.valid_until),
          status: participant.status,
          created: formatDate(participant.created),
          updated: formatDate(participant.updated)
        }))
      )
    }

    dispatch(setLoading(isLoading))
    if (queryError) {
      const error = queryError as FetchBaseQueryError
      if (error.status === 401) {
        return
      }
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

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setCurrentPage(1)
    refetch()
  }

  const handleDelete = async (subscriberId: string) => {
    try {
      await deleteNetworkParticipant(subscriberId).unwrap()
      showToast({
        message: 'Network participant deleted successfully',
        type: 'success'
      })
      refetch()
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

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
  }

  const handlePageSizeChange = (newPageSize: number) => {
    setCurrentPageSize(newPageSize)
    setCurrentPage(1)
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

  const error = (queryError as FetchBaseQueryError) || (deleteError as FetchBaseQueryError)

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

  if (tableData.length === 0) {
    return (
      <div className={styles.networkParticipantsContainer}>
        <ActionHeaders
          onPlusClick={handleAddParticipant}
          onBackClick={() => router.back()}
          onHomeClick={() => router.push('/')}
        />
        <h2 className={styles.title}>{en.networkParticipants.title}</h2>
        <div className={styles.emptyContainer}>
          <p>No network participants found.</p>
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
        data={tableData}
        actions={actions}
        pagination={{
          currentPage: currentPage,
          pageSize: currentPageSize,
          total: pagination?.total || 1,
          onPageChange: handlePageChange,
          onPageSizeChange: handlePageSizeChange
        }}
      />
      <AlertModal
        isOpen={deleteModalState.isOpen}
        title="Delete Network Participant"
        message="Are you sure you want to delete this network participant? This action cannot be undone."
        onConfirm={handleDeleteConfirm}
        onClose={handleDeleteCancel}
      />
      {error?.status === 401 && (
        <UnauthorizedAccess
          onRetry={refetch}
          closeButton={true}
        />
      )}
    </div>
  )
}

export default NetworkParticipants
